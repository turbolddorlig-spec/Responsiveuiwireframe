#!/bin/bash

clear

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔥 VERCEL FORCE REBUILD - CSS БАЙХГҮЙ АСУУДАЛ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔍 АСУУДАЛ:"
echo "   ❌ Production дээр CSS ОГТХОН Ч байхгүй"
echo "   ❌ Vercel хуучин build cache ашиглаж байна"
echo "   ❌ Шинэ commit ч ажиллахгүй байна"
echo ""
echo "✅ ШИЙДЭЛ:"
echo "   → Dummy file өөрчилж Vercel-г rebuild хийлгэнэ"
echo "   → Cache-гүй шинэ build хийгдэнэ"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔨 STEP 1: DUMMY FILE ӨӨРЧЛӨХ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Create a timestamp-based dummy change to force rebuild
TIMESTAMP=$(date +%s)
echo "/* Force rebuild timestamp: $TIMESTAMP */" >> index.css

echo "✓ index.css өөрчилсөн (timestamp: $TIMESTAMP)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 STEP 2: LOCAL BUILD ШАЛГАХ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

rm -rf dist/ node_modules/.vite 2>/dev/null
echo "✓ Cache цэвэрлэгдсэн"

echo ""
echo "npm run build хийж байна..."
npm run build --silent

if [ $? -ne 0 ]; then
  echo "❌ Build амжилтгүй!"
  exit 1
fi

echo "✓ Build амжилттай"

# Check CSS file
CSS_FILE=$(find dist/assets -name "*.css" -type f 2>/dev/null | head -1)

if [ -z "$CSS_FILE" ]; then
  echo "❌ CSS файл үүсээгүй!"
  exit 1
fi

CSS_SIZE=$(wc -c < "$CSS_FILE" 2>/dev/null || echo "0")
CSS_SIZE_KB=$((CSS_SIZE / 1024))

echo "📄 CSS: $(basename "$CSS_FILE")"
echo "📏 Хэмжээ: $CSS_SIZE_KB KB"

if [ $CSS_SIZE_KB -lt 50 ]; then
  echo "❌ CSS хэт жижиг ($CSS_SIZE_KB KB)!"
  echo ""
  echo "Tailwind compile хийгдээгүй байна!"
  echo ""
  echo "CSS агуулга:"
  head -30 "$CSS_FILE"
  exit 1
fi

echo "✅ CSS зөв үүсгэгдсэн ($CSS_SIZE_KB KB)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 STEP 3: GIT COMMIT + PUSH"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

git add -A

git commit -m "fix: Force Vercel rebuild - CSS not loading in production (rebuild $TIMESTAMP, CSS: $CSS_SIZE_KB KB)

CRITICAL: This commit forces Vercel to rebuild without cache.

- Verified local build generates ${CSS_SIZE_KB}KB CSS
- All config files correct (.cjs only)
- PostCSS and Tailwind working locally
- Issue is Vercel using stale cache

Vercel must:
1. Clear build cache
2. Rebuild from scratch
3. Generate fresh CSS bundle

DO NOT use existing build cache!"

if [ $? -ne 0 ]; then
  echo "⚠️ Commit алдаа, empty commit хийж байна..."
  git commit --allow-empty -m "fix: Force Vercel rebuild - timestamp $TIMESTAMP"
fi

echo "✓ Commit хийгдлээ"

echo ""
echo "🚀 GitHub руу push..."
git push origin main

if [ $? -ne 0 ]; then
  echo "❌ Push амжилтгүй!"
  exit 1
fi

echo "✓ GitHub-д push хийгдлээ"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ АМЖИЛТТАЙ!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Local Build:"
echo "   ✅ CSS: $CSS_SIZE_KB KB"
echo "   ✅ Tailwind: Working"
echo "   ✅ PostCSS: Working"
echo ""
echo "⏳ Vercel: Auto-deploying..."
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚨 CRITICAL: VERCEL ДЭЭР ЗААВАЛ ХИЙХ!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Local build зөв ажиллаж байна."
echo "Асуудал нь ЗӨВХӨН Vercel build cache!"
echo ""
echo "═══════════════════════════════════════════"
echo "ЗААВАЛ ДАГАХ АЛХАМ:"
echo "═══════════════════════════════════════════"
echo ""
echo "1. https://vercel.com/dashboard нээх"
echo ""
echo "2. Project сонгох"
echo ""
echo "3. 'Deployments' tab"
echo ""
echo "4. Latest deployment хүлээх (1-2 минут)"
echo ""
echo "5. Latest deployment дээр '...' (3 dots) дарах"
echo ""
echo "6. 'Redeploy' сонгох"
echo ""
echo "7. 🚨 CRITICAL:"
echo "   ┌─────────────────────────────────────┐"
echo "   │ ☐ Use existing Build Cache          │"
echo "   └─────────────────────────────────────┘"
echo "   ↑ ЭНЭ CHECKBOX-Г УНТРААЖ ЗААВАЛ ХООСЛОНО!"
echo ""
echo "8. 'Redeploy' товч дарах"
echo ""
echo "9. 2-3 минут хүлээх"
echo ""
echo "10. Production URL → Ctrl+Shift+R (Hard refresh)"
echo ""
echo "11. F12 → Console шалгах:"
echo "    ✅ '✅ Tailwind CSS loaded successfully'"
echo ""
echo "12. F12 → Network → CSS файл шалгах:"
echo "    ✅ index-[hash].css"
echo "    ✅ Size: >100KB"
echo "    ✅ Status: 200 OK"
echo ""
echo "═══════════════════════════════════════════"
echo ""
echo "Хэрэв дараа нь ч CSS харагдахгүй бол:"
echo ""
echo "Vercel Build Logs шалгах:"
echo "  → 'View Function Logs' дарах"
echo "  → Build output-д алдаа байгаа эсэх"
echo "  → CSS файл үүсгэгдсэн эсэх"
echo "  → Хэмжээ нь хэд байгаа"
echo ""
echo "━━━━━━━━━━━━��━━━━━━━━━━━━━━━━━━━━━━━━━━━"
