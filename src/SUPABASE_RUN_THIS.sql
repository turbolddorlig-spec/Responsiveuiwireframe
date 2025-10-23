-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 🚀 ZOODSHOPY LOGISTICS DATABASE SETUP
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
--
-- ЗААВАР:
-- 1. Supabase Dashboard нээх → SQL Editor
-- 2. Энэ бүх SQL script-ийг copy хийх
-- 3. "New query" дарах → Paste хийх
-- 4. "Run" товч дарах ▶️
-- 5. Амжилттай бол ✅ "Success. No rows returned" гэх мэт харагдана
-- 6. Хуудсыг refresh хийгээд дахин туршаарай
--
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- ═══════════════════════════════════════════════════════════════════════════
-- 📦 STEP 1: EXTENSIONS (PostgreSQL өргөтгөлүүд)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ═══════════════════════════════════════════════════════════════════════════
-- 📋 STEP 2: TABLES (Хүснэгтүүд)
-- ═══════════════════════════════════════════════════════════════════════════

-- 👤 User Profiles Table (Хэрэглэгчийн профайл)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    phone TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'operator', 'driver', 'driver_lead', 'accounting', 'warehouse')),
    driver_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 📦 Products Table (Бүтээгдэхүүн)
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

-- 🛒 Orders Table (Захиалга)
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

-- 🚗 Driver Leads Table (Жолоочийн lead)
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

-- 📊 Stocks Table (Агуулахын нөөц)
CREATE TABLE IF NOT EXISTS stocks (
    id SERIAL PRIMARY KEY,
    product_code TEXT NOT NULL,
    qty INTEGER NOT NULL DEFAULT 0,
    warehouse TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT positive_qty CHECK (qty >= 0)
);

-- ═══════════════════════════════════════════════════════════════════════════
-- 🔍 STEP 3: INDEXES (Хурдасгуур индексүүд)
-- ═══════════════════════════════════════════════════════════════════════════

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

-- ═══════════════════════════════════════════════════════════════════════════
-- ⚙️ STEP 4: TRIGGERS (Автомат updated_at)
-- ═══════════════════════════════════════════════════════════════════════════

-- Trigger function үүсгэх
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Хүснэгт бүрт trigger нэмэх
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

-- ═══════════════════════════════════════════════════════════════════════════
-- 🔒 STEP 5: ROW LEVEL SECURITY (RLS Идэвхжүүлэх)
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════════════════════
-- 🛡️ STEP 6: RLS POLICIES (Эрх мэдлийн дүрмүүд)
-- ═══════════════════════════════════════════════════════════════════════════

-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ 👤 USER PROFILES POLICIES                                               │
-- └─────────────────────────────────────────────────────────────────────────┘

DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
CREATE POLICY "Admins can view all profiles"
    ON user_profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
        )
    );

DROP POLICY IF EXISTS "Admins can insert profiles" ON user_profiles;
CREATE POLICY "Admins can insert profiles"
    ON user_profiles FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
        )
    );

DROP POLICY IF EXISTS "Admins can update profiles" ON user_profiles;
CREATE POLICY "Admins can update profiles"
    ON user_profiles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
        )
    );

DROP POLICY IF EXISTS "Admins can delete profiles" ON user_profiles;
CREATE POLICY "Admins can delete profiles"
    ON user_profiles FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
        )
    );

-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ 📦 PRODUCTS POLICIES                                                    │
-- └─────────────────────────────────────────────────────────────────────────┘

DROP POLICY IF EXISTS "Anyone authenticated can view products" ON products;
CREATE POLICY "Anyone authenticated can view products"
    ON products FOR SELECT
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admins and warehouse can manage products" ON products;
CREATE POLICY "Admins and warehouse can manage products"
    ON products FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'warehouse')
        )
    );

-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ 🛒 ORDERS POLICIES                                                      │
-- └─────────────────────────────────────────────────────────────────────────┘

DROP POLICY IF EXISTS "Admins and operators can view all orders" ON orders;
CREATE POLICY "Admins and operators can view all orders"
    ON orders FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'operator', 'accounting', 'driver_lead')
        )
    );

DROP POLICY IF EXISTS "Drivers can view their own orders" ON orders;
CREATE POLICY "Drivers can view their own orders"
    ON orders FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'driver' AND driver_id = id
        )
    );

DROP POLICY IF EXISTS "Admins and operators can manage orders" ON orders;
CREATE POLICY "Admins and operators can manage orders"
    ON orders FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'operator')
        )
    );

-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ 🚗 DRIVER LEADS POLICIES                                                │
-- └─────────────────────────────────────────────────────────────────────────┘

DROP POLICY IF EXISTS "Admins and driver_lead can view driver leads" ON driver_leads;
CREATE POLICY "Admins and driver_lead can view driver leads"
    ON driver_leads FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'driver_lead')
        )
    );

DROP POLICY IF EXISTS "Admins and driver_lead can manage driver leads" ON driver_leads;
CREATE POLICY "Admins and driver_lead can manage driver leads"
    ON driver_leads FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'driver_lead')
        )
    );

-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ 📊 STOCKS POLICIES                                                      │
-- └─────────────────────────────────────────────────────────────────────────┘

DROP POLICY IF EXISTS "Anyone authenticated can view stocks" ON stocks;
CREATE POLICY "Anyone authenticated can view stocks"
    ON stocks FOR SELECT
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admins and warehouse can manage stocks" ON stocks;
CREATE POLICY "Admins and warehouse can manage stocks"
    ON stocks FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'warehouse')
        )
    );

-- ═══════════════════════════════════════════════════════════════════════════
-- 📝 STEP 7: SEED DATA (Туршилтын өгөгдөл)
-- ═══════════════════════════════════════════════════════════════════════════

-- 📦 Бүтээгдэхүүн нэмэх
INSERT INTO products (code, name, size, color, price, description, stock) VALUES
    ('PRD001', 'Сүү 1л', '1л', 'Цагаан', 3500, 'Эрүүл мэндийн сүү', 150),
    ('PRD002', 'Талх', '500г', 'Бор', 2000, 'Шинэ талх', 200),
    ('PRD003', 'Төмс', '1кг', 'Шар', 1500, 'Шинэ төмс', 300),
    ('PRD004', 'Лууван', '1кг', 'Улаан', 2500, 'Шинэ лууван', 100),
    ('PRD005', 'Сонгино', '1кг', 'Улаан', 1800, 'Шинэ сонгино', 150),
    ('PRD006', 'Өндөг', '10 ширхэг', 'Цагаан', 4000, 'Шинэ өндөг', 80),
    ('PRD007', 'Гурил', '1кг', 'Цагаан', 2200, 'Буудайн гу��ил', 250),
    ('PRD008', 'Будаа', '1кг', 'Цагаан', 3000, 'Хятад будаа', 120),
    ('PRD009', 'Соёо', '900г', 'Цагаан', 2800, 'Сантай соёо', 90),
    ('PRD010', 'Чихэр', '1кг', 'Цагаан', 2600, 'Нунтаг чихэр', 110)
ON CONFLICT (code) DO NOTHING;

-- 📊 Агуулахын нөөц нэмэх
INSERT INTO stocks (product_code, qty, warehouse) VALUES
    ('PRD001', 150, 'Агуулах A'),
    ('PRD002', 200, 'Агуулах A'),
    ('PRD003', 300, 'Агуулах A'),
    ('PRD004', 100, 'Агуулах B'),
    ('PRD005', 150, 'Агуулах B'),
    ('PRD006', 80, 'Агуулах A'),
    ('PRD007', 250, 'Агуулах B'),
    ('PRD008', 120, 'Агуулах A'),
    ('PRD009', 90, 'Агуулах B'),
    ('PRD010', 110, 'Агуулах A')
ON CONFLICT DO NOTHING;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- ✅ DATABASE SETUP АМЖИЛТТАЙ!
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
--
-- 🎉 Баяр хүргэе! Database tables үүсч, seed data орлоо!
--
-- 📋 ДАРААГИЙН АЛХАМ:
--
-- 1. ✅ Tables үүссэн эсэхийг шалгах:
--    → Table Editor → public schema → products, orders гэх мэт харагдана
--
-- 2. ✅ Data орсон эсэхийг шалгах:
--    → SQL Editor дээр: SELECT * FROM products;
--    → 10 бүтээгдэхүүн харагдах ёстой
--
-- 3. 👤 Demo хэрэглэгчид үүсгэх:
--    → Vercel production site нээх
--    → "Setup Demo Users" товч дарах
--    → Эсвэл: /supabase/functions/setup-demo-users ашиглах
--
-- 4. 🚀 Application туршаж үзэх:
--    → Production site refresh хийх
--    → Demo Mode-оос гарах ёстой
--    → Login хийж туршаарай!
--
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 📞 АСУУДАЛ ГАРВАЛ:
--
-- - Tables харагдахгүй байвал: Энэ script дахин run хийх
-- - RLS алдаа гарвал: Authentication → User Management шалгах
-- - Өгөгдөл харагдахгүй байвал: SELECT queries туршиж үзэх
--
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━