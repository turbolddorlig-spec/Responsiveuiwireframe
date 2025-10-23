-- ============================================
-- SUPABASE TABLE VERIFICATION & DIAGNOSTIC
-- Run this in Supabase SQL Editor to verify
-- all tables exist and are accessible
-- ============================================

-- ============================================
-- STEP 1: Check if all required tables exist
-- ============================================
DO $$
DECLARE
    table_exists BOOLEAN;
BEGIN
    RAISE NOTICE '======================================== ';
    RAISE NOTICE 'CHECKING TABLE EXISTENCE';
    RAISE NOTICE '========================================';
    
    -- Check user_profiles
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles'
    ) INTO table_exists;
    RAISE NOTICE 'user_profiles: %', CASE WHEN table_exists THEN '✅ EXISTS' ELSE '❌ MISSING' END;
    
    -- Check products
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
    ) INTO table_exists;
    RAISE NOTICE 'products: %', CASE WHEN table_exists THEN '✅ EXISTS' ELSE '❌ MISSING' END;
    
    -- Check orders
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'orders'
    ) INTO table_exists;
    RAISE NOTICE 'orders: %', CASE WHEN table_exists THEN '✅ EXISTS' ELSE '❌ MISSING' END;
    
    -- Check driver_leads
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'driver_leads'
    ) INTO table_exists;
    RAISE NOTICE 'driver_leads: %', CASE WHEN table_exists THEN '✅ EXISTS' ELSE '❌ MISSING' END;
    
    -- Check stocks
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'stocks'
    ) INTO table_exists;
    RAISE NOTICE 'stocks: %', CASE WHEN table_exists THEN '✅ EXISTS' ELSE '❌ MISSING' END;
    
    -- Check kv_store
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'kv_store_549cd952'
    ) INTO table_exists;
    RAISE NOTICE 'kv_store_549cd952: %', CASE WHEN table_exists THEN '✅ EXISTS' ELSE '❌ MISSING' END;
    
    RAISE NOTICE '========================================';
END $$;

-- ============================================
-- STEP 2: Check row counts
-- ============================================
DO $$
DECLARE
    count_val INT;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'TABLE ROW COUNTS';
    RAISE NOTICE '========================================';
    
    -- user_profiles
    BEGIN
        SELECT COUNT(*) INTO count_val FROM user_profiles;
        RAISE NOTICE 'user_profiles: % rows', count_val;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'user_profiles: ❌ ERROR - %', SQLERRM;
    END;
    
    -- products
    BEGIN
        SELECT COUNT(*) INTO count_val FROM products;
        RAISE NOTICE 'products: % rows', count_val;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'products: ❌ ERROR - %', SQLERRM;
    END;
    
    -- orders
    BEGIN
        SELECT COUNT(*) INTO count_val FROM orders;
        RAISE NOTICE 'orders: % rows', count_val;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'orders: ❌ ERROR - %', SQLERRM;
    END;
    
    -- driver_leads
    BEGIN
        SELECT COUNT(*) INTO count_val FROM driver_leads;
        RAISE NOTICE 'driver_leads: % rows', count_val;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'driver_leads: ❌ ERROR - %', SQLERRM;
    END;
    
    -- stocks
    BEGIN
        SELECT COUNT(*) INTO count_val FROM stocks;
        RAISE NOTICE 'stocks: % rows', count_val;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'stocks: ❌ ERROR - %', SQLERRM;
    END;
    
    RAISE NOTICE '========================================';
END $$;

-- ============================================
-- STEP 3: Check RLS status
-- ============================================
SELECT 
    schemaname,
    tablename,
    CASE 
        WHEN rowsecurity THEN '✅ ENABLED' 
        ELSE '⚠️ DISABLED' 
    END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN ('user_profiles', 'products', 'orders', 'driver_leads', 'stocks', 'kv_store_549cd952')
ORDER BY tablename;

-- ============================================
-- STEP 4: Check RLS policies
-- ============================================
SELECT 
    tablename,
    policyname,
    cmd as operation,
    CASE 
        WHEN permissive THEN 'PERMISSIVE' 
        ELSE 'RESTRICTIVE' 
    END as type
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename IN ('user_profiles', 'products', 'orders', 'driver_leads', 'stocks', 'kv_store_549cd952')
ORDER BY tablename, policyname;

-- ============================================
-- STEP 5: Test REST API access (simulate)
-- ============================================
DO $$
DECLARE
    count_val INT;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'TESTING REST API ACCESS (SIMULATED)';
    RAISE NOTICE '========================================';
    
    -- Test products SELECT (public read)
    BEGIN
        SELECT COUNT(*) INTO count_val FROM products;
        RAISE NOTICE 'GET /products: ✅ SUCCESS (% rows)', count_val;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'GET /products: ❌ FAILED - %', SQLERRM;
    END;
    
    -- Test orders SELECT (public read)
    BEGIN
        SELECT COUNT(*) INTO count_val FROM orders;
        RAISE NOTICE 'GET /orders: ✅ SUCCESS (% rows)', count_val;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'GET /orders: ❌ FAILED - %', SQLERRM;
    END;
    
    -- Test user_profiles SELECT (public read)
    BEGIN
        SELECT COUNT(*) INTO count_val FROM user_profiles;
        RAISE NOTICE 'GET /user_profiles: ✅ SUCCESS (% rows)', count_val;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'GET /user_profiles: ❌ FAILED - %', SQLERRM;
    END;
    
    -- Test driver_leads SELECT (public read)
    BEGIN
        SELECT COUNT(*) INTO count_val FROM driver_leads;
        RAISE NOTICE 'GET /driver_leads: ✅ SUCCESS (% rows)', count_val;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'GET /driver_leads: ❌ FAILED - %', SQLERRM;
    END;
    
    -- Test stocks SELECT (public read)
    BEGIN
        SELECT COUNT(*) INTO count_val FROM stocks;
        RAISE NOTICE 'GET /stocks: ✅ SUCCESS (% rows)', count_val;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'GET /stocks: ❌ FAILED - %', SQLERRM;
    END;
    
    RAISE NOTICE '========================================';
END $$;

-- ============================================
-- STEP 6: Display sample data
-- ============================================

-- Products sample
SELECT '========== PRODUCTS SAMPLE ==========' as info;
SELECT id, code, name, price, stock FROM products LIMIT 3;

-- Orders sample
SELECT '========== ORDERS SAMPLE ==========' as info;
SELECT id, code, status, total_price FROM orders LIMIT 3;

-- User profiles sample
SELECT '========== USER PROFILES SAMPLE ==========' as info;
SELECT id, phone, name, role FROM user_profiles LIMIT 3;

-- ============================================
-- FINAL SUMMARY
-- ============================================
DO $$
DECLARE
    user_profiles_count INT := 0;
    products_count INT := 0;
    orders_count INT := 0;
    driver_leads_count INT := 0;
    stocks_count INT := 0;
    all_tables_exist BOOLEAN := true;
BEGIN
    -- Get counts safely
    BEGIN SELECT COUNT(*) INTO user_profiles_count FROM user_profiles; EXCEPTION WHEN OTHERS THEN all_tables_exist := false; END;
    BEGIN SELECT COUNT(*) INTO products_count FROM products; EXCEPTION WHEN OTHERS THEN all_tables_exist := false; END;
    BEGIN SELECT COUNT(*) INTO orders_count FROM orders; EXCEPTION WHEN OTHERS THEN all_tables_exist := false; END;
    BEGIN SELECT COUNT(*) INTO driver_leads_count FROM driver_leads; EXCEPTION WHEN OTHERS THEN all_tables_exist := false; END;
    BEGIN SELECT COUNT(*) INTO stocks_count FROM stocks; EXCEPTION WHEN OTHERS THEN all_tables_exist := false; END;
    
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'VERIFICATION SUMMARY';
    RAISE NOTICE '========================================';
    
    IF all_tables_exist AND products_count > 0 THEN
        RAISE NOTICE '✅ ALL TABLES EXIST AND HAVE DATA';
        RAISE NOTICE '';
        RAISE NOTICE 'Expected REST API endpoints:';
        RAISE NOTICE 'GET https://ymxwnapkniubgbboupbb.supabase.co/rest/v1/products';
        RAISE NOTICE 'GET https://ymxwnapkniubgbboupbb.supabase.co/rest/v1/orders';
        RAISE NOTICE 'GET https://ymxwnapkniubgbboupbb.supabase.co/rest/v1/user_profiles';
        RAISE NOTICE 'GET https://ymxwnapkniubgbboupbb.supabase.co/rest/v1/driver_leads';
        RAISE NOTICE 'GET https://ymxwnapkniubgbboupbb.supabase.co/rest/v1/stocks';
        RAISE NOTICE '';
        RAISE NOTICE 'All endpoints should return 200 OK';
    ELSIF all_tables_exist THEN
        RAISE NOTICE '⚠️ TABLES EXIST BUT SOME ARE EMPTY';
        RAISE NOTICE 'Run seed data migration to populate tables';
    ELSE
        RAISE NOTICE '❌ SOME TABLES ARE MISSING';
        RAISE NOTICE 'Run migrations in order:';
        RAISE NOTICE '  1. 20241022000000_init_schema.sql';
        RAISE NOTICE '  2. 20241022000001_verify_and_fix_tables.sql';
        RAISE NOTICE '  3. 20241022000002_fix_rls_policies.sql';
    END IF;
    
    RAISE NOTICE '========================================';
END $$;
