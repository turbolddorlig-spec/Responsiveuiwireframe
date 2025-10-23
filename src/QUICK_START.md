# ⚡ Quick Start Guide

> **Энэ заавар нь 3 төрлийн Setup-ийг тайлбарлана**

---

## 1️⃣ Demo Mode (Хурдан туршиж үзэх - 30 секунд)

Supabase setup хэрэггүй шууд туршиж үзэх:

```bash
# Clone repository
git clone <repo-url>
cd zoodshopy-logistics

# Install dependencies
npm install

# Start dev server
npm run dev
```

**Нэвтрэх хуудас дээр:**
1. Аливаа нэвтрэх нэр оруулна (жишээ: `test`)
2. Аливаа нууц үг оруулна (жишээ: `test`)
3. Алдаа гарна
4. Систем автоматаар Demo Mode руу шилжинэ ✅

**Demo Credentials:**
```
Нэвтрэх нэр: 99000000
Нууц үг: super123
```

---

## 2️⃣ Local Development (Бүрэн setup - 5 минут)

### A. Supabase Setup

```bash
# 1. Supabase Project үүсгэх
https://supabase.com → "New Project"

# 2. SQL Editor дээр database үүсгэх
→ DEPLOY.md дотор бүрэн SQL код байна (хуулж paste)

# 3. Demo users үүсгэх
Authentication → Users → "Add user"
Email: 99000000@logistics.mn
Password: super123
✅ Auto Confirm User
```

### B. Local Environment

```bash
# .env.local файл үүсгэх
cp .env.example .env.local

# Supabase credentials оруулах
nano .env.local
```

**.env.local:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

```bash
# Run development server
npm run dev
```

🎉 **Бэлэн!** http://localhost:5173

---

## 3️⃣ Vercel Production Deploy (5 минут)

### Prerequisites
- ✅ GitHub account
- ✅ Vercel account
- ✅ Supabase project (2-р алхам дахь setup)

### Steps

```bash
# 1. GitHub руу push
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/zoodshopy.git
git push -u origin main
```

```bash
# 2. Vercel дээр import
https://vercel.com/new

→ GitHub repo сонгох
→ Import дарна
```

**3. Environment Variables:**

Vercel Dashboard дээр:
```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOi...
```

**4. Deploy:**
```
"Deploy" товч дарна
→ 2-3 минут хүлээнэ
→ Бэлэн! ✅
```

---

## 📖 Дэлгэрэнгүй Заавар

| Заавар | Тайлбар |
|--------|---------|
| **DEPLOY.md** | Хурдан deployment (5 минут) |
| **VERCEL_SUPABASE_SETUP.md** | Бүрэн дэлгэрэнгүй setup |
| **DEMO_MODE_README.md** | Demo Mode тайлбар |
| **CREDENTIALS.md** | Бүх demo credentials |

---

## 🔧 Troubleshooting

### Алдаа: "Failed to fetch"

**Шалтгаан:** Supabase холбогдохгүй байна

**Шийдэл:**
1. Browser console (F12) нээнэ
2. Network tab шалгана
3. Supabase URL зөв эсэхийг шалгана

Эсвэл Demo Mode ашиглана:
```
→ Систем автоматаар Demo Mode руу шилжинэ
→ LocalStorage ашиглана
```

### Алдаа: "Invalid login credentials"

**Шалтгаан:** Demo users үүсгээгүй

**Шийдэл:**
```
Supabase Dashboard → Authentication → Users
→ 7 demo users үүсгэнэ (DEPLOY.md үзнэ үү)
```

### Алдаа: TypeScript errors

**Шийдэл:**
```bash
# Type check
npm run type-check

# Node modules дахин суулгах
rm -rf node_modules package-lock.json
npm install
```

---

## ✅ Next Steps

1. **Dashboard тест хийх**: Огноо сонгох, захиалга харах
2. **Захиалга үүсгэх**: Orders → "Шинэ захиалга" товч
3. **Бүтээгдэхүүн нэмэх**: Products → "Бүтээгдэхүүн нэмэх"
4. **Role тест хийх**: Өөр эрхээр нэвтрэх (Credentials.md үзнэ үү)

---

## 📞 Тусламж

- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)
- Documentation: README.md, FEATURES.md
- Credentials: CREDENTIALS.md

**Амжилт хүсье!** 🚀
