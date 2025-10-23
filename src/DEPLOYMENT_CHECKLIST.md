# ✅ Vercel + Supabase Deployment Checklist

> **Deployment өмнө шалгах checklist**

---

## 📋 Pre-Deployment Checklist

### 1. Supabase Setup

- [ ] Supabase project үүсгэсэн
- [ ] Project нэр: `zoodshopy-logistics`
- [ ] Region сонгосон: Singapore (Asia ойрхон)
- [ ] Database password хадгалсан

### 2. Database Tables

- [ ] SQL Editor дээр бүх SQL script ажиллуулсан
- [ ] Tables үүссэн эсэхийг шалгасан:
  ```sql
  SELECT table_name 
  FROM information_schema.tables 
  WHERE table_schema = 'public';
  ```
  Хүлээгдэж буй: `user_profiles`, `products`, `orders`, `driver_leads`, `stocks`

- [ ] RLS идэвхжсэн эсэхийг шалгасан:
  ```sql
  SELECT tablename, rowsecurity 
  FROM pg_tables 
  WHERE schemaname = 'public';
  ```

- [ ] Demo products байгаа эсэхийг шалгасан:
  ```sql
  SELECT COUNT(*) FROM products;
  ```
  Хүлээгдэж буй: 10 бүтээгдэхүүн

### 3. Authentication Setup

- [ ] 7 demo хэрэглэгч үүсгэсэн:
  - `99000000@logistics.mn` (super_admin)
  - `99000001@logistics.mn` (admin)
  - `99000002@logistics.mn` (operator)
  - `99112233@logistics.mn` (driver)
  - `99112234@logistics.mn` (driver_lead)
  - `99112235@logistics.mn` (accounting)
  - `99112236@logistics.mn` (warehouse)

- [ ] Бүх хэрэглэгчид **Auto Confirm** хийгдсэн
- [ ] `user_profiles` table дээр profile үүссэн эсэхийг шалгасан:
  ```sql
  SELECT * FROM user_profiles;
  ```
  Хүлээгдэж буй: 7 мөр

### 4. API Keys

- [ ] Supabase Project URL хуулсан:
  ```
  Settings → API → Project URL
  https://xxxxxx.supabase.co
  ```

- [ ] Anon/Public Key хуулсан:
  ```
  Settings → API → Project API keys → anon public
  eyJhbGciOiJIUzI...
  ```

- [ ] Хоёр түлхүүрийг аюулгүй газар хадгалсан

---

## 🚀 Vercel Deployment Checklist

### 1. GitHub Repository

- [ ] GitHub repository үүсгэсэн
- [ ] Local code-ийг push хийсэн:
  ```bash
  git init
  git add .
  git commit -m "Initial deployment"
  git branch -M main
  git remote add origin https://github.com/USERNAME/zoodshopy.git
  git push -u origin main
  ```

### 2. Vercel Project

- [ ] Vercel.com руу нэвтэрсэн
- [ ] "Add New Project" дарсан
- [ ] GitHub repository холбосон
- [ ] Project import хийсэн

### 3. Build Settings

- [ ] Framework Preset: **Vite**
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`

### 4. Environment Variables

Vercel Dashboard → Settings → Environment Variables:

- [ ] `VITE_SUPABASE_URL` нэмсэн
  ```
  Value: https://your-project.supabase.co
  ```

- [ ] `VITE_SUPABASE_ANON_KEY` нэмсэн
  ```
  Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```

- [ ] Хоёр environment variable-д:
  - Environment: **Production**, **Preview**, **Development** (бүгдийг сонгосон)
  - Visible: All

### 5. Deploy

- [ ] "Deploy" товч дарсан
- [ ] Build амжилттай дууссан (2-3 минут)
- [ ] Deployment URL гарсан

---

## 🧪 Post-Deployment Testing

### 1. Access Check

- [ ] Vercel deployment URL нээгдэнэ
- [ ] Нэвтрэх хуудас харагдана
- [ ] Console дээр алдаагүй (F12 → Console)

### 2. Authentication Test

- [ ] Demo credentials-аар нэвтэрч чадсан:
  ```
  Нэвтрэх нэр: 99000000
  Нууц үг: super123
  ```

- [ ] Dashboard ачааллагдсан
- [ ] Хэрэглэгчийн нэр зөв харагдана: "Супер Админ"

### 3. Data Loading Test

- [ ] Products харагдана (Products цэс)
- [ ] 10 demo бүтээгдэхүүн байна
- [ ] Orders хуудас ачааллагдана
- [ ] Dashboard stats харагдана

### 4. Functionality Test

- [ ] Захиалга үүсгэж чадсан
- [ ] Захиалга засаж чадсан
- [ ] Бүтээгдэхүүн нэмж чадсан
- [ ] Stock update ажиллана

### 5. Performance Check

- [ ] Хуудас хурдан ачааллагдана (< 3 секунд)
- [ ] Network tab дээр бүх API calls амжилттай (200 status)
- [ ] Console дээр error байхгүй

---

## 🔥 Demo Mode Fallback Check

Хэрэв Supabase холбогдохгүй бол:

- [ ] Систем автоматаар Demo Mode руу шилжинэ
- [ ] Toast notification гарна: "🎮 Demo Mode идэвхжлээ!"
- [ ] LocalStorage ашиглан ажиллана
- [ ] 7 demo хэрэглэгч, 10 бүтээгдэхүүн, 3 захиалга байна

---

## 🐛 Common Issues Checklist

### Issue: "Failed to fetch"

- [ ] Environment variables зөв оруулсан эсэхийг шалгах
- [ ] Vercel logs шалгах (Dashboard → Deployments → [Latest] → Functions)
- [ ] Supabase project running эсэхийг шалгах
- [ ] Network tab дээр алдааны дэлгэрэнгүй үзэх

### Issue: "Invalid login credentials"

- [ ] Demo users үүсгэсэн эсэхийг шалгах
- [ ] Auto Confirm идэвхжүүлсэн эсэхийг шалгах
- [ ] `user_profiles` table дээр profile байгаа эсэхийг шалгах

### Issue: "Table does not exist"

- [ ] SQL script бүрэн ажиллуулсан эсэхийг шалгах
- [ ] Supabase Dashboard → Table Editor дээр tables харагдаж байгаа эсэхийг шалгах
- [ ] RLS policies үүссэн эсэхийг шалгах

---

## 📊 Deployment Success Metrics

Deployment амжилттай гэж үзэх:

- ✅ Build амжилттай (0 errors, 0 warnings)
- ✅ Deployment URL ажиллана
- ✅ Нэвтрэх систем ажиллана
- ✅ Database холболт ажиллана
- ✅ Demo data харагдана
- ✅ CRUD операцууд ажиллана
- ✅ Console дээр critical errors байхгүй

---

## 📞 Support Resources

Хэрэв асуудал гарвал:

1. **Browser Console** (F12) шалгах
2. **Vercel Logs** шалгах
3. **Supabase Logs** шалгах (Dashboard → Logs)
4. **TROUBLESHOOTING.md** үзэх
5. **VERCEL_SUPABASE_SETUP.md** дахин унших

---

## ✨ Final Checklist

Deployment бүрэн амжилттай гэж үзэхийн тулд:

- [ ] ✅ Vercel URL нээгдэнэ
- [ ] ✅ Нэвтрэх ажиллана
- [ ] ✅ Dashboard харагдана
- [ ] ✅ Data ачааллагдана
- [ ] ✅ CRUD ажиллана
- [ ] ✅ Алдаа байхгүй
- [ ] ✅ Performance сайн
- [ ] ✅ Mobile responsive ��жиллана

**🎉 Баяр хүргэе! Production-ready deployment амжилттай боллоо!**

---

**Next Steps:**
1. Custom domain нэмэх (Vercel Dashboard → Domains)
2. Analytics тохируулах (Vercel Analytics)
3. Monitoring setup хийх
4. Production data оруулах
5. Хэрэглэгчдэд хүргэх

**Амжилт хүсье!** 🚀
