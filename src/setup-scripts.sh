#!/bin/bash

# Make all scripts executable
chmod +x 🔧_AUTO_FIX_VITE_CONFIG.sh
chmod +x 🚀_PRE_DEPLOY_CHECK.sh
chmod +x 🔥_VERCEL_FORCE_REBUILD.sh
chmod +x ⚡_ЭЦСИЙН_ЗАСВАР_DEPLOY.sh
chmod +x 🚀_GIT_SETUP_PUSH.sh
chmod +x git-setup-push.sh
chmod +x git-troubleshoot.sh

echo "✅ All scripts are now executable!"
echo ""
echo "Available commands:"
echo ""
echo "Git Setup:"
echo "  bash git-setup-push.sh          - Setup Git & push to GitHub"
echo "  bash git-troubleshoot.sh        - Diagnose Git issues"
echo ""
echo "Deploy Setup:"
echo "  bash 🔧_AUTO_FIX_VITE_CONFIG.sh  - Fix vite.config.ts"
echo "  bash 🚀_PRE_DEPLOY_CHECK.sh       - Full pre-deploy check"
echo "  bash 🔥_VERCEL_FORCE_REBUILD.sh  - Force Vercel rebuild"
echo ""
echo "Or use npm scripts:"
echo "  npm run predeploy      - Full check"
echo "  npm run check-config   - Quick fix vite.config"
echo ""
echo "Documentation:"
echo "  cat README_GIT_PUSH.md         - Git push guide"
echo "  cat GIT_QUICK_REFERENCE.md     - Quick reference"
echo "  cat 🚀_ЭХЛЭХ_ЭНД.md             - Deploy guide"