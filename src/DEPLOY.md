# 🚀 Хурдан Deployment Заавар

> **Зорилго:** Vercel дээр frontend + Supabase дээр backend 5 минутанд байршуулах

---

## ⚡ Хурдан Эхлэл (5 минут)

### 1️⃣ Supabase Setup (2 минут)

```bash
1. https://supabase.com → "New Project"
2. Project нэр: zoodshopy-logistics
3. Password үүсгэх + Region: Singapore
4. SQL Editor → Доорх SQL-ийг бүгд хуулж paste + RUN:
```

```sql
-- Tables үүсгэх
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE user_profiles (id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, phone TEXT UNIQUE NOT NULL, name TEXT NOT NULL, role TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE products (id SERIAL PRIMARY KEY, code TEXT UNIQUE NOT NULL, name TEXT NOT NULL, price NUMERIC(12, 0) DEFAULT 0, stock INTEGER DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE orders (id SERIAL PRIMARY KEY, code TEXT UNIQUE NOT NULL, total_price NUMERIC(12, 0) DEFAULT 0, status TEXT DEFAULT 'NEW', delivery_date TEXT, products JSONB DEFAULT '[]', created_at TIMESTAMPTZ DEFAULT NOW());

-- Demo өгөгдөл
INSERT INTO products (code, name, price, stock) VALUES ('PRD001', 'Сүү 1л', 3500, 150), ('PRD002', 'Талх', 2000, 200), ('PRD003', 'Төмс', 1500, 300);

-- RLS идэвхжүүлэх
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all authenticated users" ON products FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow all authenticated users" ON orders FOR ALL USING (auth.uid() IS NOT NULL);
```

```bash
5. Authentication → Users → "Add user"
   Email: 99000000@logistics.mn
   Password: super123
   ✅ Auto Confirm User checkbox идэвхжүүлнэ
6. Settings → API → Хуулна:
   - Project URL
   - anon public key
```

### 2️⃣ Vercel Deploy (3 минут)

```bash
# GitHub руу push
git init
git add .
git commit -m "Initial deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/zoodshopy.git
git push -u origin main
```

```bash
1. https://vercel.com → "Add New Project"
2. GitHub repo сонгох: zoodshopy
3. Environment Variables нэмэх:

   VITE_SUPABASE_URL = https://xxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOi...

4. "Deploy" дарна
5. 2 минутын дараа бэлэн! ✅
```

---

## 🎮 Demo Mode (Автомат)

Supabase холбогдохгүй бол систем **автоматаар Demo Mode руу шилжинэ**:

- ✅ 7 demo хэрэглэгч
- ✅ 10 бүтээгдэхүүн
- ✅ 3 захиалга
- ✅ LocalStorage ашиглана
- ✅ Backend setup хэрэггүй

**Нэвтрэх:**
```
Нэвтрэх нэр: 99000000
Нууц үг: super123
```

---

## 🔧 Бүрэн Заавар

Дэлгэрэнгүй тайлбар: **`VERCEL_SUPABASE_SETUP.md`**

- Бүрэн SQL schema
- RLS policies тайлбар
- 7 хэрэглэгчийн бүрэн setup
- Troubleshooting

---

## ✅ Шалгах

```bash
# Local тест
npm install
npm run dev
# http://localhost:5173

# Vercel URL нээх
https://your-app.vercel.app
```

**Амжилт хүсье!** 🚀
