# ⚡ ЭХЛЭХ ЭНД - GIT PUSH

## 🎯 ХУРДАН ЭХЛЭЛ

### 1️⃣ Scripts executable болгох (нэг удаа)

```bash
bash setup-scripts.sh
```

---

### 2️⃣ Git troubleshoot (optional)

```bash
bash git-troubleshoot.sh
```

Асуудал байгаа эсэхийг шалгана.

---

### 3️⃣ GitHub руу push хийх

```bash
bash git-setup-push.sh
```

**Эсвэл gараар:**

```bash
# GitHub дээр repo үүсгэ: https://github.com/new
git init
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git add -A
git commit -m "Initial commit"
git push -u origin main
```

---

## 🐛 АЛДАА ГАРВАЛ

### Authentication Failed

Personal Access Token үүсгэх:
- https://github.com/settings/tokens
- "Generate new token"
- Select `repo`
- Copy & use as password

---

### Repository Not Found

1. GitHub дээр repo үүсгэх
2. Remote URL зөв эсэхийг шалгах:
   ```bash
   git remote -v
   ```

---

## 📖 ДЭЛГЭРЭНГҮЙ

```bash
cat README_GIT_PUSH.md
```

---

## ✅ АМЖИЛТ!

GitHub push амжилттай бол:

```
https://vercel.com/new
→ Import Git Repository
→ Deploy
```

**БЭЛЭН!** 🚀
