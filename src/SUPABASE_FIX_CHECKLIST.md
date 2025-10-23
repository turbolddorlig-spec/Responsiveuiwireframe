# ✅ SUPABASE 404 FIX - QUICK CHECKLIST

## 🎯 GOAL
Fix all Supabase REST API 404 errors and verify:
- ✅ GET /products → 200 OK
- ✅ GET /orders → 200 OK
- ✅ GET /user_profiles → 200 OK
- ✅ GET /driver_leads → 200 OK
- ✅ GET /stocks → 200 OK

---

## 📋 PRE-FLIGHT CHECK

**Before starting:**
- [ ] Supabase project is active (not paused)
- [ ] Project URL: `https://ymxwnapkniubgbboupbb.supabase.co` ✅
- [ ] Anon key is correct in `/utils/supabase/info.tsx` ✅
- [ ] Can access Supabase Dashboard

---

## 🚀 3-STEP FIX (5 MINUTES)

### ☐ STEP 1: Create Tables (2 min)

**Action:**
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Click "New Query"
4. Copy `/supabase/migrations/20241022000001_verify_and_fix_tables.sql`
5. Paste into SQL Editor
6. Click **RUN**

**Expected Output:**
```
✅ user_profiles: 0 rows
✅ products: 5 rows
✅ orders: 0 rows
✅ driver_leads: 0 rows
✅ stocks: 5 rows
✅ kv_store_549cd952: 0 rows
```

**Verify:**
- [ ] No error messages in SQL Editor
- [ ] "SUPABASE TABLE VERIFICATION COMPLETE" appears
- [ ] All 6 tables created

---

### ☐ STEP 2: Fix RLS Policies (1 min)

**Action:**
1. Still in SQL Editor
2. Click "New Query"
3. Copy `/supabase/migrations/20241022000002_fix_rls_policies.sql`
4. Paste into SQL Editor
5. Click **RUN**

**Expected Output:**
```
✅ RLS POLICIES UPDATED SUCCESSFULLY
✅ user_profiles: 0 rows
✅ products: 5 rows
✅ orders: 0 rows
...
IMPORTANT: Public read access enabled for demo mode
```

**Verify:**
- [ ] No error messages
- [ ] "RLS POLICIES UPDATED SUCCESSFULLY" appears
- [ ] Public read access message shown

---

### ☐ STEP 3: Verify Tables (1 min)

**Action:**
1. Still in SQL Editor
2. Click "New Query"
3. Copy `/SUPABASE_TABLE_VERIFICATION.sql`
4. Paste into SQL Editor
5. Click **RUN**

**Expected Output:**
```
✅ user_profiles: ✅ EXISTS
✅ products: ✅ EXISTS
✅ orders: ✅ EXISTS
✅ driver_leads: ✅ EXISTS
✅ stocks: ✅ EXISTS
✅ kv_store_549cd952: ✅ EXISTS
...
GET /products: ✅ SUCCESS (5 rows)
GET /orders: ✅ SUCCESS (0 rows)
...
✅ ALL TABLES EXIST AND HAVE DATA
```

**Verify:**
- [ ] All tables show "✅ EXISTS"
- [ ] All API tests show "✅ SUCCESS"
- [ ] "ALL TABLES EXIST AND HAVE DATA" message

---

## 🧪 VERIFICATION (2 MINUTES)

### ☐ TEST 1: Check Table Editor

**Action:**
1. Supabase Dashboard → Table Editor
2. Click on each table

**Expected:**
- [ ] `user_profiles` table exists (may be empty)
- [ ] `products` table exists with 5 rows
- [ ] `orders` table exists (may be empty)
- [ ] `driver_leads` table exists (may be empty)
- [ ] `stocks` table exists with 5 rows
- [ ] `kv_store_549cd952` table exists (may be empty)

---

### ☐ TEST 2: Check RLS Policies

**Action:**
1. Supabase Dashboard → Authentication → Policies
2. Select each table from dropdown

**Expected for each table:**
- [ ] RLS is **ENABLED**
- [ ] "Allow public read access..." policy exists (SELECT, PERMISSIVE)
- [ ] "Allow authenticated users to manage..." policy exists (ALL, PERMISSIVE)

---

### ☐ TEST 3: Test REST API in Browser

**Action:**
1. Open your app in browser
2. Open DevTools (F12)
3. Go to Console tab
4. Paste this code:

```javascript
// Test Products API
fetch('https://ymxwnapkniubgbboupbb.supabase.co/rest/v1/products', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlteHduYXBrbml1YmdiYm91cGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMzkzNzMsImV4cCI6MjA3NjcxNTM3M30.sHvfJM6HLFyLmcfE7fTJyqb5rYIvbpyylp5MmlixSx0',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlteHduYXBrbml1YmdiYm91cGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMzkzNzMsImV4cCI6MjA3NjcxNTM3M30.sHvfJM6HLFyLmcfE7fTJyqb5rYIvbpyylp5MmlixSx0'
  }
})
.then(r => {
  console.log('Status:', r.status);
  return r.json();
})
.then(data => console.log('✅ Products:', data))
.catch(err => console.error('❌ Error:', err));
```

**Expected Console Output:**
```
Status: 200
✅ Products: Array(5) [{id: 1, code: "PRD001", name: "Сүү 1л", ...}, ...]
```

**Checklist:**
- [ ] Status is **200** (not 404, 403, or 500)
- [ ] Data is an array with 5 products
- [ ] No errors in console

---

### ☐ TEST 4: Test Frontend App

**Action:**
1. Refresh your app
2. Open DevTools (F12) → Network tab
3. Filter by "products"
4. Watch the requests

**Expected:**
- [ ] No 404 errors for `/products`
- [ ] No 404 errors for `/orders`
- [ ] No 404 errors for `/user_profiles`
- [ ] All requests show **200 OK** status
- [ ] Products page displays 5 products
- [ ] No "Failed to fetch" errors in console

---

## 🐛 TROUBLESHOOTING

### ❌ If STEP 1 fails:

**Error:** "relation does not exist"
```sql
-- Re-run with CREATE TABLE IF NOT EXISTS
-- Already handled in migration file
```

**Error:** "permission denied"
```
Solution: Check you're logged into correct Supabase project
```

---

### ❌ If STEP 2 fails:

**Error:** "policy already exists"
```sql
-- Migration already handles this with DROP POLICY IF EXISTS
-- Just re-run the migration
```

**Error:** "table does not exist"
```
Solution: Go back to STEP 1, tables weren't created
```

---

### ❌ If REST API returns 404:

**Possible causes:**
1. Tables don't exist → Re-run STEP 1
2. Wrong table name (typo) → Check spelling
3. Wrong schema (not `public`) → Verify in Table Editor
4. Supabase project paused → Check project status

**Solution:**
```bash
# 1. Verify project is active
# 2. Re-run STEP 1 and STEP 2
# 3. Wait 30 seconds for cache refresh
# 4. Test again
```

---

### ❌ If REST API returns 403:

**Cause:** RLS blocking access

**Solution:**
```
1. Re-run STEP 2 (RLS policies)
2. Verify "Allow public read access" policy exists
3. Test again
```

---

### ❌ If tables are empty:

**Cause:** Seed data didn't insert

**Solution:**
```sql
-- Run this in SQL Editor:
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

## ✅ FINAL CHECKLIST

**Before declaring success, verify ALL of these:**

### Tables:
- [ ] All 6 tables exist in Supabase Table Editor
- [ ] `products` has 5 rows
- [ ] `stocks` has 5 rows
- [ ] No errors when querying tables

### RLS Policies:
- [ ] RLS enabled on all tables
- [ ] Public read policies exist
- [ ] Authenticated write policies exist

### REST API:
- [ ] GET /products → 200 OK (5 rows)
- [ ] GET /orders → 200 OK (0 rows)
- [ ] GET /user_profiles → 200 OK (0+ rows)
- [ ] GET /driver_leads → 200 OK (0 rows)
- [ ] GET /stocks → 200 OK (5 rows)
- [ ] No 404 errors
- [ ] No 403 errors

### Frontend App:
- [ ] App loads without errors
- [ ] Products page shows 5 products
- [ ] Orders page works (empty or demo data)
- [ ] No console errors
- [ ] No "Failed to fetch" errors
- [ ] Demo mode works if Supabase fails

---

## 🎉 SUCCESS CRITERIA

**All 404 errors fixed when you see:**

### Supabase Dashboard:
```
✅ 6 tables in Table Editor
✅ RLS policies on all tables
✅ Products table has 5 rows
```

### Browser Console:
```
✅ Status: 200
✅ Products: Array(5)
✅ No errors
```

### Network Tab:
```
✅ GET /rest/v1/products → 200 OK
✅ GET /rest/v1/orders → 200 OK
✅ GET /rest/v1/user_profiles → 200 OK
```

### Frontend:
```
✅ Products display correctly
✅ Orders page loads
✅ No 404 errors
```

---

## 📚 DOCUMENTATION

- **Complete Guide:** [SUPABASE_404_FIX_COMPLETE.md](./SUPABASE_404_FIX_COMPLETE.md)
- **Verification SQL:** [SUPABASE_TABLE_VERIFICATION.sql](./SUPABASE_TABLE_VERIFICATION.sql)
- **Migration 1:** `/supabase/migrations/20241022000001_verify_and_fix_tables.sql`
- **Migration 2:** `/supabase/migrations/20241022000002_fix_rls_policies.sql`

---

## ⏱️ ESTIMATED TIME

| Step | Time | Cumulative |
|------|------|------------|
| STEP 1: Create Tables | 2 min | 2 min |
| STEP 2: Fix RLS | 1 min | 3 min |
| STEP 3: Verify | 1 min | 4 min |
| TEST: Browser API | 1 min | 5 min |
| **TOTAL** | **5 min** | **5 min** |

---

**STATUS:** ✅ READY TO START

**NEXT:** Open Supabase Dashboard and run STEP 1!

**URL:** https://supabase.com/dashboard/project/ymxwnapkniubgbboupbb
