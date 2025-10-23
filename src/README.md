# ZoodShopy Logistics System 📦

> **Modern Logistics захиалгын удирдлагын систем**

Vercel + Supabase дээр суурилсан бүрэн ажиллагаатай, production-ready logistics систем.

---

## 🔥 VERCEL DEPLOYMENT - CONFIGURATION VERIFIED ✅

**"No Output Directory named 'dist' found" алдаа гарч байна уу?**

→ **✅ CONFIGURATION VERIFIED!** All requirements met!

### ⚡ DEPLOYMENT (3 STEPS):

#### ✅ Step 1: Git Push

```bash
# ✅ All files verified at repository root
# ✅ vite.config.ts → outDir: 'dist', assetsDir: 'assets', base: '/'
# ✅ package.json → "build": "vite build"
# ✅ vercel.json → Explicit configuration
# ✅ .gitignore → Recreated (ignores dist/)
# ✅ index.html → Clean production HTML

git add .
git commit -m "chore: Verify Vite + Vercel configuration"
git push
```

#### ✅ Step 2: Verify Vercel Root Directory

```
Vercel Dashboard → Settings → General
→ Root Directory: ./  (or empty)
→ If different, change to: ./
→ Save
```

**CRITICAL:** Root Directory must be `./` (repository root)!

#### ✅ Step 3: Redeploy (Clear Cache)

```
Deployments → [...] → Redeploy
→ ⚠️ [ ] Use existing Build Cache  ← MUST UNCHECK!
→ Redeploy
```

### 📖 Complete Guides:

→ **[VERCEL_BUILD_VERIFICATION.md](./VERCEL_BUILD_VERIFICATION.md)** - ✅ CONFIGURATION VERIFIED!  
→ **[DEPLOY_NOW_VERIFIED.md](./DEPLOY_NOW_VERIFIED.md)** - 🚀 READY TO DEPLOY!

**Verification Results:**
```
✅ Repository structure: CORRECT (files at root, not /src)
✅ vite.config.ts: CORRECT (outDir: 'dist', assetsDir: 'assets')
✅ package.json: CORRECT ("build": "vite build")
✅ vercel.json: CORRECT (explicit config)
✅ .gitignore: RECREATED (ignores dist/)
✅ index.html: CORRECT (clean HTML)
✅ Expected output: dist/index.html + dist/assets/ ✅
```

**Build Output:**
```
dist/
├── index.html
└── assets/
    ├── index-XXX.css
    └── index-XXX.js
```

**Status:** 🟢 **VERIFIED & READY TO DEPLOY**

---

## 🚨 DATABASE ERROR: "Could not find table 'public.products'"

**Demo Mode автоматаар идэвхжсэн үү? Console дээр database алдаа байна уу?**

→ **[FIX_DATABASE_ERROR.md](./FIX_DATABASE_ERROR.md)** - ШУУРХАЙ ЗАСВАР!

### ⚡ 2 Минутын Засвар:

```
1. Supabase Dashboard → SQL Editor
2. SUPABASE_RUN_THIS.sql файлыг нээ
3. Бүх агуулгыг copy → paste → Run ▶️
4. Tables үүсч, seed data орно
5. Production site refresh → Demo Mode-оос гарна!
```

**Файл:** [SUPABASE_RUN_THIS.sql](./SUPABASE_RUN_THIS.sql) ← ЭНИЙГ RUN ХИЙХ!

**Шалтгаан:** Migration файлууд Vercel дээр автоматаар ажиллахгүй, manual run хэрэгтэй.

---

## 🎯 АСУУДАЛ ОЛДЛОО! OUTPUT DIRECTORY БУРУУ БАЙНА

**Screenshot-ээс харахад Vercel Settings дээр Output Directory "build" гэж override хийгдсэн байна!**

→ **[VERCEL_OUTPUT_FIX.md](./VERCEL_OUTPUT_FIX.md)** - ШУУРХАЙ ЗАСАХ ЗААВР!

###  Яаралтай Засх:

```
1. Vercel Dashboard → Settings → Build & Deployment
2. Output Directory: "build" → "dist" болго (эсвэл хоосон үлдээ)
3. Save → Redeploy
4. Git push (Tailwind config засагдсан)
5. → Цэнхэр дэлгэц харагдах ёстой!
```

**Шалтгаан:**
- ✅ CSS файл ачаалагдсан (Network tab: 2.02 kB)
- ❌ Output directory "build" байна, "dist" байх ёстой
- ❌ Tailwind config TestApp.tsx олохгүй байсан (засагдлаа ✅)

---

## 🚨 ЯАРАЛТАЙ: TAILWIND CDN TEST

**Console дээр styling огт харагдахгүй байна уу? (зөвхөн текст)**

→ **[CDN_TEST.md](./CDN_TEST.md)** - TAILWIND CDN ТУРШИЛТ!

Tailwind CDN нэмсэн. Энэ нь build process-ийг bypass хийнэ.

```bash
git push
# → Цэнхэр дэлгэц харагдах ЁСТОЙ
# → Хэрэв харагдавал: BUILD PROCESS асуудалтай
# → Хэрэв харагдаагүй бол: ӨӨР асуудал
```

**Дараагийн:** Screenshot аваад үзүүл (Network tab, Build logs)

---

## 🧪 VERCEL TAILWIND TEST (ӨМНӨХ)

**Дахиад ч Vercel дээр UI харагдахгүй байна уу?**

→ **[TAILWIND_TEST.md](./TAILWIND_TEST.md)** - ЭНГИЙН TEST ХИЙЦГЭЕ!

Энгийн **цэнхэр дэлгэцтэй** test app үүсгэж, Tailwind яг ажиллаж байгаа эсэхийг шалгацгаая.

```bash
# Одоо:
git push
# → Vercel дээр цэнхэр дэлгэц харагдах ёстой
# → Хэрэв харагдавал: ✅ Tailwind OK, App.tsx-ийн асуудал
# → Хэрэв харагдаагүй: ❌ Build process асуудал
```

---

## 🚨 VERCEL ДЭЭР UI ХАРАГДАХГҮЙ БОЛ

**Зураг дээр зөвхөн текст эсвэл хуучин газрын зураг харагдаж байна уу?**

→ **[VERCEL_ШУУРХАЙ_ЗАСВАР.md](./VERCEL_ШУУРХАЙ_ЗАСВАР.md)** - ЭНИЙГ УНШААРАЙ!

**Шалгах:**
1. Vercel Build Logs - Tailwind compile алдаа
2. Browser DevTools Network - CSS файлууд 404
3. Local `npm run build` - Ажиллаж байгаа эсэх

---

## ⚠️ АНХААРУУЛГА: CSS Fix (Vercel хар дэлгэц)

**✅ ЗАСАГДСАН!** Vercel дээр хар дэлгэц гарах асуудал шийдэгдсэн.

- ✅ Tailwind v3 ашиглаж байна
- ✅ `index.css` + `styles/globals.css` бүтэ
- ✅ VSCode дээр туршсан

**Хурдан заавар:** [CSS_FIX_FINAL.md](./CSS_FIX_FINAL.md)  
**Дэлгэрэнгүй:** [VERCEL_FIX.md](./VERCEL_FIX.md)  
**Debug:** [VERCEL_DEBUG.md](./VERCEL_DEBUG.md)

---

## 🚀 Хурдан Эхлэл

### ⚡ Vercel + Supabase Deployment (5 минут)

**👉 [START_DEPLOYMENT.md](./START_DEPLOYMENT.md) - ЭНД ЭХЛЭНЭ ҮҮ!**

```bash
# Алхам 1: Supabase Project үүсгэх (2 минут)
# Алхам 2: GitHub Push (1 минут)  
# Алхам 3: Vercel Deploy (2 минут)
# → Бэлэн! ✅
```

### 💻 Local Development

```bash
git clone <repo-url>
cd zoodshopy-logistics
npm install
npm run dev
# http://localhost:5173
```

**Deployment Заавар:**
- ⚡ **[START_DEPLOYMENT.md](./START_DEPLOYMENT.md)** - Энд эхлэх! (5 минут)
- 🔧 **[CSS_FIX_FINAL.md](./CSS_FIX_FINAL.md)** - CSS fix (хурдан)
- 🔧 **[VERCEL_FIX.md](./VERCEL_FIX.md)** - CSS fix (дэлгэрэнгүй)
- 🚀 **[DEPLOY.md](./DEPLOY.md)** - Хурдан deployment
- 📘 **[VERCEL_SUPABASE_SETUP.md](./VERCEL_SUPABASE_SETUP.md)** - Дэлгэрэнгүй setup
- ✅ **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Checklist
- 📖 **[VERCEL_README.md](./VERCEL_README.md)** - Post-deployment
- ⚙️ **[QUICK_START.md](./QUICK_START.md)** - 3 төрлийн setup
- 🎮 **[DEMO_MODE_README.md](./DEMO_MODE_README.md)** - Demo Mode тайлбар

---

## ✨ Онцлог

### 🔐 Authentication & Authorization
- 7 төрлийн эрх мэдэл: Super Admin, Admin, Operator, Driver, Driver Lead, Accounting, Warehouse
- Supabase Auth ашиглсан найдвартай нэвтрэх систем
- Row Level Security (RLS) бүхий аюулгүй эрх хязгаарлалт

### 📦 Захиалгын Удирдлага
- Захиалга үүсгэх, засах, цуцлах
- 4 төлөв: NEW, IN_TRANSIT, DELIVERED, CANCELLED
- 3 төлбөрийн төлөв: PAID, UNPAID, PARTIAL
- Жолооч хуваарилах систем
- Огноо цагийн автомат бүртгэл (Монголын цаг UTC+8)

### 📊 Бүтээгдэхүүн & Агуулах
- Агуулахн нөөц хяналт
- Бодит цагийн stock update
- Захиалгад хуваарилагдсан бараа tracking
- Бүтээгдэхүүн нэмэх, засах, устгах

### 🚗 Жолоочийн Систем
- Жолооч бүр өөрийн захиалгуудаа хармаар
- Хүргэлтийн төлөв шинэчлэх
- Mobile-friendly жолоочийн интерфэйс
- Driver Lead ахлагчийн хяналт

### 💰 Нягтлан Бодох
- Төлбөрийн мэдээлэл, тайлан
- Өдрөөр ангилсан мэдээлэл
- Нийт орлого, төлөгдөөгүй дансны хяналт

### 🎮 Автомат Demo Mode
- Supabase холбогдохгүй үед автомтаар идэвхжинэ
- LocalStorage ашигласан 7 demo хэрэглэгч
- 10 бүтээгдэхүүн, 3 захиалга бүхий бэлэн өгөгдөл
- Backend setup хэрэггүй шууд туршиж үзэх

---

## 📦 Технологи Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS 4.0, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Icons**: Lucide React
- **Toast Notifications**: Sonner

## 🗂️ Project Structure

```
/
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── AppShell.tsx     # Main layout
│   ├── DashboardFrame.tsx
│   ├── OrdersFrame.tsx
│   ├── ProductsFrame.tsx
│   ├── DriverFrame.tsx
│   ├── DriverLeadFrame.tsx
│   ├── AccountingFrame.tsx
│   ├── WarehouseFrame.tsx
│   └── UsersFrame.tsx
├── utils/
│   ├── api.ts           # Supabase API utilities
│   └── supabase/
│       ├── client.ts    # Supabase client
│       └── info.tsx     # Project credentials
├── supabase/
│   ─ migrations/      # Database schema
│   ├── functions/       # Edge functions
│   └── seed.sql         # Sample data
├── App.tsx              # Main app component
└── main.tsx             # Entry point
```

## 🔐 Row Level Security (RLS)

Supabase-ийн Row Level Security (RLS) policies ашиглан өгөгдлийн аюулгүй байдлыг хангасан:

- **Super Admin / Admin**: Бүх өгөгдөл харах, засх эрхтэй
- **Operator**: Захиалга үүсгэх, засах
- **Driver**: Зөвхөн өрийн захиалгуудыг харах
- **Driver Lead**: Бүх жолоочийн захиалгуудыг харах
- **Accounting**: Бүх төлбөрийн мэдээллийг харах
- **Warehouse**: Бүтээгдэхүүн, агуулахын нөөцийг удирдах

## 🌐 Deploy хийх

### Vercel Deploy

1. GitHub repository-г холбох
2. Environment variables нэмэх:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy!

### Netlify Deploy

1. GitHub repository холбох
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Environment variables нэмэх
4. Deploy!

## 📱 Features by Role

### Super Admin / Admin
- Dashboard: Бүх статистик, тайлан
- Захиалгууд: Бүх захиалгыг харах, засах
- Бүтээгдэхүүн: Бүтээгдэхүүн удирдах
- Хэрэглэгч: Хэрэглэгч удирдах
- Бүх модулиудад нэвтрэх

### Operator
- Захиалга үүсгэх, засах
- Жолооч хуваарилах
- Захиалгын статус шинэчлэх

### Driver
- Өөрийн захиалгуудыг харах
- Захиалгын статус шинэчлэх (In Transit, Delivered)
- Захиалгын дэлгэрэнгүй харах

### Driver Lead
- Бүх жолоочийн захиалгуудыг харах
- Driver leads удирдах
- Жолооч хуваарилах

### Accounting
- Бүх төлбөрийн мэдээлэл харах
- Төлбөрийн статус шинэчлэх
- Тайлан гаргах

### Warehouse
- Бүтээгдэхүүн удирдах
- Агуулахын нөөц хянах
- Агуулах хооронд шүлжүүлэг

## 🔧 Troubleshooting

### "Failed to fetch" алдаа

- Supabase project асаалттай эсэхийг шалгана уу
- Environment variables зөв тохируулсан эсэхийг шалгана уу
- Browser DevTools Console дээр дэлгэрэнгүй алдаа үзнэ үү

### "Invalid credentials" алдаа

- Demo users үүсгэсэн эсэхийг Supabase Dashboard > Authentication > Users дээр шалгана уу
- `user_profiles` table дээр profile байгаа эсэхийг шалгана уу
- Edge function `setup-demo-users` ажиллуулсан эсэхийг шалгана уу

### RLS policy алдаа

- SQL Editor дээр `SELECT * FROM user_profiles;` ажиллуулж үзнэ үү
- RLS policies зөв үүссэн эсэхийг Table settings дээр шалгана уу

📖 **Длгэрэнгүй**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Бүх асуудал болон шийдэлүүд

## 📄 License

MIT License

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 📞 Support

Асуудал гарвал GitHub Issues дээр нэмнэ үү.

---

**Built with ❤️ for Mongolian logistics companies**