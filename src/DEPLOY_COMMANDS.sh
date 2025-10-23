#!/bin/bash

# 🚀 VERCEL DEPLOYMENT SCRIPT
# This script will test, commit, and deploy your project to Vercel

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 VERCEL DEPLOYMENT - LOGISTICS SYSTEM"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 1: Clean previous builds
echo "📦 Step 1: Cleaning previous builds..."
rm -rf dist/ node_modules/.vite build/
echo "✅ Clean completed"
echo ""

# Step 2: Build project
echo "🔨 Step 2: Building project..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed! Please fix errors and try again."
  exit 1
fi

echo "✅ Build successful"
echo ""

# Step 3: Verify dist/ folder
echo "🔍 Step 3: Verifying dist/ folder..."
if [ ! -d "dist" ]; then
  echo "❌ dist/ folder not found! Check vite.config.ts"
  exit 1
fi

if [ ! -f "dist/index.html" ]; then
  echo "❌ dist/index.html not found!"
  exit 1
fi

echo "✅ dist/ folder verified"
ls -lah dist/
echo ""

# Step 4: Check CSS contains animations
echo "🎨 Step 4: Checking animations in CSS..."
if grep -r "animate-gradient" dist/assets/*.css > /dev/null; then
  echo "✅ Animations found in CSS!"
else
  echo "⚠️  Warning: Animations not found in CSS. Check tailwind.config.js"
fi
echo ""

# Step 5: Git status
echo "📝 Step 5: Git status..."
git status
echo ""

# Step 6: Ask for confirmation
read -p "🤔 Ready to commit and push to GitHub? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Deployment cancelled"
  exit 0
fi

# Step 7: Git add
echo "➕ Step 7: Adding files to Git..."
git add .
echo "✅ Files added"
echo ""

# Step 8: Git commit
echo "💾 Step 8: Committing changes..."
git commit -m "fix: Configure Vercel deployment with animations

- vite.config.ts: Set outDir to 'dist' for Vercel
- tailwind.config.js: Add custom animations (gradient, blob, pulse-slow)
- tailwind.config.js: Configure keyframes and animation delays
- Add .gitignore to exclude build artifacts
- Project structure verified and Vercel-ready
- All config files in project root
- Theme animations configured for login page"

if [ $? -ne 0 ]; then
  echo "⚠️  Commit failed (maybe no changes?)"
  echo "Continuing to push..."
fi
echo ""

# Step 9: Git push
echo "🚀 Step 9: Pushing to GitHub..."
git push origin main

if [ $? -ne 0 ]; then
  echo "❌ Push failed! Check your Git credentials and try again."
  echo "You can manually run: git push origin main"
  exit 1
fi

echo "✅ Pushed to GitHub successfully"
echo ""

# Step 10: Done
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 DEPLOYMENT INITIATED!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⏳ Vercel will auto-deploy in 1-2 minutes"
echo ""
echo "📍 Check deployment status:"
echo "   https://vercel.com/your-username/your-project/deployments"
echo ""
echo "🌐 Your production URL:"
echo "   https://your-project.vercel.app"
echo ""
echo "✅ What to verify:"
echo "   - Animated gradient background (blue → purple → pink)"
echo "   - 3 floating blobs (yellow, purple, pink)"
echo "   - Glassmorphism login card"
echo "   - Pulsing logo"
echo "   - Demo Mode works (99000000 / super123)"
echo ""
echo "🔄 Hard refresh browser after deployment:"
echo "   Chrome: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)"
echo "   Firefox: Ctrl+F5"
echo "   Safari: Cmd+Option+R"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Happy deploying! ✨"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
