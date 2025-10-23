# ❌ Supabase Edge Functions Deploy ХЭРЭГГҮЙ!

## 🎯 Таны асуудлын шийдэл:

Та "supabase руу deploy л дараагүй байгаа юу" гэж асуусан. Хариулт нь: **Та deploy хийх ХЭРЭГГҮЙ!**

## 🔍 Учир:

Таны систем нь **шууд Supabase Client** ашигладаг архитектуртай:

```
┌─────────────────┐         ┌──────────────────┐
│  React Frontend │────────▶│  Supabase DB     │
│  (Browser)      │  HTTP   │  (PostgreSQL)    │
└─────────────────┘         └──────────────────┘
```

**Edge Functions (`/supabase/functions/server/`) нь АШИГЛАГДДАГГҮЙ!**

## ✅ Та зөвхөн хийх ёстой:

### 1. Database Tables үүсгэх:

Апп ажиллуулахад "Setup Required Screen" харагдана:

```bash
npm run dev
```

Дэлгэц дээр:
1. **"SQL ХУУЛЖ SETUP ЭХЛҮҮЛЭХ"** товч дарна
2. SQL Editor автоматаар нээгдэж, код хуулагдана
3. **Ctrl+V** paste хийнэ
4. **RUN** дарна
5. **Refresh** хийнэ

### 2. Demo хэрэглэгчид үүсгэх:

Supabase Dashboard → Authentication → Users → Add user

```
99000000@logistics.mn  /  super123
99000002@logistics.mn  /  operator123
99112233@logistics.mn  /  driver123
```

(Дэлгэрэнгүй: [CREDENTIALS.md](./CREDENTIALS.md))

### 3. Бэлэн! 🎉

Refresh хийхэд систем ажиллана.

---

## ❌ Та хийх ХЭРЭГГҮЙ:

- ❌ `supabase functions deploy` команд
- ❌ Edge Functions deploy
- ❌ Backend server ажиллуулах
- ❌ Docker эсвэл containerization
- ❌ `/supabase/functions/server/index.tsx` засах

---

## 📁 Файлын тайлбар:

### ✅ Ашиглагдаж байгаа файлууд:

```
/utils/api.ts              ← Supabase Client ашигладаг
/utils/supabase/client.ts  ← Direct connection
/App.tsx                   ← Frontend
/components/               ← UI components
```

### ❌ Ашиглагдаагүй (хуучин) файлууд:

```
/supabase/functions/server/index.tsx    ← Docker-ийн үлдэгдэл
/supabase/functions/server/kv_store.tsx ← Ашиглагдаагүй
```

Эдгээр файлууд нь Docker backend-ийн үед ашиглагдаж байсан боловч одоо **огт хэрэггүй**.

---

## 🔧 Яагаад Edge Functions байгаа юм бэ?

Тэд нь Docker backend-аас Supabase руу шилжихэд бүрэн устгаагүй байсан үлдэгдэл файлууд юм. Системд ямар ч нөлөөгүй.

---

## 📚 Дараа нь юу хийх вэ?

1. **Local дээр ажиллуулах**: [QUICKSTART.md](./QUICKSTART.md)
2. **Production deploy**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
3. **Асуудал шийдэх**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 💡 Deployment хийх бол?

Production-д deploy хийхдээ **зөвхөн frontend** deploy хийнэ:

### Vercel:
```bash
git push origin main
```
→ Vercel автоматаар frontend deploy хийнэ

### Netlify:
```bash
npm run build
```
→ `dist` folder upload хийнэ

**Backend/Edge Functions deploy ОГТХОН ХЭРЭГГҮЙ!**

---

## ✅ Дүгнэлт:

Та **deploy хийх ХЭРЭГГҮЙ** байсан. Зөвхөн **Supabase SQL setup** хийх хэрэгтэй байсан!

**Setup screen дээрх ONE-CLICK товчийг ашиглаарай.** 🚀
