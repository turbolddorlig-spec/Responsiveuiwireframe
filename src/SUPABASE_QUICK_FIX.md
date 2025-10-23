# ⚡ SUPABASE 404 FIX - QUICK REFERENCE

## 🎯 3 COMMANDS TO FIX ALL 404 ERRORS

### 📍 LOCATION
https://supabase.com/dashboard/project/ymxwnapkniubgbboupbb/sql

---

## 1️⃣ CREATE TABLES (Copy → Paste → Run)

```sql
-- Copy ENTIRE file: /supabase/migrations/20241022000001_verify_and_fix_tables.sql
-- Paste into Supabase SQL Editor
-- Click RUN

-- ✅ Expected: "SUPABASE TABLE VERIFICATION COMPLETE"
-- ✅ Creates: 6 tables (products, orders, user_profiles, driver_leads, stocks, kv_store)
-- ✅ Seeds: 5 products, 5 stocks
```

---

## 2️⃣ FIX RLS POLICIES (Copy → Paste → Run)

```sql
-- Copy ENTIRE file: /supabase/migrations/20241022000002_fix_rls_policies.sql
-- Paste into Supabase SQL Editor
-- Click RUN

-- ✅ Expected: "RLS POLICIES UPDATED SUCCESSFULLY"
-- ✅ Enables: Public read access for demo mode
-- ✅ Fixes: 403 Forbidden errors
```

---

## 3️⃣ VERIFY (Copy → Paste → Run)

```sql
-- Copy ENTIRE file: /SUPABASE_TABLE_VERIFICATION.sql
-- Paste into Supabase SQL Editor
-- Click RUN

-- ✅ Expected: "ALL TABLES EXIST AND HAVE DATA"
-- ✅ Confirms: All 6 tables exist
-- ✅ Tests: REST API access
```

---

## ✅ TEST IN BROWSER

**Open Console (F12) → Paste:**

```javascript
fetch('https://ymxwnapkniubgbboupbb.supabase.co/rest/v1/products', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlteHduYXBrbml1YmdiYm91cGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMzkzNzMsImV4cCI6MjA3NjcxNTM3M30.sHvfJM6HLFyLmcfE7fTJyqb5rYIvbpyylp5MmlixSx0'
  }
})
.then(r => r.json())
.then(d => console.log('✅', d))
.catch(e => console.error('❌', e));
```

**Expected:** `✅ [{id: 1, code: "PRD001", ...}, ...]`

---

## 📊 SUCCESS INDICATORS

### Supabase Dashboard:
- ✅ Table Editor shows 6 tables
- ✅ Products table has 5 rows
- ✅ Stocks table has 5 rows

### Browser Console:
- ✅ Status: 200 (not 404)
- ✅ Data: Array(5)
- ✅ No errors

### Frontend App:
- ✅ Products page shows 5 items
- ✅ No "Failed to fetch" errors
- ✅ No 404 in Network tab

---

## 🐛 IF STILL BROKEN

### 404 → Re-run Command 1
```
Table doesn't exist
→ Go back to step 1️⃣
```

### 403 → Re-run Command 2
```
Permission denied
→ Go back to step 2️⃣
```

### Empty Tables → Seed Manually
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

## ⏱️ TIME

- Step 1: 2 min
- Step 2: 1 min
- Step 3: 1 min
- Test: 1 min
- **Total: 5 min**

---

## 📚 DETAILED GUIDES

Need more help?
- **Ultra Quick:** [FIX_SUPABASE_404_NOW.md](./FIX_SUPABASE_404_NOW.md)
- **Complete:** [SUPABASE_404_FIX_COMPLETE.md](./SUPABASE_404_FIX_COMPLETE.md)
- **Checklist:** [SUPABASE_FIX_CHECKLIST.md](./SUPABASE_FIX_CHECKLIST.md)
- **Status:** [SUPABASE_404_FIX_STATUS.md](./SUPABASE_404_FIX_STATUS.md)

---

**🚀 START NOW:** https://supabase.com/dashboard/project/ymxwnapkniubgbboupbb/sql

**✅ RESULT:** No more 404 errors!
