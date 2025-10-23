# 🚀 START HERE - Logistics System

**Сайн байна уу!** Энэ нь Монгол хэл дээрх захиалгын удирдлагын систем юм.

---

## 💡 АНХААРУУЛГА: Edge Functions Deploy ХЭРЭГГҮЙ!

Энэ систем нь **шууд Supabase Client** ашигладаг - backend server эсвэл edge functions deploy хийх шаардлагагүй.

```
React Frontend → Supabase Database (Direct)
```

---

## ⚡ Хурдан эхлэх (5 минут)

### Юу хэрэгтэй вэ?

1. ✅ Node.js 18+ суулгасан
2. ✅ Supabase account (үнэгүй) - [supabase.com](https://supabase.com)
3. ✅ Code editor (VS Code recommended)

---

## 📚 Documentation Guide

Та анх удаа эхэлж байна уу? Дараах дарааллаар уншина уу:

### 1️⃣ Эхний алхам
👉 **[SETUP_WALKTHROUGH.md](./SETUP_WALKTHROUGH.md)** ← Энд эхэл!
- Алхам алхмаар дэлгэрэнгүй заавар
- Суурь мэдлэггүй хүнд зориулсан
- Зургууд, жишээ кодтой
- 10-15 минут

### 2️⃣ Хурдан заавар
👉 **[QUICKSTART.md](./QUICKSTART.md)**
- Туршлагатай хөгжүүлэгчдэд
- 5 минутанд бэлэн болгох
- Товч, цэгцтэй

### 3️⃣ Бүрэн танилцуулга
👉 **[README.md](./README.md)**
- Системийн тойм
- Технологи stack
- Deploy заавар

### 4️⃣ Нэмэлт мэдээлэл
- **[DEPLOYMENT_SIMPLE.md](./DEPLOYMENT_SIMPLE.md)** - Deployment тайлбар (Edge Functions ХЭРЭГГҮЙ!)
- **[CREDENTIALS.md](./CREDENTIALS.md)** - Бүх demo хэрэглэгчид
- **[FEATURES.md](./FEATURES.md)** - Бүх функцууд
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Production deploy
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Алдаа засах заавар

---

## 🎯 Хэрхэн эхлэх вэ?

### Алхам 1: Code татах

```bash
git clone <your-repo-url>
cd logistics-system
npm install
```

### Алхам 2: Supabase Setup

**ЧУХАЛ**: Та заавал Supabase setup хийх ёстой!

Сонголт хийнэ үү:

**A) Анхны удаа** → [SETUP_WALKTHROUGH.md](./SETUP_WALKTHROUGH.md) үзнэ үү (recommended)

**B) Туршлагатай** → [QUICKSTART.md](./QUICKSTART.md) үзнэ үү

### Алхам 3: Environment Variables

`.env` файл үүсгэж:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Алхам 4: Ажиллуулах

```bash
npm run dev
```

Браузер: `http://localhost:5173`

Н��втрэх: `99000000` / `super123`

---

## ❓ Түгээмэл асуултууд

### "Failed to fetch" алдаа гарч байна
➡️ `.env` файл байгаа эсэхийг шалгаарай  
➡️ Supabase project асаалттай эсэхийг шалгаарай

### "Invalid credentials" гэж гарч байна
➡️ Demo users үүсгэсэн эсэхийг шалгаарай  
➡️ [SETUP_WALKTHROUGH.md](./SETUP_WALKTHROUGH.md) PART 3, 4-г үзнэ үү

### "Could not find table" алдаа
➡️ Database schema үүсгээгүй байна  
➡️ [SETUP_WALKTHROUGH.md](./SETUP_WALKTHROUGH.md) PART 2-г үзнэ үү

### Суудлаас эхлэх хэрэгтэй
➡️ [SETUP_WALKTHROUGH.md](./SETUP_WALKTHROUGH.md) - Бүх зүйл дэлгэрэнгүй

---

## 🎓 Систем судлах

### Demo хэрэглэгчид

| Нэвтрэх | Нууц үг | Эрх | Юу хийж болох? |
|---------|---------|-----|----------------|
| 99000000 | super123 | Super Admin | Бүх эрх |
| 99000002 | operator123 | Operator | Захиалга удирдах |
| 99112233 | driver123 | Driver | Хүргэлт хийх |
| 99112235 | account123 | Accounting | Төлбөр хянах |
| 99112236 | warehouse123 | Warehouse | Агуулах удирдах |

Бүрэн жагсаалт: [CREDENTIALS.md](./CREDENTIALS.md)

### Үндсэн функцууд

- ✅ Захиалга үүсгэх, засах, устгах
- ✅ Бүтээгдэхүүн удирдах
- ✅ Агуулахын нөөц хяналт
- ✅ Жолооч хуваарилах
- ✅ Төлбөрийн мэдээлэл
- ✅ 7 төрлийн эрх мэдэл
- ✅ Mobile responsive

Дэлгэрэнгүй: [FEATURES.md](./FEATURES.md)

---

## 🚀 Production-д deploy хийх

Бэлэн болсон уу? Deploy заавар:

👉 **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**

Platforms:
- Vercel (recommended)
- Netlify
- GitHub Pages

---

## 🛠️ Технологи

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 4.0 + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Toasts**: Sonner

---

## 📞 Тусламж хэрэгтэй юу?

1. **Setup асуудал** → [SETUP_WALKTHROUGH.md](./SETUP_WALKTHROUGH.md) дахин уншина уу
2. **Алдаа** → Browser Console (F12) шалгаарай
3. **Features** → [FEATURES.md](./FEATURES.md) үзнэ үү
4. **GitHub Issues** → Асуулт асуугаарай

---

## ✅ Checklist

Setup бэлэн эсэхийг шалгах:

- [ ] Node.js суусан
- [ ] `npm install` хийсэн
- [ ] Supabase project үүсгэсэн
- [ ] Database schema үүсгэсэн (`complete_setup.sql`)
- [ ] 7 demo хэрэглэгч үүсгэсэн
- [ ] User profiles холбосон
- [ ] `.env` файл үүсгэсэн
- [ ] `npm run dev` ажиллаж байна
- [ ] Нэвтрэх ажиллаж байна
- [ ] Dashboard харагдаж байна

Бүгд ✅ бол - **Амжилттай!** 🎉

---

**Амжилт хүсье! Систем ашиглах танд таатай байх болно.** 💪

**Асуулт байвал GitHub Issues дээр асууна уу.**

---

Made with ❤️ for Mongolian logistics companies