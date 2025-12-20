# Customer Accounts Database Setup

This document contains the SQL commands to set up customer accounts and order tracking in Supabase.

## Prerequisites

1. You need a Supabase project with authentication enabled
2. Run these SQL commands in the Supabase SQL Editor (Dashboard > SQL Editor)

## 1. Enable UUID Extension (if not already enabled)

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

## 2. Create Customers Table

This table extends Supabase auth.users to store additional customer information.

```sql
-- Customers table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS customers (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comment for documentation
COMMENT ON TABLE customers IS 'Customer profiles extending Supabase auth.users';
```

## 3. Create Orders Table

```sql
-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  stripe_session_id TEXT UNIQUE,
  order_number TEXT UNIQUE,
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'eur',
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  shipping_address JSONB,
  billing_address JSONB,
  items JSONB NOT NULL,
  tracking_number TEXT,
  notes TEXT,
  guest_email TEXT, -- For guest checkouts (not logged in)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comment for documentation
COMMENT ON TABLE orders IS 'Customer orders with Stripe integration';
COMMENT ON COLUMN orders.customer_id IS 'NULL for guest orders';
COMMENT ON COLUMN orders.guest_email IS 'Email for guest orders (when customer_id is NULL)';
```

## 4. Create Indexes for Performance

```sql
-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_guest_email ON orders(guest_email) WHERE guest_email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
```

## 5. Enable Row Level Security (RLS)

```sql
-- Enable RLS on customers table
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Enable RLS on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
```

## 6. Create RLS Policies for Customers Table

```sql
-- Customers can read their own profile
CREATE POLICY "Users can view own customer profile"
  ON customers FOR SELECT
  USING (auth.uid() = id);

-- Customers can insert their own profile (on signup)
CREATE POLICY "Users can insert own customer profile"
  ON customers FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Customers can update their own profile
CREATE POLICY "Users can update own customer profile"
  ON customers FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Service role can do everything (for backend functions)
CREATE POLICY "Service role full access to customers"
  ON customers FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');
```

## 7. Create RLS Policies for Orders Table

```sql
-- Customers can view their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = customer_id);

-- Service role can insert orders (webhook creates orders)
CREATE POLICY "Service role can insert orders"
  ON orders FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Service role can update orders (for status changes, tracking)
CREATE POLICY "Service role can update orders"
  ON orders FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Service role can read all orders (for admin)
CREATE POLICY "Service role can read all orders"
  ON orders FOR SELECT
  USING (auth.jwt() ->> 'role' = 'service_role');
```

## 8. Create Trigger to Auto-Create Customer Profile on Auth Signup

```sql
-- Function to create customer profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.customers (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 9. Create Function to Update Timestamps

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for customers table
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for orders table
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 10. Create Function to Generate Order Numbers

```sql
-- Function to generate unique order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  counter INTEGER := 0;
BEGIN
  LOOP
    -- Format: SS-YYYYMMDD-XXXX (SS = Sura Steel, date, random 4 chars)
    new_number := 'SS-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
                  UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));

    -- Check if this number already exists
    IF NOT EXISTS (SELECT 1 FROM orders WHERE order_number = new_number) THEN
      RETURN new_number;
    END IF;

    counter := counter + 1;
    IF counter > 100 THEN
      RAISE EXCEPTION 'Could not generate unique order number';
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
```

## 11. Create RPC Function for Creating Orders (for webhook)

```sql
-- RPC function to create an order (called from webhook)
CREATE OR REPLACE FUNCTION create_order(
  p_stripe_session_id TEXT,
  p_customer_id UUID DEFAULT NULL,
  p_guest_email TEXT DEFAULT NULL,
  p_total_amount DECIMAL(10,2) DEFAULT 0,
  p_currency TEXT DEFAULT 'eur',
  p_shipping_address JSONB DEFAULT NULL,
  p_items JSONB DEFAULT '[]'::JSONB
)
RETURNS TABLE (
  order_id UUID,
  order_number TEXT
) AS $$
DECLARE
  v_order_number TEXT;
  v_order_id UUID;
BEGIN
  -- Generate unique order number
  v_order_number := generate_order_number();
  v_order_id := uuid_generate_v4();

  -- Insert order
  INSERT INTO orders (
    id,
    customer_id,
    stripe_session_id,
    order_number,
    total_amount,
    currency,
    shipping_address,
    items,
    guest_email,
    status
  ) VALUES (
    v_order_id,
    p_customer_id,
    p_stripe_session_id,
    v_order_number,
    p_total_amount,
    p_currency,
    p_shipping_address,
    p_items,
    p_guest_email,
    'confirmed'
  );

  RETURN QUERY SELECT v_order_id, v_order_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Environment Variables

Add these to your Netlify environment variables:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here
```

**Important:**
- The `SUPABASE_URL` and `SUPABASE_ANON_KEY` are used by both frontend and backend
- The `SUPABASE_SERVICE_KEY` is the service role key (not the anon key) and should only be used in server-side functions. Never expose it to the frontend.
- All three variables are already used by your existing inventory system, so they should already be configured in Netlify

## Frontend Supabase Client Setup

The frontend uses `import.meta.env.SUPABASE_URL` and `import.meta.env.SUPABASE_ANON_KEY` (without the `VITE_` prefix). See `App.jsx` for the Supabase client initialization.

## Testing

After running these SQL commands, you can test:

1. **Sign up a user** - Check that a customer profile is auto-created
2. **Place an order** - The webhook should create an order in the database
3. **View orders** - Logged-in users should only see their own orders

## Troubleshooting

### RLS Policy Issues
If you get permission denied errors:
1. Check that you're using the correct Supabase key (anon for frontend, service_role for backend)
2. Verify RLS policies are correctly applied
3. Check the auth.uid() is correctly passed in requests

### Order Creation Fails
1. Check Stripe webhook is correctly configured
2. Verify SUPABASE_SERVICE_KEY is set in Netlify environment variables
3. Check Netlify function logs for errors

### Customer Profile Not Created
1. Verify the trigger on auth.users is active
2. Check Supabase logs for any errors during signup
