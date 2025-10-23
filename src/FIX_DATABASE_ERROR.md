# 🔧 DATABASE ERROR FIX - ШУУД ЗАСВАР

## 🚨 Алдаа

```
"Could not find the table 'public.products' in the schema cache"
PGRST205 error
```

→ **Шалтгаан:** Supabase database дээр tables үүсээгүй байна!

---

## ⚡ ШУУРХАЙ ЗАСВАР (2 минут)

### Алхам 1: Supabase Dashboard Нээх

```
1. https://supabase.com/dashboard нээх
2. Project сонгох
3. SQL Editor tab сонгох
```

### Алхам 2: SQL Script Ажиллуулах

```
1. "New query" товч дарах
2. SUPABASE_RUN_THIS.sql файлыг нээх
3. Бүх агуулгыг COPY хийх (Ctrl+A → Ctrl+C)
4. SQL Editor руу PASTE хийх (Ctrl+V)
5. "Run" товч дарах ▶️
```

### Алхам 3: Үр Дүн Шалгах

**✅ Амжилттай бол:**
```
Success. No rows returned.
```

Эсвэл:

```
Rows returned: 0
Execution time: XXXms
```

**❌ Алдаа гарвал:**
- Алдааны текстийг уншаарай
- Extension-ууд идэвхжүүлэгдээгүй байж болно
- Дахин run хийж үзээрэй

---

## 📊 Алхам 4: Tables Үүссэн Эсэхийг Шалгах

```
1. Supabase Dashboard
2. Table Editor tab
3. public schema

Хүлээгдэж буй tables:
✅ user_profiles
✅ products
✅ orders
✅ driver_leads
✅ stocks
```

**Data шалгах:**
```sql
SELECT * FROM products;
-- → 10 бүтээгдэхүүн харагдах ёстой
```

---

## 🚀 Алхам 5: Application Refresh

```
1. Vercel production site нээх
2. Хуудсыг бүрэн refresh (Ctrl+Shift+R)
3. Browser DevTools Console нээх (F12)
4. Алдаа байгаа эсэхийг шалгах
```

**Хүлээгдэж буй:**
```
❌ "Could not find table" алдаа БАЙХГҮЙ болно
✅ Demo Mode-оос гарна
✅ "Setup Required" screen харагдана (хэрэв demo users байхгүй бол)
```

---

## 👤 Алхам 6: Demo Users Үүсгэх (Optional)

**Хувилбар A: Automatic (Edge Function)**

```
1. Vercel site дээр "Setup Demo Users" товч дарах
2. Хэдэн секунд хүлээх
3. Амжилттай гэсэн мессеж харагдана
```

**Хувилбар B: Manual (SQL)**

```sql
-- Supabase SQL Editor дээр:

-- NOTE: Энэ нь зөвхөн туршилтын зорилготой!
-- Production дээр signup API ашиглах хэрэгтэй!

-- Signup API ашиглах заавар:
-- → /supabase/functions/setup-demo-users/index.ts файлыг үзнэ үү
-- → Frontend-ээс тухайн Edge Function дуудах
```

---

## ✅ БҮРЭН CHECKLIST

- [ ] Supabase Dashboard → SQL Editor нээсэн
- [ ] SUPABASE_RUN_THIS.sql script run хийсэн
- [ ] "Success" гэсэн мессеж харагдсан
- [ ] Table Editor дээр 5 table харагдаж байна
- [ ] `SELECT * FROM products;` → 10 rows
- [ ] Production site refresh хийсэн
- [ ] "Could not find table" алдаа БАЙХГҮЙ
- [ ] Demo users үүсгэсэн (optional)
- [ ] Login туршиж үзсэн

---

## 🔍 TROUBLESHOOTING

### Асуудал 1: "Extension does not exist"

```sql
-- Supabase Dashboard → Database → Extensions
-- uuid-ossp идэвхжүүлэх
-- pgcrypto идэвхжүүлэх
```

### Асуудал 2: Tables үүсч байгаа ч data байхгүй

```sql
-- SQL Editor дээр:
SELECT COUNT(*) FROM products;
-- → 10 гарах ёстой

-- Хэрэв 0 бол:
-- SUPABASE_RUN_THIS.sql дахин run хийх
-- STEP 7 (SEED DATA) хэсгийг дахин run хийх
```

### Асуудал 3: RLS Policy алдаа

```
Error: policy "..." already exists

→ Энэ нь хэвийн. Script-д DROP POLICY IF EXISTS байгаа
→ Дахин run хийж болно
```

### Асуудал 4: Vercel дээр Demo Mode-оос гарахгүй байна

```
Шалтгаан:
- Database холболт тохируулагдаагүй
- Environment variables буруу
- RLS policies хэт хатуу

Шалгах:
1. Supabase URL болон Anon Key зөв эсэх
2. RLS policies үүссэн эсэх
3. Browser Console алдаа байгаа эсэх
```

### Асуудал 5: "Setup Demo Users" товч ажиллахгүй

```
→ Edge function deploy хийгдээгүй байж болно
→ Manual signup хийх:

Vercel дээр signup form-оор:
- Phone: 99000000
- Password: super123
- Name: Супер Админ
- Role: super_admin
```

---

## 📋 ХЭВИЙН WORKFLOW

```
┌─────────────────────────────────────────────┐
│ 1. SQL Script Run                           │
│    → Tables үүсгэх                          │
│    → RLS policies тохируулах                │
│    → Seed data оруулах                      │
└─────────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────────┐
│ 2. Tables Verify                            │
│    → Table Editor шалгах                    │
│    → Data байгаа эсэхийг баталгаажуулах     │
└─────────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────────┐
│ 3. Application Refresh                      │
│    → Production site reload                 │
│    → Demo Mode гарах                        │
└─────────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────────┐
│ 4. Demo Users Setup                         │
│    → Edge function эсвэл manual signup      │
│    → 7 demo users үүсгэх                    │
└─────────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────────┐
│ 5. Login & Test                             │
│    → Phone: 99000000                        │
│    → Password: super123                     │
│    → Амжилттай нэвтэрч, dashboard харах     │
└─────────────────────────────────────────────┘
```

---

## 🎯 ЯАГААД DEMO MODE ИДЭВХЖСЭН ВЭ?

```js
// App.tsx дээр автомат detection:

useEffect(() => {
  const checkDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(1);
      
      if (error) {
        // ❌ Database холбогдохгүй байна
        // → АВТОМАТ Demo Mode идэвхжүүлнэ
        enableDemoMode();
      }
    } catch {
      // ❌ Network эсвэл бусад алдаа
      // → АВТОМАТ Demo Mode идэвхжүүлнэ
      enableDemoMode();
    }
  };
  
  checkDatabase();
}, []);
```

**Үр дүн:**
- ✅ Database setup хийгдээгүй ч туршиж үзэх боломжтой
- ✅ LocalStorage ашиглан 7 demo users, 10 products
- ✅ Backend-гүй бүрэн ажиллах UI

**Database setup хийсний дараа:**
- ✅ Demo Mode автоматаар идэвхгүй болно
- ✅ Production database ашиглагдана
- ✅ Бодит Supabase Auth, RLS, Realtime

---

## 📞 АСУУДАЛ ҮРГЭЛЖИЛБЭЛ

**Screenshot аваарай:**
1. SQL Editor run үр дүн
2. Table Editor (Tables list)
3. Browser Console (F12)
4. Production site (Demo Mode эсвэл Setup screen)

**Хаана алдаа гарч байгааг тодорхой бичээрэй:**
- SQL run үед?
- Tables үүсч байгаа боловч data байхгүй?
- Application refresh хийсний дараа ч Demo Mode-ноос гарахгүй?

→ Би дэлгэрэнгүй тусална!

---

## 🚀 ФАЙЛУУД

- **SUPABASE_RUN_THIS.sql** - SQL script (энийг run хийх!)
- **/supabase/migrations/** - Migration files (reference)
- **/supabase/seed.sql** - Seed data (reference)
- **/supabase/functions/setup-demo-users/** - Edge function

---

**Одоо SUPABASE_RUN_THIS.sql файлыг Supabase SQL Editor дээр run хийгээрэй!**

**Амжилт!** 🎉
