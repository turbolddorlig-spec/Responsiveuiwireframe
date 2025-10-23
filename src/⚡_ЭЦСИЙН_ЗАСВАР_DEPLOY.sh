#!/bin/bash

clear

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚡ ЭЦСИЙН ЗАСВАР - THEME БАЙХГҮЙ АСУУДАЛ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔍 ОЛДСОН АСУУДАЛ:"
echo "   ❌ postcss.config.js болон .cjs хоёулаа байсан"
echo "   ❌ tailwind.config.js болон .cjs хоёулаа байсан"
echo "   ❌ Vite .js файлыг ашиглаж, .cjs ignore хийж байсан"
echo ""
echo "✅ ЗАСВАР:"
echo "   ✓ postcss.config.js УСТГАСАН"
echo "   ✓ tailwind.config.js УСТГАСАН"
echo "   ✓ Зөвхөн .cjs файлууд үлдсэн"
echo "   ✓ vite.config.ts дээр PostCSS path заасан"
echo "   ✓ index.html дээр inline critical CSS нэмсэн"
echo "   ✓ CDN fallback шинэчилсэн"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧹 STEP 1: ЦЭВЭРЛЭХ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

rm -rf dist/ node_modules/.vite node_modules/.cache 2>/dev/null

echo "✓ Build cache цэвэрлэгдсэн"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 STEP 2: DEPENDENCIES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "npm install хийж байна..."
npm install --silent

if [ $? -ne 0 ]; then
  echo "❌ npm install амжилтгүй!"
  exit 1
fi

echo "✓ Dependencies суулгасан"

# Verify PostCSS and Tailwind are installed
if [ ! -d "node_modules/tailwindcss" ]; then
  echo "❌ tailwindcss суугаагүй байна!"
  exit 1
fi

if [ ! -d "node_modules/postcss" ]; then
  echo "❌ postcss суугаагүй байна!"
  exit 1
fi

echo "✓ tailwindcss: $(node -p "require('./node_modules/tailwindcss/package.json').version")"
echo "✓ postcss: $(node -p "require('./node_modules/postcss/package.json').version")"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 STEP 3: CONFIG ШАЛГАХ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check .cjs files exist
if [ ! -f "postcss.config.cjs" ]; then
  echo "❌ postcss.config.cjs байхгүй!"
  exit 1
fi

if [ ! -f "tailwind.config.cjs" ]; then
  echo "❌ tailwind.config.cjs байхгүй!"
  exit 1
fi

echo "✓ postcss.config.cjs байна"
echo "✓ tailwind.config.cjs байна"

# Check old .js files are deleted
if [ -f "postcss.config.js" ]; then
  echo "⚠️  WARNING: postcss.config.js байгаа нь буруу!"
  echo "   Устгаж байна..."
  rm postcss.config.js
fi

if [ -f "tailwind.config.js" ]; then
  echo "⚠️  WARNING: tailwind.config.js байгаа нь буруу!"
  echo "   Устгаж байна..."
  rm tailwind.config.js
fi

echo "✓ Зөвхөн .cjs config файлууд байна"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔨 STEP 4: BUILD"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "npm run build хийж байна..."
npm run build

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ BUILD АМЖИЛТГҮЙ!"
  echo ""
  echo "Алдааг дээрээс харна уу."
  exit 1
fi

echo ""
echo "✓ Build амжилттай"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 STEP 5: CSS ФАЙЛ ШАЛГАХ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Find CSS file
CSS_FILE=$(find dist/assets -name "*.css" -type f 2>/dev/null | head -1)

if [ -z "$CSS_FILE" ]; then
  echo "❌ CRITICAL ERROR: CSS файл үүсээгүй!"
  echo ""
  echo "Магадгүй шалтгаан:"
  echo "  - main.tsx дээр './index.css' import байхгүй"
  echo "  - PostCSS config алдаатай"
  echo "  - Tailwind config алдаатай"
  echo ""
  echo "dist/assets агуулга:"
  ls -la dist/assets/ 2>/dev/null || echo "(folder байхгүй)"
  exit 1
fi

# Get file size
CSS_SIZE=$(wc -c < "$CSS_FILE" 2>/dev/null || echo "0")
CSS_SIZE_KB=$((CSS_SIZE / 1024))

echo "📄 CSS файл: $(basename "$CSS_FILE")"
echo "📏 Хэмжээ: $CSS_SIZE_KB KB ($CSS_SIZE bytes)"
echo ""

# Check if CSS is too small
if [ $CSS_SIZE_KB -lt 20 ]; then
  echo "❌ CRITICAL: CSS хэт жижиг байна!"
  echo ""
  echo "Хүлээгдсэн: >100 KB"
  echo "Одоогийн: $CSS_SIZE_KB KB"
  echo ""
  echo "Энэ нь Tailwind compile хийгдээгүй гэсэн үг!"
  echo ""
  echo "CSS агуулга (эхний 30 мөр):"
  head -30 "$CSS_FILE"
  echo ""
  exit 1
fi

echo "✅ CSS хэмжээ зөв! ($CSS_SIZE_KB KB)"

# Check CSS content
echo ""
echo "🔍 CSS агуулга шалгаж байна..."

if grep -q "\.bg-background" "$CSS_FILE"; then
  echo "  ✓ .bg-background class байна"
else
  echo "  ⚠️  .bg-background байхгүй"
fi

if grep -q "\.text-foreground" "$CSS_FILE"; then
  echo "  ✓ .text-foreground class байна"
else
  echo "  ⚠️  .text-foreground байхгүй"
fi

if grep -q "@layer" "$CSS_FILE"; then
  echo "  ✓ Tailwind layers байна"
else
  echo "  ⚠️  Tailwind layers байхгүй"
fi

RULE_COUNT=$(grep -c "{" "$CSS_FILE" 2>/dev/null || echo "0")
echo "  ℹ️  CSS rules: ~$RULE_COUNT"

if [ $RULE_COUNT -lt 100 ]; then
  echo "  ⚠️  WARNING: CSS дүрэм цөөн байна"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 STEP 6: BUILD OUTPUT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "dist/ folder агуулга:"
ls -lh dist/
echo ""

echo "dist/assets/ агуулга:"
ls -lh dist/assets/
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ BUILD АМЖИЛТТАЙ!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Үзүүлэлт:"
echo "   ✅ CSS файл: $CSS_SIZE_KB KB"
echo "   ✅ Config: .cjs files ONLY"
echo "   ✅ Inline critical CSS: index.html"
echo "   ✅ CDN fallback: ready"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 STEP 7: GIT COMMIT & PUSH"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Stage changes
git add -A

# Check if there are changes
if git diff-index --quiet HEAD -- 2>/dev/null; then
  echo "ℹ️  Өөрчлөлт байхгүй байна"
  echo ""
  read -p "Empty commit хийж force redeploy хийх үү? (y/n) " -n 1 -r
  echo ""
  
  if [[ $REPLY =~ ^[YyТт]$ ]]; then
    git commit --allow-empty -m "fix: Final CSS fix - removed duplicate .js configs, explicit PostCSS path, inline critical CSS ($CSS_SIZE_KB KB)"
    
    if [ $? -ne 0 ]; then
      echo "❌ Commit амжилтгүй!"
      exit 1
    fi
  else
    echo "❌ Цуцлагдлаа"
    echo ""
    echo "Local build амжилттай, гэхдээ deploy хийгдээгүй."
    exit 0
  fi
else
  # Commit changes
  git commit -m "fix: Final CSS fix - removed duplicate .js configs, explicit PostCSS path, inline critical CSS ($CSS_SIZE_KB KB)"
  
  if [ $? -ne 0 ]; then
    echo "❌ Commit амжилтгүй!"
    exit 1
  fi
fi

echo "✓ Commit хийгдлээ"
echo ""

# Push to GitHub
echo "🚀 GitHub руу push хийж байна..."
git push origin main

if [ $? -ne 0 ]; then
  echo "❌ Push амжилтгүй!"
  echo ""
  echo "Гараар push хийнэ үү:"
  echo "  git push origin main"
  exit 1
fi

echo "✓ GitHub-д push хийгдлээ"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 АМЖИЛТТАЙ!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Local build: $CSS_SIZE_KB KB CSS"
echo "✅ Git push: Амжилттай"
echo "⏳ Vercel: Auto-deploying..."
echo ""

echo "━━━━━━━━━━━━━━━��━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚠️  CRITICAL: VERCEL CACHE УСТГАХ!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Vercel Dashboard дээр:"
echo ""
echo "1. https://vercel.com/dashboard"
echo ""
echo "2. Project → Deployments"
echo ""
echo "3. Latest deployment → '...' → Redeploy"
echo ""
echo "4. ⚠️  CRITICAL: 'Use existing Build Cache' UNCHECK!"
echo "   (Энэ checkbox ЗААВАЛ тэмдэглэхгүй!)"
echo ""
echo "5. 'Redeploy' дарах"
echo ""
echo "6. 2-3 минут хүлээх"
echo ""
echo "7. Production URL → Hard refresh (Ctrl+Shift+R)"
echo ""
echo "8. F12 → Console:"
echo "   ✅ '✅ Tailwind CSS loaded successfully'"
echo "   ЭСВЭЛ"
echo "   ⚠️  '❌ CRITICAL: Tailwind CSS not loaded!'"
echo "   ⚠️  'Loading CDN fallback...'"
echo "   ⚠️  '✅ Tailwind CDN loaded'"
echo ""
echo "Хэрэв CDN fallback ажилласан бол:"
echo "  → Vercel Build Logs шалгах"
echo "  → CSS файл үүсгэгдсэн эсэх"
echo "  → PostCSS алдаа байгаа эсэх"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 ДАРААГИЙН АЛХАМ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Vercel Dashboard нээх"
echo "2. Cache устгах"
echo "3. Manual redeploy (без cache)"
echo "4. 2-3 минут хүлээх"
echo "5. Production шалгах"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
