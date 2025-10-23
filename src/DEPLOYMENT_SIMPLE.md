# 🚀 Logistics System - Deployment заавар

## ⚡ Энгийн байдал: Edge Functions deploy ХЭРЭГГҮЙ!

Таны систем нь **шууд Supabase Client** ашиглаж байгаа учраас Edge Functions deploy хийх шаардлагагүй.

```
┌─────────────┐         ┌──────────────┐
│   React     │────────▶│   Supabase   │
│  Frontend   │         │   Database   │
└─────────────┘         └──────────────┘
```

## ✅ Та зөвхөн 1 зүйл хийх хэрэгтэй:

### Алхам 1: Database Tables үүсгэх

**А. ONE-CLICK Setup (Хамгийн хялбар):**

1. Апп ажиллуулна
2. Setup Required дэлгэц харагдана
3. Цэнхэр "**SQL ХУУЛЖ SETUP ЭХЛҮҮЛЭХ**" товч дарна
4. SQL Editor автоматаар нээгдэж, код хуулагдана
5. **Ctrl+V** (Mac: Cmd+V) paste хийнэ
6. **RUN ▶️** дарна
7. **Refresh** хийнэ

**Б. Гараар Setup:**

1. Supabase Dashboard нээнэ: https://supabase.com/dashboard
2. SQL Editor руу очно
3. Доорх SQL код ажиллуулна:

```sql
-- Copy paste from /supabase/migrations/complete_setup.sql
```

### Алхам 2: Demo хэрэглэгчид үүсгэх

SQL дууссаны дараа:

1. Authentication → Users руу очно
2. Доорх утгуудыг ашиглаж хэрэглэгч үүсгэнэ:

```
super@logistics.mn    / password: super123
admin@logistics.mn    / password: admin123
operator@logistics.mn / password: operator123
```

**ЭСВЭЛ** CREDENTIALS.md файл руу очиж дэлгэрэнгүй заавар харна уу.

### Алхам 3: Амжилттай! 🎉

App refresh хийж нэвтрэх хуудас харагдвал бүх зүйл бэлэн болсон гэсэн үг!

---

## 🚫 ТА ЮУ ХИЙХ ХЭРЭГГҮЙ:

- ❌ Edge Functions deploy хийх
- ❌ Docker ажиллуулах
- ❌ Backend server эхлүүлэх
- ❌ `supabase functions deploy` команд ажиллуулах

## 🔧 Архитектурын тайлбар:

Таны систем нь **serverless** архитектуртай:

- **Frontend**: React + Vite
- **Database**: Supabase Postgres (RLS enabled)
- **Auth**: Supabase Auth
- **API**: Шууд Supabase Client (Row Level Security ашигладаг)

Edge Functions (`/supabase/functions/server/`) нь хуучин архитектурын үлдэгдэл бөгөөд одоогоор ашиглагддаггүй.

## 📚 Холбоос заавар:

- [QUICKSTART.md](./QUICKSTART.md) - 5 минутын setup
- [CREDENTIALS.md](./CREDENTIALS.md) - Demo хэрэглэгчид
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Асуудал шийдэх

## 🆘 Тусламж хэрэгтэй бол:

1. Setup Required Screen дээрх товчуудыг ашиглана
2. Console (F12) дээрх error messages уншина
3. TROUBLESHOOTING.md файлыг шалгана
