#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔥 FIX: REMOVE /src FOLDER FROM GITHUB"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  CRITICAL: /src folder байна GitHub дээр!"
echo "    Энэ нь Vercel build-г эвдэж байна."
echo ""
echo "Энэ script:"
echo "  1. Local /src folder-г устгана"
echo "  2. Git-д commit хийнэ"
echo "  3. GitHub руу push хийнэ"
echo "  4. Vercel-д redeploy хийх зааварчилгаа өгнө"
echo ""

# Check if src folder exists
if [ ! -d "src" ]; then
  echo "✅ /src folder байхгүй (зөв!)"
  echo ""
  echo "Таны local дээр /src folder байхгүй байна."
  echo "Гэхдээ GitHub дээр байж магадгүй."
  echo ""
  read -p "🤔 Git-с /src folder устгаж GitHub-д push хийх үү? (y/n) " -n 1 -r
  echo ""
  
  if [[ ! $REPLY =~ ^[YyТт]$ ]]; then
    echo "❌ Цуцлагдлаа"
    exit 0
  fi
  
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🗑️  STEP 1: Git-с /src устгах"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  
  # Remove src from git
  git rm -rf src/ 2>/dev/null || echo "⚠️  Git-д /src folder олдсонгүй"
  
else
  echo "❌ CRITICAL: /src folder БАЙНА!"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🗑️  STEP 1: /src folder устгах"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  
  echo "📂 /src folder агуулга:"
  ls -la src/ 2>/dev/null || echo "(empty or permission denied)"
  echo ""
  
  read -p "🔥 /src folder-г УСТГАХ уу? Энэ үйлдлийг буцаах боломжгүй! (y/n) " -n 1 -r
  echo ""
  
  if [[ ! $REPLY =~ ^[YyТт]$ ]]; then
    echo "❌ Цуцлагдлаа"
    echo ""
    echo "⚠️  /src folder устгаагүй бол Vercel build амжилтгүй байх болно!"
    exit 1
  fi
  
  echo ""
  echo "🗑️  Устгаж байна..."
  
  # Remove from filesystem
  rm -rf src/
  
  # Remove from git
  git rm -rf src/ 2>/dev/null || echo "Git дээр байхгүй"
  
  echo "✅ /src folder устгасан"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 STEP 2: Өөрчлөлтүүдийг шалгах"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

git status --short

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💾 STEP 3: Commit хийх"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

git add .

COMMIT_MSG="fix: Remove /src folder - Enforce root-level structure for Vercel"

git commit -m "$COMMIT_MSG"

if [ $? -ne 0 ]; then
  echo "⚠️  Commit амжилтгүй (магадгүй өөрчлөлт байхгүй)"
  
  # Check if there are any changes
  if git diff-index --quiet HEAD --; then
    echo "ℹ️  Өөрчлөлт байхгүй, push хийж байна..."
  else
    echo "❌ Commit хийх боломжгүй болсон"
    exit 1
  fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 STEP 4: GitHub руу push хийх"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

git push origin main

if [ $? -ne 0 ]; then
  echo "❌ Push амжилтгүй!"
  echo ""
  echo "Гараар push хийнэ үү:"
  echo "  git push origin main"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ SUCCESS! /src FOLDER УСТГАГДЛАА"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Local /src folder устгасан"
echo "✅ Git-с /src folder хассан"
echo "✅ GitHub-д push хийгдсэн"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 ОДОО: VERCEL REDEPLOY ХИЙХ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Vercel автоматаар redeploy хийхгүй байж магадгүй."
echo "Manual redeploy хийх:"
echo ""
echo "Option 1: Vercel Dashboard"
echo "──────────────────────────"
echo "1. Очих: https://vercel.com/dashboard"
echo "2. Project сонгох"
echo "3. Deployments tab"
echo "4. Latest deployment дээр '...' дарах"
echo "5. 'Redeploy' дарах"
echo "6. ✅ 'Use existing Build Cache' БИТГИЙ тэмдэглэ!"
echo "7. 'Redeploy' confirm хийх"
echo ""
echo "Option 2: Force New Deployment"
echo "───────────────────────────────"
echo "git commit --allow-empty -m 'trigger: Redeploy after /src removal'"
echo "git push origin main"
echo ""
echo "Option 3: Vercel CLI"
echo "────────────────────"
echo "vercel --prod --force"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 ХҮЛЭЭГДЭЖ БУЙ VERCEL BUILD OUTPUT:"
echo ""
echo "✅ npm install"
echo "   → tailwindcss@3.4.1 installed"
echo ""
echo "✅ npm run build"
echo "   → vite building..."
echo "   → ✓ dist/index.html created"
echo "   → ✓ dist/assets/*.css created"
echo "   → ✓ dist/assets/*.js created"
echo ""
echo "✅ Deployment ready"
echo "   → https://your-app.vercel.app"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 /src FOLDER УСТГАГДЛАА!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  Redeploy хийснээр Vercel build амжилттай болно!"
echo ""
