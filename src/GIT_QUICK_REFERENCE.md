# GIT PUSH - ШУУРХАЙ ЗААВАР

## ⚡ 1 МИНУТ - AUTO SCRIPT

```bash
bash git-setup-push.sh
```

Script автоматаар:
1. Git config шалгана
2. Repository initialize хийнэ
3. Remote add хийнэ
4. Commit хийнэ
5. Push хийнэ

---

## 📝 3 МИНУТ - MANUAL

### 1. GitHub Repository Үүсгэх

```
https://github.com/new
```

→ Repo name оруул  
→ "Create repository" дарах  
→ URL copy хий

### 2. Git Setup

```bash
# Initialize
git init
git branch -M main

# Add remote (өөрийн URL ашиглаарай)
git remote add origin https://github.com/USERNAME/REPO.git

# Commit
git add -A
git commit -m "Initial commit"

# Push
git push -u origin main
```

---

## 🐛 АЛДАА ЗАСАХ

### Authentication Failed

**Personal Access Token үүсгэх:**
1. https://github.com/settings/tokens
2. "Generate new token"
3. ✅ Select `repo`
4. Copy token
5. Push хийхдээ password-ийн оронд token ашиглах

---

### Repository Not Found

**Remote URL шалгах:**

```bash
git remote -v
```

**Засах:**

```bash
git remote set-url origin https://github.com/CORRECT_URL.git
```

---

### Branch Conflict

**Force push (⚠️ overwrites remote):**

```bash
git push -f origin main
```

---

## ✅ VERIFICATION

**GitHub дээр шалгах:**

```
https://github.com/YOUR_USERNAME/YOUR_REPO
```

Files харагдах ёстой ✅

---

## 🚀 VERCEL DEPLOY

Push амжилттай бол:

```
1. https://vercel.com/new
2. Import Git Repository
3. Select your repo
4. Deploy
```

---

## 📖 ДЭЛГЭРЭНГҮЙ

```bash
cat GIT_PUSH_GUIDE.md
```

---

**ЭХЛҮҮЛЬЕ!** 🚀
