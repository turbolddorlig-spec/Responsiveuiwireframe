#!/bin/bash

clear

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 AUTO FIX: vite.config.ts outDir → dist"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

CONFIG_FILE="vite.config.ts"

if [ ! -f "$CONFIG_FILE" ]; then
  echo "❌ $CONFIG_FILE олдсонгүй!"
  exit 1
fi

echo "📄 Файл: $CONFIG_FILE"
echo ""

# Check current outDir value
CURRENT_OUTDIR=$(grep -oP "outDir:\s*['\"]([^'\"]+)" "$CONFIG_FILE" | sed "s/outDir:\s*['\"]//")

if [ -z "$CURRENT_OUTDIR" ]; then
  echo "⚠️  outDir тохиргоо олдсонгүй!"
  echo ""
  echo "Одоогийн агуулга:"
  cat "$CONFIG_FILE"
  echo ""
  exit 1
fi

echo "🔍 Одоогийн утга: outDir: '$CURRENT_OUTDIR'"
echo ""

if [ "$CURRENT_OUTDIR" = "dist" ]; then
  echo "✅ ЗӨВӨӨР БАЙНА!"
  echo ""
  echo "outDir аль хэдийн 'dist' байна."
  echo "Засах шаардлагагүй."
  echo ""
  exit 0
fi

if [ "$CURRENT_OUTDIR" = "build" ]; then
  echo "🔨 ЗАСВАРЛАЖ БАЙНА..."
  echo ""
  echo "   build → dist"
  echo ""
  
  # Create backup
  cp "$CONFIG_FILE" "${CONFIG_FILE}.backup"
  echo "✓ Backup: ${CONFIG_FILE}.backup"
  
  # Replace build with dist
  sed -i.tmp "s/outDir:\s*['\"]build['\"]/outDir: 'dist'/g" "$CONFIG_FILE"
  rm -f "${CONFIG_FILE}.tmp"
  
  echo "✓ Файл шинэчилэгдсэн"
  echo ""
  
  # Verify
  NEW_OUTDIR=$(grep -oP "outDir:\s*['\"]([^'\"]+)" "$CONFIG_FILE" | sed "s/outDir:\s*['\"]//")
  
  if [ "$NEW_OUTDIR" = "dist" ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ АМЖИЛТТАЙ ЗАСВАРЛАСАН!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Хуучин: outDir: 'build'"
    echo "Шинэ:   outDir: 'dist'"
    echo ""
    echo "Backup файл: ${CONFIG_FILE}.backup"
    echo ""
    
    # Show the changed lines
    echo "Өөрчлөгдсөн мөр:"
    grep -n "outDir:" "$CONFIG_FILE"
    echo ""
    
    # Git status
    if git rev-parse --git-dir > /dev/null 2>&1; then
      echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
      echo "📦 GIT COMMIT?"
      echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
      echo ""
      
      read -p "Git commit хийх үү? (y/n) " -n 1 -r
      echo ""
      
      if [[ $REPLY =~ ^[YyТт]$ ]]; then
        git add "$CONFIG_FILE"
        git commit -m "fix: Auto-fix vite.config.ts outDir from 'build' to 'dist'

Vercel requires output directory to be 'dist'.
Changed outDir: 'build' → outDir: 'dist'

This ensures Vercel can find and deploy the build output."
        
        if [ $? -eq 0 ]; then
          echo ""
          echo "✓ Git commit амжилттай"
          echo ""
          
          read -p "GitHub руу push хийх үү? (y/n) " -n 1 -r
          echo ""
          
          if [[ $REPLY =~ ^[YyТт]$ ]]; then
            git push origin main
            
            if [ $? -eq 0 ]; then
              echo ""
              echo "✅ GitHub-д push хийгдлээ!"
              echo ""
              echo "⏳ Vercel автоматаар deploy хийж байна..."
              echo "   https://vercel.com/dashboard дээр шалгаарай"
            else
              echo ""
              echo "❌ Push амжилтгүй"
            fi
          fi
        else
          echo ""
          echo "❌ Commit амжилтгүй"
        fi
      else
        echo ""
        echo "ℹ️  Commit хийгдсэнгүй"
        echo ""
        echo "Дараа нь commit хийхдээ:"
        echo "  git add vite.config.ts"
        echo "  git commit -m 'fix: outDir build → dist'"
        echo "  git push origin main"
      fi
    fi
    
  else
    echo "❌ АЛДАА: Засвар амжилтгүй"
    echo ""
    echo "Одоогийн утга: $NEW_OUTDIR"
    echo ""
    echo "Backup-с сэргээх:"
    echo "  cp ${CONFIG_FILE}.backup $CONFIG_FILE"
    exit 1
  fi
  
else
  echo "⚠️  UNEXPECTED VALUE: '$CURRENT_OUTDIR'"
  echo ""
  echo "Хүлээгдсэн: 'build' эсвэл 'dist'"
  echo "Олдсон:     '$CURRENT_OUTDIR'"
  echo ""
  echo "Гараар засварлах шаардлагатай байж магадгүй."
  echo ""
  
  echo "Одоогийн агуулга:"
  cat "$CONFIG_FILE"
  echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
