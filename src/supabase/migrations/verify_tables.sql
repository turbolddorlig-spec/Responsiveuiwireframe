-- ============================================
-- QUICK TABLE VERIFICATION SCRIPT
-- Run this to check if all tables exist
-- ============================================

-- Check which tables exist in public schema
SELECT 
    table_name,
    (SELECT COUNT(*) 
     FROM information_schema.columns 
     WHERE table_schema = 'public' 
     AND table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_name IN (
    'user_profiles',
    'products', 
    'orders',
    'driver_leads',
    'stocks',
    'kv_store_549cd952'
)
ORDER BY table_name;

-- Count rows in each table
DO $$
DECLARE
    user_profiles_count INT := 0;
    products_count INT := 0;
    orders_count INT := 0;
    driver_leads_count INT := 0;
    stocks_count INT := 0;
    kv_store_count INT := 0;
    table_exists BOOLEAN;
BEGIN
    -- Check and count user_profiles
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles'
    ) INTO table_exists;
    IF table_exists THEN
        SELECT COUNT(*) INTO user_profiles_count FROM user_profiles;
    END IF;

    -- Check and count products
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
    ) INTO table_exists;
    IF table_exists THEN
        SELECT COUNT(*) INTO products_count FROM products;
    END IF;

    -- Check and count orders
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'orders'
    ) INTO table_exists;
    IF table_exists THEN
        SELECT COUNT(*) INTO orders_count FROM orders;
    END IF;

    -- Check and count driver_leads
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'driver_leads'
    ) INTO table_exists;
    IF table_exists THEN
        SELECT COUNT(*) INTO driver_leads_count FROM driver_leads;
    END IF;

    -- Check and count stocks
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'stocks'
    ) INTO table_exists;
    IF table_exists THEN
        SELECT COUNT(*) INTO stocks_count FROM stocks;
    END IF;

    -- Check and count kv_store
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'kv_store_549cd952'
    ) INTO table_exists;
    IF table_exists THEN
        SELECT COUNT(*) INTO kv_store_count FROM kv_store_549cd952;
    END IF;

    -- Display results
    RAISE NOTICE '========================================';
    RAISE NOTICE 'SUPABASE TABLE STATUS';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'user_profiles: % rows', user_profiles_count;
    RAISE NOTICE 'products: % rows', products_count;
    RAISE NOTICE 'orders: % rows', orders_count;
    RAISE NOTICE 'driver_leads: % rows', driver_leads_count;
    RAISE NOTICE 'stocks: % rows', stocks_count;
    RAISE NOTICE 'kv_store_549cd952: % rows', kv_store_count;
    RAISE NOTICE '========================================';
    
    -- Recommendations
    IF products_count = 0 THEN
        RAISE NOTICE '⚠️  WARNING: products table is empty!';
        RAISE NOTICE '   Run seed.sql to add sample products';
    END IF;
    
    IF stocks_count = 0 THEN
        RAISE NOTICE '⚠️  WARNING: stocks table is empty!';
        RAISE NOTICE '   Run seed.sql to add sample stock data';
    END IF;
    
    IF user_profiles_count = 0 THEN
        RAISE NOTICE 'ℹ️  INFO: No users yet. Use signup or Demo Mode';
    END IF;
END $$;

-- Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
    'user_profiles',
    'products',
    'orders', 
    'driver_leads',
    'stocks',
    'kv_store_549cd952'
)
ORDER BY tablename;

-- List all policies
SELECT 
    schemaname,
    tablename,
    policyname,
    CASE 
        WHEN cmd = 'r' THEN 'SELECT'
        WHEN cmd = 'w' THEN 'INSERT'
        WHEN cmd = 'u' THEN 'UPDATE'
        WHEN cmd = 'd' THEN 'DELETE'
        WHEN cmd = '*' THEN 'ALL'
    END as command
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
