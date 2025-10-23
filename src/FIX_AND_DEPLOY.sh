#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 VERCEL BUILD FIX - Deploy Now"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Fixed: Moved Tailwind CSS to dependencies"
echo "   (was in devDependencies, causing Vercel build to fail)"
echo ""
echo "📦 Updated package.json:"
echo "   ✅ tailwindcss → dependencies"
echo "   ✅ autoprefixer → dependencies"
echo "   ✅ postcss → dependencies"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check for /src folder
if [ -d "src" ]; then
  echo "⚠️  WARNING: /src folder detected!"
  echo "   Your project uses root-level structure, not /src"
  echo ""
  read -p "   Remove /src folder? (y/n) " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "   🗑️  Removing /src folder..."
    rm -rf src/
    echo "   ✅ /src folder removed"
    echo ""
  fi
fi

# Git status
echo "📝 Current Git status:"
git status
echo ""

# Confirm deployment
read -p "🚀 Ready to commit and deploy? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Deployment cancelled"
  exit 0
fi

# Add files
echo "➕ Adding files..."
git add package.json

# If src was removed, add that too
if [ ! -d "src" ]; then
  git add -A
fi

# Commit
echo "💾 Committing..."
git commit -m "fix: Move Tailwind CSS to dependencies for Vercel build

- Moved tailwindcss from devDependencies to dependencies
- Moved autoprefixer from devDependencies to dependencies  
- Moved postcss from devDependencies to dependencies
- Fixes 'Cannot find module tailwindcss' error on Vercel
- Removed /src folder if it existed (using root-level structure)"

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
echo "📊 Check build status:"
echo "   https://vercel.com/your-username/your-project/deployments"
echo ""
echo "🌐 Production URL:"
echo "   https://your-project.vercel.app"
echo ""
echo "✅ Expected result:"
echo "   ✓ Build succeeds (no 'Cannot find module' error)"
echo "   ✓ Tailwind CSS processed successfully"
echo "   ✓ Animations visible on production"
echo "   ✓ Login page with gradient background"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Done! Check Vercel dashboard for build status."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
