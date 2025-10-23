#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 VITE + VERCEL 'dist' OUTPUT VERIFICATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

HAS_ERROR=0

# Check 1: /src folder must NOT exist
echo "📁 1. Checking project structure..."
if [ -d "src" ]; then
  echo "❌ CRITICAL ERROR: /src folder exists!"
  echo "   This project MUST use root-level structure."
  echo "   Fix: rm -rf src/"
  echo ""
  HAS_ERROR=1
else
  echo "✅ No /src folder (correct - root-level structure)"
fi

# Check 2: vite.config.ts must be in root with outDir: 'dist'
echo ""
echo "⚙️  2. Checking vite.config.ts..."
if [ -f "vite.config.ts" ]; then
  echo "✅ vite.config.ts exists in root"
  
  if grep -q "outDir: 'dist'" vite.config.ts; then
    echo "   ✅ outDir: 'dist' ENFORCED"
  else
    echo "   ❌ CRITICAL ERROR: outDir: 'dist' NOT FOUND!"
    echo "   Current setting:"
    grep "outDir:" vite.config.ts || echo "   (outDir not specified)"
    echo "   Fix: Edit vite.config.ts and set outDir: 'dist'"
    HAS_ERROR=1
  fi
  
  if grep -q "assetsDir: 'assets'" vite.config.ts; then
    echo "   ✅ assetsDir: 'assets' configured"
  fi
else
  echo "❌ CRITICAL ERROR: vite.config.ts NOT in root!"
  HAS_ERROR=1
fi

# Check 3: No duplicate vite.config.ts in /src
if [ -f "src/vite.config.ts" ]; then
  echo "   ❌ CRITICAL ERROR: Duplicate vite.config.ts in /src!"
  echo "   Fix: rm src/vite.config.ts"
  HAS_ERROR=1
fi

# Check 4: vercel.json must match vite output
echo ""
echo "🌐 3. Checking vercel.json..."
if [ -f "vercel.json" ]; then
  echo "✅ vercel.json exists in root"
  
  if grep -q '"outputDirectory": "dist"' vercel.json; then
    echo "   ✅ outputDirectory: 'dist' ENFORCED (matches Vite)"
  else
    echo "   ❌ CRITICAL ERROR: outputDirectory: 'dist' NOT FOUND!"
    echo "   Current setting:"
    grep "outputDirectory" vercel.json || echo "   (outputDirectory not specified)"
    echo "   Fix: Edit vercel.json and set \"outputDirectory\": \"dist\""
    HAS_ERROR=1
  fi
  
  if grep -q '"buildCommand": "npm run build"' vercel.json; then
    echo "   ✅ buildCommand: 'npm run build'"
  fi
else
  echo "❌ CRITICAL ERROR: vercel.json NOT in root!"
  echo "   Fix: Create vercel.json with outputDirectory: 'dist'"
  HAS_ERROR=1
fi

# Check 5: tailwind.config.js must be in root
echo ""
echo "🎨 4. Checking tailwind.config.js..."
if [ -f "tailwind.config.js" ]; then
  echo "✅ tailwind.config.js exists in root"
  
  if grep -q "./src/\*\*" tailwind.config.js; then
    echo "   ⚠️  WARNING: tailwind.config.js references /src folder"
    echo "   This should be removed (no /src folder exists)"
    echo "   Recommendation: Use root-level paths only"
  else
    echo "   ✅ No /src paths (correct)"
  fi
else
  echo "❌ ERROR: tailwind.config.js NOT in root!"
  HAS_ERROR=1
fi

# Check 6: postcss.config.js
echo ""
echo "🔧 5. Checking postcss.config.js..."
if [ -f "postcss.config.js" ]; then
  echo "✅ postcss.config.js exists in root"
else
  echo "❌ ERROR: postcss.config.js NOT in root!"
  HAS_ERROR=1
fi

# Check 7: index.html
echo ""
echo "📄 6. Checking index.html..."
if [ -f "index.html" ]; then
  echo "✅ index.html exists in root"
  
  if grep -q 'src="/main.tsx"' index.html; then
    echo "   ✅ Script points to /main.tsx (correct for root structure)"
  elif grep -q 'src="/src/main.tsx"' index.html; then
    echo "   ❌ ERROR: Script points to /src/main.tsx but no /src exists!"
    echo "   Fix: Change to /main.tsx"
    HAS_ERROR=1
  else
    echo "   ⚠️  WARNING: Cannot find main.tsx script reference"
  fi
else
  echo "❌ CRITICAL ERROR: index.html NOT in root!"
  HAS_ERROR=1
fi

# Check 8: main.tsx entry point
echo ""
echo "🚀 7. Checking main.tsx entry point..."
if [ -f "main.tsx" ]; then
  echo "✅ main.tsx exists in root"
else
  echo "❌ CRITICAL ERROR: main.tsx NOT in root!"
  HAS_ERROR=1
fi

# Check 9: package.json dependencies
echo ""
echo "📦 8. Checking package.json..."
if [ -f "package.json" ]; then
  echo "✅ package.json exists"
  
  # Check Tailwind location
  if grep -A 20 '"dependencies"' package.json | grep -q '"tailwindcss"'; then
    echo "   ✅ tailwindcss in dependencies (correct for Vercel)"
  elif grep -A 20 '"devDependencies"' package.json | grep -q '"tailwindcss"'; then
    echo "   ⚠️  WARNING: tailwindcss in devDependencies"
    echo "   Recommendation: Move to dependencies for Vercel"
  else
    echo "   ❌ ERROR: tailwindcss not found!"
    HAS_ERROR=1
  fi
  
  # Check build script
  if grep -q '"build": "vite build"' package.json; then
    echo "   ✅ Build script: vite build"
  else
    echo "   ⚠️  WARNING: Build script may be incorrect"
  fi
else
  echo "❌ CRITICAL ERROR: package.json NOT found!"
  HAS_ERROR=1
fi

# Check 10: .gitignore
echo ""
echo "🙈 9. Checking .gitignore..."
if [ -f ".gitignore" ]; then
  echo "✅ .gitignore exists"
  
  if grep -q "dist/" .gitignore && grep -q "build/" .gitignore; then
    echo "   ✅ Ignores both dist/ and build/"
  elif grep -q "dist/" .gitignore; then
    echo "   ✅ Ignores dist/"
    echo "   ⚠️  Recommendation: Also ignore build/"
  else
    echo "   ⚠️  WARNING: Should ignore dist/ and build/"
  fi
else
  echo "⚠️  .gitignore missing (recommended to create)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Summary
if [ $HAS_ERROR -eq 0 ]; then
  echo "✅ ALL CRITICAL CHECKS PASSED!"
  echo ""
  echo "📊 Configuration Summary:"
  echo "   ✅ vite.config.ts → outDir: 'dist'"
  echo "   ✅ vercel.json → outputDirectory: 'dist'"
  echo "   ✅ Root-level structure (no /src)"
  echo "   ✅ All config files in root"
  echo ""
  echo "🚀 READY FOR DEPLOYMENT!"
  echo ""
  echo "Next steps:"
  echo "  1. npm run build (test local build)"
  echo "  2. ls -la dist/ (verify output)"
  echo "  3. git push origin main (deploy to Vercel)"
  echo ""
else
  echo "❌ ERRORS FOUND - MUST FIX BEFORE DEPLOYING!"
  echo ""
  echo "⚠️  CRITICAL: Fix the errors above before deploying to Vercel."
  echo ""
  echo "📚 See ENFORCE_DIST_OUTPUT.md for detailed configuration guide."
  echo ""
  exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"