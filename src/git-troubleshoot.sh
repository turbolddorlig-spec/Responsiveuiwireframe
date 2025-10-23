#!/bin/bash

# Git Troubleshooting Script

clear

echo "========================================"
echo "GIT TROUBLESHOOTING"
echo "========================================"
echo ""

ISSUES=0

# Check 1: Git installed
echo "Check 1: Git Installation"
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo "  OK: $GIT_VERSION"
else
    echo "  ERROR: Git not installed!"
    echo "  Download from: https://git-scm.com/downloads"
    ((ISSUES++))
fi
echo ""

# Check 2: Git config
echo "Check 2: Git Configuration"
GIT_NAME=$(git config --global user.name 2>/dev/null)
GIT_EMAIL=$(git config --global user.email 2>/dev/null)

if [ -z "$GIT_NAME" ] || [ -z "$GIT_EMAIL" ]; then
    echo "  ERROR: Git config not set!"
    echo "  Fix:"
    echo "    git config --global user.name \"Your Name\""
    echo "    git config --global user.email \"your.email@example.com\""
    ((ISSUES++))
else
    echo "  OK: $GIT_NAME <$GIT_EMAIL>"
fi
echo ""

# Check 3: Git repository
echo "Check 3: Git Repository"
if [ -d ".git" ]; then
    echo "  OK: Git repository exists"
    
    # Check branch
    CURRENT_BRANCH=$(git branch --show-current 2>/dev/null)
    if [ -z "$CURRENT_BRANCH" ]; then
        echo "  WARNING: No branch (need initial commit)"
    else
        echo "  Branch: $CURRENT_BRANCH"
    fi
else
    echo "  ERROR: Not a git repository!"
    echo "  Fix:"
    echo "    git init"
    echo "    git branch -M main"
    ((ISSUES++))
fi
echo ""

# Check 4: Remote repository
echo "Check 4: Remote Repository"
if [ -d ".git" ]; then
    if git remote -v | grep -q "origin"; then
        REMOTE_URL=$(git remote get-url origin)
        echo "  OK: Remote configured"
        echo "  URL: $REMOTE_URL"
        
        # Test connection
        echo "  Testing connection..."
        if git ls-remote origin &> /dev/null; then
            echo "  OK: Can connect to remote"
        else
            echo "  ERROR: Cannot connect to remote!"
            echo "  Possible reasons:"
            echo "    - Repository doesn't exist"
            echo "    - Authentication failed"
            echo "    - Network issue"
            ((ISSUES++))
        fi
    else
        echo "  ERROR: No remote configured!"
        echo "  Fix:"
        echo "    git remote add origin https://github.com/USERNAME/REPO.git"
        ((ISSUES++))
    fi
else
    echo "  SKIP: No git repository"
fi
echo ""

# Check 5: .gitignore
echo "Check 5: .gitignore File"
if [ -f ".gitignore" ]; then
    echo "  OK: .gitignore exists"
    
    # Check for common patterns
    if grep -q "node_modules" .gitignore; then
        echo "  OK: node_modules ignored"
    else
        echo "  WARNING: node_modules not in .gitignore!"
    fi
    
    if grep -q "dist" .gitignore; then
        echo "  OK: dist ignored"
    else
        echo "  WARNING: dist not in .gitignore!"
    fi
else
    echo "  WARNING: No .gitignore file!"
    echo "  Recommended: Create .gitignore"
fi
echo ""

# Check 6: Large files
echo "Check 6: Large Files/Folders"

if [ -d "node_modules" ]; then
    NODE_SIZE=$(du -sh node_modules 2>/dev/null | cut -f1)
    echo "  WARNING: node_modules/ exists ($NODE_SIZE)"
    
    if git check-ignore node_modules > /dev/null 2>&1; then
        echo "  OK: But it's ignored by git"
    else
        echo "  ERROR: NOT ignored! This will cause problems!"
        echo "  Fix: Add 'node_modules/' to .gitignore"
        ((ISSUES++))
    fi
fi

if [ -d "dist" ]; then
    DIST_SIZE=$(du -sh dist 2>/dev/null | cut -f1)
    echo "  INFO: dist/ exists ($DIST_SIZE)"
    
    if git check-ignore dist > /dev/null 2>&1; then
        echo "  OK: It's ignored by git"
    else
        echo "  WARNING: dist/ not ignored"
    fi
fi

if [ -d "build" ]; then
    BUILD_SIZE=$(du -sh build 2>/dev/null | cut -f1)
    echo "  INFO: build/ exists ($BUILD_SIZE)"
    
    if git check-ignore build > /dev/null 2>&1; then
        echo "  OK: It's ignored by git"
    else
        echo "  WARNING: build/ not ignored"
    fi
fi
echo ""

# Check 7: Staged/Modified files
echo "Check 7: Git Status"
if [ -d ".git" ]; then
    STAGED=$(git diff --cached --numstat 2>/dev/null | wc -l)
    MODIFIED=$(git diff --numstat 2>/dev/null | wc -l)
    UNTRACKED=$(git ls-files --others --exclude-standard 2>/dev/null | wc -l)
    
    echo "  Staged:    $STAGED files"
    echo "  Modified:  $MODIFIED files"
    echo "  Untracked: $UNTRACKED files"
    
    TOTAL=$((STAGED + MODIFIED + UNTRACKED))
    
    if [ $TOTAL -eq 0 ]; then
        echo "  Status: Clean (nothing to commit)"
    elif [ $TOTAL -gt 100 ]; then
        echo "  WARNING: Many files ($TOTAL total)"
        echo "  This may indicate node_modules or build folders"
    else
        echo "  Status: Ready to commit"
    fi
else
    echo "  SKIP: No git repository"
fi
echo ""

# Check 8: Recent commits
echo "Check 8: Commit History"
if [ -d ".git" ]; then
    COMMIT_COUNT=$(git rev-list --count HEAD 2>/dev/null)
    
    if [ -z "$COMMIT_COUNT" ] || [ "$COMMIT_COUNT" -eq 0 ]; then
        echo "  INFO: No commits yet"
    else
        echo "  Commits: $COMMIT_COUNT"
        echo "  Latest:"
        git log --oneline -3 2>/dev/null | sed 's/^/    /'
    fi
else
    echo "  SKIP: No git repository"
fi
echo ""

# Summary
echo "========================================"
echo "SUMMARY"
echo "========================================"
echo ""

if [ $ISSUES -eq 0 ]; then
    echo "OK: No critical issues found!"
    echo ""
    echo "Ready to push:"
    echo "  git add -A"
    echo "  git commit -m \"Your message\""
    echo "  git push -u origin main"
else
    echo "FOUND $ISSUES ISSUE(S)"
    echo ""
    echo "Fix the issues above before pushing."
fi

echo ""

# Recommendations
echo "========================================"
echo "RECOMMENDATIONS"
echo "========================================"
echo ""

# Check for duplicate config files
if [ -f "postcss.config.js" ] && [ -f "postcss.config.cjs" ]; then
    echo "- Remove duplicate: postcss.config.js (keep .cjs)"
fi

if [ -f "tailwind.config.js" ] && [ -f "tailwind.config.cjs" ]; then
    echo "- Remove duplicate: tailwind.config.js (keep .cjs)"
fi

# Check for too many .md files
MD_COUNT=$(find . -maxdepth 1 -name "*.md" -type f 2>/dev/null | wc -l)
if [ $MD_COUNT -gt 10 ]; then
    echo "- Consider moving .md files to docs/ folder ($MD_COUNT in root)"
fi

echo ""
echo "To fix issues automatically, run:"
echo "  bash git-setup-push.sh"
echo ""
