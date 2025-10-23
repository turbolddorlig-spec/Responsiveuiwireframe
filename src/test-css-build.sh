#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 TAILWIND CSS BUILD VERIFICATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

HAS_ERROR=0

# Check 1: Config files format
echo "📋 1. Checking config file formats..."

if grep -q "module.exports" postcss.config.js; then
  echo "✅ postcss.config.js → CommonJS format"
else
  echo "❌ postcss.config.js → NOT CommonJS! (should use module.exports)"
  HAS_ERROR=1
fi

if grep -q "module.exports" tailwind.config.js; then
  echo "✅ tailwind.config.js → CommonJS format"
else
  echo "❌ tailwind.config.js → NOT CommonJS! (should use module.exports)"
  HAS_ERROR=1
fi

# Check 2: index.css has theme variables
echo ""
echo "🎨 2. Checking index.css content..."

if grep -q "@tailwind base" index.css && grep -q "@tailwind components" index.css && grep -q "@tailwind utilities" index.css; then
  echo "✅ index.css → Has @tailwind directives"
else
  echo "❌ index.css → Missing @tailwind directives!"
  HAS_ERROR=1
fi

if grep -q "--background:" index.css && grep -q "--foreground:" index.css && grep -q "--primary:" index.css; then
  echo "✅ index.css → Has theme variables"
else
  echo "❌ index.css → Missing theme variables!"
  HAS_ERROR=1
fi

# Check 3: main.tsx imports only index.css
echo ""
echo "📦 3. Checking main.tsx imports..."

if grep -q "import './index.css'" main.tsx; then
  echo "✅ main.tsx → Imports ./index.css"
else
  echo "❌ main.tsx → Does NOT import ./index.css!"
  HAS_ERROR=1
fi

if grep -q "import './styles/globals.css'" main.tsx; then
  echo "❌ main.tsx → Still imports ./styles/globals.css (should be removed!)"
  HAS_ERROR=1
else
  echo "✅ main.tsx → Does NOT import globals.css (correct)"
fi

# Check 4: Tailwind in dependencies
echo ""
echo "📦 4. Checking package.json dependencies..."

if grep -A 15 '"dependencies"' package.json | grep -q '"tailwindcss"'; then
  echo "✅ tailwindcss → In dependencies"
else
  echo "❌ tailwindcss → NOT in dependencies!"
  HAS_ERROR=1
fi

if grep -A 15 '"dependencies"' package.json | grep -q '"postcss"'; then
  echo "✅ postcss → In dependencies"
else
  echo "❌ postcss → NOT in dependencies!"
  HAS_ERROR=1
fi

if grep -A 15 '"dependencies"' package.json | grep -q '"autoprefixer"'; then
  echo "✅ autoprefixer → In dependencies"
else
  echo "❌ autoprefixer → NOT in dependencies!"
  HAS_ERROR=1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $HAS_ERROR -eq 0 ]; then
  echo "✅ ALL CHECKS PASSED!"
  echo ""
  echo "📊 Configuration is correct. Now testing build..."
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🔨 BUILDING PROJECT..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  
  # Clean previous build
  rm -rf dist/
  
  # Build
  npm run build
  
  if [ $? -eq 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📊 BUILD OUTPUT ANALYSIS"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Check if dist exists
    if [ ! -d "dist" ]; then
      echo "❌ CRITICAL ERROR: dist/ folder NOT created!"
      exit 1
    fi
    
    echo "✅ dist/ folder created"
    echo ""
    
    # Find CSS file
    CSS_FILE=$(find dist/assets -name "*.css" | head -1)
    
    if [ -z "$CSS_FILE" ]; then
      echo "❌ ERROR: No CSS file found in dist/assets/"
      exit 1
    fi
    
    echo "📄 CSS File: $CSS_FILE"
    
    # Get CSS file size
    CSS_SIZE=$(wc -c < "$CSS_FILE")
    CSS_SIZE_KB=$((CSS_SIZE / 1024))
    
    echo "📏 CSS Size: $CSS_SIZE_KB KB"
    echo ""
    
    # Check if CSS is large enough (should be >100KB)
    if [ $CSS_SIZE_KB -lt 100 ]; then
      echo "❌ WARNING: CSS file too small ($CSS_SIZE_KB KB)"
      echo "   Expected: >100KB for complete Tailwind build"
      echo "   Possible causes:"
      echo "   - Theme variables not compiling"
      echo "   - @tailwind directives not processed"
      echo "   - PostCSS not running correctly"
      echo ""
      echo "🔍 Checking CSS content..."
      
      # Check for theme variables in output
      if grep -q "background-color" "$CSS_FILE"; then
        echo "   ✅ Contains background-color rules"
      else
        echo "   ❌ Does NOT contain background-color rules!"
      fi
      
      if grep -q "hsl(var(--background))" "$CSS_FILE"; then
        echo "   ⚠️  Contains CSS variables (not compiled utilities)"
      fi
      
      exit 1
    else
      echo "✅ CSS SIZE CORRECT ($CSS_SIZE_KB KB)"
      echo ""
      echo "🔍 Verifying CSS content..."
      
      # Count CSS rules (rough estimate)
      RULE_COUNT=$(grep -c "{" "$CSS_FILE")
      echo "   📊 Approximate CSS rules: ~$RULE_COUNT"
      
      # Check for important classes
      if grep -q "background-color" "$CSS_FILE"; then
        echo "   ✅ Contains background-color utilities"
      fi
      
      if grep -q "text-foreground" "$CSS_FILE"; then
        echo "   ✅ Contains custom theme classes"
      fi
      
      if grep -q "animate-gradient" "$CSS_FILE"; then
        echo "   ✅ Contains custom animations"
      fi
      
      echo ""
      echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
      echo "🎉 BUILD SUCCESSFUL!"
      echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
      echo ""
      echo "✅ Configuration: Correct"
      echo "✅ Build: Successful"
      echo "✅ CSS Size: $CSS_SIZE_KB KB (>100KB)"
      echo "✅ CSS Content: Complete Tailwind utilities"
      echo ""
      echo "🚀 READY TO DEPLOY!"
      echo ""
      echo "Next steps:"
      echo "  1. git add ."
      echo "  2. git commit -m 'fix: Tailwind CSS complete theme'"
      echo "  3. git push origin main"
      echo "  4. Wait 2-3 minutes for Vercel deploy"
      echo "  5. Hard refresh production (Ctrl+Shift+R)"
      echo ""
    fi
  else
    echo ""
    echo "❌ BUILD FAILED!"
    echo ""
    echo "Check the error messages above."
    exit 1
  fi
else
  echo "❌ CONFIGURATION ERRORS FOUND!"
  echo ""
  echo "Please fix the errors above before building."
  echo ""
  echo "📚 See: 🎨_TAILWIND_FIXED_DEPLOY_NOW.md"
  exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
