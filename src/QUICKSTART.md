# ⚡ Quick Start Guide

Logistics системийг 10 минутад ажиллахад бэлтгэх хурдан заавар.

## 💡 АНХААРУУЛГА: Edge Functions Deploy ХЭРЭГГҮЙ!

Энэ систем нь **шууд Supabase Client** ашигладаг - `supabase functions deploy` хийх шаардлагагүй.

---

## Шаардлагатай зүйлс

- Node.js 18+ суулгасан байх
- Supabase account (үнэгүй)
- Git

## 🚀 3 Алхам (ONE-CLICK Setup ашиглавал 5 минут)

### Сонголт A: 🎯 ONE-CLICK SETUP (ХАМГИЙН ХЯЛБАР)

1. **Апп ажиллуулах:**
   ```bash
   npm install
   npm run dev
   ```

2. **Setup Required дэлгэц харагдана** → Цэнхэр "**SQL ХУУЛЖ SETUP ЭХЛҮҮЛЭХ**" товч дарна

3. **SQL Editor автоматаар нээгдэнэ** → Ctrl+V paste хийж **RUN** дарна

4. **Demo хэрэглэгчид үүсгэх** (доорх 4️⃣ алхмыг үзнэ үү)

5. **Refresh** дарна → Амжилттай! 🎉

---

### Сонголт Б: Гараар Setup

### 1️⃣ Supabase Project үүсгэх (2 мин)

1. [supabase.com](https://supabase.com) дээр нэвтэрч шинэ project үүсгэнэ үү
2. Project нэр: `logistics-system`
3. Password үүсгэж, хадгална уу
4. Region: сонго (жишээ нь: Northeast Asia)
5. Project үүсгэгдэхийг хүлээнэ үү (~2 минут)

### 2️⃣ Database Schema үүсгэх (2 мин)

1. Supabase Dashboard дээр **SQL Editor** рүү орно уу
2. **New query** дарна уу
3. `/supabase/migrations/20241022000000_init_schema.sql` файлын **БҮГДИЙГ** хуулж байршуулна уу
4. **RUN** дарж схем үүсгэнэ үү ✅

### 3️⃣ Sample Data оруулах (1 мин)

1. SQL Editor дээр **New query** дахин дарна уу
2. `/supabase/seed.sql` файлын агуулгыг хуулна уу
3. **RUN** дарж бүтээгдэхүүн болон агуулахын өгөгдөл оруулна уу ✅

### 4️⃣ Demo Users үүсгэх (3 мин)

**Арга A: Гараар (илүү найдвартай)**

Хэрэглэгч бүрийн хувьд:

1. Supabase Dashboard > **Authentication** > **Users** рүү орно уу
2. **Add user** > **Create new user** дарна уу
3. Дараах мэдээллийг оруулна уу:

| Email | Password | Auto Confirm? |
|-------|----------|---------------|
| 99000000@logistics.mn | super123 | ✅ YES |
| 99000001@logistics.mn | admin123 | ✅ YES |
| 99000002@logistics.mn | operator123 | ✅ YES |
| 99112233@logistics.mn | driver123 | ✅ YES |
| 99112234@logistics.mn | lead123 | ✅ YES |
| 99112235@logistics.mn | account123 | ✅ YES |
| 99112236@logistics.mn | warehouse123 | ✅ YES |

4. Хэрэглэгч бүрийг үүсгэсний дараа **User ID (UUID)** хуулж авна уу
5. SQL Editor рүү буцаж очоод `/scripts/create-demo-users.sql` файлыг нээнэ үү
6. `PASTE_USER_ID_HERE` бүрийг зөв User ID-аар солино уу
7. **RUN** дарж user profiles үүсгэнэ үү ✅

### 5️⃣ Frontend ажиллуулах (2 мин)

1. **Environment variables** үүсгэх:

```bash
# Project root folder-т .env файл үүсгэх
touch .env
```

`.env` дотор:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

💡 **Project credentials-г хаанаас авах?**
- Supabase Dashboard > **Settings** > **API**
- `Project URL` болон `anon public` key-г хуулна уу

2. **Dependencies суулгах:**

```bash
npm install
```

3. **Dev server ажиллуулах:**

```bash
npm run dev
```

4. Браузер дээр нээх: **http://localhost:5173** 🎉

## ✅ Нэвтрэх

Дараах credentials-р нэвтэрч үзнэ үү:

| Утас | Нууц үг | Эрх |
|------|---------|-----|
| 99000000 | super123 | Super Admin |
| 99000002 | operator123 | Operator |
| 99112233 | driver123 | Driver |

## 🐛 Алдаа гарвал?

### "Failed to fetch"
- `.env` файл үүсгэсэн эсэхийг шалгана уу
- `VITE_SUPABASE_URL` болон `VITE_SUPABASE_ANON_KEY` зөв эсэхийг шалгана уу
- Dev server restart хийнэ үү: `Ctrl+C` дараад `npm run dev`

### "Invalid credentials"  
- Demo users үүсгэсэн эсэхийг Supabase Dashboard > Authentication > Users дээр шалгана уу
- `user_profiles` table дээр өгөгдөл байгаа эсэхийг SQL Editor-ээр шалгана уу:
```sql
SELECT * FROM user_profiles;
```

### RLS error
- Бүх schema файлыг зөв ажиллуулсан эсэхийг шалгана уу
- Supabase Dashboard > Database > Tables дээр бүх table-д RLS enabled байгаа эсэхийг шалгана уу

## 📚 Дараах алхмууд

- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Дэлгэрэнгүй setup заавар
- [README.md](./README.md) - Системийн бүрэн танилцуулга
- Supabase Dashboard дээр өгөгдөл харах, засах
- Deploy хийх (Vercel, Netlify)

## 🎉 Амжилттай!

Одоо та logistics систем ашиглаж эхлэх бэлэн боллоо! 🚚📦