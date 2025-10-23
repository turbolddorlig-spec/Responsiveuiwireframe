-- ============================================================================
-- COMPLETE SUPABASE SETUP FOR LOGISTICS SYSTEM
-- ============================================================================
-- Run this entire file in Supabase SQL Editor to setup everything at once
-- This includes: Schema, Seed Data, and Demo Users
-- ============================================================================

-- STEP 1: CREATE SCHEMA
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    phone TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'operator', 'driver', 'driver_lead', 'accounting', 'warehouse')),
    driver_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    size TEXT,
    color TEXT,
    price NUMERIC(12, 0) NOT NULL DEFAULT 0,
    description TEXT,
    image_url TEXT,
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    customer_phone TEXT,
    total_price NUMERIC(12, 0) DEFAULT 0,
    status TEXT DEFAULT 'NEW' CHECK (status IN ('NEW', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED')),
    payment_status TEXT DEFAULT 'UNPAID' CHECK (payment_status IN ('PAID', 'UNPAID', 'PARTIAL')),
    payment_method TEXT CHECK (payment_method IN ('CASH', 'CARD', 'TRANSFER', 'QPAY')),
    delivery_date TEXT,
    delivery_time TEXT,
    address TEXT,
    district TEXT,
    khoroo TEXT,
    driver_id UUID REFERENCES user_profiles(id),
    notes TEXT,
    products JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Driver Leads Table
CREATE TABLE IF NOT EXISTS driver_leads (
    id SERIAL PRIMARY KEY,
    name TEXT,
    phone TEXT NOT NULL,
    district TEXT,
    province TEXT,
    note TEXT,
    status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CONTACTED', 'CLOSED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stocks Table
CREATE TABLE IF NOT EXISTS stocks (
    id SERIAL PRIMARY KEY,
    product_code TEXT NOT NULL,
    qty INTEGER NOT NULL DEFAULT 0,
    warehouse TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT positive_qty CHECK (qty >= 0)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_phone ON user_profiles(phone);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_products_code ON products(code);
CREATE INDEX IF NOT EXISTS idx_orders_code ON orders(code);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_driver_id ON orders(driver_id);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date ON orders(delivery_date);
CREATE INDEX IF NOT EXISTS idx_stocks_product_code ON stocks(product_code);
CREATE INDEX IF NOT EXISTS idx_stocks_warehouse ON stocks(warehouse);
CREATE INDEX IF NOT EXISTS idx_driver_leads_status ON driver_leads(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_driver_leads_updated_at ON driver_leads;
CREATE TRIGGER update_driver_leads_updated_at BEFORE UPDATE ON driver_leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON user_profiles;

DROP POLICY IF EXISTS "Anyone authenticated can view products" ON products;
DROP POLICY IF EXISTS "Admins and warehouse can manage products" ON products;

DROP POLICY IF EXISTS "Admins, operators, accounting, driver_lead can view all orders" ON orders;
DROP POLICY IF EXISTS "Drivers can view their own orders" ON orders;
DROP POLICY IF EXISTS "Admins and operators can manage orders" ON orders;

DROP POLICY IF EXISTS "Admins and driver_lead can view driver leads" ON driver_leads;
DROP POLICY IF EXISTS "Admins and driver_lead can manage driver leads" ON driver_leads;

DROP POLICY IF EXISTS "Anyone authenticated can view stocks" ON stocks;
DROP POLICY IF EXISTS "Admins and warehouse can manage stocks" ON stocks;

-- User Profiles RLS Policies
CREATE POLICY "Users can view their own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
    ON user_profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Admins can insert profiles"
    ON user_profiles FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Admins can update profiles"
    ON user_profiles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Admins can delete profiles"
    ON user_profiles FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
        )
    );

-- Products RLS Policies
CREATE POLICY "Anyone authenticated can view products"
    ON products FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and warehouse can manage products"
    ON products FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'warehouse')
        )
    );

-- Orders RLS Policies
CREATE POLICY "Admins, operators, accounting, driver_lead can view all orders"
    ON orders FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'operator', 'accounting', 'driver_lead')
        )
    );

CREATE POLICY "Drivers can view their own orders"
    ON orders FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'driver' AND driver_id = auth.uid()
        )
    );

CREATE POLICY "Admins and operators can manage orders"
    ON orders FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'operator')
        )
    );

-- Driver Leads RLS Policies
CREATE POLICY "Admins and driver_lead can view driver leads"
    ON driver_leads FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'driver_lead')
        )
    );

CREATE POLICY "Admins and driver_lead can manage driver leads"
    ON driver_leads FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'driver_lead')
        )
    );

-- Stocks RLS Policies
CREATE POLICY "Anyone authenticated can view stocks"
    ON stocks FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and warehouse can manage stocks"
    ON stocks FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'warehouse')
        )
    );

-- STEP 2: SEED DATA
-- ============================================================================

-- Seed products
INSERT INTO products (code, name, size, color, price, description, stock) VALUES
    ('PRD001', 'Сүү 1л', '1л', 'Цагаан', 3500, 'Эрүүл мэндийн сүү', 150),
    ('PRD002', 'Талх', '500г', 'Бор', 2000, 'Шинэ талх', 200),
    ('PRD003', 'Төмс', '1кг', 'Шар', 1500, 'Шинэ төмс', 300),
    ('PRD004', 'Лууван', '1кг', 'Улаан', 2500, 'Шинэ лууван', 100),
    ('PRD005', 'Сонгино', '1кг', 'Улаан', 1800, 'Шинэ сонгино', 150)
ON CONFLICT (code) DO NOTHING;

-- Seed stocks
INSERT INTO stocks (product_code, qty, warehouse) VALUES
    ('PRD001', 150, 'Агуулах A'),
    ('PRD002', 200, 'Агуулах A'),
    ('PRD003', 300, 'Агуулах A'),
    ('PRD004', 100, 'Агуулах B'),
    ('PRD005', 150, 'Агуулах B')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- STEP 3: CREATE DEMO USERS
-- ============================================================================
-- NOTE: You must manually create auth.users in Supabase Dashboard first!
-- Go to Authentication > Users and create users with these emails:
--   - 99000000@logistics.mn (password: super123)
--   - 99000001@logistics.mn (password: admin123)
--   - 99000002@logistics.mn (password: operator123)
--   - 99112233@logistics.mn (password: driver123)
--   - 99112234@logistics.mn (password: lead123)
--   - 99112235@logistics.mn (password: account123)
--   - 99112236@logistics.mn (password: warehouse123)
--
-- Then, run the INSERT statements below with the correct User IDs
-- ============================================================================

-- After creating users in Auth, uncomment and update these INSERT statements:
/*
INSERT INTO user_profiles (id, phone, name, role) VALUES
    ('PASTE_SUPER_ADMIN_USER_ID_HERE', '99000000', 'Супер Админ', 'super_admin'),
    ('PASTE_ADMIN_USER_ID_HERE', '99000001', 'Админ Дорж', 'admin'),
    ('PASTE_OPERATOR_USER_ID_HERE', '99000002', 'Оператор Болд', 'operator'),
    ('PASTE_DRIVER_USER_ID_HERE', '99112233', 'Жолооч Бат', 'driver'),
    ('PASTE_DRIVER_LEAD_USER_ID_HERE', '99112234', 'Ахлагч Цэрэн', 'driver_lead'),
    ('PASTE_ACCOUNTING_USER_ID_HERE', '99112235', 'Нягтлан Сара', 'accounting'),
    ('PASTE_WAREHOUSE_USER_ID_HERE', '99112236', 'Агуулах Ганбат', 'warehouse')
ON CONFLICT (id) DO NOTHING;
*/

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check if tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('user_profiles', 'products', 'orders', 'driver_leads', 'stocks')
ORDER BY table_name;

-- Check products
SELECT COUNT(*) as product_count FROM products;

-- Check stocks
SELECT COUNT(*) as stock_count FROM stocks;

-- Check user profiles (will be 0 until you create auth users)
SELECT COUNT(*) as user_profile_count FROM user_profiles;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('user_profiles', 'products', 'orders', 'driver_leads', 'stocks');

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
-- Next steps:
-- 1. Go to Authentication > Users in Supabase Dashboard
-- 2. Create 7 demo users (see email list above)
-- 3. Copy each user's UUID
-- 4. Update and run the INSERT statements for user_profiles
-- ============================================================================
