# 🚀 Vercel + Supabase Бүрэн Тохиргоо

Энэ заавар нь **ZoodShopy Logistics System**-ийг Vercel дээр frontend, Supabase дээр backend/database байршуулах бүрэн гарын авлага юм.

---

## 📋 Тойм

- **Frontend**: Vercel (React + Vite)
- **Backend**: Supabase (PostgreSQL Database)
- **Auth**: Supabase Authentication
- **Demo Mode**: LocalStorage (Supabase байхгүй үед автомат идэвхжинэ)

---

## 🎯 1-р Алхам: Supabase Тохируулах

### 1.1. Supabase Project Үүсгэх

1. [https://supabase.com](https://supabase.com) руу орно
2. "New Project" дарна
3. Project нэр өгнө: `zoodshopy-logistics`
4. Database Password үүсгэнэ (Хадгална уу!)
5. Region сонгоно: **Singapore** (Монголд ойрхон)
6. "Create Project" дарна

### 1.2. Database Tables Үүсгэх

1. Supabase Dashboard → **SQL Editor** руу орно
2. Доорх SQL кодыг бүгдийг хуулна:

```sql
-- ============================================================================
-- ЗӨВХӨН ЭНЭ SQL-ИЙГ АЖИЛЛУУЛ - БУСДЫГ ХЭРЭГГҮЙ!
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

-- Create indexes
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

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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

CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON user_profiles FOR SELECT USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));
CREATE POLICY "Admins can insert profiles" ON user_profiles FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));
CREATE POLICY "Admins can update profiles" ON user_profiles FOR UPDATE USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));
CREATE POLICY "Admins can delete profiles" ON user_profiles FOR DELETE USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));
CREATE POLICY "Anyone authenticated can view products" ON products FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins and warehouse can manage products" ON products FOR ALL USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'warehouse')));
CREATE POLICY "Admins, operators, accounting, driver_lead can view all orders" ON orders FOR SELECT USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'operator', 'accounting', 'driver_lead')));
CREATE POLICY "Drivers can view their own orders" ON orders FOR SELECT USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'driver' AND driver_id = auth.uid()));
CREATE POLICY "Admins and operators can manage orders" ON orders FOR ALL USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'operator')));
CREATE POLICY "Admins and driver_lead can view driver leads" ON driver_leads FOR SELECT USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'driver_lead')));
CREATE POLICY "Admins and driver_lead can manage driver leads" ON driver_leads FOR ALL USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'driver_lead')));
CREATE POLICY "Anyone authenticated can view stocks" ON stocks FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins and warehouse can manage stocks" ON stocks FOR ALL USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'warehouse')));

-- Seed demo products
INSERT INTO products (code, name, size, color, price, description, stock) VALUES
    ('PRD001', 'Сүү 1л', '1л', 'Цагаан', 3500, 'Эрүүл мэндийн сүү', 150),
    ('PRD002', 'Талх', '500г', 'Бор', 2000, 'Шинэ талх', 200),
    ('PRD003', 'Төмс', '1кг', 'Шар', 1500, 'Шинэ төмс', 300),
    ('PRD004', 'Лууван', '1кг', 'Улаан', 2500, 'Шинэ лууван', 100),
    ('PRD005', 'Сонгино', '1кг', 'Улаан', 1800, 'Шинэ сонгино', 150),
    ('PRD006', 'Гурил', '1кг', 'Цагаан', 2200, 'Импортын гурил', 250),
    ('PRD007', 'Будаа', '1кг', 'Цагаан', 4500, 'Тайландын будаа', 180),
    ('PRD008', 'Гахайн мах', '1кг', 'Улаан', 12000, 'Шинэ гахайн мах', 80),
    ('PRD009', 'Үхрийн мах', '1кг', 'Улаан', 18000, 'Шинэ үхрийн мах', 60),
    ('PRD010', 'Өндөг', '10ш', 'Шар', 3000, 'Шинэ өндөг', 300)
ON CONFLICT (code) DO NOTHING;
```

3. **"RUN"** (▶️) товч дарна
4. "Success" мэссэж гарч ирнэ

### 1.3. Demo Хэрэглэгчид Үүсгэх

1. Supabase Dashboard → **Authentication** → **Users** руу орно
2. **"Add user"** → **"Create new user"** дарна
3. Доорх 7 хэрэглэгчийг үүсгэнэ:

| Email | Password | Үүрэг |
|-------|----------|-------|
| `99000000@logistics.mn` | `super123` | Super Admin |
| `99000001@logistics.mn` | `admin123` | Admin |
| `99000002@logistics.mn` | `operator123` | Operator |
| `99112233@logistics.mn` | `driver123` | Driver |
| `99112234@logistics.mn` | `lead123` | Driver Lead |
| `99112235@logistics.mn` | `account123` | Accounting |
| `99112236@logistics.mn` | `warehouse123` | Warehouse |

**Чухал:** "Auto Confirm User" checkbox-г заавал идэвхжүүлнэ!

4. Бү�� хэрэглэгчийг үүсгэсний дараа SQL Editor руу буцаж очоод доорх SQL-ийг ажиллуулна:

```sql
-- User Profiles үүсгэх (UUID-уудыг auth.users-аас татна)
INSERT INTO user_profiles (id, phone, name, role)
SELECT 
    id,
    SUBSTRING(email FROM 1 FOR POSITION('@' IN email) - 1) as phone,
    CASE 
        WHEN email = '99000000@logistics.mn' THEN 'Супер Админ'
        WHEN email = '99000001@logistics.mn' THEN 'Админ Дорж'
        WHEN email = '99000002@logistics.mn' THEN 'Оператор Болд'
        WHEN email = '99112233@logistics.mn' THEN 'Жолооч Бат'
        WHEN email = '99112234@logistics.mn' THEN 'Ахлагч Цэрэн'
        WHEN email = '99112235@logistics.mn' THEN 'Нягтлан Сара'
        WHEN email = '99112236@logistics.mn' THEN 'Агуулах Ганбат'
    END as name,
    CASE 
        WHEN email = '99000000@logistics.mn' THEN 'super_admin'
        WHEN email = '99000001@logistics.mn' THEN 'admin'
        WHEN email = '99000002@logistics.mn' THEN 'operator'
        WHEN email = '99112233@logistics.mn' THEN 'driver'
        WHEN email = '99112234@logistics.mn' THEN 'driver_lead'
        WHEN email = '99112235@logistics.mn' THEN 'accounting'
        WHEN email = '99112236@logistics.mn' THEN 'warehouse'
    END as role
FROM auth.users
WHERE email LIKE '%@logistics.mn'
ON CONFLICT (id) DO NOTHING;
```

5. **"RUN"** дарна

### 1.4. API Keys Хадгалах

1. Supabase Dashboard → **Settings** → **API** руу орно
2. Дараах мэдээллийг хуулж хадгална:
   - **Project URL**: `https://XXXXXXXXX.supabase.co`
   - **anon/public key**: `eyJhbGc...` (Урт token)

---

## 🎯 2-р Алхам: Vercel Deployment

### 2.1. GitHub Repository Үүсгэх

1. GitHub руу орж шинэ repo үүсгэнэ: `zoodshopy-logistics`
2. Локал code-оо push хийнэ:

```bash
git init
git add .
git commit -m "Initial commit: ZoodShopy Logistics System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/zoodshopy-logistics.git
git push -u origin main
```

### 2.2. Vercel-д Deploy Хийх

1. [https://vercel.com](https://vercel.com) руу орно
2. **"Add New"** → **"Project"** дарна
3. GitHub repository-гоо сонгоно: `zoodshopy-logistics`
4. **"Import"** дарна

### 2.3. Environment Variables Оруулах

**Build Settings**-д дараах Environment Variables-ийг нэмнэ:

| Variable Name | Value | Тайлбар |
|--------------|-------|---------|
| `VITE_SUPABASE_URL` | `https://XXXXXXXXX.supabase.co` | Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGc...` | Supabase anon key |

**Чухал:** `VITE_` prefix заавал байх ёстой!

5. **"Deploy"** дарна

### 2.4. Build Settings Шалгах

Vercel автоматаар таньж авна гэвч хэрэв алдаа гарвал:

- **Framework Preset**: `Vite`
- **Build Command**: `npm run build` эсвэл `vite build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

---

## 🎯 3-р Алхам: Environment Variables (Vercel дээр)

### 3.1. Figma Make Environment

Хэрэв Figma Make дээр ажиллаж байгаа бол:

1. **utils/supabase/info.tsx** файл өөрчлөгдөнө (автомат)
2. Энэ файл нь Vercel deployment-д автоматаар багтана

### 3.2. Өөрийн Supabase Холбох

Хэрэв өөрийн Supabase project холбохыг хүсвэл:

**utils/supabase/client.ts** файлд:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Vercel Dashboard → Settings → Environment Variables дээр:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Redeploy хийнэ:

```bash
# GitHub руу push хийвэл автомат redeploy болно
git add .
git commit -m "Update environment variables"
git push
```

---

## ✅ 4-р Алхам: Тест Хийх

### 4.1. Vercel URL Нээх

1. Deployment дууссан бол **"Visit"** дарна
2. Нэвтрэх хуудас гарч ирнэ

### 4.2. Нэвтрэх

Demo хэрэглэгчээр нэвтрэнэ:

```
Нэвтрэх нэр: 99000000
Нууц үг: super123
```

### 4.3. Системийг Туршиж Үзэх

- ✅ Dashboard харагдах ёстой
- ✅ Orders, Products, Users цэс ажиллана
- ✅ Захиалга үүсгэх, засах боломжтой

---

## 🔥 Санамж

### Автомат Demo Mode

Хэрэв Supabase холбогдохгүй бол систем **автоматаар Demo Mode руу шилжинэ**:

```
🎮 Demo Mode автоматаар идэвхжүүлж байна...
🎮 Demo Mode идэвхжлээ! LocalStorage ашиглана.
```

Энэ нь:
- LocalStorage ашиглан бүх өгөгдлийг хадгална
- 7 demo хэрэглэгч, 10 бүтээгдэхүүн, 3 захиалгатай ажиллана
- Backend setup хэрэггүйгээр шууд туршиж үзнэ

### Production Mode

Суpabase зөв тохируулсан бол:
- Database-аас бодит өгөгдөл татна
- Auth системээр нэвтрэнэ
- Бүх өөрчлөлт database-д хадгалагдана

---

## 🛠️ Troubleshooting

### Алдаа: "Failed to fetch"

**Шалтгаан:** Supabase URL/Keys буруу

**Шийдэл:**
1. Vercel Dashboard → Settings → Environment Variables шалгана
2. `VITE_SUPABASE_URL` болон `VITE_SUPABASE_ANON_KEY` зөв эсэхийг шалгана
3. Redeploy хийнэ

### Алдаа: "Invalid login credentials"

**Шалтгаан:** Demo хэрэглэгчид үүсгээгүй

**Шийдэл:**
1. Supabase Dashboard → Authentication → Users шалгана
2. 7 хэрэглэгчийг дахин үүсгэнэ (1.3-р алхам)
3. **Auto Confirm User** checkbox идэвхжүүлнэ

### Алдаа: "table does not exist"

**Шалтгаан:** Database tables үүсгээгүй

**Шийдэл:**
1. Supabase → SQL Editor руу орно
2. 1.2-р алхам дахь бүх SQL-ийг дахин ажиллуулна

---

## 📚 Холбоос

- Supabase Dashboard: https://supabase.com/dashboard
- Vercel Dashboard: https://vercel.com/dashboard
- Demo Credentials: `/CREDENTIALS.md`

---

## ✨ Дуусгал

Та одоо **Vercel + Supabase** дээр бүрэн ажиллагаатай Logistics системтэй боллоо! 🎉

Хэрэв асуудал гарвал:
1. Browser Console (F12) шалгана
2. Network tab дээр алдаануудыг харна
3. Supabase Logs шалгана

**Амжилт хүсье!** 🚀
