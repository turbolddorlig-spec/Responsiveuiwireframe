# 🐛 Vercel Deployment Debug

## Асуудал

Vercel дээр:
- ❌ UI харагдахгүй (зөвхөн суурь HTML текст)
- ❌ CSS styling огт байхгүй
- ❌ Background дээр хуучин газрын зураг

## Шалгах Зүйлс

### 1. Vercel Build Logs Шалгах

```
Vercel Dashboard → Deployments → [Latest] → Build Logs
```

**Шалгах:**
- ✅ Tailwind CSS compile хийгдсэн эсэх
- ✅ CSS файлууд generate хийгдсэн эсэх
- ✅ Build амжилттай эсэх

### 2. Browser DevTools

**Network Tab:**
```
F12 → Network → Reload

Шалгах файлууд:
- index.css
- globals.css
- main.tsx.js
- App.tsx.js
```

**Console Tab:**
```
F12 → Console

Алдаа байгаа эсэхийг шалгах:
- CSS import error
- Module not found
- Failed to fetch
```

### 3. Production Build Тест

```bash
# Local дээр production build тест
npm run build
npm run preview

# http://localhost:4173 нээх
# Хэрэв local дээр ажиллавал Vercel тохиргооны асуудал
```

## Магадлалтай Шалтгаан

### 1. CSS файлууд build output-д байхгүй

```bash
# Build хийсний дараа dist folder шалгах
ls -la dist/
ls -la dist/assets/

# CSS файлууд байгаа эсэхийг шалгах
# Байх ёстой:
# - index-[hash].css
# - main-[hash].js
```

### 2. Tailwind PostCSS process хийгдээгүй

**postcss.config.js шалгах:**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 3. Background Image Issue

Хуучин газрын зураг background-д харагдаж байна.

**Магадгүй:**
- `index.html` дээр inline style байгаа
- `globals.css` эсвэл `index.css` дээр background-image
- Browser cache хуучин зургийг харуулж байна

## Шийдэл Оролдох

### Алхам 1: Hard Reload

```
Browser дээр:
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)

Cache цэвэрлэх:
DevTools → Application → Clear storage → Clear site data
```

### Алхам 2: Vercel Redeploy

```
Vercel Dashboard → Deployments → [Latest] → ⋯ → Redeploy
```

### Алхам 3: Environment Variables Шалгах

```
Vercel Dashboard → Settings → Environment Variables

Шалгах:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
```

### Алхам 4: Build Command Шалгах

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}

// package.json
{
  "scripts": {
    "build": "vite build"
  }
}
```

## Туршилт

### Энгийн HTML Test

Vercel дээр энгийн HTML/CSS ажиллаж байгаа эсэхийг шалгах:

```html
<!-- index.html-д style нэмэх -->
<style>
  body {
    background: red !important;
    color: white !important;
  }
</style>
```

Хэрэв улаан background харагдавал:
- ✅ Vercel static files serve хийж байна
- ❌ Асуудал нь Tailwind/CSS build process-д байна

Хэрэв харагдаагүй бол:
- ❌ Vercel build output буруу байна
- ❌ Routing асуудал байна

## Дараагийн Алхам

1. **Vercel Build Logs харах** - Tailwind compile алдаа байгаа эсэх
2. **Browser Network tab шалгах** - CSS файлууд load хийгдэж байгаа эсэх
3. **Local production build** - `npm run build && npm run preview`
4. **Vercel Dashboard** - Environment variables зөв эсэх

## Тусламж

Хэрэв асуудал үргэлжилбэл:
1. Vercel build logs screenshot
2. Browser DevTools Console screenshot
3. Network tab screenshot (CSS файлууд)

Дээрх мэдээллийг өгвөл илүү дэлгэрэнгүй тусалж чадна.
