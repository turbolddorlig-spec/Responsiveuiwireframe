# 🔧 SUPABASE REST 404 ERRORS - COMPLETE FIX

## ❌ PROBLEM

Console shows 404 errors when fetching data:
```
❌ GET .../rest/v1/products → 404 Not Found
❌ GET .../rest/v1/orders → 404 Not Found
❌ GET .../rest/v1/user_profiles → 404 Not Found
```

**Root Cause:** Tables don't exist in Supabase database yet.

---

## ✅ SOLUTION OVERVIEW

We've created a comprehensive migration that will:
1. ✅ Create all required tables with correct schema
2. ✅ Set up proper indexes for performance
3. ✅ Enable Row Level Security (RLS) policies
4. ✅ Add updated_at triggers
5. ✅ Seed initial product data
6. ✅ Verify table creation

---

## 📋 TABLES THAT WILL BE CREATED

| Table | Purpose | Rows Expected |
|-------|---------|---------------|
| `user_profiles` | User accounts & roles | 0+ (created via signup) |
| `products` | Product catalog | 5 (seeded) |
| `orders` | Customer orders | 0+ (created by operators) |
| `driver_leads` | Driver recruitment leads | 0+ |
| `stocks` | Warehouse inventory | 5 (seeded) |
| `kv_store_549cd952` | Backend key-value store | 0+ |

---

## 🚀 STEP-BY-STEP FIX

### Step 1: Go to Supabase Dashboard

1. Open: **https://supabase.com/dashboard**
2. Select project: **ymxwnapkniubgbboupbb**
3. Go to: **SQL Editor** (left sidebar)

---

### Step 2: Run the Migration

1. Click **"+ New Query"** button
2. Copy the ENTIRE contents of: `/supabase/migrations/20241022000001_verify_and_fix_tables.sql`
3. Paste into SQL Editor
4. Click **"Run"** button (or press Cmd/Ctrl + Enter)

**Expected Output:**
```
✅ Success. No rows returned
✅ NOTICE: ========================================
✅ NOTICE: SUPABASE TABLE VERIFICATION COMPLETE
✅ NOTICE: ========================================
✅ NOTICE: user_profiles: 0 rows
✅ NOTICE: products: 5 rows
✅ NOTICE: orders: 0 rows
✅ NOTICE: driver_leads: 0 rows
✅ NOTICE: stocks: 5 rows
✅ NOTICE: kv_store_549cd952: 0 rows
✅ NOTICE: ========================================
```

---

### Step 3: Verify Tables Exist

In the Supabase Dashboard:

1. Go to **Table Editor** (left sidebar)
2. You should see these tables:
   ```
   ✅ user_profiles
   ✅ products (with 5 rows)
   ✅ orders
   ✅ driver_leads
   ✅ stocks (with 5 rows)
   ✅ kv_store_549cd952
   ```

3. Click on **products** table
4. You should see 5 products:
   - PRD001: Сүү 1л
   - PRD002: Талх
   - PRD003: Төмс
   - PRD004: Лууван
   - PRD005: Сонгино

---

### Step 4: Test API Endpoints

Open **API Docs** in Supabase:

1. Go to **Settings** → **API**
2. Copy your **URL**: `https://ymxwnapkniubgbboupbb.supabase.co`
3. Copy your **anon public** key

#### Test Products Endpoint:
```bash
curl -X GET \
  'https://ymxwnapkniubgbboupbb.supabase.co/rest/v1/products?select=*' \
  -H 'apikey: YOUR_ANON_KEY' \
  -H 'Authorization: Bearer YOUR_ANON_KEY'
```

**Expected:** 200 OK with 5 products

#### Test Orders Endpoint:
```bash
curl -X GET \
  'https://ymxwnapkniubgbboupbb.supabase.co/rest/v1/orders?select=*' \
  -H 'apikey: YOUR_ANON_KEY' \
  -H 'Authorization: Bearer YOUR_ANON_KEY'
```

**Expected:** 200 OK (empty array initially)

#### Test User Profiles Endpoint:
```bash
curl -X GET \
  'https://ymxwnapkniubgbboupbb.supabase.co/rest/v1/user_profiles?select=*' \
  -H 'apikey: YOUR_ANON_KEY' \
  -H 'Authorization: Bearer YOUR_ANON_KEY'
```

**Expected:** 200 OK (empty array until users sign up)

---

## 🔍 CODE VERIFICATION

### ✅ All Table Names Are Correct

I've verified all `supabase.from('table_name')` calls in the codebase:

| File | Table Used | Status |
|------|------------|--------|
| `/utils/api.ts` | `user_profiles` | ✅ Correct |
| `/utils/api.ts` | `products` | ✅ Correct |
| `/utils/api.ts` | `orders` | ✅ Correct |
| `/utils/api.ts` | `driver_leads` | ✅ Correct |
| `/utils/api.ts` | `stocks` | ✅ Correct |
| `/components/SetupChecker.tsx` | `products` | ✅ Correct |
| `/components/SetupChecker.tsx` | `orders` | ✅ Correct |
| `/components/SetupChecker.tsx` | `user_profiles` | ��� Correct |
| `/utils/supabase/client.ts` | `user_profiles` | ✅ Correct |
| `/supabase/functions/server/kv_store.tsx` | `kv_store_549cd952` | ✅ Correct |

**No table name changes needed!** ✅

---

## 🔐 ROW LEVEL SECURITY (RLS) POLICIES

All tables have proper RLS policies:

### User Profiles:
- ✅ Users can view their own profile
- ✅ Admins can view/manage all profiles

### Products:
- ✅ Authenticated users can view products
- ✅ Admins/warehouse can manage products

### Orders:
- ✅ Admins/operators/accounting can view all orders
- ✅ Drivers can view their own orders
- ✅ Admins/operators can manage orders

### Driver Leads:
- ✅ Admins/driver_lead can view/manage leads

### Stocks:
- ✅ Authenticated users can view stocks
- ✅ Admins/warehouse can manage stocks

---

## 🧪 TESTING AFTER FIX

### Test 1: Login with Demo Mode

1. Open app: `https://your-app.vercel.app`
2. Click **"Demo Mode"** button
3. Login as any demo user (e.g., super_admin / super123)
4. App should load without errors

### Test 2: Check Browser Console

**Before Fix:**
```
❌ GET /rest/v1/products → 404 Not Found
❌ GET /rest/v1/orders → 404 Not Found
```

**After Fix:**
```
✅ GET /rest/v1/products → 200 OK (5 items)
✅ GET /rest/v1/orders → 200 OK (0 items)
✅ GET /rest/v1/user_profiles → 200 OK
```

### Test 3: Dashboard Functionality

1. **Products Page:**
   - ✅ Shows 5 products
   - ✅ Can view product details
   - ✅ No 404 errors

2. **Orders Page:**
   - ✅ Loads successfully (empty initially)
   - ✅ Can create new order
   - ✅ No 404 errors

3. **Users Page:**
   - ✅ Shows demo users
   - ✅ Can view user list
   - ✅ No 404 errors

---

## 🐛 TROUBLESHOOTING

### Issue 1: Migration Fails with "already exists" Error

**Cause:** Tables already exist from previous migration

**Solution:**
```sql
-- The migration uses "CREATE TABLE IF NOT EXISTS"
-- and "DROP POLICY IF EXISTS" to handle this
-- Just run the migration again, it's safe!
```

### Issue 2: RLS Policy Error

**Error:** `new row violates row-level security policy`

**Cause:** User doesn't have permission

**Solution:**
1. Check if user is logged in (demo mode or real user)
2. Verify user has correct role in `user_profiles`
3. For testing, temporarily disable RLS:
   ```sql
   ALTER TABLE products DISABLE ROW LEVEL SECURITY;
   ```
4. Re-enable after testing:
   ```sql
   ALTER TABLE products ENABLE ROW LEVEL SECURITY;
   ```

### Issue 3: Still Getting 404 Errors

**Possible Causes:**

1. **Wrong Supabase Project:**
   - Verify URL: `https://ymxwnapkniubgbboupbb.supabase.co`
   - Check `/utils/supabase/info.tsx`:
     ```typescript
     export const projectId = "ymxwnapkniubgbboupbb"
     ```

2. **Migration Not Run:**
   - Go to Supabase Dashboard → SQL Editor
   - Run the migration script again

3. **API Key Wrong:**
   - Go to Settings → API
   - Copy **anon public** key
   - Verify it matches in `/utils/supabase/info.tsx`

4. **Cache Issue:**
   - Clear browser cache
   - Hard refresh (Cmd/Ctrl + Shift + R)
   - Restart browser

---

## 📊 DATABASE SCHEMA SUMMARY

```sql
-- User Profiles (extends auth.users)
user_profiles (
  id UUID PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN (...)),
  driver_name TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Products Catalog
products (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  size TEXT,
  color TEXT,
  price NUMERIC(12, 0),
  description TEXT,
  image_url TEXT,
  stock INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Customer Orders
orders (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  customer_phone TEXT,
  total_price NUMERIC(12, 0),
  status TEXT CHECK (status IN (...)),
  payment_status TEXT,
  payment_method TEXT,
  delivery_date TEXT,
  delivery_time TEXT,
  address TEXT,
  district TEXT,
  khoroo TEXT,
  driver_id INTEGER REFERENCES user_profiles(id),
  notes TEXT,
  products JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Driver Recruitment Leads
driver_leads (
  id SERIAL PRIMARY KEY,
  name TEXT,
  phone TEXT NOT NULL,
  district TEXT,
  province TEXT,
  note TEXT,
  status TEXT CHECK (status IN (...)),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Warehouse Stock Tracking
stocks (
  id SERIAL PRIMARY KEY,
  product_code TEXT NOT NULL,
  qty INTEGER CHECK (qty >= 0),
  warehouse TEXT NOT NULL,
  updated_at TIMESTAMPTZ
)

-- Backend Key-Value Store
kv_store_549cd952 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

---

## ✅ SUCCESS CRITERIA

After running the migration, you should see:

### Supabase Dashboard:
```
✅ 6 tables exist
✅ products has 5 rows
✅ stocks has 5 rows
✅ All tables have RLS enabled
✅ All indexes created
✅ All triggers active
```

### Browser Console:
```
✅ GET /rest/v1/products → 200 OK
✅ GET /rest/v1/orders → 200 OK
✅ GET /rest/v1/user_profiles → 200 OK
✅ GET /rest/v1/driver_leads → 200 OK
✅ GET /rest/v1/stocks → 200 OK
```

### Application:
```
✅ Demo Mode works
✅ Products page loads
✅ Orders page loads
✅ Users page loads
✅ Dashboard displays correctly
✅ No 404 errors in console
```

---

## 🎯 NEXT STEPS

1. ✅ **Run the migration** (Step 2 above)
2. ✅ **Verify tables exist** (Step 3)
3. ✅ **Test endpoints** (Step 4)
4. ✅ **Test application**
5. ✅ **Deploy to Vercel** (if needed)

---

## 📞 DEMO USER CREDENTIALS

After signup, create these users for full testing:

| Phone | Password | Role | Name |
|-------|----------|------|------|
| 99000000 | super123 | super_admin | Супер Админ |
| 99000001 | admin123 | admin | Админ Дорж |
| 99000002 | operator123 | operator | Оператор Болд |
| 99112233 | driver123 | driver | Жолооч Бат |
| 99112234 | lead123 | driver_lead | Ахлагч Цэрэн |
| 99112235 | account123 | accounting | Нягтлан Сара |
| 99112236 | warehouse123 | warehouse | Агуулах Ганбат |

**Note:** Use the signup flow in the app or Demo Mode to create these.

---

## 🎉 DONE!

After following these steps:
- ✅ All tables exist in Supabase
- ✅ All API endpoints return 200 OK
- ✅ No more 404 errors
- ✅ Application fully functional
- ✅ Ready for production use

**STATUS:** 🚀 READY TO FIX - RUN MIGRATION NOW!
