# Supabase Setup Guide

Logistics системийг Supabase дээр ажиллахад шаардлагатай алхмууд.

## 1. Supabase Project үүсгэх

1. [supabase.com](https://supabase.com) дээр нэвтэрнэ үү
2. "New Project" дарж шинэ project үүсгэнэ үү
3. Project нэр болон нууц үгээ оруулна уу

## 2. Database Schema үүсгэх

Supabase Dashboard дээр:

1. **SQL Editor** рүү орно уу
2. `/supabase/migrations/20241022000000_init_schema.sql` файлын агуулгыг хуулж SQL Editor-т байрлуулна уу
3. **RUN** дарж schema үүсгэнэ үү

## 3. Seed Data оруулах

1. SQL Editor дээр `/supabase/seed.sql` файлын агуулгыг хуулж байрлуулна уу
2. **RUN** дарж products болон stocks оруулна уу

## 4. Demo хэрэглэгчдийг үүсгэх

### Арга 1: Edge Function ашиглах (Recommended)

1. Supabase CLI суулгана уу:
```bash
npm install -g supabase
```

2. Login хийнэ үү:
```bash
supabase login
```

3. Project холбоно уу:
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

4. Edge Functions deploy хийнэ үү:
```bash
supabase functions deploy setup-demo-users
```

5. Function дуудана уу:
```bash
curl -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/setup-demo-users \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### Арга 2: SQL ашиглах

SQL Editor дээр дараах кодыг ажиллуулж хэрэглэгч бүрийг гараар үүсгэнэ үү:

```sql
-- Note: Энэ нь зөвхөн user_profiles үүсгэнэ, auth.users үүсгэхгүй
-- Auth users-ийг Supabase Dashboard > Authentication > Users дээр гараар үүсгэх хэрэгтэй

-- User profiles insert (auth users create хийсний дараа)
INSERT INTO user_profiles (id, phone, name, role) VALUES
  ('USER_ID_HERE', '99000000', 'Супер Админ', 'super_admin');
```

## 5. Environment Variables тохируулах

Supabase dashboard-с дараах мэдээллийг авна уу:

1. **Settings** > **API** рүү орно уу
2. **Project URL** болон **anon/public** key-г хуулна уу

Таны app-д дараах environment variables оруулна уу:
- `VITE_SUPABASE_URL`: Таны project URL
- `VITE_SUPABASE_ANON_KEY`: Таны anon/public key

## 6. Authentication тохируулах

Supabase Dashboard дээр:

1. **Authentication** > **Providers** рүү орно уу  
2. **Email** provider enable хийнэ үү
3. **Email Confirmation** унтраана уу (жишээ app-д email server байхгүй учир)

## 7. Row Level Security (RLS) шалгах

Schema файлд бүх RLS policies байгаа боловч шалгана уу:

1. **Database** > **Tables** рүү орно уу
2. Хүснэгт бүр дээр RLS enabled байгааг шалгана уу
3. Policies дээр дарж таны policies үүссэн эсэхийг шалгана уу

## 8. Demo Credentials

Систем нэвтрэхэд ашиглах demo хэрэглэгчид:

| Нэвтрэх нэр | Нууц үг | Эрх |
|------------|---------|-----|
| 99000000 | super123 | Super Admin |
| 99000001 | admin123 | Admin |
| 99000002 | operator123 | Operator |
| 99112233 | driver123 | Driver |
| 99112234 | lead123 | Driver Lead |
| 99112235 | account123 | Accounting |
| 99112236 | warehouse123 | Warehouse |

## 9. GitHub Deploy (Optional)

GitHub repository-тэй холбож Vercel/Netlify дээр deploy хийх:

### Vercel:
1. Vercel dashboard дээр import хийнэ үү
2. Environment variables-г нэмнэ үү (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
3. Deploy!

### Netlify:
1. Netlify dashboard дээр new site хийнэ үү
2. Environment variables-г нэмнэ үү
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy!

## Troubleshooting

### "Failed to fetch" алдаа
- Supabase project асаалттай эсэхийг шалгана уу
- Environment variables зөв тохируулсан эсэхийг шалгана уу
- Browser console дээр бүрэн error message-г үзнэ үү

### "Invalid credentials" алдаа
- Demo users үүссэн эсэхийг Supabase Dashboard > Authentication > Users дээр шалгана уу
- user_profiles table дээр тохирох profile байгаа эсэхийг шалгана уу

### RLS policy алдаа
- SQL Editor дээр `SELECT * FROM user_profiles;` ажиллуулж үзнэ үү
- RLS policies зөв үүссэн эсэхийг шалгана уу

## Нэмэлт мэдээлэл

- Supabase Documentation: https://supabase.com/docs
- Supabase Auth: https://supabase.com/docs/guides/auth
- Row Level Security: https://supabase.com/docs/guides/auth/row-level-security
