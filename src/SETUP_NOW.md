# ⚠️ СУУДЛААС ЭХЛЭХ - Setup Заавар

## Та энэ алдааг харж байна:

```
Error: Could not find the table 'public.products' in the schema cache (PGRST205)
```

**Энэ нь Supabase database setup хийгээгүй байгааг илэрхийлж байна.**

---

## 🚀 5 МИНУТАД СУУДЛАХ

### ✅ Хамгийн эхний алхам: .env файл үүсгэх

1. Project root folder дээр `.env` файл үүсгэнэ үү (`.env.example` биш!)

2. Дараах агуулгыг `.env` файлд хуулна уу:

```bash
VITE_SUPABASE_URL=PASTE_YOUR_URL_HERE
VITE_SUPABASE_ANON_KEY=PASTE_YOUR_ANON_KEY_HERE
```

3. Хаанаас авах вэ?

#### A) Supabase Project үүсгээгүй бол:

1. [https://supabase.com](https://supabase.com) нээх
2. **Start your project** дарах
3. GitHub эсвэл Google-р нэвтрэх
4. **New Project** дарах
5. Мэдээлэл оруулах:
   - Project name: `logistics-system` (эсвэл дурын)
   - Database Password: **АНХААРЛАА! Энэ password-г ХАДГАЛНА УУ!**
   - Region: Singapore эсвэл Seoul (ойрхон байх)
6. **Create new project** дарах
7. 2-3 минут хүлээх (project үүсгэж байна...)

#### B) Supabase Project үүсгэсэн бол:

1. [https://supabase.com/dashboard](https://supabase.com/dashboard) нээх
2. Өөрийн project дарах
3. Зүүн талын цэснээс **Settings** ⚙️ дарах
4. **API** дарах
5. Дараах 2 утгыг хуулах:
   - **Project URL** → `.env` файлын `VITE_SUPABASE_URL`
   - **anon public** key → `.env` файлын `VITE_SUPABASE_ANON_KEY`

**Жишээ .env файл:**
```bash
VITE_SUPABASE_URL=https://abcdefgh12345678.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...очень_длинный_ключ
```

---

### ✅ Хоёрдахь алхам: Database Schema үүсгэх

1. Supabase Dashboard дээр **SQL Editor** дарах (зүүн талын цэс)

2. **New query** товч дарах

3. **Project файлаасаа** дараах файлыг нээх:
   ```
   /supabase/migrations/complete_setup.sql
   ```

4. **Бүх агуулгыг хуулах** (Ctrl+A, Ctrl+C)

5. SQL Editor дээр **Paste** хийх (Ctrl+V)

6. **RUN ▶️** товч дарах (эсвэл Ctrl+Enter)

7. **"Success. No rows returned"** гэсэн мессеж харах

✅ Үүнд таны database дараах tables үүснэ:
- `products` - Бүтээгдэхүүн
- `orders` - Захиалга
- `user_profiles` - Хэрэглэгчдийн profile
- `stocks` - Нөөцийн хөдөлгөөн
- `driver_leads` - Жолоочдын багийн удирдлага

---

### ✅ Гуравдахь алхам: Demo хэрэглэгчид үүсгэх

#### 3.1: Auth Users үүсгэх

1. Supabase Dashboard > **Authentication** > **Users** (зүүн цэс)

2. **Add user** ▼ > **Create new user** дарах

3. **7 удаа** дараах хэрэглэгчдийг үүсгэх:

| # | Email | Password | Auto Confirm | Нэр |
|---|-------|----------|--------------|-----|
| 1 | 99000000@logistics.mn | super123 | ✅ YES | Супер админ |
| 2 | 99000001@logistics.mn | admin123 | ✅ YES | Админ |
| 3 | 99000002@logistics.mn | operator123 | ✅ YES | Оператор |
| 4 | 99112233@logistics.mn | driver123 | ✅ YES | Бат (жолооч) |
| 5 | 99112234@logistics.mn | lead123 | ✅ YES | Дорж (багийн ахлагч) |
| 6 | 99112235@logistics.mn | account123 | ✅ YES | Нягтлан |
| 7 | 99112236@logistics.mn | warehouse123 | ✅ YES | Агуулахчин |

⚠️ **АНХААРЛАА**: "Auto Confirm User" checkbox-г ЗААВАЛ идэвхжүүлнэ үү!

#### 3.2: User Profiles холбох

1. Хэрэглэгч бүрээс **User ID** хуулж авах:
   - Хэрэглэгч дээр дарах
   - "ID" field дээр дарж хуулах (uuid format, жишээ: `a1b2c3d4-...`)

2. **SQL Editor** дээр шинэ query үүсгэх

3. Project файлаас `/scripts/create-demo-users.sql` нээх

4. Дараах хэсгүүдийг **солих**:
   ```sql
   -- ЖИШЭЭ: Супер админ
   INSERT INTO user_profiles (id, phone, name, role)
   VALUES (
     'PASTE_USER_ID_HERE',  -- ← ЭНД USER ID ХУУЛНА
     '99000000',
     'Супер Админ',
     'super_admin'
   );
   ```

5. Бүх 7 хэрэглэгчийн хувьд `PASTE_USER_ID_HERE`-г солих

6. **RUN ▶️** дарах

7. Амжилттай: `INSERT 0 7` гэсэн мессеж харагдана

---

### ✅ Дөрөвдэх алхам: Бүтээгдэхүүн нэмэх (Сонгох)

SQL Editor дээр ажиллуулах:

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

### ✅ Тавдахь алхам: Dev Server Restart

1. Terminal дээр `Ctrl+C` дарж server зогсоох

2. Дахин ажиллуулах:
   ```bash
   npm run dev
   ```

3. Browser refresh хийх (Ctrl+R эсвэл F5)

---

## ✅ Амжилттай суудсан эсэхээ шалгах

### Login хуудас дээр:

1. Нэвтрэх нэр: `99000000`
2. Нууц үг: `super123`
3. **Нэвтрэх** дарах

### Хэрэв амжилттай бол:

- ✅ Dashboard харагдана
- ✅ Захиалга, Бүтээгдэхүүн цэснүүд харагдана
- ✅ "Тавтай морил, Супер Админ!" гэсэн мессеж

### Хэрэв алдаа гарвал:

#### "Invalid login credentials"
→ Demo users үүсгээгүй эсвэл user_profiles холбоогүй байна
→ **Гуравдахь алхам дахин хийх**

#### "Table not found"
→ Schema үүсгээгүй байна
→ **Хоёрдахь алхам дахин хийх**

#### "Failed to fetch"
→ .env файл алдаатай байна
→ **Эхний алхам дахин шалгах**

---

## 🆘 Тусламж хэрэгтэй юу?

### Дэлгэрэнгүй заавар:
- 📘 **SETUP_WALKTHROUGH.md** - Алхам алхмаар (screenshot бүхий)
- 📕 **QUICKSTART.md** - Хурдан эхлэх (5 мин)
- 📗 **TROUBLESHOOTING.md** - Бүх асуудлын шийдэл

### Browser Console шалгах:
1. `F12` дарах
2. **Console** tab нээх
3. Улаан алдаануудыг унших
4. Screenshot авч илгээх

### Туслах хүсэлт илгээх:
1. GitHub Issues дээр шинэ issue үүсгэх
2. Дараах мэдээлэл оруулах:
   - Алдааны мессеж
   - Browser Console screenshot
   - Хийсэн алхмууд

---

## 💡 Зөвлөмж

### 1. .env файлыг git-д commit хийхгүй!
`.gitignore` файлд `.env` байгаа эсэхийг шалгаарай.

### 2. Database Password хадгалах
Supabase project үүсгэхдээ database password-г аюулгүй газар хадгалаарай.

### 3. Region сонгох
MongoDB болон бусад сервисүүдтэй ижил region сонговол хурдан ажиллана.

---

## ✨ Setup дууссаны дараа

Систем бүрэн ажиллахад бэлэн болно:

- ✅ 7 төрлийн эрх мэдэл (super_admin, admin, operator, driver, driver_lead, accounting, warehouse)
- ✅ Захиалга удирдах (Үүсгэх, Засах, Цуцлах, Төлөв өөрчлөх)
- ✅ Бүтээгдэхүүн удирдах (Stock tracking)
- ✅ Жолооч удирдах (Real-time delivery tracking)
- ✅ Тайлан харах (Dashboard, Accounting)
- ✅ Монголын цаг (UTC+8)
- ✅ Responsive дизайн

---

**Амжилт хүсье! Setup дууссаны дараа `npm run dev` ажиллуулж системийг ашиглаарай! 🚀**
