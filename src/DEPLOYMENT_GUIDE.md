# 🚀 Deployment Guide

Logistics системийг үйлдвэрлэлийн орчинд deploy хийх бүрэн заавар.

## ⚡ АНХААРУУЛГА: Edge Functions Deploy ХЭРЭГГҮЙ!

**Энэ систем нь шууд Supabase Client ашигладаг** - Edge Functions deploy хийх шаардлагагүй.

```
┌─────────────┐         ┌──────────────┐
│   React     │────────▶│   Supabase   │
│  Frontend   │         │   Database   │
└─────────────┘         └──────────────┘
```

❌ **Та ХИЙХ ХЭРЭГГҮЙ:**
- `supabase functions deploy` команд ажиллуулах
- Edge Functions тохируулах
- Backend server эхлүүлэх

✅ **Та ЗӨВХӨН хийх хэрэгтэй:**
- Supabase database tables үүсгэх (ONE-CLICK setup)
- Frontend deploy хийх (Vercel/Netlify)

---

## 📋 Prerequisites

- ✅ Supabase project бүрэн setup хийсэн байх ([QUICKSTART.md](./QUICKSTART.md) эсвэл ONE-CLICK setup)
- ✅ Database tables үүсгэсэн байх (SetupRequiredScreen дээрх товч ашиглаж)
- ✅ GitHub repository үүсгэсэн байх
- ✅ Local дээр систем ажиллаж байгааг шалгасан байх

## 🌐 Deployment Options

### Option 1: Vercel (Recommended ⭐)

Vercel нь React apps-д хамгийн тохиромжтой, хурдан бөгөөд хялбар.

#### Step 1: GitHub Push

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### Step 2: Vercel Import

1. [vercel.com](https://vercel.com) дээр нэвтэрнэ үү
2. **"Add New"** > **"Project"** дарна уу
3. GitHub repository-г сонгоно уу
4. **"Import"** дарна уу

#### Step 3: Environment Variables

**Environment Variables** хэсэгт дараах 2 variable нэмнэ үү:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

💡 Эдгээр утгуудыг Supabase Dashboard > Settings > API-с авна уу.

#### Step 4: Deploy

1. **"Deploy"** дарна уу
2. 2-3 минут хүлээнэ үү
3. Deploy дууссаны дараа **"Visit"** дарж үзнэ үү
4. Нэвтрэх хуудас харагдах ёстой! 🎉

#### Auto Deployments

Vercel автоматаар GitHub commits бүрийг deploy хийнэ:
- `main` branch → Production
- Бусад branches → Preview deployments

---

### Option 2: Netlify

Netlify нь бас маш сайн сонголт, drag & drop deploy боломжтой.

#### Step 1: GitHub Push

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### Step 2: Netlify Import

1. [netlify.com](https://netlify.com) дээр нэвтэрнэ үү
2. **"Add new site"** > **"Import an existing project"** дарна уу
3. GitHub repository сонгоно уу

#### Step 3: Build Settings

```
Build command: npm run build
Publish directory: dist
```

#### Step 4: Environment Variables

**Site settings** > **Environment variables** дээр:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### Step 5: Deploy

1. **"Deploy site"** дарна уу
2. Deploy дууссаны дараа site URL дээр нэвтэрч үзнэ үү

---

### Option 3: GitHub Pages

GitHub Pages нь үнэгүй static site hosting.

#### Step 1: vite.config.ts засах

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/', // GitHub repo нэрээ бичнэ үү
});
```

#### Step 2: Deploy Script нэмэх

`package.json` дээр:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

#### Step 3: gh-pages суулгах

```bash
npm install --save-dev gh-pages
```

#### Step 4: Deploy

```bash
npm run deploy
```

#### Step 5: GitHub Settings

1. GitHub repository дээр **Settings** > **Pages** рүү орно уу
2. **Source**: `gh-pages` branch сонгоно уу
3. **Save** дарна уу
4. URL: `https://username.github.io/repo-name/`

⚠️ **Анхааруулга**: Environment variables-г GitHub Secrets ашиглаж тохируулах хэрэгтэй.

---

## 🔐 Security Checklist

### ✅ Production-д deploy хийхийн өмнө:

- [ ] `.env` файл `.gitignore` дотор байгаа эсэхийг шалгах
- [ ] Demo credentials хэрэглэхгүй байх (үйлдвэрлэлийн хэрэглэгчид үүсгэх)
- [ ] Supabase RLS policies зөв тохируулсан эсэхийг шалгах
- [ ] CORS settings зөв эсэхийг шалгах
- [ ] All API keys environment variables-д байгаа эсэхийг шалгах
- [ ] Sensitive data log-руу гарахгүй байгааг шалгах

### ✅ Supabase Production Settings:

1. **Authentication > Email Auth**
   - Production-д email server тохируулах (Resend, SendGrid гэх мэт)
   - Email confirmation идэвхжүүлэх
   
2. **Authentication > URL Configuration**
   - Site URL: Таны production domain оруулах
   - Redirect URLs: Production URL нэмэх

3. **Database > Backups**
   - Automatic backups идэвхжүүлэх (paid plan-д)
   
4. **API Settings**
   - Rate limiting шалгах
   - API keys rotation хийх (хэрэв шаардлагатай бол)

---

## 🔍 Post-Deployment Testing

Deploy хийсний дараа дараах зүйлсийг шалгана уу:

### 1. Login System
- [ ] Нэвтрэх ажиллаж байна уу?
- [ ] Буруу credentials-р алдаа харуулж байна уу?
- [ ] Logout ажиллаж байна уу?

### 2. Data Loading
- [ ] Dashboard өгөгдөл харуулж байна уу?
- [ ] Products list харагдаж байна уу?
- [ ] Orders load хийгдэж байна уу?

### 3. CRUD Operations
- [ ] Захиалга үүсгэж болох уу?
- [ ] Захиалга засаж болох уу?
- [ ] Бүтээгдэхүүн нэмэх, засах, устгах ажиллаж байна уу?

### 4. Role-Based Access
- [ ] Driver зөвхөн өөрийн захиалгуудыг харж байна уу?
- [ ] Admin бүх өгөгдөл харж байна уу?
- [ ] Operator захиалга үүсгэж чадаж байна уу?

### 5. Performance
- [ ] Хуудсууд хурдан ачаалагдаж байна уу?
- [ ] API requests timeout болохгүй байна уу?
- [ ] Mobile дээр зөв харагдаж байна уу?

---

## 🐛 Common Deployment Issues

### Issue: "Failed to fetch" error

**Шалтгаан**: Environment variables алга эсвэл буруу

**Шийдэл**:
1. Deployment platform дээр environment variables зөв тохируулсан эсэхийг шалгана уу
2. Rebuild хийж үзнэ үү
3. Browser cache цэвэрлэнэ үү

### Issue: White screen after deploy

**Шалтгаан**: Build алдаа эсвэл base path буруу

**Шийдэл**:
1. Build logs-г шалгана уу
2. `vite.config.ts` дээр `base` зөв тохируулсан эсэхийг шалгана уу
3. Browser console дээр алдаа шалгана уу

### Issue: RLS policy errors

**Шалтгаан**: Database policies зөв тохируулаагүй

**Шийдэл**:
1. Supabase SQL Editor дээр schema migration дахин ажиллуулна уу
2. RLS policies үүссэн эсэхийг шалгана уу
3. User roles зөв тохируулсан эсэхийг шалгана уу

---

## 📊 Monitoring & Analytics

### Supabase Dashboard

1. **Auth**: Нэвтэрсэн хэрэглэгчдийн тоо хянах
2. **Database**: API calls, query performance
3. **Logs**: Error tracking

### Vercel Analytics

Vercel Pro план дээр:
- Page views
- Performance metrics
- Error tracking

---

## 🔄 Continuous Deployment

### Auto-deploy on Git Push

Vercel болон Netlify автоматаар deploy хийдэг:

```bash
# Code засах
git add .
git commit -m "Update feature"
git push origin main

# Automatic deployment эхэлнэ! 🚀
```

### Preview Deployments

Feature branch үүсгэвэл preview URL үүснэ:

```bash
git checkout -b feature/new-feature
git push origin feature/new-feature

# Preview URL автоматаар үүснэ
```

---

## 🎯 Next Steps

- [ ] Custom domain холбох
- [ ] SSL certificate тохируулах (automatic on Vercel/Netlify)
- [ ] Monitoring tools нэмэх (Sentry, LogRocket гэх мэт)
- [ ] Email server тохируулах
- [ ] Production хэрэглэгчид үүсгэх
- [ ] User documentation бичих

---

## 📞 Support

Асуудал гарвал:
- GitHub Issues: Техникийн асуудал
- Supabase Discord: Database/Auth асуудал
- Vercel Support: Deployment асуудал

**Амжилт хүсье! 🚀**