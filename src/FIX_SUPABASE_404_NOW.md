# 🚨 FIX SUPABASE 404 ERRORS NOW - 3 STEPS

## ⚡ QUICK FIX (5 MINUTES)

Your Supabase REST API is returning **404 errors**. Fix it in 3 steps:

---

## 🎯 THE PROBLEM

```
❌ GET /rest/v1/products → 404 Not Found
❌ GET /rest/v1/orders → 404 Not Found
❌ GET /rest/v1/user_profiles → 404 Not Found
```

**Cause:** Tables don't exist or RLS policies are blocking access.

---

## ✅ THE SOLUTION

### STEP 1: Create Tables (2 min)

1. **Open:** https://supabase.com/dashboard/project/ymxwnapkniubgbboupbb/sql
2. **Click:** "New Query"
3. **Copy ALL of this file:** `/supabase/migrations/20241022000001_verify_and_fix_tables.sql`
4. **Paste** into SQL Editor
5. **Click:** RUN (▶️ button)

**Expected:**
```
✅ SUPABASE TABLE VERIFICATION COMPLETE
✅ user_profiles: 0 rows
✅ products: 5 rows
✅ orders: 0 rows
✅ driver_leads: 0 rows
✅ stocks: 5 rows
✅ kv_store_549cd952: 0 rows
```

---

### STEP 2: Fix RLS Policies (1 min)

1. **Still in SQL Editor**
2. **Click:** "New Query"
3. **Copy ALL of this file:** `/supabase/migrations/20241022000002_fix_rls_policies.sql`
4. **Paste** into SQL Editor
5. **Click:** RUN (▶️ button)

**Expected:**
```
✅ RLS POLICIES UPDATED SUCCESSFULLY
✅ Public read access enabled for demo mode
```

---

### STEP 3: Verify (1 min)

**Test in browser console (F12):**

```javascript
fetch('https://ymxwnapkniubgbboupbb.supabase.co/rest/v1/products', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlteHduYXBrbml1YmdiYm91cGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMzkzNzMsImV4cCI6MjA3NjcxNTM3M30.sHvfJM6HLFyLmcfE7fTJyqb5rYIvbpyylp5MmlixSx0'
  }
})
.then(r => r.json())
.then(data => console.log('✅ SUCCESS:', data))
.catch(err => console.error('❌ FAILED:', err));
```

**Expected:**
```
✅ SUCCESS: [{id: 1, code: "PRD001", name: "Сүү 1л", price: 3500, ...}, ...]
```

---

## 🎉 DONE!

After these 3 steps:
- ✅ All tables exist
- ✅ All REST API calls return 200 OK
- ✅ Frontend loads data correctly
- ✅ No more 404 errors

---

## 📚 DETAILED GUIDES

If you need more help:
- **Complete Guide:** [SUPABASE_404_FIX_COMPLETE.md](./SUPABASE_404_FIX_COMPLETE.md)
- **Checklist:** [SUPABASE_FIX_CHECKLIST.md](./SUPABASE_FIX_CHECKLIST.md)
- **Verification SQL:** [SUPABASE_TABLE_VERIFICATION.sql](./SUPABASE_TABLE_VERIFICATION.sql)

---

## 🐛 TROUBLESHOOTING

### Still getting 404?
1. Check Supabase project is **active** (not paused)
2. Wait 30 seconds for cache refresh
3. Clear browser cache
4. Re-run STEP 1 and STEP 2

### Getting 403 Forbidden?
- Re-run STEP 2 (RLS policies)
- Verify "Allow public read access" policy exists

### Tables are empty?
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

**START NOW:** https://supabase.com/dashboard/project/ymxwnapkniubgbboupbb/sql

**Time:** 5 minutes

**Difficulty:** Easy (just copy-paste-run!)

✅ **Let's fix those 404s!**
