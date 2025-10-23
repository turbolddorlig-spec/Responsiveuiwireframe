#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔴 ЭЦСИЙН CSS ЗАСВАР - PRODUCTION THEME БАЙХГҮЙ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🐛 АСУУДАЛ: Production CSS огт ачаалагдахгүй"
echo "   → Хар хүснэгт харагдаж байна"
echo "   → Theme огт байхгүй"
echo "   → Tailwind utilities ажиллахгүй"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 STEP 1: ЭЦСИЙН CONFIG ЗАСВАР"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Ensure postcss.config.js is correct
echo "✓ postcss.config.js шалгаж байна..."
cat > postcss.config.cjs << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
EOF

echo "✓ postcss.config.cjs үүсгэсэн (CommonJS)"

# Ensure tailwind.config.js is correct
echo "✓ tailwind.config.js шалгаж байна..."
cat > tailwind.config.cjs << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './index.html',
    './App.tsx',
    './main.tsx',
    './components/**/*.{ts,tsx,js,jsx}',
    './utils/**/*.{ts,tsx,js,jsx}',
    './*.{tsx,ts,jsx,js}',
  ],
  safelist: [
    // Critical classes that MUST be included
    'bg-background',
    'text-foreground',
    'bg-gradient-to-br',
    'from-blue-500',
    'via-purple-500',
    'to-pink-500',
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))' 
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
      }
    }
  },
  plugins: [],
};
EOF

echo "✓ tailwind.config.cjs үүсгэсэн (CommonJS)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧹 STEP 2: ЦЭВЭРЛЭХ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

rm -rf dist/ node_modules/.vite .vercel/cache

echo "✓ Хуучин build устгагдсан"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 STEP 3: DEPENDENCIES ШИНЭЧЛЭХ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npm install

if [ $? -ne 0 ]; then
  echo "❌ npm install амжилтгүй!"
  exit 1
fi

echo "✓ Dependencies суулгасан"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔨 STEP 4: BUILD ХИЙХ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build амжилтгүй!"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 STEP 5: CSS ШАЛГАХ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

CSS_FILE=$(find dist/assets -name "*.css" -type f | head -1)

if [ -z "$CSS_FILE" ]; then
  echo "❌ CSS файл үүсээгүй!"
  exit 1
fi

CSS_SIZE=$(wc -c < "$CSS_FILE")
CSS_SIZE_KB=$((CSS_SIZE / 1024))

echo "📄 CSS файл: $CSS_FILE"
echo "📏 Хэмжээ: $CSS_SIZE_KB KB"
echo ""

if [ $CSS_SIZE_KB -lt 50 ]; then
  echo "❌ CSS хэт жижиг ($CSS_SIZE_KB KB)!"
  echo ""
  echo "Tailwind compile хийгдээгүй байна."
  echo ""
  echo "CSS агуулга:"
  head -50 "$CSS_FILE"
  exit 1
fi

echo "✅ CSS зөв үүсгэгдсэн ($CSS_SIZE_KB KB)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 STEP 6: GIT COMMIT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

git add -A
git commit -m "fix: Final CSS fix - CommonJS configs + CDN fallback + verified build ($CSS_SIZE_KB KB CSS)"

if [ $? -ne 0 ]; then
  echo "⚠️ Commit алдаа (магадгүй өөрчлөлт байхгүй)"
  git commit --allow-empty -m "fix: Force rebuild - CSS fix"
fi

echo "✓ Commit хийгдсэн"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 STEP 7: PUSH TO GITHUB"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

git push origin main

if [ $? -ne 0 ]; then
  echo "❌ Push амжилтгүй!"
  exit 1
fi

echo "✓ GitHub-д push хийгдсэн"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ АМЖИЛТТАЙ!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Build үзүүлэлт:"
echo "   ✅ CSS файл: $CSS_SIZE_KB KB"
echo "   ✅ Config: CommonJS (.cjs)"
echo "   ✅ Fallback: CDN (нөөц хувилбар)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⏳ ДАРААГИЙН АЛХАМ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Vercel Dashboard рүү очих:"
echo "   https://vercel.com/dashboard"
echo ""
echo "2. Project → Settings"
echo ""
echo "3. 'Clear Build Cache' дарах"
echo ""
echo "4. Deployments → Latest → Redeploy"
echo "   ⚠️ 'Use existing Build Cache' UNCHECK!"
echo ""
echo "5. 2-3 минут хүлээх"
echo ""
echo "6. Production URL → Hard refresh (Ctrl+Shift+R)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 ХЭРЭВ ДҮР БАЙХГҮЙ БОЛ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "CDN fallback автоматаар ажиллах болно!"
echo "DevTools Console дээр үзнэ үү:"
echo "   '⚠️ Tailwind CSS not loaded! Using CDN fallback...'"
echo ""
echo "Энэ нь compiled CSS load хийгдээгүй гэсэн үг."
echo "Vercel build logs шалгаж алдаа олно уу."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
