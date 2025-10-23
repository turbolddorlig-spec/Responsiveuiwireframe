#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 FIX: Vite Output Directory (build → dist)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "❌ Problem: Vite building to build/ instead of dist/"
echo "✅ Fix: Updated vite.config.ts to explicitly use dist/"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Clean old build folders
echo "🧹 Step 1: Cleaning old build folders..."
rm -rf build/ dist/
echo "✅ Cleaned"
echo ""

# Test build locally (optional)
read -p "🧪 Test build locally first? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "🔨 Building locally..."
  npm run build
  
  if [ $? -ne 0 ]; then
    echo "❌ Build failed locally! Fix errors and try again."
    exit 1
  fi
  
  echo ""
  echo "📁 Build output:"
  ls -la dist/
  
  if [ ! -d "dist" ]; then
    echo "❌ dist/ folder not created! Check vite.config.ts"
    exit 1
  fi
  
  if [ ! -f "dist/index.html" ]; then
    echo "❌ dist/index.html not found!"
    exit 1
  fi
  
  echo "✅ Local build successful! Output in dist/"
  echo ""
  
  # Clean for Vercel
  rm -rf dist/
fi

# Git status
echo "📝 Current Git status:"
git status
echo ""

# Confirm deployment
read -p "🚀 Ready to commit and deploy to Vercel? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Deployment cancelled"
  exit 0
fi

# Add files
echo "➕ Adding files..."
git add vite.config.ts .gitignore

# Commit
echo "💾 Committing..."
git commit -m "fix: Set Vite outDir to 'dist' explicitly

- Simplified vite.config.ts for clarity
- Set outDir: 'dist' (was building to 'build/')
- Added emptyOutDir: true for clean builds
- Created .gitignore to exclude build folders
- Fixes Vercel 'No Output Directory named dist' error

This ensures Vite builds to dist/ folder as expected by Vercel."

if [ $? -ne 0 ]; then
  echo "⚠️  Commit failed (maybe no changes?)"
  echo "Continuing to push..."
fi

# Push
echo "🚀 Pushing to GitHub..."
git push origin main

if [ $? -ne 0 ]; then
  echo "❌ Push failed! Check your credentials and try again."
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ DEPLOYMENT INITIATED!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⏳ Vercel is building... (1-2 minutes)"
echo ""
echo "✅ Expected Vercel output:"
echo "   dist/index.html          (not build/index.html)"
echo "   dist/assets/*.css"
echo "   dist/assets/*.js"
echo ""
echo "📊 Check build status:"
echo "   https://vercel.com/your-username/your-project/deployments"
echo ""
echo "🌐 Production URL:"
echo "   https://your-project.vercel.app"
echo ""
echo "🔍 Verify in Vercel logs:"
echo "   ✓ vite v6.3.5 building..."
echo "   ✓ dist/index.html created (not build/)"
echo "   ✓ Deployment ready"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Done! Check Vercel dashboard."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
