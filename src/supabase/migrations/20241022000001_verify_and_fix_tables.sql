-- ============================================
-- SUPABASE TABLE VERIFICATION AND FIX
-- Ensures all tables exist with correct schema
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. USER PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    phone TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'operator', 'driver', 'driver_lead', 'accounting', 'warehouse')),
    driver_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. PRODUCTS TABLE
-- ============================================
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

-- ============================================
-- 3. ORDERS TABLE
-- ============================================
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
    driver_id INTEGER REFERENCES user_profiles(id),
    notes TEXT,
    products JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. DRIVER LEADS TABLE
-- ============================================
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

-- ============================================
-- 5. STOCKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS stocks (
    id SERIAL PRIMARY KEY,
    product_code TEXT NOT NULL,
    qty INTEGER NOT NULL DEFAULT 0,
    warehouse TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT positive_qty CHECK (qty >= 0)
);

-- ============================================
-- 6. KV STORE TABLE (for backend)
-- ============================================
CREATE TABLE IF NOT EXISTS kv_store_549cd952 (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CREATE INDEXES (IF NOT EXISTS)
-- ============================================

-- User Profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_phone ON user_profiles(phone);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Products
CREATE INDEX IF NOT EXISTS idx_products_code ON products(code);

-- Orders
CREATE INDEX IF NOT EXISTS idx_orders_code ON orders(code);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_driver_id ON orders(driver_id);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date ON orders(delivery_date);

-- Stocks
CREATE INDEX IF NOT EXISTS idx_stocks_product_code ON stocks(product_code);
CREATE INDEX IF NOT EXISTS idx_stocks_warehouse ON stocks(warehouse);

-- Driver Leads
CREATE INDEX IF NOT EXISTS idx_driver_leads_status ON driver_leads(status);

-- KV Store
CREATE INDEX IF NOT EXISTS idx_kv_store_key ON kv_store_549cd952(key);

-- ============================================
-- CREATE UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ADD TRIGGERS FOR UPDATED_AT
-- ============================================

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS update_driver_leads_updated_at ON driver_leads;
DROP TRIGGER IF EXISTS update_kv_store_updated_at ON kv_store_549cd952;

-- Create triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_driver_leads_updated_at BEFORE UPDATE ON driver_leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kv_store_updated_at BEFORE UPDATE ON kv_store_549cd952
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE kv_store_549cd952 ENABLE ROW LEVEL SECURITY;

-- ============================================
-- DROP EXISTING POLICIES (to avoid conflicts)
-- ============================================

-- User Profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON user_profiles;

-- Products
DROP POLICY IF EXISTS "Anyone authenticated can view products" ON products;
DROP POLICY IF EXISTS "Admins and warehouse can manage products" ON products;

-- Orders
DROP POLICY IF EXISTS "Admins, operators, accounting, driver_lead can view all orders" ON orders;
DROP POLICY IF EXISTS "Drivers can view their own orders" ON orders;
DROP POLICY IF EXISTS "Admins and operators can manage orders" ON orders;

-- Driver Leads
DROP POLICY IF EXISTS "Admins and driver_lead can view driver leads" ON driver_leads;
DROP POLICY IF EXISTS "Admins and driver_lead can manage driver leads" ON driver_leads;

-- Stocks
DROP POLICY IF EXISTS "Anyone authenticated can view stocks" ON stocks;
DROP POLICY IF EXISTS "Admins and warehouse can manage stocks" ON stocks;

-- KV Store
DROP POLICY IF EXISTS "Service role can access kv store" ON kv_store_549cd952;

-- ============================================
-- CREATE RLS POLICIES
-- ============================================

-- USER PROFILES POLICIES
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

-- PRODUCTS POLICIES
CREATE POLICY "Anyone authenticated can view products"
    ON products FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and warehouse can manage products"
    ON products FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'warehouse', 'operator')
        )
    );

-- ORDERS POLICIES
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
            WHERE id = auth.uid() AND role = 'driver' AND driver_id = id::INTEGER
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

-- DRIVER LEADS POLICIES
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

-- STOCKS POLICIES
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

-- KV STORE POLICIES (Service role only)
CREATE POLICY "Service role can access kv store"
    ON kv_store_549cd952 FOR ALL
    USING (true);

-- ============================================
-- SEED DEFAULT DATA (IF TABLES ARE EMPTY)
-- ============================================

-- Seed products if empty
INSERT INTO products (code, name, size, color, price, description, stock)
SELECT 'PRD001', 'Сүү 1л', '1л', 'Цагаан', 3500, 'Эрүүл мэндийн сүү', 150
WHERE NOT EXISTS (SELECT 1 FROM products WHERE code = 'PRD001');

INSERT INTO products (code, name, size, color, price, description, stock)
SELECT 'PRD002', 'Талх', '500г', 'Бор', 2000, 'Шинэ талх', 200
WHERE NOT EXISTS (SELECT 1 FROM products WHERE code = 'PRD002');

INSERT INTO products (code, name, size, color, price, description, stock)
SELECT 'PRD003', 'Төмс', '1кг', 'Шар', 1500, 'Шинэ төмс', 300
WHERE NOT EXISTS (SELECT 1 FROM products WHERE code = 'PRD003');

INSERT INTO products (code, name, size, color, price, description, stock)
SELECT 'PRD004', 'Лууван', '1кг', 'Улаан', 2500, 'Шинэ лууван', 100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE code = 'PRD004');

INSERT INTO products (code, name, size, color, price, description, stock)
SELECT 'PRD005', 'Сонгино', '1кг', 'Улаан', 1800, 'Шинэ сонгино', 150
WHERE NOT EXISTS (SELECT 1 FROM products WHERE code = 'PRD005');

-- Seed stocks if empty
INSERT INTO stocks (product_code, qty, warehouse)
SELECT 'PRD001', 150, 'Агуулах A'
WHERE NOT EXISTS (SELECT 1 FROM stocks WHERE product_code = 'PRD001' AND warehouse = 'Агуулах A');

INSERT INTO stocks (product_code, qty, warehouse)
SELECT 'PRD002', 200, 'Агуулах A'
WHERE NOT EXISTS (SELECT 1 FROM stocks WHERE product_code = 'PRD002' AND warehouse = 'Агуулах A');

INSERT INTO stocks (product_code, qty, warehouse)
SELECT 'PRD003', 300, 'Агуулах A'
WHERE NOT EXISTS (SELECT 1 FROM stocks WHERE product_code = 'PRD003' AND warehouse = 'Агуулах A');

INSERT INTO stocks (product_code, qty, warehouse)
SELECT 'PRD004', 100, 'Агуулах B'
WHERE NOT EXISTS (SELECT 1 FROM stocks WHERE product_code = 'PRD004' AND warehouse = 'Агуулах B');

INSERT INTO stocks (product_code, qty, warehouse)
SELECT 'PRD005', 150, 'Агуулах B'
WHERE NOT EXISTS (SELECT 1 FROM stocks WHERE product_code = 'PRD005' AND warehouse = 'Агуулах B');

-- ============================================
-- VERIFICATION: Log table status
-- ============================================
DO $$
DECLARE
    user_profiles_count INT;
    products_count INT;
    orders_count INT;
    driver_leads_count INT;
    stocks_count INT;
    kv_store_count INT;
BEGIN
    SELECT COUNT(*) INTO user_profiles_count FROM user_profiles;
    SELECT COUNT(*) INTO products_count FROM products;
    SELECT COUNT(*) INTO orders_count FROM orders;
    SELECT COUNT(*) INTO driver_leads_count FROM driver_leads;
    SELECT COUNT(*) INTO stocks_count FROM stocks;
    SELECT COUNT(*) INTO kv_store_count FROM kv_store_549cd952;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'SUPABASE TABLE VERIFICATION COMPLETE';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'user_profiles: % rows', user_profiles_count;
    RAISE NOTICE 'products: % rows', products_count;
    RAISE NOTICE 'orders: % rows', orders_count;
    RAISE NOTICE 'driver_leads: % rows', driver_leads_count;
    RAISE NOTICE 'stocks: % rows', stocks_count;
    RAISE NOTICE 'kv_store_549cd952: % rows', kv_store_count;
    RAISE NOTICE '========================================';
END $$;
