# 🔧 SUPABASE 404 FIX - COMPLETE GUIDE

## 🎯 PROBLEM
Supabase REST API returns 404 errors when trying to fetch:
- `GET /products` → 404
- `GET /orders` → 404  
- `GET /user_profiles` → 404
- `GET /driver_leads` → 404
- `GET /stocks` → 404

## ✅ ROOT CAUSES
1. **Tables don't exist** - Migrations not run
2. **RLS policies too restrictive** - Blocking public/unauthenticated access
3. **Schema cache not refreshed** - Supabase needs restart after migration

---

## 🚀 SOLUTION - 3 STEPS (5 MINUTES)

### STEP 1: Run Table Setup Migration (2 min)

**Go to:** Supabase Dashboard → SQL Editor → New Query

**Copy and paste this ENTIRE migration:**

```sql
-- File: /supabase/migrations/20241022000001_verify_and_fix_tables.sql
-- (Copy the ENTIRE contents from that file)
```

**Or use the quick link:**
1. Open: `/supabase/migrations/20241022000001_verify_and_fix_tables.sql`
2. Copy ALL content (Ctrl+A, Ctrl+C)
3. Paste into Supabase SQL Editor
4. Click **RUN**

**Expected output:**
```
========================================
SUPABASE TABLE VERIFICATION COMPLETE
========================================
user_profiles: 0 rows (or more if you have users)
products: 5 rows
orders: 0 rows
driver_leads: 0 rows
stocks: 5 rows
========================================
```

✅ **Tables created with seed data!**

---

### STEP 2: Fix RLS Policies (1 min)

**Still in SQL Editor → New Query**

**Copy and paste this ENTIRE migration:**

```sql
-- File: /supabase/migrations/20241022000002_fix_rls_policies.sql
-- (Copy the ENTIRE contents from that file)
```

**Or:**
1. Open: `/supabase/migrations/20241022000002_fix_rls_policies.sql`
2. Copy ALL content
3. Paste into Supabase SQL Editor
4. Click **RUN**

**Expected output:**
```
========================================
RLS POLICIES UPDATED SUCCESSFULLY
========================================
user_profiles: 0 rows
products: 5 rows
orders: 0 rows
driver_leads: 0 rows
stocks: 5 rows
========================================
IMPORTANT: Public read access enabled for demo mode
For production, restrict policies appropriately
========================================
```

✅ **RLS policies now allow public read access!**

---

### STEP 3: Verify Tables (1 min)

**Still in SQL Editor → New Query**

**Copy and paste this:**

```sql
-- File: /SUPABASE_TABLE_VERIFICATION.sql
-- (Copy the ENTIRE contents from that file)
```

**Or:**
1. Open: `/SUPABASE_TABLE_VERIFICATION.sql`
2. Copy ALL content
3. Paste into Supabase SQL Editor
4. Click **RUN**

**Expected output:**
```
========================================
CHECKING TABLE EXISTENCE
========================================
user_profiles: ✅ EXISTS
products: ✅ EXISTS
orders: ✅ EXISTS
driver_leads: ✅ EXISTS
stocks: ✅ EXISTS
kv_store_549cd952: ✅ EXISTS
========================================

========================================
TABLE ROW COUNTS
========================================
user_profiles: 0 rows
products: 5 rows
orders: 0 rows
driver_leads: 0 rows
stocks: 5 rows
========================================

========================================
TESTING REST API ACCESS (SIMULATED)
========================================
GET /products: ✅ SUCCESS (5 rows)
GET /orders: ✅ SUCCESS (0 rows)
GET /user_profiles: ✅ SUCCESS (0 rows)
GET /driver_leads: ✅ SUCCESS (0 rows)
GET /stocks: ✅ SUCCESS (5 rows)
========================================

✅ ALL TABLES EXIST AND HAVE DATA

Expected REST API endpoints:
GET https://ymxwnapkniubgbboupbb.supabase.co/rest/v1/products
GET https://ymxwnapkniubgbboupbb.supabase.co/rest/v1/orders
GET https://ymxwnapkniubgbboupbb.supabase.co/rest/v1/user_profiles
GET https://ymxwnapkniubgbboupbb.supabase.co/rest/v1/driver_leads
GET https://ymxwnapkniubgbboupbb.supabase.co/rest/v1/stocks

All endpoints should return 200 OK
========================================
```

✅ **All tables verified!**

---

## 🧪 TEST REST API ENDPOINTS

### Test in Browser DevTools Console:

```javascript
// Test Products API
fetch('https://ymxwnapkniubgbboupbb.supabase.co/rest/v1/products', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlteHduYXBrbml1YmdiYm91cGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMzkzNzMsImV4cCI6MjA3NjcxNTM3M30.sHvfJM6HLFyLmcfE7fTJyqb5rYIvbpyylp5MmlixSx0',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlteHduYXBrbml1YmdiYm91cGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMzkzNzMsImV4cCI6MjA3NjcxNTM3M30.sHvfJM6HLFyLmcfE7fTJyqb5rYIvbpyylp5MmlixSx0'
  }
})
.then(r => r.json())
.then(data => console.log('✅ Products:', data))
.catch(err => console.error('❌ Error:', err));

// Test Orders API
fetch('https://ymxwnapkniubgbboupbb.supabase.co/rest/v1/orders', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlteHduYXBrbml1YmdiYm91cGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMzkzNzMsImV4cCI6MjA3NjcxNTM3M30.sHvfJM6HLFyLmcfE7fTJyqb5rYIvbpyylp5MmlixSx0',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlteHduYXBrbml1YmdiYm91cGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMzkzNzMsImV4cCI6MjA3NjcxNTM3M30.sHvfJM6HLFyLmcfE7fTJyqb5rYIvbpyylp5MmlixSx0'
  }
})
.then(r => r.json())
.then(data => console.log('✅ Orders:', data))
.catch(err => console.error('❌ Error:', err));
```

**Expected Console Output:**
```
✅ Products: [{id: 1, code: "PRD001", name: "Сүү 1л", price: 3500, ...}, ...]
✅ Orders: []
```

**If you see 404 or 403:**
- 404 = Table doesn't exist → Re-run STEP 1
- 403 = RLS blocking access → Re-run STEP 2

---

## 📊 TABLE STRUCTURE VERIFICATION

### Expected Tables:

| Table Name | Primary Key | Row Count (after seed) |
|------------|-------------|------------------------|
| `user_profiles` | id (UUID) | 0 (add users manually) |
| `products` | id (SERIAL) | 5 |
| `orders` | id (SERIAL) | 0 |
| `driver_leads` | id (SERIAL) | 0 |
| `stocks` | id (SERIAL) | 5 |
| `kv_store_549cd952` | key (TEXT) | 0 |

### Verify in Supabase Dashboard:

1. **Table Editor** → Should see all 6 tables
2. **Click on `products`** → Should see 5 rows:
   - PRD001: Сүү 1л (₮3,500)
   - PRD002: Талх (₮2,000)
   - PRD003: Төмс (₮1,500)
   - PRD004: Лууван (₮2,500)
   - PRD005: Сонгино (₮1,800)

3. **Click on `stocks`** → Should see 5 rows

---

## 🔐 RLS POLICY VERIFICATION

### Check in Supabase Dashboard:

**Authentication → Policies**

**Expected policies for each table:**

#### `products` table:
- ✅ "Allow public read access to products" (SELECT, PERMISSIVE)
- ✅ "Allow authenticated users to manage products" (ALL, PERMISSIVE)

#### `orders` table:
- ✅ "Allow public read access to orders" (SELECT, PERMISSIVE)
- ✅ "Allow authenticated users to manage orders" (ALL, PERMISSIVE)

#### `user_profiles` table:
- ✅ "Allow public read access to user_profiles" (SELECT, PERMISSIVE)
- ✅ "Users can view their own profile" (SELECT, PERMISSIVE)
- ✅ "Admins can manage profiles" (ALL, PERMISSIVE)

#### `driver_leads` table:
- ✅ "Allow public read access to driver_leads" (SELECT, PERMISSIVE)
- ✅ "Allow authenticated users to manage driver_leads" (ALL, PERMISSIVE)

#### `stocks` table:
- ✅ "Allow public read access to stocks" (SELECT, PERMISSIVE)
- ✅ "Allow authenticated users to manage stocks" (ALL, PERMISSIVE)

---

## 🐛 TROUBLESHOOTING

### Issue 1: "Table does not exist"
```
Error: relation "public.products" does not exist
```

**Solution:**
1. Re-run STEP 1 migration
2. Wait 10 seconds for schema cache refresh
3. Refresh Supabase Dashboard
4. Check Table Editor to confirm tables exist

---

### Issue 2: "403 Forbidden" or "401 Unauthorized"
```
Error: new row violates row-level security policy
```

**Solution:**
1. Re-run STEP 2 migration (RLS policies)
2. Verify policies in Dashboard → Authentication → Policies
3. Ensure "Allow public read access" policy exists for each table

---

### Issue 3: "404 Not Found" from REST API
```
GET https://...supabase.co/rest/v1/products → 404
```

**Causes:**
- Table name mismatch (check spelling: `products` not `product`)
- Schema not `public` (should be `public.products`)
- Supabase project paused/inactive

**Solution:**
1. Check Supabase project status (should be "Active")
2. Verify table name in Table Editor
3. Re-run STEP 1 and STEP 2
4. Wait 30 seconds for cache refresh
5. Test again

---

### Issue 4: Empty tables but migrations ran successfully
```
Products table exists but shows 0 rows
```

**Solution:**
Run seed data manually:

```sql
INSERT INTO products (code, name, size, color, price, description, stock)
VALUES 
  ('PRD001', 'Сүү 1л', '1л', 'Цагаан', 3500, 'Эрүүл мэндийн сүү', 150),
  ('PRD002', 'Талх', '500г', 'Бор', 2000, 'Шинэ талх', 200),
  ('PRD003', 'Төмс', '1кг', 'Шар', 1500, 'Шинэ төмс', 300),
  ('PRD004', 'Лууван', '1кг', 'Улаан', 2500, 'Шинэ лууван', 100),
  ('PRD005', 'Сонгино', '1кг', 'Улаан', 1800, 'Шинэ сонгино', 150)
ON CONFLICT (code) DO NOTHING;
```

---

## ✅ SUCCESS CHECKLIST

After completing all steps, verify:

- [ ] All 6 tables exist in Supabase Table Editor
- [ ] `products` table has 5 rows
- [ ] `stocks` table has 5 rows
- [ ] RLS policies show "public read access" for each table
- [ ] REST API test returns 200 OK (not 404)
- [ ] Browser console shows product data (not errors)
- [ ] Frontend app loads without 404 errors
- [ ] Demo mode works with local storage fallback

---

## 🎉 EXPECTED RESULT

### Browser Console:
```
✅ Products: Array(5) [{code: "PRD001", ...}, ...]
✅ Orders: Array(0) []
✅ User Profiles: Array(0) []
```

### Supabase Logs:
```
✅ GET /rest/v1/products → 200 OK (5 rows)
✅ GET /rest/v1/orders → 200 OK (0 rows)
✅ GET /rest/v1/user_profiles → 200 OK (0 rows)
✅ GET /rest/v1/driver_leads → 200 OK (0 rows)
✅ GET /rest/v1/stocks → 200 OK (5 rows)
```

### Frontend App:
```
✅ Dashboard loads
✅ Products page shows 5 products
✅ Orders page shows empty state (or demo orders)
✅ No 404 errors in console
✅ No "Failed to fetch" errors
```

---

## 📚 FILES REFERENCE

| File | Purpose |
|------|---------|
| `/supabase/migrations/20241022000000_init_schema.sql` | Initial schema setup |
| `/supabase/migrations/20241022000001_verify_and_fix_tables.sql` | Create tables + seed data |
| `/supabase/migrations/20241022000002_fix_rls_policies.sql` | Fix RLS policies |
| `/SUPABASE_TABLE_VERIFICATION.sql` | Diagnostic tool |
| `/SUPABASE_404_FIX_COMPLETE.md` | This guide |

---

## 🚀 QUICK START (TL;DR)

```bash
# 1. Open Supabase Dashboard → SQL Editor

# 2. Run these 3 files in order:
#    a) /supabase/migrations/20241022000001_verify_and_fix_tables.sql
#    b) /supabase/migrations/20241022000002_fix_rls_policies.sql
#    c) /SUPABASE_TABLE_VERIFICATION.sql

# 3. Verify output shows all ✅

# 4. Test in browser console:
fetch('https://ymxwnapkniubgbboupbb.supabase.co/rest/v1/products', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlteHduYXBrbml1YmdiYm91cGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMzkzNzMsImV4cCI6MjA3NjcxNTM3M30.sHvfJM6HLFyLmcfE7fTJyqb5rYIvbpyylp5MmlixSx0'
  }
}).then(r => r.json()).then(console.log);

# Expected: [{id: 1, code: "PRD001", ...}, ...]
```

**Done! All 404 errors should be fixed.** 🎉

---

**STATUS:** ✅ READY TO FIX

**NEXT STEP:** Run STEP 1 migration now!
