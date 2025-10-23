#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 ENFORCED VERCEL DEPLOYMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This script enforces 'dist/' output for Vercel deployment."
echo ""

# Step 1: Verify configuration
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 STEP 1: Verifying Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

bash verify-config.sh

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Configuration verification FAILED!"
  echo "Please fix the errors above before deploying."
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧹 STEP 2: Cleaning Previous Builds"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -d "dist" ] || [ -d "build" ]; then
  echo "Removing old build directories..."
  rm -rf dist/ build/
  echo "✅ Cleaned"
else
  echo "✅ No previous builds to clean"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔨 STEP 3: Building for Production"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npm run build

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Build FAILED!"
  echo "Please fix build errors before deploying."
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 STEP 4: Verifying Build Output"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check dist/ folder exists
if [ ! -d "dist" ]; then
  echo "❌ CRITICAL ERROR: dist/ folder NOT created!"
  
  if [ -d "build" ]; then
    echo "❌ ERROR: build/ folder created instead!"
    echo "Your vite.config.ts is configured incorrectly."
    echo "Fix: Set outDir: 'dist' in vite.config.ts"
  fi
  
  exit 1
fi

echo "✅ dist/ folder created"

# Check dist/index.html
if [ ! -f "dist/index.html" ]; then
  echo "❌ ERROR: dist/index.html NOT found!"
  exit 1
fi
echo "✅ dist/index.html exists"

# Check dist/assets/
if [ ! -d "dist/assets" ]; then
  echo "❌ ERROR: dist/assets/ folder NOT found!"
  exit 1
fi
echo "✅ dist/assets/ folder exists"

# Count CSS and JS files
CSS_COUNT=$(find dist/assets -name "*.css" 2>/dev/null | wc -l)
JS_COUNT=$(find dist/assets -name "*.js" 2>/dev/null | wc -l)

echo "   📦 CSS files: $CSS_COUNT"
echo "   📦 JS files: $JS_COUNT"

if [ $CSS_COUNT -eq 0 ]; then
  echo "⚠️  WARNING: No CSS files found in dist/assets/"
fi

if [ $JS_COUNT -eq 0 ]; then
  echo "❌ ERROR: No JS files found in dist/assets/"
  exit 1
fi

echo ""
echo "📂 Build output:"
ls -lh dist/ | head -10
echo ""
ls -lh dist/assets/ | head -10

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ BUILD VERIFICATION COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Build Summary:"
echo "  ✅ dist/ folder created (NOT build/)"
echo "  ✅ dist/index.html exists"
echo "  ✅ dist/assets/*.css exists ($CSS_COUNT files)"
echo "  ✅ dist/assets/*.js exists ($JS_COUNT files)"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📤 STEP 5: Git Status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

git status --short

echo ""
read -p "🤔 Commit and push to GitHub? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[YyТт]$ ]]; then
  echo ""
  echo "⏸️  Deployment paused."
  echo ""
  echo "✅ Build successful! You can deploy manually:"
  echo "  1. git add ."
  echo "  2. git commit -m 'Deploy to Vercel'"
  echo "  3. git push origin main"
  echo "  4. Visit https://vercel.com/new"
  echo ""
  exit 0
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💾 STEP 6: Git Commit"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

git add .

read -p "📝 Commit message (or press Enter for default): " COMMIT_MSG

if [ -z "$COMMIT_MSG" ]; then
  COMMIT_MSG="deploy: Enforced dist/ output - Ready for Vercel"
fi

git commit -m "$COMMIT_MSG"

if [ $? -ne 0 ]; then
  echo "⚠️  Commit failed (possibly no changes)"
  echo "Continuing to push..."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 STEP 7: Pushing to GitHub"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

git push origin main

if [ $? -ne 0 ]; then
  echo "❌ Push failed!"
  echo "Possible reasons:"
  echo "  - GitHub credentials not configured"
  echo "  - Network connection issue"
  echo "  - Remote repository not found"
  echo ""
  echo "Fix and run: git push origin main"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 DEPLOYMENT READY!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Configuration verified"
echo "✅ Build successful → dist/"
echo "✅ Output verified"
echo "✅ Pushed to GitHub"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 NEXT: DEPLOY TO VERCEL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Option 1: Vercel CLI"
echo "────────────���───────"
echo "npm install -g vercel"
echo "vercel login"
echo "vercel --prod"
echo ""
echo "Option 2: Vercel Dashboard"
echo "──────────────────────────"
echo "1. Visit: https://vercel.com/new"
echo "2. Click 'Import Git Repository'"
echo "3. Select your repository"
echo "4. Click 'Deploy'"
echo "5. Wait 2-3 minutes"
echo "6. ✅ Production URL!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Expected Vercel Build Process:"
echo "  [1/4] Installing dependencies"
echo "        ✓ npm install"
echo "        ✓ tailwindcss installed"
echo "  [2/4] Building application"
echo "        ✓ npm run build"
echo "        ✓ dist/index.html created     ← CRITICAL"
echo "        ✓ dist/assets/*.css created    ← CRITICAL"
echo "        ✓ dist/assets/*.js created     ← CRITICAL"
echo "  [3/4] Uploading to CDN"
echo "        ✓ Uploading dist/ folder       ← CRITICAL"
echo "  [4/4] Deployment ready"
echo "        ✓ https://your-app.vercel.app"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ALL DONE! DEPLOY TO VERCEL NOW!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
