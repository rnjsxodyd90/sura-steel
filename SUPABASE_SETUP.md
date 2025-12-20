# Supabase Inventory Setup Guide

## Step 1: Create Supabase Account (Free)

1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub or email
3. Create a new project (choose a region close to Netherlands, e.g., Frankfurt)
4. Wait for project to initialize (~2 minutes)

## Step 2: Create Database Tables

Go to **SQL Editor** in Supabase and run this:

```sql
-- Create inventory table
CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  variant TEXT NOT NULL DEFAULT 'default',
  stock INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint
CREATE UNIQUE INDEX inventory_product_variant ON inventory(product_id, variant);

-- Create function to decrement stock
CREATE OR REPLACE FUNCTION decrement_stock(
  p_product_id INTEGER,
  p_variant TEXT,
  p_quantity INTEGER
)
RETURNS void AS $$
BEGIN
  UPDATE inventory
  SET stock = GREATEST(0, stock - p_quantity),
      updated_at = NOW()
  WHERE product_id = p_product_id AND variant = p_variant;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON inventory
  FOR SELECT USING (true);

-- Allow service role full access
CREATE POLICY "Allow service role all" ON inventory
  FOR ALL USING (auth.role() = 'service_role');
```

## Step 3: Add Initial Inventory Data

Run this SQL to add your products (adjust stock numbers):

```sql
-- Gold Collection
INSERT INTO inventory (product_id, product_name, variant, stock) VALUES
(20, 'Moon Gold', 'full_set', 10),
(20, 'Moon Gold', 'place_setting', 25),
(24, 'Pandora Gold', 'full_set', 8),
(24, 'Pandora Gold', 'place_setting', 20),
(1, 'Ivy Gold', 'full_set', 5),
(1, 'Ivy Gold', 'place_setting', 15);
-- Add more products as needed...

-- Silver Collection
INSERT INTO inventory (product_id, product_name, variant, stock) VALUES
(56, 'Bree', 'full_set', 12),
(56, 'Bree', 'place_setting', 30);
-- Add more products as needed...
```

## Step 4: Get API Keys

1. Go to **Settings** → **API** in Supabase
2. Copy these values:
   - `Project URL` → This is your SUPABASE_URL
   - `anon public` key → This is your SUPABASE_ANON_KEY
   - `service_role` key → This is your SUPABASE_SERVICE_KEY (keep secret!)

## Step 5: Add to Netlify Environment Variables

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site → **Site settings** → **Environment variables**
3. Add these variables:

| Key | Value |
|-----|-------|
| `SUPABASE_URL` | Your Project URL (e.g., https://xxxxx.supabase.co) |
| `SUPABASE_ANON_KEY` | Your anon/public key |
| `SUPABASE_SERVICE_KEY` | Your service_role key |

## Step 6: Test

1. Deploy your site
2. Check browser console for inventory data
3. Products should show stock levels

## Stock Level Display

- **In Stock**: stock > low_stock_threshold (default 5)
- **Low Stock**: stock <= low_stock_threshold AND stock > 0
- **Out of Stock**: stock = 0

## Updating Stock

Stock is automatically decremented when:
- A successful Stripe checkout completes
- You can also manually update in Supabase dashboard

## Questions?

The inventory system is designed to:
- Show real-time stock levels on product pages
- Prevent overselling (checks stock before checkout)
- Auto-update after successful purchases

