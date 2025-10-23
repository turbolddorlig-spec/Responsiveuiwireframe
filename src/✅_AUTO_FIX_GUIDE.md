# ✅ AUTO FIX GUIDE - VITE CONFIG

## 🎯 АСУУДАЛ

Vercel дээр deploy хийхдээ **гараар** `vite.config.ts` файлыг нээж:

```typescript
outDir: 'build'  // ← Буруу
```

Засаж:

```typescript
outDir: 'dist'   // ← Зөв
```

Энэ нь цаг алдуулж, мартагдаж болно!

---

## ✅ ШИЙДЭЛ - AUTO FIX SCRIPTS

### 🔧 Script 1: vite.config.ts зөвхөн шалгаад засах

```bash
bash 🔧_AUTO_FIX_VITE_CONFIG.sh
```

**Юу хийх вэ:**
- ✅ `vite.config.ts` шалгана
- ✅ `outDir: 'build'` олдвол `'dist'` болгоно
- ✅ Backup үүсгэнэ (`.backup`)
- ✅ Git commit/push сонголт өгнө

---

### 🚀 Script 2: БҮХ ТОХИРГОО шалгаад AUTO FIX

```bash
bash 🚀_PRE_DEPLOY_CHECK.sh
```

**Юу шалгах вэ:**

**✅ CHECK 1: vite.config.ts**
- `outDir: 'build'` → AUTO FIX → `outDir: 'dist'`

**✅ CHECK 2: vercel.json**
- `outputDirectory: 'build'` → AUTO FIX → `outputDirectory: 'dist'`

**✅ CHECK 3: PostCSS Config**
- Duplicate files (`postcss.config.js` + `.cjs`) → AUTO DELETE `.js`
- Зөвхөн `.cjs` үлдээнэ

**✅ CHECK 4: Tailwind Config**
- Duplicate files (`tailwind.config.js` + `.cjs`) → AUTO DELETE `.js`
- Зөвхөн `.cjs` үлдээнэ

**✅ CHECK 5: CSS Import**
- `main.tsx` → `import './index.css'` байгаа эсэх
- `index.css` → `@tailwind` directives байгаа эсэх

---

## 📊 OUTPUT EXAMPLE

### 🔧 AUTO FIX VITE CONFIG:

```
🔧 AUTO FIX: vite.config.ts outDir → dist

📄 Файл: vite.config.ts

🔍 Одоогийн утга: outDir: 'build'

🔨 ЗАСВАРЛАЖ БАЙНА...

   build → dist

✓ Backup: vite.config.ts.backup
✓ Файл шинэчилэгдсэн

✅ АМЖИЛТТАЙ ЗАСВАРЛАСАН!

Хуучин: outDir: 'build'
Шинэ:   outDir: 'dist'

Git commit хийх үү? (y/n)
```

### 🚀 PRE-DEPLOY CHECK:

```
🚀 PRE-DEPLOY CHECK - AUTO FIX

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHECK 1: vite.config.ts outDir
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  БУРУУ: outDir: 'build'

🔨 AUTO FIX хийж байна...
✅ ЗАСВАРЛАСАН: outDir: 'dist'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHECK 2: vercel.json outputDirectory
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ ЗӨВӨӨР: outputDirectory: 'dist'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHECK 3: PostCSS Config
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  postcss.config.js байна
✅ postcss.config.cjs байна

❌ DUPLICATE: Хоёр config файл байна!

🔨 AUTO FIX: .js файл устгаж байна...
✅ postcss.config.js устгасан

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHECK 4: Tailwind Config
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Зөвхөн .cjs файл байна

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHECK 5: CSS Import
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ main.tsx: index.css import байна
✅ index.css: Tailwind directives байна

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ҮНЭЛГЭЭ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ БҮХ ШАЛГАЛТ АМЖИЛТТАЙ!

Vercel deploy хийхэд бэлэн.
```

---

## 🎯 ХЭЗЭЭ АШИГЛАХ ВЭ?

### Хувилбар 1: Зөвхөн vite.config.ts шалгах

```bash
bash 🔧_AUTO_FIX_VITE_CONFIG.sh
```

**Хэрэглэх үед:**
- `outDir: 'build'` эсэхийг шалгах
- Гараар засах хэрэггүй автомат засах

### Хувилбар 2: БҮХ ТОХИРГОО шалгах

```bash
bash 🚀_PRE_DEPLOY_CHECK.sh
```

**Хэрэглэх үед:**
- Deploy хийхээс өмнө
- БҮХ тохиргоог баталгаажуулах
- Duplicate configs устгах
- Production-ready эсэхийг шалгах

---

## 🔄 WORKFLOW

### Option A: Зөвхөн vite.config.ts

```bash
# 1. Auto fix
bash 🔧_AUTO_FIX_VITE_CONFIG.sh

# 2. Git (script нь автоматаар санал болгоно)
# Эсвэл гараар:
git add vite.config.ts
git commit -m "fix: outDir build → dist"
git push origin main
```

### Option B: Бүрэн шалгалт

```bash
# 1. Full check + auto fix
bash 🚀_PRE_DEPLOY_CHECK.sh

# 2. Хэрэв алдаа байвал дахин ажиллуулах
# Бүх auto fix хийгдсэний дараа exit 0

# 3. Git
git add -A
git commit -m "fix: Auto-fix all configs for Vercel deploy"
git push origin main
```

---

## ⚡ ШУУРХАЙ COMMANDS

```bash
# Quick fix vite.config.ts:
bash 🔧_AUTO_FIX_VITE_CONFIG.sh

# Full pre-deploy check:
bash 🚀_PRE_DEPLOY_CHECK.sh

# Manual check:
grep "outDir" vite.config.ts
grep "outputDirectory" vercel.json
ls -la *config.js *config.cjs

# Manual fix:
sed -i "s/outDir: 'build'/outDir: 'dist'/g" vite.config.ts
```

---

## ✅ SUCCESS INDICATORS

### After Auto Fix:

```
✅ vite.config.ts: outDir: 'dist'
✅ vercel.json: outputDirectory: 'dist'
✅ No duplicate .js configs
✅ All .cjs configs present
✅ CSS imports correct
```

### Vercel Deploy:

```
✅ Build output: dist/
✅ Build completes successfully
✅ No "output directory not found" errors
✅ CSS files in dist/assets/
```

---

## 🐛 TROUBLESHOOTING

### Script амжилтгүй:

```bash
# Check permissions:
chmod +x 🔧_AUTO_FIX_VITE_CONFIG.sh
chmod +x 🚀_PRE_DEPLOY_CHECK.sh

# Run with bash:
bash 🔧_AUTO_FIX_VITE_CONFIG.sh
```

### Backup сэргээх:

```bash
# Хэрэв auto fix буруу зүйл хийсэн бол:
cp vite.config.ts.backup vite.config.ts
```

### Manual verification:

```bash
# Check what changed:
diff vite.config.ts.backup vite.config.ts

# Check current value:
grep -n "outDir" vite.config.ts
```

---

## 🎯 САНАМЖ

**Эдгээр scripts:**
- ✅ Автоматаар алдаа засна
- ✅ Backup үүсгэнэ
- ✅ Verification хийнэ
- ✅ Git commit сонголт өгнө
- ✅ Цаг хэмнэнэ

**Гараар засах шаардлагагүй!**

---

## 🚀 ОДОО АЖИЛЛУУЛ!

```bash
bash 🚀_PRE_DEPLOY_CHECK.sh
```

**Автоматаар бүх асуудлыг засаад Vercel deploy хий!** ⚡✨
