# 🔧 Troubleshooting Guide

Энэ нь logistics системд тулгарч болох түгээмэл асуудлууд болон тэдгээрийн шийдлийг агуулсан гарын авлага юм.

---

## 🚨 Алдааны төрлүүд

### 1. "Could not find the table 'public.orders'" (PGRST205)

**Шалтгаан**: Database schema үүсгээгүй байна.

**Шийдэл**:

1. Supabase Dashboard нээнэ үү ([supabase.com](https://supabase.com))
2. Өөрийн project сонгоно уу
3. Зүүн талын цэсээс **SQL Editor** дарна уу
4. **New query** дарна уу
5. Project дотроо `/supabase/migrations/complete_setup.sql` файлыг нээнэ үү
6. **Бүх агуулгыг** хуулж SQL Editor-т байрлуулна уу (Ctrl+A, Ctrl+C, Ctrl+V)
7. **RUN** ▶️ товч дарна уу
8. "Success" мессеж харагдах хүртэл хүлээнэ үү

**Шалгах**:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Харах ёстой: `driver_leads`, `orders`, `products`, `stocks`, `user_profiles`

---

### 2. "Invalid login credentials" (AuthApiError)

**Шалтгаан**: Demo хэрэглэгчид үүсгээгүй эсвэл user profiles холбоогүй байна.

**Шийдэл**:

#### Step 1: Auth Users үүсгэх

1. Supabase Dashboard > **Authentication** > **Users** руу орно уу
2. **Add user** > **Create new user** дарна уу
3. Дараах мэдээллийг оруулна уу:

| Email | Password | Auto Confirm |
|-------|----------|--------------|
| 99000000@logistics.mn | super123 | ✅ YES |
| 99000001@logistics.mn | admin123 | ✅ YES |
| 99000002@logistics.mn | operator123 | ✅ YES |
| 99112233@logistics.mn | driver123 | ✅ YES |
| 99112234@logistics.mn | lead123 | ✅ YES |
| 99112235@logistics.mn | account123 | ✅ YES |
| 99112236@logistics.mn | warehouse123 | ✅ YES |

⚠️ **ЧУХАЛ**: "Auto Confirm User" checkbox-г заавал идэвхжүүлнэ үү!

#### Step 2: User Profiles холбох

1. Үүсгэсэн хэрэглэгч бүрээс **User ID** хуулна уу (UUID format)
2. SQL Editor рүү орно уу
3. `/scripts/create-demo-users.sql` файлыг нээнэ үү
4. Хуулаад `PASTE_USER_ID_HERE` бүрийг өөрийн User ID-аар солино уу
5. SQL Editor дээр Paste хийж **RUN** дарна уу

**Шалгах**:
```sql
SELECT phone, name, role FROM user_profiles ORDER BY phone;
```

Харах ёстой: 7 хэрэглэгч

---

### 3. "Failed to fetch" эсвэл холболтын алдаа

**Шалтгаан**: Environment variables тохируулаагүй эсвэл буруу байна.

**Шийдэл**:

1. Project root folder дээр `.env` файл байгаа эсэхийг шалгаарай

2. Агуулга:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Зөв утгуудыг авах:
   - Supabase Dashboard > **Settings** ⚙️ > **API**
   - **Project URL** хуулах
   - **anon** `public` key хуулах

4. Dev server restart хийх:
   - Terminal дээр `Ctrl+C` дарна
   - `npm run dev` дахин ажиллуулна

---

### 4. "Email not confirmed" алдаа

**Шалтгаан**: Хэрэглэгч үүсгэхдээ "Auto Confirm User" сонгоогүй байна.

**Шийдэл**:

1. Supabase Dashboard > **Authentication** > **Users**
2. Тухайн хэрэглэгч дээр дарна уу
3. **Confirm Email** товч олж дарна уу

ЭСВЭЛ

Хэрэглэгчийг дахин үүсгэж "Auto Confirm User" идэвхжүүлнэ үү.

---

### 5. RLS Policy алдаа ("Row level security policy violation")

**Шалтгаан**: RLS policies зөв тохируулаагүй эсвэл хэрэглэгчийн role буруу байна.

**Шийдэл**:

1. Schema дахин үүсгэх: `complete_setup.sql` ажиллуулна уу
2. User roles шалгах:
```sql
SELECT id, phone, name, role FROM user_profiles;
```
3. Role зөв бол RLS policies шалгах:
```sql
SELECT tablename, policyname FROM pg_policies 
WHERE schemaname = 'public';
```

---

### 6. "Cannot insert/update/delete" алдаа

**Шалтгаан**: Хэрэглэгчийн эрх мэдэл хүрэлцэхгүй байна.

**Шийдэл**:

Super Admin эсвэл Admin эрхтэй нэвтэрч үзнэ үү:
- Нэвтрэх: `99000000`
- Нууц үг: `super123`

Хэрэв үйлдэл хийх эрхгүй бол `user_profiles` table дээр role шалгаарай.

---

### 7. Бүтээгдэхүүн харагдахгүй байна

**Шалтгаан**: Seed data оруулаагүй байна.

**Шийдэл**:

SQL Editor дээр:
```sql
INSERT INTO products (code, name, size, color, price, description, stock) VALUES
    ('PRD001', 'Сүү 1л', '1л', 'Цагаан', 3500, 'Эрүүл мэндийн сүү', 150),
    ('PRD002', 'Талх', '500г', 'Бор', 2000, 'Шинэ талх', 200),
    ('PRD003', 'Төмс', '1кг', 'Шар', 1500, 'Шинэ төмс', 300),
    ('PRD004', 'Лууван', '1кг', 'Улаан', 2500, 'Шинэ лууван', 100),
    ('PRD005', 'Сонгино', '1кг', 'Улаан', 1800, 'Шинэ сонгино', 150)
ON CONFLICT (code) DO NOTHING;
```

---

### 8. White screen / Blank page

**Шалтгаан**: Build error эсвэл JavaScript алдаа.

**Шийдэл**:

1. Browser Console нээх (F12 эсвэл Right-click > Inspect)
2. **Console** tab дээр алдааг үзэх
3. Улаан өнгийн error мессеж харах
4. Terminal дээр build алдаа шалгах

Түгээмэл шалтгаан:
- `npm install` хийгээгүй
- `.env` файл алга
- Browser cache асуудал → Ctrl+Shift+R (hard refresh)

---

### 9. Setup шалгах (Diagnostic Tool)

Login хуудас дээр **"🔍 Setup шалгах"** товч дарж автоматаар шалгуулах:

Шалгах зүйлс:
- ✅ Environment variables
- ✅ Database холболт
- ✅ Tables үүссэн эсэх
- ✅ User profiles холбогдсон эсэх
- ✅ Seed data байгаа эсэх

Алдаа гарвал автоматаар шийдлийг харуулна.

---

## 🔍 Debugging Tips

### Browser Console шалгах

1. `F12` дарж DevTools нээх
2. **Console** tab сонгох
3. Улаан алдаануудыг унших
4. Network tab дээр API requests шалгах

### Supabase Logs шалгах

1. Supabase Dashboard > **Logs**
2. Filter: `postgres` эсвэл `auth`
3. Алдааны мессеж хайх
4. Timestamp шалгах

### Common Console Errors

```
Failed to fetch
➡️ .env файл шалгах, CORS асуудал

PGRST205
➡️ Schema үүсгэх

Invalid login credentials
➡️ Users үүсгэх

Network request failed
➡️ Supabase project асаалттай эсэхийг шалгах
```

---

## ✅ Complete Setup Checklist

Дараах бүх алхмууд хийгдсэн эсэхийг шалгаарай:

- [ ] Node.js суусан (`node --version`)
- [ ] npm packages суусан (`npm install`)
- [ ] Supabase project үүсгэсэн
- [ ] Database schema үүсгэсэн (`complete_setup.sql`)
- [ ] 7 auth users үүсгэсэн (Authentication > Users)
- [ ] User profiles холбосон (`create-demo-users.sql`)
- [ ] Seed data оруулсан (products, stocks)
- [ ] `.env` файл үүсгэсэн
- [ ] `VITE_SUPABASE_URL` тохируулсан
- [ ] `VITE_SUPABASE_ANON_KEY` тохируулсан
- [ ] Dev server ажиллаж байна (`npm run dev`)
- [ ] Login хуудас харагдаж байна
- [ ] Super admin-аар нэвтрэх ажиллаж байна

---

## 📚 Дэлгэрэнгүй заавар

- **[SETUP_WALKTHROUGH.md](./SETUP_WALKTHROUGH.md)** - Алхам алхмаар setup заавар
- **[QUICKSTART.md](./QUICKSTART.md)** - Хурдан эхлэх заавар
- **[START_HERE.md](./START_HERE.md)** - Хаанаас эхлэх
- **[CREDENTIALS.md](./CREDENTIALS.md)** - Demo хэрэглэгчид
- **[README.md](./README.md)** - Системийн тойм

---

## 💬 Тусламж авах

### Асуулт асуух:
1. GitHub Issues дээр асуулт үүсгэх
2. Алдааны дэлгэрэнгүй мэдээлэл оруулах:
   - Алдааны мессеж (бүтнээр)
   - Browser console screenshot
   - Таны хийсэн алхмууд

### Тусалж болох мэдээлэл:
- Node.js version: `node --version`
- npm version: `npm --version`
- Browser: Chrome/Firefox/Safari/Edge
- OS: Windows/Mac/Linux
- Supabase project region

---

## 🎯 Бүх зүйл ажиллахгүй байвал

**Full Reset хийх**:

1. `.env` файл устгаад дахин үүсгэх
2. `node_modules` устгаад `npm install` дахин хийх
3. Dev server restart: `Ctrl+C`, дараа `npm run dev`
4. Browser cache цэвэрлэх: `Ctrl+Shift+Delete`
5. Supabase дээр schema дахин үүсгэх

**Эсвэл**:

Суудлаас эхлэх - [SETUP_WALKTHROUGH.md](./SETUP_WALKTHROUGH.md) дахин дагах

---

**Амжилт хүсье! Асуудал тулгарвал бүү санаа зов - энэ нь хэвийн явдал! 💪**
