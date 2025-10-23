# 🎬 Supabase Setup - Step by Step Walkthrough

Энэ заавар нь **хэзээ ч Supabase ашиглаж үзээгүй** хүмүүст зориулсан мэдрэмжтэй дэлгэрэнгүй алхам алхмаар заавар юм.

---

## ⏱️ Хугацаа: 10-15 минут

---

## 📋 Хэрэгтэй зүйлс

- ✅ Gmail эсвэл GitHub account (Supabase нэвтрэх)
- ✅ Сайн интернэт холболт
- ✅ Энэ project-ийг татаад, `npm install` хийсэн байх

---

## 🎯 PART 1: Supabase Project үүсгэх (3 минут)

### Алхам 1.1: Supabase нэвтрэх

1. Браузер дээр [https://supabase.com](https://supabase.com) руу орно уу
2. Баруун дээд буланд **"Start your project"** товч дарна уу
3. **"Sign in with GitHub"** эсвэл **"Sign in with Google"** сонгоно уу
4. Эрх олгох цонх гарвал **"Authorize"** дарна уу

✅ **Амжилттай**: Та одоо Supabase dashboard дээр байна!

---

### Алхам 1.2: Шинэ Project үүсгэх

1. **"New Project"** товч дарна уу (ногоон товч, dashboard-ийн голд байна)
2. Дараах мэдээллийг бөглөнө үү:

   **Project Name**: `logistics-system` (эсвэл дурын нэр)
   
   **Database Password**: Аюулгүй нууц үг үүсгэнэ үү
   - Жишээ: `MySecurePass123!`
   - ⚠️ **АНХААРУУЛГА**: Энэ нууц үгийг **ХАДГАЛНА УУ**! Та дараа хэрэглэх болно.
   - Би: Notepad дээр хадгалж байна
   
   **Region**: Сонгоно уу
   - Хамгийн ойр: **Northeast Asia (Seoul)** эсвэл **Southeast Asia (Singapore)**
   
   **Pricing Plan**: `Free` сонгогдсон байх ёстой ✅

3. **"Create new project"** товч дарна уу

4. ⏳ **2-3 минут хүлээнэ үү** - Supabase таны project-ийг үүсгэж байна...
   - "Setting up project..." гэж харагдана
   - Кофе уух боломжтой! ☕

✅ **Амжилттай**: Project dashboard харагдах болно!

---

## 🗄️ PART 2: Database Schema үүсгэх (3 минут)

Одоо бид өгөгдлийн санд tables үүсгэх болно.

### Алхам 2.1: SQL Editor нээх

1. Зүүн талын цэс дээр **"SQL Editor"** товчийг дарна уу
   - 📝 Icon-той байна
   
2. Баруун дээд талд **"New query"** товч дарна уу

✅ Та одоо SQL editor дээр байна - энд код бичих болно!

---

### Алхам 2.2: Schema Code хуулах

1. **Энэ project дотроо** `/supabase/migrations/complete_setup.sql` файлыг нээнэ үү
   - VS Code эсвэл аливаа text editor ашиглана уу

2. Файлын **БҮГДИЙГ** сонгоно уу:
   - Windows: `Ctrl + A`
   - Mac: `Cmd + A`

3. Хуулна уу:
   - Windows: `Ctrl + C`
   - Mac: `Cmd + C`

4. Supabase SQL Editor руу буцаж ирээд **Paste** хийнэ үү:
   - Windows: `Ctrl + V`
   - Mac: `Cmd + V`

✅ Editor дээр маш их SQL код харагдах болно (500+ lines)

---

### Алхам 2.3: Schema ажиллуулах

1. Баруун доод буланд **"RUN"** товч байна - **дарна уу**! ▶️

2. ⏳ **5-10 секунд** хүлээнэ үү...

3. Доод хэсэгт **"Success. No rows returned"** гэсэн ногоон мессеж харагдах ёстой ✅

4. **Verification** хийе: Дараах SQL-г хуулж, шинэ query-д run хийнэ үү:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   ORDER BY table_name;
   ```

   **Харах ёстой үр дүн**:
   ```
   driver_leads
   orders
   products
   stocks
   user_profiles
   ```

✅ **Амжилттай**: Бүх tables үүсгэгдлээ! 🎉

---

## 👥 PART 3: Demo Users үүсгэх (5 минут)

Одоо бид 7 demo хэрэглэгч үүсгэх болно.

### Алхам 3.1: Authentication хэсэгт орох

1. Зүүн талын цэсээс **"Authentication"** сонгоно уу
   - 🔐 Icon-той

2. Дээд цэс дээр **"Users"** tab дарна уу

✅ Хоосон хүснэгт харагдана - одоо хэрэглэгч алга

---

### Алхам 3.2: Эхний хэрэглэгч үүсгэх (Super Admin)

1. Баруун дээд талд **"Add user"** товч дарна уу

2. Dropdown гарна - **"Create new user"** сонгоно уу

3. Дараах form гарна, бөглөнө үү:

   **Email**: `99000000@logistics.mn`
   
   **Password**: `super123`
   
   ⚠️ **ЧУХАЛ**: 
   - **"Auto Confirm User"** checkbox-г **заавал идэвхжүүлнэ үү** ✅
   - Үгүй бол хэрэглэгч email confirm хийх шаардлагатай болно!

4. **"Create user"** товч дарна уу

✅ Шинэ хэрэглэгч users list дээр гарч ирнэ!

---

### Алхам 3.3: User ID хуулах

1. Шинэ үүссэн хэрэглэгч дээр **дарна уу**

2. Цонх гарна - **"User ID"** хэсэг олно уу
   - Жишээ: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

3. User ID-г **хуулна уу** (icon дээр дарахад автоматаар хуулагдана)

4. Notepad эсвэл аливаа text editor дээр **Paste** хийж хадгална уу

   Ингэж бичиж болно:
   ```
   Super Admin: a1b2c3d4-e5f6-7890-abcd-ef1234567890
   ```

---

### Алхам 3.4: Бусад 6 хэрэглэгчдийг үүсгэх

**Дээрх Алхам 3.2 ба 3.3-г 6 удаа давтана уу:**

| # | Email | Password | Role | Тэмдэглэл |
|---|-------|----------|------|-----------|
| 2️⃣ | 99000001@logistics.mn | admin123 | Admin | User ID хадгална |
| 3️⃣ | 99000002@logistics.mn | operator123 | Operator | User ID хадгална |
| 4️⃣ | 99112233@logistics.mn | driver123 | Driver | User ID хадгална |
| 5️⃣ | 99112234@logistics.mn | lead123 | Driver Lead | User ID хадгална |
| 6️⃣ | 99112235@logistics.mn | account123 | Accounting | User ID хадгална |
| 7️⃣ | 99112236@logistics.mn | warehouse123 | Warehouse | User ID хадгална |

**Бүгдийг үүсгэсний дараа** - 7 хэрэглэгч харагдах ёстой ✅

⚠️ **Санамж**: Хэрэглэгч бүрийн User ID-г ХАДГАЛААРАЙ!

---

## 🔗 PART 4: User Profiles холбох (3 минут)

Одоо бид auth users-г таны database-тэй холбох болно.

### Алхам 4.1: SQL Query template нээх

1. **Энэ project дотроо** `/scripts/create-demo-users.sql` файлыг нээнэ үү

2. Бүх агуулгыг **хуулна уу**

---

### Алхам 4.2: User IDs солих

1. Хуулсан SQL-д **7 удаа** `PASTE_USER_ID_HERE` гэсэн текст байна

2. **Тус бүрийг** Алхам 3.4-т хадгалсан User ID-аар **солино уу**

   **Өмнө**:
   ```sql
   INSERT INTO user_profiles (id, phone, name, role)
   VALUES ('PASTE_USER_ID_HERE', '99000000', 'Супер Админ', 'super_admin');
   ```

   **Дараа** (жишээ):
   ```sql
   INSERT INTO user_profiles (id, phone, name, role)
   VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '99000000', 'Супер Админ', 'super_admin');
   ```

3. 7 хэрэглэгч бүрийн талд зөв User ID бичигдсэн эсэхийг шалгаарай!

---

### Алхам 4.3: SQL ажиллуулах

1. Supabase dashboard дээр **SQL Editor** руу буцаж очно уу

2. **"New query"** дарна уу

3. Засварласан SQL кодоо **Paste** хийнэ үү

4. **"RUN"** дарна уу ▶️

5. **"Success"** гэсэн мессеж харагдах ёстой ✅

---

### Алхам 4.4: Шалгах

SQL Editor дээр дараах query ажиллуулна уу:

```sql
SELECT phone, name, role FROM user_profiles ORDER BY phone;
```

**Харах ёстой үр дүн**:
```
99000000 | Супер Админ    | super_admin
99000001 | Админ Дорж     | admin
99000002 | Оператор Болд  | operator
99112233 | Жолооч Бат     | driver
99112234 | Ахлагч Цэрэн   | driver_lead
99112235 | Нягтлан Сара   | accounting
99112236 | Агуулах Ганбат | warehouse
```

✅ **Амжилттай**: Бүх хэрэглэгчид холбогдлоо! 🎉

---

## 🔑 PART 5: Environment Variables тохируулах (2 минут)

### Алхам 5.1: API Keys авах

1. Supabase dashboard дээр зүүн доод буланд **"Project Settings"** (⚙️) дарна уу

2. Зүүн цэсээс **"API"** сонгоно уу

3. Дараах 2 утгыг хуулна уу:

   **Project URL**:
   - "Project URL" хэсгээс хуулна
   - Жишээ: `https://abcdefghijklmnop.supabase.co`

   **anon public key**:
   - "Project API keys" хэсгээс `anon` `public` key-г хуулна
   - Жишээ: `eyJhbGc...` (маш урт текст)

---

### Алхам 5.2: .env файл үүсгэх

1. **Энэ project-ийн root folder** дээр `.env` файл үүсгэнэ үү

2. Дараах агуулгыг бичнэ үү:

```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Өөрийн утгуудаар солино уу**:
   - `https://abcdefghijklmnop.supabase.co` → Таны Project URL
   - `eyJhbGc...` → Таны anon key

4. **Хадгална уу** (Ctrl+S / Cmd+S)

✅ **Амжилттай**: Environment variables бэлэн болсон!

---

## 🚀 PART 6: Системийг ажиллуулах! (1 минут)

### Алхам 6.1: Server эхлүүлэх

Terminal/Command Prompt дээр:

```bash
npm run dev
```

⏳ 5-10 секунд хүлээнэ үү...

**Харах ёстой**:
```
  VITE v4.x.x  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### Алхам 6.2: Браузер нээх

1. Браузер дээр `http://localhost:5173` руу очно уу

2. **Login хуудас** харагдах ёстой! ✅

---

### Алхам 6.3: Нэвтрэх тест хийх

1. Дараах credentials-р нэвтэрч үзнэ үү:

   ```
   Нэвтрэх нэр: 99000000
   Нууц үг: super123
   ```

2. **"Нэвтрэх"** товч дарна уу

3. 2-3 секундын дараа **Dashboard** харагдах ёстой! 🎉

---

## ✅ Амжилттай!

Та одоо Logistics системийг бүрэн ажиллахад бэлэн болгосон байна! 🚀

### Дараа юу хийх вэ?

- 📖 [CREDENTIALS.md](./CREDENTIALS.md) - Бүх demo хэрэглэгчдийн мэдээлэл
- 📚 [FEATURES.md](./FEATURES.md) - Системийн бүх функцууд
- 🚀 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Production дээр deploy хийх

---

## ❓ Асуудал гарвал?

### "Could not find table" алдаа
➡️ PART 2-г дахин хийнэ үү - Schema үүсгэх

### "Invalid credentials" алдаа  
➡️ PART 3, 4-г дахин хийнэ үү - Users үүсгэх

### "Failed to fetch" алдаа
➡️ `.env` файл зөв байгаа эсэхийг шалгаарай (PART 5)

### Бусад асуудал
➡️ Browser Console дээр алдааг шалгаарай (F12 дарна)

---

**Амжилт хүсье! Асуулт байвал GitHub Issues дээр асууна уу.** 💪
