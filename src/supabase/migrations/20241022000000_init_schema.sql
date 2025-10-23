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
    driver_id INTEGER REFERENCES user_profiles(id),
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
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_driver_leads_updated_at BEFORE UPDATE ON driver_leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;

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
            WHERE id = auth.uid() AND role = 'driver' AND driver_id = id
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
