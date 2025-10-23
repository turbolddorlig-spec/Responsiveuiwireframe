# 🔧 PGRST205 Алдааг засах - 2 МИНУТАД

## ⚠️ Та энэ алдааг харж байна:

```
Error: Could not find the table 'public.products' in the schema cache (PGRST205)
```

---

## ✅ ШИЙДЭЛ - 2 алхам:

### АЛХАМ 1: SQL Editor нээх

👉 **[ЭНЭ ХОЛБООС ДАРАХ](https://aezeazgqndyquljaxicq.supabase.co/project/default/sql/new)** 

Эсвэл manually:
1. https://supabase.com/dashboard нээх
2. Өөрийн project дарах
3. Зүүн цэснээс **SQL Editor** сонгох
4. **New query** дарах

---

### АЛХАМ 2: SQL Code ажиллуулах

#### Option A: VS Code эсвэл Text Editor ашиглан

1. **Project folder дээрээ** дараах файлыг нээнэ үү:
   ```
   /supabase/migrations/complete_setup.sql
   ```

2. **Ctrl+A** (Mac: Cmd+A) дарж бүх агуулгыг сонгоно

3. **Ctrl+C** (Mac: Cmd+C) дарж хуулна

4. **Supabase SQL Editor дээр Ctrl+V** (Mac: Cmd+V) paste хийнэ

5. **RUN ▶️** товч дарна (эсвэл Ctrl+Enter)

6. **Хүлээнэ үү** - 2-5 секунд

7. ✅ **"Success. No rows returned"** гэсэн мессеж харагдвал амжилттай!

#### Option B: Файлыг шууд нээж хуулах

```bash
# Terminal дээр:
cat supabase/migrations/complete_setup.sql

# Гарсан бүх кодыг хуулж SQL Editor дээр paste хийх
```

---

## ✅ Юу хийгдэх вэ?

Энэ SQL код дараах зүйлсийг үүсгэнэ:

### 📦 5 Database Tables:
- ✅ **products** - Бүтээгдэхүүний мэдээлэл
- ✅ **orders** - Захиалгын мэдээлэл  
- ✅ **user_profiles** - Хэрэглэгчдийн profile
- ✅ **stocks** - Агуулахын нөөц
- ✅ **driver_leads** - Жолоочдын мэдээлэл

### 🔐 Security Policies:
- RLS (Row Level Security) бүх tables дээр
- Эрхийн шалгалт (super_admin, admin, operator, driver, etc.)

### 📊 Sample Data:
- 10 Demo бүтээгдэхүүн
- 15 Demo захиалга
- Агуулахын анхны нөөц

---

## ✅ Амжилттай болсон эсэхийг шалгах

### SQL Editor дээр дараах командыг ажиллуулж үзнэ үү:

```sql
-- Tables үүссэн эсэхийг шалгах
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

**Хүлээгдэж буй үр дүн:**
```
products
orders
user_profiles
stocks
driver_leads
```

**Бүх 5 table байвал ✅ Амжилттай!**

---

## ✅ Дараагийн алхам: Demo Users үүсгэх (OPTIONAL)

Хэрэв та систем ашиглахыг хүсч байвал demo хэрэглэгчид үүсгэх хэрэгтэй:

### Хурдан арга:

1. Supabase Dashboard > **Authentication** > **Users**
2. **Add user** > **Create new user** дарах
3. Дараах 7 хэрэглэгчийг үүсгэх:

| Email | Password | Auto Confirm |
|-------|----------|--------------|
| 99000000@logistics.mn | super123 | ✅ YES |
| 99000001@logistics.mn | admin123 | ✅ YES |
| 99000002@logistics.mn | operator123 | ✅ YES |
| 99112233@logistics.mn | driver123 | ✅ YES |
| 99112234@logistics.mn | lead123 | ✅ YES |
| 99112235@logistics.mn | account123 | ✅ YES |
| 99112236@logistics.mn | warehouse123 | ✅ YES |

⚠️ **ЧУХАЛ**: "Auto Confirm User" checkbox ЗААВАЛ идэвхжүүлнэ үү!

4. Хэрэглэгч бүрийн **User ID** (UUID) хуулна

5. SQL Editor дээр дараах кодыг ажиллуулна (USER_ID солино):

```sql
-- Супер админ
INSERT INTO user_profiles (id, phone, name, role)
VALUES ('PASTE_USER_ID_HERE', '99000000', 'Супер Админ', 'super_admin');

-- Админ
INSERT INTO user_profiles (id, phone, name, role)
VALUES ('PASTE_USER_ID_HERE', '99000001', 'Админ', 'admin');

-- Оператор
INSERT INTO user_profiles (id, phone, name, role)
VALUES ('PASTE_USER_ID_HERE', '99000002', 'Оператор', 'operator');

-- Жолооч
INSERT INTO user_profiles (id, phone, name, role, driver_name)
VALUES ('PASTE_USER_ID_HERE', '99112233', 'Бат', 'driver', 'Бат');

-- Багийн ахлагч
INSERT INTO user_profiles (id, phone, name, role, driver_name)
VALUES ('PASTE_USER_ID_HERE', '99112234', 'Дорж', 'driver_lead', 'Дорж');

-- Нягтлан
INSERT INTO user_profiles (id, phone, name, role)
VALUES ('PASTE_USER_ID_HERE', '99112235', 'Нягтлан', 'accounting');

-- Агуулахчин
INSERT INTO user_profiles (id, phone, name, role)
VALUES ('PASTE_USER_ID_HERE', '99112236', 'Агуулахчин', 'warehouse');
```

---

## 🔄 REFRESH хийх

1. **Browser дээрээ F5 дарах** эсвэл Ctrl+R (Mac: Cmd+R)

2. ✅ **Login хуудас харагдана**

3. Нэвтрэх:
   - Нэвтрэх нэр: `99000000`
   - Нууц үг: `super123`

4. ✅ **Dashboard ажиллана!**

---

## ❌ Хэрэв алдаа гарвал

### "Invalid login credentials"
- Demo users үүсгээгүй байна
- user_profiles холбоогүй байна
- **Дээрх "Demo Users үүсгэх" хэсгийг дагах**

### "Failed to fetch"
- Supabase project унтарсан байна
- Project Settings шалгах

### "Permission denied"
- RLS policies алдаатай байна
- `/supabase/migrations/complete_setup.sql` дахин ажиллуулах

---

## 📚 Дэлгэрэнгүй заавар

- 📘 **SETUP_WALKTHROUGH.md** - Дэлгэрэнгүй алхам алхмаар
- 📕 **QUICKSTART.md** - Хурдан эхлэх (5 мин)
- 📗 **TROUBLESHOOTING.md** - Бүх асуудлын шийдэл
- 📙 **CREDENTIALS.md** - Demo хэрэглэгчдийн жагсаалт

---

## 🆘 Тусламж хэрэгтэй юу?

1. Browser Console нээх (F12)
2. **Console** tab дээр алдаа харах
3. Screenshot авч GitHub Issues дээр нээх

---

## ✨ Амжилт хүсье!

Setup дууссаны дараа танд:
- ✅ 7 төрлийн эрхийн систем
- ✅ Захиалга удирдах
- ✅ Бүтээгдэхүүн удирдах
- ✅ Жолооч удирдах
- ✅ Тайлан харах

**Бүх зүйл 2 МИНУТАД бэлэн болно! 🚀**
