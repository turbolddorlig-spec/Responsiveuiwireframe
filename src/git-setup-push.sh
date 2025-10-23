#!/bin/bash

# Simple Git Setup & Push (No Emoji, Cross-Platform)

clear

echo "========================================"
echo "GIT SETUP & PUSH TO GITHUB"
echo "========================================"
echo ""

# Step 1: Check Git
if ! command -v git &> /dev/null; then
    echo "ERROR: Git is not installed!"
    echo "Download from: https://git-scm.com/downloads"
    exit 1
fi

echo "Step 1: Git is installed"
echo ""

# Step 2: Git Config
echo "Step 2: Checking Git config..."
GIT_NAME=$(git config --global user.name 2>/dev/null)
GIT_EMAIL=$(git config --global user.email 2>/dev/null)

if [ -z "$GIT_NAME" ] || [ -z "$GIT_EMAIL" ]; then
    echo "Git config not set. Please enter:"
    read -p "Your name: " INPUT_NAME
    read -p "Your email: " INPUT_EMAIL
    
    git config --global user.name "$INPUT_NAME"
    git config --global user.email "$INPUT_EMAIL"
    echo "Git config saved!"
else
    echo "Git config OK: $GIT_NAME <$GIT_EMAIL>"
fi

echo ""

# Step 3: Initialize Git Repository
echo "Step 3: Initializing Git repository..."

if [ ! -d ".git" ]; then
    git init
    git branch -M main
    echo "Git repository initialized with branch 'main'"
else
    echo "Git repository already exists"
fi

echo ""

# Step 4: Add Remote
echo "Step 4: Setting up remote repository..."

if git remote -v | grep -q "origin"; then
    CURRENT_REMOTE=$(git remote get-url origin)
    echo "Current remote: $CURRENT_REMOTE"
    echo ""
    read -p "Change remote URL? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "New GitHub repo URL: " NEW_REMOTE
        git remote set-url origin "$NEW_REMOTE"
        echo "Remote URL updated!"
    fi
else
    echo ""
    echo "Please create a new repository on GitHub:"
    echo "https://github.com/new"
    echo ""
    read -p "Enter your GitHub repo URL: " REMOTE_URL
    git remote add origin "$REMOTE_URL"
    echo "Remote added!"
fi

echo ""

# Step 5: Clean up documentation files
echo "Step 5: Checking documentation files..."
MD_COUNT=$(find . -maxdepth 1 -name "*.md" -type f | wc -l)
echo "Found $MD_COUNT markdown files in root folder"

if [ $MD_COUNT -gt 10 ]; then
    echo ""
    echo "WARNING: Too many .md files ($MD_COUNT)"
    echo ""
    echo "Options:"
    echo "  1) Move to docs/ folder (recommended)"
    echo "  2) Keep all files (slower commit)"
    echo "  3) Skip (continue as-is)"
    echo ""
    read -p "Choose (1/2/3): " -n 1 -r
    echo ""
    
    if [[ $REPLY == "1" ]]; then
        mkdir -p docs
        
        # Keep important files in root
        KEEP_FILES=("README.md" "FEATURES.md" "CREDENTIALS.md" "QUICKSTART.md")
        
        for file in *.md; do
            if [[ -f "$file" ]]; then
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
        
        echo "Moved extra .md files to docs/ folder"
        echo "Kept in root: README.md, FEATURES.md, CREDENTIALS.md, QUICKSTART.md"
    fi
fi

echo ""

# Step 6: Add files
echo "Step 6: Adding files to Git..."
git add -A

TOTAL_FILES=$(git status -s | wc -l)
echo "Files to commit: $TOTAL_FILES"

if [ $TOTAL_FILES -gt 100 ]; then
    echo ""
    echo "WARNING: Many files to commit ($TOTAL_FILES)"
    echo "This may take a while..."
    echo ""
    read -p "Continue? (y/n): " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelled"
        exit 1
    fi
fi

echo ""

# Step 7: Commit
echo "Step 7: Committing files..."
read -p "Commit message (Enter for default): " COMMIT_MSG

if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="Initial commit - ZoodShopy Logistics System"
fi

git commit -m "$COMMIT_MSG"

if [ $? -ne 0 ]; then
    echo "ERROR: Commit failed!"
    echo "Check git status:"
    git status
    exit 1
fi

echo "Committed successfully!"
echo ""

# Step 8: Push
echo "Step 8: Pushing to GitHub..."

CURRENT_BRANCH=$(git branch --show-current)
echo "Branch: $CURRENT_BRANCH"
echo ""

git push -u origin "$CURRENT_BRANCH"

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Push failed!"
    echo ""
    echo "Possible reasons:"
    echo ""
    echo "1. Authentication required:"
    echo "   - Create a Personal Access Token:"
    echo "     https://github.com/settings/tokens"
    echo "   - Select 'repo' permission"
    echo "   - Use token as password when prompted"
    echo ""
    echo "2. Repository does not exist:"
    echo "   - Create repository on GitHub:"
    echo "     https://github.com/new"
    echo ""
    echo "3. Branch already exists with different history:"
    echo "   - Try force push (WARNING: overwrites remote):"
    echo "     git push -f origin $CURRENT_BRANCH"
    echo ""
    
    read -p "Try force push? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push -f origin "$CURRENT_BRANCH"
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "Force push successful!"
        else
            echo ""
            echo "Force push failed!"
            exit 1
        fi
    else
        exit 1
    fi
fi

echo ""
echo "========================================"
echo "SUCCESS!"
echo "========================================"
echo ""
echo "Repository: $(git remote get-url origin)"
echo "Branch: $CURRENT_BRANCH"
echo ""
echo "Next steps:"
echo ""
echo "1. Deploy to Vercel:"
echo "   - Visit: https://vercel.com/new"
echo "   - Click 'Import Git Repository'"
echo "   - Select your GitHub repository"
echo "   - Click 'Deploy'"
echo ""
echo "2. Configure environment variables in Vercel:"
echo "   - Project Settings > Environment Variables"
echo "   - Add SUPABASE_URL, SUPABASE_ANON_KEY, etc."
echo ""
echo "3. Wait for deployment and test your app!"
echo ""
echo "DONE!"
