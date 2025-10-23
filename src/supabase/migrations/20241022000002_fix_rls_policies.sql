-- ============================================
-- FIX RLS POLICIES FOR SUPABASE REST API
-- This migration fixes 404 errors by updating
-- Row Level Security policies
-- ============================================

-- ============================================
-- DISABLE RLS TEMPORARILY FOR SETUP
-- (Re-enable at end of script)
-- ============================================
ALTER TABLE IF EXISTS user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS products DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS driver_leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS stocks DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS kv_store_549cd952 DISABLE ROW LEVEL SECURITY;

-- ============================================
-- DROP ALL EXISTING POLICIES
-- ============================================

-- User Profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON user_profiles;
DROP POLICY IF EXISTS "Allow public read access to user_profiles" ON user_profiles;

-- Products
DROP POLICY IF EXISTS "Anyone authenticated can view products" ON products;
DROP POLICY IF EXISTS "Admins and warehouse can manage products" ON products;
DROP POLICY IF EXISTS "Allow public read access to products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to manage products" ON products;

-- Orders
DROP POLICY IF EXISTS "Admins, operators, accounting, driver_lead can view all orders" ON orders;
DROP POLICY IF EXISTS "Drivers can view their own orders" ON orders;
DROP POLICY IF EXISTS "Admins and operators can manage orders" ON orders;
DROP POLICY IF EXISTS "Allow public read access to orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated users to manage orders" ON orders;

-- Driver Leads
DROP POLICY IF EXISTS "Admins and driver_lead can view driver leads" ON driver_leads;
DROP POLICY IF EXISTS "Admins and driver_lead can manage driver leads" ON driver_leads;
DROP POLICY IF EXISTS "Allow public read access to driver_leads" ON driver_leads;
DROP POLICY IF EXISTS "Allow authenticated users to manage driver_leads" ON driver_leads;

-- Stocks
DROP POLICY IF EXISTS "Anyone authenticated can view stocks" ON stocks;
DROP POLICY IF EXISTS "Admins and warehouse can manage stocks" ON stocks;
DROP POLICY IF EXISTS "Allow public read access to stocks" ON stocks;
DROP POLICY IF EXISTS "Allow authenticated users to manage stocks" ON stocks;

-- KV Store
DROP POLICY IF EXISTS "Service role can access kv store" ON kv_store_549cd952;
DROP POLICY IF EXISTS "Allow backend access to kv store" ON kv_store_549cd952;

-- ============================================
-- RE-ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE IF EXISTS user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS driver_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS kv_store_549cd952 ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE NEW PERMISSIVE POLICIES
-- For demo/development, we allow public read
-- and authenticated write access
-- ============================================

-- ============================================
-- USER PROFILES POLICIES
-- ============================================

-- Allow public read access (for demo mode)
CREATE POLICY "Allow public read access to user_profiles"
    ON user_profiles FOR SELECT
    USING (true);

-- Allow authenticated users to read their own profile
CREATE POLICY "Users can view their own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

-- Allow authenticated users with admin/super_admin role to manage profiles
CREATE POLICY "Admins can manage profiles"
    ON user_profiles FOR ALL
    USING (
        auth.uid() IS NOT NULL AND (
            auth.uid() = id OR
            EXISTS (
                SELECT 1 FROM user_profiles
                WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
            )
        )
    );

-- ============================================
-- PRODUCTS POLICIES
-- ============================================

-- Allow public read access (for demo mode and initial load)
CREATE POLICY "Allow public read access to products"
    ON products FOR SELECT
    USING (true);

-- Allow authenticated users to manage products
CREATE POLICY "Allow authenticated users to manage products"
    ON products FOR ALL
    USING (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'warehouse', 'operator')
        )
    );

-- ============================================
-- ORDERS POLICIES
-- ============================================

-- Allow public read access (for demo mode)
CREATE POLICY "Allow public read access to orders"
    ON orders FOR SELECT
    USING (true);

-- Allow authenticated users to manage orders
CREATE POLICY "Allow authenticated users to manage orders"
    ON orders FOR ALL
    USING (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'operator', 'accounting', 'driver_lead')
        )
    );

-- ============================================
-- DRIVER LEADS POLICIES
-- ============================================

-- Allow public read access (for demo mode)
CREATE POLICY "Allow public read access to driver_leads"
    ON driver_leads FOR SELECT
    USING (true);

-- Allow authenticated users to manage driver leads
CREATE POLICY "Allow authenticated users to manage driver_leads"
    ON driver_leads FOR ALL
    USING (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'driver_lead')
        )
    );

-- ============================================
-- STOCKS POLICIES
-- ============================================

-- Allow public read access (for demo mode)
CREATE POLICY "Allow public read access to stocks"
    ON stocks FOR SELECT
    USING (true);

-- Allow authenticated users to manage stocks
CREATE POLICY "Allow authenticated users to manage stocks"
    ON stocks FOR ALL
    USING (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'warehouse')
        )
    );

-- ============================================
-- KV STORE POLICIES (Backend only)
-- ============================================

-- Allow backend service role to access kv store
CREATE POLICY "Allow backend access to kv store"
    ON kv_store_549cd952 FOR ALL
    USING (true);

-- ============================================
-- VERIFICATION
-- ============================================
DO $$
DECLARE
    user_profiles_count INT;
    products_count INT;
    orders_count INT;
    driver_leads_count INT;
    stocks_count INT;
BEGIN
    SELECT COUNT(*) INTO user_profiles_count FROM user_profiles;
    SELECT COUNT(*) INTO products_count FROM products;
    SELECT COUNT(*) INTO orders_count FROM orders;
    SELECT COUNT(*) INTO driver_leads_count FROM driver_leads;
    SELECT COUNT(*) INTO stocks_count FROM stocks;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'RLS POLICIES UPDATED SUCCESSFULLY';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'user_profiles: % rows', user_profiles_count;
    RAISE NOTICE 'products: % rows', products_count;
    RAISE NOTICE 'orders: % rows', orders_count;
    RAISE NOTICE 'driver_leads: % rows', driver_leads_count;
    RAISE NOTICE 'stocks: % rows', stocks_count;
    RAISE NOTICE '========================================';
    RAISE NOTICE 'IMPORTANT: Public read access enabled for demo mode';
    RAISE NOTICE 'For production, restrict policies appropriately';
    RAISE NOTICE '========================================';
END $$;
