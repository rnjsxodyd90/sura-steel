# Newsletter & Discount Codes Database Setup

Run these SQL commands in the Supabase SQL Editor (Dashboard > SQL Editor).

## 1. Create Newsletter Subscribers Table

```sql
-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  discount_code_id UUID,
  status TEXT DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed'))
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_customer_id ON newsletter_subscribers(customer_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- Comment for documentation
COMMENT ON TABLE newsletter_subscribers IS 'Newsletter subscriptions with discount code tracking';
```

## 2. Create Discount Codes Table

```sql
-- Discount codes table
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  discount_percent INTEGER NOT NULL DEFAULT 15,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  order_id UUID REFERENCES orders(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT DEFAULT 'newsletter'
);

-- Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_customer_id ON discount_codes(customer_id);
CREATE INDEX IF NOT EXISTS idx_discount_codes_expires_at ON discount_codes(expires_at);

-- Comment for documentation
COMMENT ON TABLE discount_codes IS 'Discount codes for newsletter signups and promotions';
COMMENT ON COLUMN discount_codes.source IS 'Where the code came from: newsletter, promo, etc.';
```

## 3. Update newsletter_subscribers foreign key

```sql
-- Add foreign key from newsletter_subscribers to discount_codes
ALTER TABLE newsletter_subscribers
ADD CONSTRAINT fk_newsletter_discount_code
FOREIGN KEY (discount_code_id) REFERENCES discount_codes(id);
```

## 4. Enable Row Level Security

```sql
-- Enable RLS on newsletter_subscribers
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Enable RLS on discount_codes
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
```

## 5. RLS Policies for Newsletter Subscribers

```sql
-- Users can view their own subscription
CREATE POLICY "Users can view own newsletter subscription"
  ON newsletter_subscribers FOR SELECT
  USING (auth.uid() = customer_id);

-- Users can insert their own subscription
CREATE POLICY "Users can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

-- Users can update their own subscription (unsubscribe)
CREATE POLICY "Users can update own newsletter subscription"
  ON newsletter_subscribers FOR UPDATE
  USING (auth.uid() = customer_id);

-- Service role full access
CREATE POLICY "Service role full access to newsletter"
  ON newsletter_subscribers FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');
```

## 6. RLS Policies for Discount Codes

```sql
-- Users can view their own discount codes
CREATE POLICY "Users can view own discount codes"
  ON discount_codes FOR SELECT
  USING (auth.uid() = customer_id);

-- Service role can insert codes (backend creates them)
CREATE POLICY "Service role can insert discount codes"
  ON discount_codes FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Service role can update codes (mark as used)
CREATE POLICY "Service role can update discount codes"
  ON discount_codes FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Service role can read all codes (for validation)
CREATE POLICY "Service role can read all discount codes"
  ON discount_codes FOR SELECT
  USING (auth.jwt() ->> 'role' = 'service_role');
```

## 7. Function to Generate Unique Discount Code

```sql
-- Function to generate unique discount code
CREATE OR REPLACE FUNCTION generate_discount_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  counter INTEGER := 0;
BEGIN
  LOOP
    -- Format: SS-XXXXXXXX (SS = Sura Steel, 8 random alphanumeric chars)
    new_code := 'SS-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR 8));

    -- Check if this code already exists
    IF NOT EXISTS (SELECT 1 FROM discount_codes WHERE code = new_code) THEN
      RETURN new_code;
    END IF;

    counter := counter + 1;
    IF counter > 100 THEN
      RAISE EXCEPTION 'Could not generate unique discount code';
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
```

## 8. Function to Create Newsletter Subscription with Discount Code

```sql
-- RPC function to subscribe to newsletter and create discount code
CREATE OR REPLACE FUNCTION subscribe_newsletter(
  p_customer_id UUID,
  p_email TEXT
)
RETURNS TABLE (
  subscription_id UUID,
  discount_code TEXT,
  expires_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
  v_subscription_id UUID;
  v_discount_code_id UUID;
  v_discount_code TEXT;
  v_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Check if already subscribed
  IF EXISTS (SELECT 1 FROM newsletter_subscribers WHERE customer_id = p_customer_id AND status = 'subscribed') THEN
    RAISE EXCEPTION 'Already subscribed to newsletter';
  END IF;

  -- Generate discount code
  v_discount_code := generate_discount_code();
  v_expires_at := NOW() + INTERVAL '60 days';
  v_discount_code_id := uuid_generate_v4();
  v_subscription_id := uuid_generate_v4();

  -- Insert discount code
  INSERT INTO discount_codes (id, code, customer_id, discount_percent, expires_at, source)
  VALUES (v_discount_code_id, v_discount_code, p_customer_id, 15, v_expires_at, 'newsletter');

  -- Insert newsletter subscription
  INSERT INTO newsletter_subscribers (id, customer_id, email, discount_code_id, status)
  VALUES (v_subscription_id, p_customer_id, p_email, v_discount_code_id, 'subscribed');

  RETURN QUERY SELECT v_subscription_id, v_discount_code, v_expires_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 9. Function to Validate Discount Code

```sql
-- RPC function to validate a discount code
CREATE OR REPLACE FUNCTION validate_discount_code(
  p_code TEXT,
  p_customer_id UUID
)
RETURNS TABLE (
  is_valid BOOLEAN,
  discount_percent INTEGER,
  error_message TEXT
) AS $$
DECLARE
  v_code_record RECORD;
BEGIN
  -- Look up the code
  SELECT * INTO v_code_record
  FROM discount_codes
  WHERE code = p_code;

  -- Code doesn't exist
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0, 'Invalid discount code'::TEXT;
    RETURN;
  END IF;

  -- Code belongs to different customer (account-locked)
  IF v_code_record.customer_id != p_customer_id THEN
    RETURN QUERY SELECT FALSE, 0, 'This code is linked to a different account'::TEXT;
    RETURN;
  END IF;

  -- Code already used
  IF v_code_record.used_at IS NOT NULL THEN
    RETURN QUERY SELECT FALSE, 0, 'This code has already been used'::TEXT;
    RETURN;
  END IF;

  -- Code expired
  IF v_code_record.expires_at < NOW() THEN
    RETURN QUERY SELECT FALSE, 0, 'This code has expired'::TEXT;
    RETURN;
  END IF;

  -- Code is valid
  RETURN QUERY SELECT TRUE, v_code_record.discount_percent, NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 10. Function to Mark Discount Code as Used

```sql
-- RPC function to mark discount code as used
CREATE OR REPLACE FUNCTION use_discount_code(
  p_code TEXT,
  p_order_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE discount_codes
  SET used_at = NOW(), order_id = p_order_id
  WHERE code = p_code AND used_at IS NULL;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Quick Setup (Run All at Once)

Copy and paste everything below into a single SQL Editor execution:

```sql
-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  discount_code_id UUID,
  status TEXT DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed'))
);

CREATE INDEX IF NOT EXISTS idx_newsletter_customer_id ON newsletter_subscribers(customer_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- Discount codes table
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  discount_percent INTEGER NOT NULL DEFAULT 15,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  order_id UUID REFERENCES orders(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT DEFAULT 'newsletter'
);

CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_customer_id ON discount_codes(customer_id);
CREATE INDEX IF NOT EXISTS idx_discount_codes_expires_at ON discount_codes(expires_at);

-- Foreign key
ALTER TABLE newsletter_subscribers
ADD CONSTRAINT fk_newsletter_discount_code
FOREIGN KEY (discount_code_id) REFERENCES discount_codes(id);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- Newsletter policies
CREATE POLICY "Users can view own newsletter subscription"
  ON newsletter_subscribers FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Users can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update own newsletter subscription"
  ON newsletter_subscribers FOR UPDATE
  USING (auth.uid() = customer_id);

CREATE POLICY "Service role full access to newsletter"
  ON newsletter_subscribers FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Discount code policies
CREATE POLICY "Users can view own discount codes"
  ON discount_codes FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Service role can insert discount codes"
  ON discount_codes FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can update discount codes"
  ON discount_codes FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can read all discount codes"
  ON discount_codes FOR SELECT
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Generate discount code function
CREATE OR REPLACE FUNCTION generate_discount_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  counter INTEGER := 0;
BEGIN
  LOOP
    new_code := 'SS-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR 8));
    IF NOT EXISTS (SELECT 1 FROM discount_codes WHERE code = new_code) THEN
      RETURN new_code;
    END IF;
    counter := counter + 1;
    IF counter > 100 THEN
      RAISE EXCEPTION 'Could not generate unique discount code';
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Subscribe newsletter function
CREATE OR REPLACE FUNCTION subscribe_newsletter(
  p_customer_id UUID,
  p_email TEXT
)
RETURNS TABLE (
  subscription_id UUID,
  discount_code TEXT,
  expires_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
  v_subscription_id UUID;
  v_discount_code_id UUID;
  v_discount_code TEXT;
  v_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
  IF EXISTS (SELECT 1 FROM newsletter_subscribers WHERE customer_id = p_customer_id AND status = 'subscribed') THEN
    RAISE EXCEPTION 'Already subscribed to newsletter';
  END IF;

  v_discount_code := generate_discount_code();
  v_expires_at := NOW() + INTERVAL '60 days';
  v_discount_code_id := uuid_generate_v4();
  v_subscription_id := uuid_generate_v4();

  INSERT INTO discount_codes (id, code, customer_id, discount_percent, expires_at, source)
  VALUES (v_discount_code_id, v_discount_code, p_customer_id, 15, v_expires_at, 'newsletter');

  INSERT INTO newsletter_subscribers (id, customer_id, email, discount_code_id, status)
  VALUES (v_subscription_id, p_customer_id, p_email, v_discount_code_id, 'subscribed');

  RETURN QUERY SELECT v_subscription_id, v_discount_code, v_expires_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Validate discount code function
CREATE OR REPLACE FUNCTION validate_discount_code(
  p_code TEXT,
  p_customer_id UUID
)
RETURNS TABLE (
  is_valid BOOLEAN,
  discount_percent INTEGER,
  error_message TEXT
) AS $$
DECLARE
  v_code_record RECORD;
BEGIN
  SELECT * INTO v_code_record FROM discount_codes WHERE code = p_code;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0, 'Invalid discount code'::TEXT;
    RETURN;
  END IF;

  IF v_code_record.customer_id != p_customer_id THEN
    RETURN QUERY SELECT FALSE, 0, 'This code is linked to a different account'::TEXT;
    RETURN;
  END IF;

  IF v_code_record.used_at IS NOT NULL THEN
    RETURN QUERY SELECT FALSE, 0, 'This code has already been used'::TEXT;
    RETURN;
  END IF;

  IF v_code_record.expires_at < NOW() THEN
    RETURN QUERY SELECT FALSE, 0, 'This code has expired'::TEXT;
    RETURN;
  END IF;

  RETURN QUERY SELECT TRUE, v_code_record.discount_percent, NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Use discount code function
CREATE OR REPLACE FUNCTION use_discount_code(
  p_code TEXT,
  p_order_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE discount_codes
  SET used_at = NOW(), order_id = p_order_id
  WHERE code = p_code AND used_at IS NULL;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```
