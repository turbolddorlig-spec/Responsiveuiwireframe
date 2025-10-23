#!/bin/bash

clear

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 GIT SETUP & PUSH - AUTO SETUP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git суулгаагүй байна!${NC}"
    echo ""
    echo "Git суулгаарай:"
    echo "  https://git-scm.com/downloads"
    exit 1
fi

echo -e "${GREEN}✓ Git installed${NC}"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 1: GIT CONFIG ШАЛГАХ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check git config
GIT_NAME=$(git config --global user.name 2>/dev/null)
GIT_EMAIL=$(git config --global user.email 2>/dev/null)

if [ -z "$GIT_NAME" ] || [ -z "$GIT_EMAIL" ]; then
    echo -e "${YELLOW}⚠️  Git config тохируулаагүй байна${NC}"
    echo ""
    
    read -p "Нэр оруулах: " INPUT_NAME
    read -p "Email оруулах: " INPUT_EMAIL
    
    git config --global user.name "$INPUT_NAME"
    git config --global user.email "$INPUT_EMAIL"
    
    echo ""
    echo -e "${GREEN}✓ Git config хадгалагдсан${NC}"
else
    echo -e "${GREEN}✓ Git config:${NC}"
    echo "  Нэр:   $GIT_NAME"
    echo "  Email: $GIT_EMAIL"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 2: GIT REPOSITORY ШАЛГАХ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -d ".git" ]; then
    echo -e "${GREEN}✓ Git repository аль хэдийн initialized${NC}"
    
    # Check for remote
    if git remote -v | grep -q "origin"; then
        CURRENT_REMOTE=$(git remote get-url origin)
        echo -e "${GREEN}✓ Remote repository configured:${NC}"
        echo "  $CURRENT_REMOTE"
        echo ""
        
        read -p "Remote URL солих уу? (y/n) " -n 1 -r
        echo ""
        
        if [[ $REPLY =~ ^[YyТт]$ ]]; then
            read -p "Шинэ GitHub repo URL: " NEW_REMOTE
            git remote set-url origin "$NEW_REMOTE"
            echo -e "${GREEN}✓ Remote URL шинэчилэгдсэн${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Remote repository configured байхгүй${NC}"
        echo ""
        read -p "GitHub repo URL оруулах: " REMOTE_URL
        git remote add origin "$REMOTE_URL"
        echo -e "${GREEN}✓ Remote added${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Git repository initialized байхгүй${NC}"
    echo ""
    echo "Initializing..."
    
    git init
    echo -e "${GREEN}✓ Git initialized${NC}"
    echo ""
    
    read -p "GitHub repo URL оруулах: " REMOTE_URL
    git remote add origin "$REMOTE_URL"
    echo -e "${GREEN}✓ Remote added${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 3: ФАЙЛУУД ЦЭВЭРЛЭХ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Count .md files
MD_COUNT=$(find . -maxdepth 1 -name "*.md" -o -name "*.MD" | wc -l)
echo "📄 Root folder дээр .md файл: $MD_COUNT"

if [ $MD_COUNT -gt 10 ]; then
    echo ""
    echo -e "${YELLOW}⚠️  Хэт олон .md файл байна!${NC}"
    echo ""
    echo "Сонголтууд:"
    echo "  1) Docs folder үүсгэж буулгах (санал болгож байна)"
    echo "  2) Үлдээх (commit хийхэд удаан байх)"
    echo "  3) Устгах (АЮУЛТАЙ!)"
    echo ""
    read -p "Сонголт (1/2/3): " -n 1 -r
    echo ""
    
    if [[ $REPLY == "1" ]]; then
        mkdir -p docs
        
        # Move all .md except important ones
        KEEP_FILES=("README.md" "FEATURES.md" "CREDENTIALS.md" "QUICKSTART.md")
        
        for file in *.md *.MD 2>/dev/null; do
            if [[ -f "$file" ]]; then
                # Check if it's a keep file
                SHOULD_KEEP=0
                for keep in "${KEEP_FILES[@]}"; do
                    if [[ "$file" == "$keep" ]]; then
                        SHOULD_KEEP=1
                        break
                    fi
                done
                
                if [ $SHOULD_KEEP -eq 0 ]; then
                    mv "$file" docs/ 2>/dev/null
                fi
            fi
        done
        
        echo -e "${GREEN}✓ .md файлууд docs/ folder руу шилжүүлэгдсэн${NC}"
        echo ""
        echo "Root folder дээр үлдсэн:"
        ls -1 *.md 2>/dev/null || echo "  (none)"
    elif [[ $REPLY == "3" ]]; then
        echo ""
        echo -e "${RED}⚠️  АНХААРУУЛГА: Бүх .md файлууд устгагдана!${NC}"
        read -p "Үргэлжлүүлэх үү? (yes гэж бичнэ үү): " CONFIRM
        
        if [[ "$CONFIRM" == "yes" ]]; then
            rm -f *.md *.MD 2>/dev/null
            echo -e "${GREEN}✓ .md файлууд устгагдсан${NC}"
        else
            echo "Цуцлагдсан"
        fi
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 4: GIT STATUS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

git status -s | head -20

TOTAL_FILES=$(git status -s | wc -l)
echo ""
echo "Нийт файл: $TOTAL_FILES"

if [ $TOTAL_FILES -gt 100 ]; then
    echo ""
    echo -e "${YELLOW}⚠️  Маш олон файл байна ($TOTAL_FILES)${NC}"
    echo ""
    echo "Энэ нь commit удаан байх болно."
    echo "node_modules/ эсвэл dist/ folder ignore хийгдсэн эсэхийг шалгаарай."
    echo ""
    
    read -p "Үргэлжлүүлэх үү? (y/n) " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[YyТт]$ ]]; then
        echo "Цуцлагдсан"
        exit 1
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 5: GIT ADD"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

git add -A

STAGED=$(git diff --cached --numstat | wc -l)
echo -e "${GREEN}✓ $STAGED файл staged${NC}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 6: GIT COMMIT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

read -p "Commit message (default: Initial commit): " COMMIT_MSG

if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="Initial commit - ZoodShopy Logistics System

- React + TypeScript frontend
- Tailwind CSS styling
- Supabase backend integration
- Demo mode with localStorage
- Auto-fix scripts for deployment
- Full order management system"
fi

git commit -m "$COMMIT_MSG"

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ Commit амжилтгүй!${NC}"
    echo ""
    echo "Магадгүй commit хийх зүйл байхгүй."
    echo "Git status:"
    git status
    exit 1
fi

echo ""
echo -e "${GREEN}✓ Commit амжилттай${NC}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 7: GIT PUSH"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if we have a remote
if ! git remote -v | grep -q "origin"; then
    echo -e "${RED}❌ Remote repository configured байхгүй!${NC}"
    exit 1
fi

REMOTE_URL=$(git remote get-url origin)
echo "Remote: $REMOTE_URL"
echo ""

# Determine default branch
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null)

if [ -z "$CURRENT_BRANCH" ]; then
    # No branch yet, create main
    git branch -M main
    CURRENT_BRANCH="main"
    echo -e "${GREEN}✓ Branch created: main${NC}"
fi

echo "Branch: $CURRENT_BRANCH"
echo ""

echo "Pushing..."
git push -u origin "$CURRENT_BRANCH"

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ Push амжилтгүй!${NC}"
    echo ""
    echo "Магадгүй шалтгаанууд:"
    echo ""
    echo "1. GitHub authentication алдаа:"
    echo "   → GitHub Personal Access Token үүсгэх хэрэгтэй"
    echo "   → https://github.com/settings/tokens"
    echo "   → 'repo' permission өгөх"
    echo ""
    echo "2. Remote repository байхгүй:"
    echo "   → GitHub дээр шинэ repository үүсгэх"
    echo "   → https://github.com/new"
    echo ""
    echo "3. Force push хэрэгтэй:"
    echo "   → git push -f origin $CURRENT_BRANCH"
    echo ""
    
    read -p "Force push оролдох уу? (y/n) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[YyТт]$ ]]; then
        echo ""
        echo -e "${YELLOW}⚠️  Force pushing...${NC}"
        git push -f origin "$CURRENT_BRANCH"
        
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}✓ Force push амжилттай!${NC}"
        else
            echo ""
            echo -e "${RED}❌ Force push амжилтгүй${NC}"
            exit 1
        fi
    else
        exit 1
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ АМЖИЛТТАЙ!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}✓ Git configured${NC}"
echo -e "${GREEN}✓ Repository initialized${NC}"
echo -e "${GREEN}✓ Files committed${NC}"
echo -e "${GREEN}✓ Pushed to GitHub${NC}"
echo ""
echo "GitHub: $REMOTE_URL"
echo "Branch: $CURRENT_BRANCH"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "ДАРААГИЙН АЛХАМ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Vercel дээр deploy хийх:"
echo "   → https://vercel.com/new"
echo "   → 'Import Git Repository'"
echo "   → GitHub repository сонгох"
echo "   → Deploy дарах"
echo ""
echo "2. Vercel дээр environment variables тохируулах:"
echo "   → Project Settings → Environment Variables"
echo "   → SUPABASE_URL"
echo "   → SUPABASE_ANON_KEY"
echo "   → SUPABASE_SERVICE_ROLE_KEY"
echo ""
echo "3. Production URL шалгах:"
echo "   → Ctrl+Shift+R (Hard refresh)"
echo "   → Demo mode ажиллаж байгаа эсэхийг шалгах"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}🎉 БЭЛЭН! VERCEL DEPLOY ХИЙ!${NC}"
echo ""
