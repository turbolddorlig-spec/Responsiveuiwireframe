#!/bin/bash

clear

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 PRE-DEPLOY CHECK - AUTO FIX"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

ERRORS=0

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "CHECK 1: vite.config.ts outDir"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ ! -f "vite.config.ts" ]; then
  echo "❌ vite.config.ts олдсонгүй!"
  ((ERRORS++))
else
  # Check for outDir value
  if grep -q "outDir:\s*['\"]build['\"]" vite.config.ts; then
    echo "⚠️  БУРУУ: outDir: 'build'"
    echo ""
    echo "🔨 AUTO FIX хийж байна..."
    
    # Auto fix
    sed -i.tmp "s/outDir:\s*['\"]build['\"]/outDir: 'dist'/g" vite.config.ts
    rm -f vite.config.ts.tmp
    
    # Verify
    if grep -q "outDir:\s*['\"]dist['\"]" vite.config.ts; then
      echo "✅ ЗАСВАРЛАСАН: outDir: 'dist'"
    else
      echo "❌ AUTO FIX амжилтгүй!"
      ((ERRORS++))
    fi
  elif grep -q "outDir:\s*['\"]dist['\"]" vite.config.ts; then
    echo "✅ ЗӨВӨӨР: outDir: 'dist'"
  else
    echo "⚠️  outDir тохиргоо олдсонгүй эсвэл өөр утгатай"
    grep -n "outDir" vite.config.ts || echo "   (outDir тохиргоо байхгүй)"
    ((ERRORS++))
  fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "CHECK 2: vercel.json outputDirectory"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ ! -f "vercel.json" ]; then
  echo "❌ vercel.json олдсонгүй!"
  ((ERRORS++))
else
  if grep -q '"outputDirectory":\s*"build"' vercel.json; then
    echo "⚠️  БУРУУ: outputDirectory: 'build'"
    echo ""
    echo "🔨 AUTO FIX хийж байна..."
    
    # Auto fix
    sed -i.tmp 's/"outputDirectory":\s*"build"/"outputDirectory": "dist"/g' vercel.json
    rm -f vercel.json.tmp
    
    # Verify
    if grep -q '"outputDirectory":\s*"dist"' vercel.json; then
      echo "✅ ЗАСВАРЛАСАН: outputDirectory: 'dist'"
    else
      echo "❌ AUTO FIX амжилтгүй!"
      ((ERRORS++))
    fi
  elif grep -q '"outputDirectory":\s*"dist"' vercel.json; then
    echo "✅ ЗӨВӨӨР: outputDirectory: 'dist'"
  else
    echo "⚠️  outputDirectory тохиргоо олдсонгүй эсвэл өөр утгатай"
    grep -n "outputDirectory" vercel.json || echo "   (outputDirectory тохиргоо байхгүй)"
  fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "CHECK 3: PostCSS Config"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check for duplicate configs
JS_EXISTS=0
CJS_EXISTS=0

if [ -f "postcss.config.js" ]; then
  echo "⚠️  postcss.config.js байна"
  JS_EXISTS=1
fi

if [ -f "postcss.config.cjs" ]; then
  echo "✅ postcss.config.cjs байна"
  CJS_EXISTS=1
fi

if [ $JS_EXISTS -eq 1 ] && [ $CJS_EXISTS -eq 1 ]; then
  echo ""
  echo "❌ DUPLICATE: Хоёр config файл байна!"
  echo ""
  echo "🔨 AUTO FIX: .js файл устгаж байна..."
  rm -f postcss.config.js
  echo "✅ postcss.config.js устгасан"
elif [ $CJS_EXISTS -eq 1 ]; then
  echo "✅ Зөвхөн .cjs файл байна"
elif [ $JS_EXISTS -eq 1 ]; then
  echo "⚠️  Зөвхөн .js файл байна (.cjs байх ёстой!)"
  ((ERRORS++))
else
  echo "❌ PostCSS config файл байхгүй!"
  ((ERRORS++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "CHECK 4: Tailwind Config"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check for duplicate configs
JS_EXISTS=0
CJS_EXISTS=0

if [ -f "tailwind.config.js" ]; then
  echo "⚠️  tailwind.config.js байна"
  JS_EXISTS=1
fi

if [ -f "tailwind.config.cjs" ]; then
  echo "✅ tailwind.config.cjs байна"
  CJS_EXISTS=1
fi

if [ $JS_EXISTS -eq 1 ] && [ $CJS_EXISTS -eq 1 ]; then
  echo ""
  echo "❌ DUPLICATE: Хоёр config файл байна!"
  echo ""
  echo "🔨 AUTO FIX: .js файл устгаж байна..."
  rm -f tailwind.config.js
  echo "✅ tailwind.config.js устгасан"
elif [ $CJS_EXISTS -eq 1 ]; then
  echo "✅ Зөвхөн .cjs файл байна"
elif [ $JS_EXISTS -eq 1 ]; then
  echo "⚠️  Зөвхөн .js файл байна (.cjs байх ёстой!)"
  ((ERRORS++))
else
  echo "❌ Tailwind config файл байхгүй!"
  ((ERRORS++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "CHECK 5: CSS Import"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ ! -f "main.tsx" ]; then
  echo "❌ main.tsx олдсонгүй!"
  ((ERRORS++))
else
  if grep -q "import.*['\"].*index\.css['\"]" main.tsx; then
    echo "✅ main.tsx: index.css import байна"
  else
    echo "❌ main.tsx: index.css import байхгүй!"
    ((ERRORS++))
  fi
fi

if [ ! -f "index.css" ]; then
  echo "❌ index.css олдсонгүй!"
  ((ERRORS++))
else
  if grep -q "@tailwind" index.css; then
    echo "✅ index.css: Tailwind directives байна"
  else
    echo "❌ index.css: Tailwind directives байхгүй!"
    ((ERRORS++))
  fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "ҮНЭЛГЭЭ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $ERRORS -eq 0 ]; then
  echo "✅ БҮХ ШАЛГАЛТ АМЖИЛТТАЙ!"
  echo ""
  echo "Vercel deploy хийхэд бэлэн."
  echo ""
  
  # Show summary
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "ТОХИРГОО:"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "✓ vite.config.ts → outDir: 'dist'"
  echo "✓ vercel.json → outputDirectory: 'dist'"
  echo "✓ postcss.config.cjs (зөвхөн .cjs)"
  echo "✓ tailwind.config.cjs (зөвхөн .cjs)"
  echo "✓ main.tsx → import './index.css'"
  echo "✓ index.css → @tailwind directives"
  echo ""
  
  exit 0
else
  echo "❌ $ERRORS АЛДАА ОЛДЛОО!"
  echo ""
  echo "Дээрх асуудлуудыг засаарай."
  echo ""
  exit 1
fi
