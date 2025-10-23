#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔥 EMERGENCY CSS FIX - PRODUCTION ДЭЭР THEME БАЙХГҮЙ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🐛 АСУУДАЛ: Production дээр theme/өнгөнүүд харагдахгүй байна"
echo "   → Хар цагаан текст"
echo "   → Style-гүй товчнууд"
echo "   → CSS ачаалагдаагүй эсвэл хоосон"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 STEP 1: LOCAL BUILD ТЕСТ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Clean old build
echo "🗑️  Хуучин build устгаж байна..."
rm -rf dist/ node_modules/.vite

echo ""
echo "📦 npm install хийж байна..."
npm install

if [ $? -ne 0 ]; then
  echo "❌ npm install амжилтгүй!"
  exit 1
fi

echo ""
echo "🔨 npm run build хийж байна..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build амжилтгүй!"
  echo ""
  echo "🔍 Алдааг шалгаарай:"
  echo "   - postcss.config.js зөв эсэх"
  echo "   - tailwind.config.js зөв эсэх"
  echo "   - index.css файл байгаа эсэх"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 STEP 2: CSS ФАЙЛ ШАЛГАХ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Find CSS file
CSS_FILE=$(find dist/assets -name "*.css" -type f | head -1)

if [ -z "$CSS_FILE" ]; then
  echo "❌ CRITICAL: CSS файл үүсээгүй!"
  echo ""
  echo "Магадгүй шалтгаан:"
  echo "  - main.tsx дээр './index.css' import хийгээгүй"
  echo "  - postcss.config.js алдаатай"
  echo "  - tailwind.config.js алдаатай"
  exit 1
fi

echo "✅ CSS файл олдсон: $CSS_FILE"

# Get file size
CSS_SIZE=$(wc -c < "$CSS_FILE")
CSS_SIZE_KB=$((CSS_SIZE / 1024))

echo "📏 Хэмжээ: $CSS_SIZE_KB KB"
echo ""

if [ $CSS_SIZE_KB -lt 50 ]; then
  echo "❌ CRITICAL ERROR: CSS файл хэт жижиг!"
  echo "   Хэмжээ: $CSS_SIZE_KB KB"
  echo "   Хүлээгдсэн: >100KB"
  echo ""
  echo "🔍 Tailwind compile хийгдээгүй байна!"
  echo ""
  echo "Шалтгаануud:"
  echo "  1. postcss.config.js буруу format"
  echo "  2. tailwind.config.js буруу format"
  echo "  3. @tailwind directives алдаатай"
  echo "  4. index.css олдохгүй байна"
  echo ""
  echo "Шалгах:"
  cat "$CSS_FILE" | head -20
  echo ""
  exit 1
fi

echo "✅ CSS хэмжээ зөв ($CSS_SIZE_KB KB)"
echo ""

# Check CSS content
echo "🔍 CSS агуулга шалгаж байна..."
echo ""

if grep -q "\.bg-background" "$CSS_FILE"; then
  echo "✅ Tailwind utilities байна (.bg-background)"
else
  echo "⚠️  WARNING: .bg-background class олдсонгүй"
fi

if grep -q "\.text-foreground" "$CSS_FILE"; then
  echo "✅ Theme classes байна (.text-foreground)"
else
  echo "⚠️  WARNING: .text-foreground class олдсонгүй"
fi

if grep -q "button" "$CSS_FILE"; then
  echo "✅ Button styles байна"
else
  echo "⚠️  WARNING: Button styles олдсонгүй"
fi

# Count CSS rules
RULE_COUNT=$(grep -c "{" "$CSS_FILE")
echo ""
echo "📊 CSS дүрмүүд: ~$RULE_COUNT"

if [ $RULE_COUNT -lt 100 ]; then
  echo "⚠️  WARNING: CSS дүрэм цөөн байна (хүлээгдсэн: >1000)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ LOCAL BUILD АМЖИЛТТАЙ!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 STEP 3: GIT COMMIT & PUSH"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Stage changes
git add -A

# Check if there are changes
if git diff-index --quiet HEAD --; then
  echo "ℹ️  Өөрчлөлт байхгүй байна"
  echo ""
  read -p "🤔 Empty commit хийж force redeploy хийх үү? (y/n) " -n 1 -r
  echo ""
  
  if [[ $REPLY =~ ^[YyТт]$ ]]; then
    git commit --allow-empty -m "fix: Force CSS rebuild - Tailwind theme missing in production"
    
    if [ $? -ne 0 ]; then
      echo "❌ Commit амжилтгүй!"
      exit 1
    fi
  else
    echo "❌ Цуцлагдлаа"
    exit 0
  fi
else
  # Commit changes
  git commit -m "fix: CSS theme fix - Simplified index.html + verified Tailwind config"
  
  if [ $? -ne 0 ]; then
    echo "❌ Commit амжилтгүй!"
    exit 1
  fi
fi

echo "✅ Commit хийгдлээ"
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

echo "✅ GitHub-д push хийгдлээ"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 STEP 4: VERCEL REDEPLOY ЗААВАРЧИЛГАА"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "⚠️  CRITICAL: Vercel автоматаар redeploy хийх болно, ГЭХДЭЭ:"
echo "   → Build cache устгах ХЭРЭГТЭЙ!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 VERCEL ДЭЭР CACHE УСТГАХ (ЗААВАЛ!)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Option 1: Manual Redeploy (БҮХ CACHE УСТГАНА)"
echo "───────────────────────────────────────────────"
echo ""
echo "1. Очих: https://vercel.com/dashboard"
echo "2. Project сонгох"
echo "3. 'Deployments' tab"
echo "4. Latest deployment дээр '...' дарах"
echo "5. 'Redeploy' дарах"
echo "6. ⚠️  CRITICAL: 'Use existing Build Cache' UNCHECK!"
echo "7. 'Redeploy' confirm хийх"
echo ""

echo "Option 2: Vercel Settings (PERMANENT FIX)"
echo "──────────────────────────────────────────"
echo ""
echo "1. Vercel Dashboard → Project"
echo "2. Settings tab"
echo "3. 'Caching' section"
echo "4. 'Clear Build Cache' дарах"
echo "5. Дахин: Deployments → Redeploy"
echo ""

echo "Option 3: Wait for Auto-Deploy (2-3 минут)"
echo "───────────────────────────────────────────"
echo ""
echo "GitHub push хийсний дараа Vercel автоматаар build хийнэ."
echo "ГЭХДЭЭ: Хуучин cache ашиглаж магадгүй!"
echo ""
echo "Хэрэв auto-deploy дараа ч theme харагдахгүй бол:"
echo "  → Option 1 ашиглаад manual redeploy хийнэ"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 VERCEL BUILD LOGS ШАЛГАХ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Build дууссаны дараа Vercel dashboard дээр:"
echo ""
echo "1. Deployments → Latest deployment"
echo "2. 'Building' эсвэл 'Build Logs' дарах"
echo "3. Дараах зүйлсийг шалгах:"
echo ""
echo "   ✅ npm install"
echo "      → tailwindcss@3.4.1 installed"
echo ""
echo "   ✅ npm run build"
echo "      → vite building..."
echo "      → dist/assets/index-[hash].css created"
echo "      → File size: 150KB - 300KB (БИШІ 5KB!)"
echo ""
echo "   ❌ ХЭРЭВ:"
echo "      → 'Cannot find module tailwindcss'"
echo "      → CSS файл жижиг (5KB)"
echo "      → Tailwind compile алдаа"
echo "      THEN: Cache устгаад дахин deploy хийх"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ АМЖИЛТ ШАЛГАХ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Deployment дууссаны дараа (2-3 минут):"
echo ""
echo "1. Production URL нээх"
echo ""
echo "2. Hard refresh хийх:"
echo "   Windows: Ctrl + Shift + R"
echo "   Mac: Cmd + Shift + R"
echo ""
echo "3. DevTools нээх (F12)"
echo ""
echo "4. Network tab → Refresh"
echo "   → index-[hash].css олох"
echo "   → Size шалгах: 150KB+ байх ёстой"
echo "   → Click хийж content харах"
echo "   → Олон CSS rules байх ёстой"
echo ""
echo "5. Elements tab"
echo "   → <body> шалгах"
echo "   → class=\"bg-background text-foreground\" харагдах ёстой"
echo "   → Computed styles дээр colors байх ёстой"
echo ""
echo "6. Console tab"
echo "   → Алдаа байхгүй байх ёстой"
echo "   → CSS load error байхгүй"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 DEPLOYMENT COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Local build: $CSS_SIZE_KB KB CSS"
echo "✅ GitHub push: Амжилттай"
echo "⏳ Vercel deploy: Auto-deploying..."
echo ""
echo "⚠️  САНАМЖ:"
echo "   Vercel dashboard дээр CACHE УСТГАХ!"
echo "   Use existing Build Cache → UNCHECK!"
echo ""
echo "🕐 2-3 минутын дараа production-г шалга:"
echo "   → Hard refresh (Ctrl+Shift+R)"
echo "   → Theme харагдах ёстой"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
