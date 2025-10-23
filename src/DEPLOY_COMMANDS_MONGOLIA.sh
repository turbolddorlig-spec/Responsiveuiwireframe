#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 VERCEL DEPLOYMENT - МОНГОЛ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 1: Configuration шалгах
echo "📋 1-р алхам: Configuration шалгах..."
echo ""

if [ -f "vite.config.ts" ]; then
  if grep -q "outDir: 'dist'" vite.config.ts; then
    echo "✅ vite.config.ts: outDir = 'dist'"
  else
    echo "❌ АЛДАА: vite.config.ts дээр outDir буруу байна!"
    exit 1
  fi
else
  echo "❌ АЛДАА: vite.config.ts олдсонгүй!"
  exit 1
fi

if [ -f "vercel.json" ]; then
  if grep -q '"outputDirectory": "dist"' vercel.json; then
    echo "✅ vercel.json: outputDirectory = 'dist'"
  else
    echo "❌ АЛДАА: vercel.json дээр outputDirectory буруу байна!"
    exit 1
  fi
else
  echo "❌ АЛДАА: vercel.json олдсонгүй!"
  exit 1
fi

if [ -d "src" ]; then
  echo "⚠️  АНХААРУУЛГА: /src folder байна! Энэ асуудал үүсгэж магадгүй."
else
  echo "✅ /src folder байхгүй (зөв)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Step 2: Build туршилт
echo "🔨 2-р алхам: Build туршилт..."
echo ""

# Хуучин build-үүд цэвэрлэх
echo "🧹 Хуучин build-үүд устгаж байна..."
rm -rf dist/ build/

# Build хийх
echo "⚙️  npm run build ажиллуулж байна..."
npm run build

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ АЛДАА: Build амжилтгүй боллоо!"
  echo "Алдааг засаад дахин оролдоно уу."
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Step 3: Build output шалгах
echo "🔍 3-р алхам: Build output шалгах..."
echo ""

if [ -d "dist" ]; then
  echo "✅ dist/ folder үүссэн"
  
  if [ -f "dist/index.html" ]; then
    echo "✅ dist/index.html байна"
  else
    echo "❌ АЛДАА: dist/index.html байхгүй!"
    exit 1
  fi
  
  if [ -d "dist/assets" ]; then
    echo "✅ dist/assets/ folder байна"
    
    CSS_COUNT=$(find dist/assets -name "*.css" | wc -l)
    JS_COUNT=$(find dist/assets -name "*.js" | wc -l)
    
    echo "   📦 CSS файлууд: $CSS_COUNT"
    echo "   📦 JS файлууд: $JS_COUNT"
    
    if [ $CSS_COUNT -eq 0 ]; then
      echo "⚠️  АНХААРУУЛГА: CSS файл олдсонгүй!"
    fi
    
    if [ $JS_COUNT -eq 0 ]; then
      echo "❌ АЛДАА: JS файл олдсонгүй!"
      exit 1
    fi
  else
    echo "❌ АЛДАА: dist/assets/ байхгүй!"
    exit 1
  fi
  
  echo ""
  echo "📂 Build output:"
  ls -lh dist/
  echo ""
  ls -lh dist/assets/ | head -10
  
else
  echo "❌ АЛДАА: dist/ folder үүсээгүй!"
  
  if [ -d "build" ]; then
    echo "❌ build/ folder үүссэн! Энэ буруу!"
    echo "vite.config.ts шалгана уу."
  fi
  
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Step 4: Git status шалгах
echo "📝 4-р алхам: Git status шалгах..."
echo ""

git status --short

echo ""
read -p "🤔 GitHub-д push хийх үү? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[YyТт]$ ]]; then
  echo "❌ Push цуцлагдсан."
  echo ""
  echo "Build амжилттай болсон! Үүнийг хийж болно:"
  echo "  1. Өөрчлөлтүүдээ commit хийх"
  echo "  2. GitHub-д push хийх"
  echo "  3. Vercel.com руу очиж deploy хийх"
  exit 0
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Step 5: Git add
echo "➕ 5-р алхам: Git add..."
git add .

# Step 6: Git commit
echo "💾 6-р алхам: Git commit..."
echo ""
read -p "📝 Commit message (эсвэл Enter-г default): " COMMIT_MSG

if [ -z "$COMMIT_MSG" ]; then
  COMMIT_MSG="config: Permanent dist/ output - Ready for Vercel deployment"
fi

git commit -m "$COMMIT_MSG"

if [ $? -ne 0 ]; then
  echo "⚠️  Commit амжилтгүй (магадгүй өөрчлөлт байхгүй)"
  echo "Үргэлжлүүлж байна..."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Step 7: Git push
echo "🚀 7-р алхам: Git push хийж байна..."
git push origin main

if [ $? -ne 0 ]; then
  echo "❌ АЛДАА: Push амжилтгүй боллоо!"
  echo "Шалтгаан:"
  echo "  - GitHub credentials буруу эсвэл expire болсон"
  echo "  - Network холболт алдаатай"
  echo "  - Remote repository олдсонгүй"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ АМЖИЛТТАЙ!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Үр дүн:"
echo "  ✅ Build амжилттай: dist/ folder үүссэн"
echo "  ✅ dist/index.html байна"
echo "  ✅ dist/assets/*.css байна"
echo "  ✅ dist/assets/*.js байна"
echo "  ✅ GitHub-д push хийгдсэн"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 ОДОО VERCEL-Д DEPLOY ХИЙХ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "АРГА 1: Vercel CLI (Хурдан)"
echo "────────────────────────────"
echo "npm install -g vercel"
echo "vercel login"
echo "vercel --prod"
echo ""
echo "АРГА 2: Vercel Dashboard (Хялбар)"
echo "──────────────────────────────────"
echo "1. Очих: https://vercel.com/new"
echo "2. 'Import Git Repository' дарах"
echo "3. Repository сонгох"
echo "4. 'Deploy' дарах"
echo "5. 2-3 минут хүлээх"
echo "6. ✅ АМЖИЛТ!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Дэлгэрэнгүй заавар:"
echo "   VERCEL_DEPLOY_MONGOLIA.md"
echo ""
echo "🎉 ТА БЭЛЭН БОЛЛОО! VERCEL-Д DEPLOY ХИЙЦГЭЭЕ!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
