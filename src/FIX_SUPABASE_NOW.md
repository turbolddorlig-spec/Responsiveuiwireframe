# 🚀 FIX SUPABASE 404 ERRORS - DO THIS NOW

## ❌ CURRENT PROBLEM

Your app shows 404 errors in browser console:
```
❌ GET https://ymxwnapkniubgbboupbb.supabase.co/rest/v1/products → 404
❌ GET https://ymxwnapkniubgbboupbb.supabase.co/rest/v1/orders → 404
❌ GET https://ymxwnapkniubgbboupbb.supabase.co/rest/v1/user_profiles → 404
```

**Why?** The database tables don't exist yet.

---

## ✅ SOLUTION (5 MINUTES)

### Step 1: Open Supabase Dashboard

1. Go to: **https://supabase.com/dashboard**
2. Login to your account
3. Select project: **ymxwnapkniubgbboupbb**

---

### Step 2: Open SQL Editor

1. Click **"SQL Editor"** in left sidebar
2. Click **"+ New Query"** button

---

### Step 3: Copy Migration Script

Open this file in your code:
```
/supabase/migrations/20241022000001_verify_and_fix_tables.sql
```

Copy the **ENTIRE contents** (all 500+ lines)

---

### Step 4: Run Migration

1. Paste into SQL Editor
2. Click **"Run"** button (bottom right)
3. Wait 5-10 seconds

**Expected Result:**
```
✅ Success. No rows returned

Notices:
========================================
SUPABASE TABLE VERIFICATION COMPLETE
========================================
user_profiles: 0 rows
products: 5 rows
orders: 0 rows
driver_leads: 0 rows
stocks: 5 rows
kv_store_549cd952: 0 rows
========================================
```

---

### Step 5: Verify Tables

1. Click **"Table Editor"** in left sidebar
2. You should see 6 tables:
   ```
   ✅ user_profiles
   ✅ products
   ✅ orders
   ✅ driver_leads
   ✅ stocks
   ✅ kv_store_549cd952
   ```

3. Click **"products"** table
4. You should see 5 products:
   - PRD001: Сүү 1л
   - PRD002: Талх
   - PRD003: Төмс
   - PRD004: Лууван
   - PRD005: Сонгино

---

### Step 6: Test Your App

1. Open your app: `https://your-app.vercel.app`
2. Open Browser DevTools (F12)
3. Go to **Console** tab
4. Refresh page (Cmd/Ctrl + R)

**Expected Result:**
```
✅ GET /rest/v1/products → 200 OK
✅ GET /rest/v1/orders → 200 OK
✅ GET /rest/v1/user_profiles → 200 OK
```

**No more 404 errors!** 🎉

---

## 🐛 TROUBLESHOOTING

### Issue: "relation already exists"

**This is OK!** It means tables already exist. The migration script handles this safely.

### Issue: Still getting 404 errors

1. **Verify Project ID:**
   - Check `/utils/supabase/info.tsx`
   - Should be: `projectId = "ymxwnapkniubgbboupbb"`

2. **Clear Browser Cache:**
   - Hard refresh: Cmd/Ctrl + Shift + R
   - Or clear cache in DevTools

3. **Check Table Names:**
   - Go to Supabase → Table Editor
   - Verify tables exist: `products`, `orders`, `user_profiles`

### Issue: RLS Policy Error

If you see: `new row violates row-level security policy`

**Temporary Fix:**
```sql
-- Run in SQL Editor
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
```

**Proper Fix:** Login with Demo Mode first to create a user with proper role.

---

## 📋 WHAT THE MIGRATION DOES

1. ✅ Creates 6 tables (if not exist)
2. ✅ Sets up indexes for performance
3. ✅ Enables Row Level Security (RLS)
4. ✅ Creates RLS policies for access control
5. ✅ Adds updated_at triggers
6. ✅ Seeds 5 products + stock data
7. ✅ Verifies table creation

---

## 🎯 QUICK CHECKLIST

- [ ] Opened Supabase Dashboard
- [ ] Went to SQL Editor
- [ ] Copied migration script
- [ ] Ran migration (clicked Run)
- [ ] Verified tables exist in Table Editor
- [ ] Tested app in browser
- [ ] Checked console for 200 OK responses
- [ ] No more 404 errors!

---

## 📖 MORE INFO

For detailed documentation:
- **Full Guide:** [SUPABASE_404_FIX.md](./SUPABASE_404_FIX.md)
- **Verification Script:** [verify_tables.sql](./supabase/migrations/verify_tables.sql)

---

## 🎉 SUCCESS!

After running the migration:
- ✅ All API endpoints return 200 OK
- ✅ Products load correctly
- ✅ Orders load correctly
- ✅ Users load correctly
- ✅ No more 404 errors
- ✅ App fully functional

**Total Time:** 5 minutes
**Difficulty:** Easy (just copy & paste!)

---

**STATUS:** 🚀 READY TO FIX

**ACTION:** Go to Supabase Dashboard → SQL Editor → Run Migration Now!
