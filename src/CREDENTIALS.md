# 🔑 Demo Credentials

Logistics системд нэвтрэх demo хэрэглэгчдийн мэдээлэл.

> ⚠️ **Анхааруулга**: Эдгээр credentials нь зөвхөн development болон demo зорилгоор ашиглагдана. Үйлдвэрлэлийн орчинд ХЭЗЭЭ Ч ашиглах ёсгүй!

## 👥 Demo Users

### 1. Super Admin
```
Нэвтрэх нэр: 99000000
Нууц үг: super123
Эрх мэдэл: Бүх эрх
```
**Хандах боломжтой модулиуд**:
- ✅ Dashboard
- ✅ Orders (бүх захиалга)
- ✅ Products
- ✅ Driver
- ✅ Driver Lead
- ✅ Accounting
- ✅ Warehouse
- ✅ Users
- ✅ Settings

---

### 2. Admin
```
Нэвтрэх нэр: 99000001
Нууц үг: admin123
Эрх мэдэл: Удирдлагын эрх
```
**Хандах боломжтой модулиуд**:
- ✅ Dashboard
- ✅ Orders (бүх захиалга)
- ✅ Products
- ✅ Driver
- ✅ Driver Lead
- ✅ Accounting
- ✅ Warehouse
- ✅ Users

---

### 3. Operator
```
Нэвтрэх нэр: 99000002
Нууц үг: operator123
Эрх мэдэл: Захиалга удирдах
```
**Хандах боломжтой модулиуд**:
- ✅ Orders (үүсгэх, засах)
- ✅ Products (харах л)
- ✅ Driver (жолооч хуваарилах)

**Үйлдлүүд**:
- Захиалга үүсгэх
- Захиалга засах
- Жолооч хуваарилах
- Төлөв шинэчлэх

---

### 4. Driver
```
Нэвтрэх нэр: 99112233
Нууц үг: driver123
Эрх мэдэл: Жолоочийн эрх
Жолоочийн нэр: Бат
```
**Хандах боломжтой модулиуд**:
- ✅ Driver (зөвхөн өөрийн захиалгууд)

**Үйлдлүүд**:
- Өөрийн захиалгуудыг харах
- Статус шинэчлэх (In Transit, Delivered)
- Захиалгын дэлгэрэнгүй харах

**Онцлог**:
- Mobile-friendly интерфейс
- Хаяг, утасны мэдээлэл
- Хүргэлтийн цаг

---

### 5. Driver Lead
```
Нэвтрэх нэр: 99112234
Нууц үг: lead123
Эрх мэдэл: Жолоочийн ахлагч
```
**Хандах боломжтой модулиуд**:
- ✅ Driver Lead (бүх жолоочийн захиалгууд)
- ✅ Driver (жолооч хуваарилах)

**Үйлдлүүд**:
- Driver leads удирдах
- Жолооч хуваарилах
- Бүх жолоочийн захиалга харах
- Lead статус шинэчлэх

---

### 6. Accounting
```
Нэвтрэх нэр: 99112235
Нууц үг: account123
Эрх мэдэл: Нягтлан бодох
```
**Хандах боломжтой модулиуд**:
- ✅ Accounting (санхүүгийн тайлан)
- ✅ Orders (төлбөрийн мэдээлэл)

**Үйлдлүүд**:
- Бүх төлбөрийн мэдээлэл харах
- Төлбөрийн төлөв шинэчлэх
- Тайлан гаргах
- Орлогын статистик

---

### 7. Warehouse
```
Нэвтрэх нэр: 99112236
Нууц үг: warehouse123
Эрх мэдэл: Агуулахын ажилтан
```
**Хандах боломжтой модулиуд**:
- ✅ Warehouse (агуулахын нөөц)
- ✅ Products (бүтээгдэхүүн удирдах)

**Үйлдлүүд**:
- Бүтээгдэхүүн нэмэх, засах, устгах
- Агуулахын нөөц хянах
- Stock adjustment
- Бүтээгдэхүүний дэлгэрэнгүй

---

## 📝 Testing Scenarios

### Scenario 1: Захиалга үүсгэх (Operator)
1. `99000002` / `operator123` нэвтрэх
2. Orders хуудас руу очих
3. "Захиалга үүсгэх" дарах
4. Мэдээлэл оруулж Save дарах
5. Жолооч хуваарилах

### Scenario 2: Жолоочоор хүргэлт (Driver)
1. `99112233` / `driver123` нэвтрэх
2. Өөрт хуваарилагдсан захиалга харах
3. Захиалга дээр дарж дэлгэрэнгүй харах
4. "In Transit" статус өөрчлөх
5. Хүргэсний дараа "Delivered" болгох

### Scenario 3: Бүтээгдэхүүн удирдах (Warehouse)
1. `99112236` / `warehouse123` нэвтрэх
2. Products хуудас руу очих
3. Шинэ бүтээгдэхүүн нэмэх
4. Stock тохируулах
5. Нөөц хянах

### Scenario 4: Санхүүгийн тайлан (Accounting)
1. `99112235` / `account123` нэвтрэх
2. Accounting хуудас руу очих
3. Төлбөрийн төлөвөөр шүүх
4. Нийт дүн харах
5. Төлбөрийн статус шинэчлэх

---

## 🔒 Security Notes

### Production орчинд:

1. **Demo credentials УСТГАХ**:
   ```sql
   DELETE FROM user_profiles WHERE phone LIKE '99%';
   DELETE FROM auth.users WHERE email LIKE '%@logistics.mn';
   ```

2. **Шинэ админ үүсгэх**:
   - Бодит и-мэйл ашиглах
   - Хүчтэй нууц үг үүсгэх
   - Email confirmation идэвхжүүлэх

3. **Password policy**:
   - Хамгийн багадаа 8 тэмдэгт
   - Том/жижиг үсэг
   - Тоо
   - Тусгай тэмдэгт

4. **Role assignment**:
   - Зөвхөн итгэлтэй хэрэглэгчдэд админ эрх
   - Regular audit хийх
   - Inactive users-г идэвхгүй болгох

---

## 📞 Password Reset

Хэрэв нууц үгээ мартсан бол:

### Development:
SQL Editor дээр:
```sql
-- User profile-ийг id-гаар нь хайж олоx
SELECT * FROM user_profiles WHERE phone = '99000000';

-- Supabase Auth дээр password солих
-- Dashboard > Authentication > Users дээр user олж "Reset Password" дарах
```

### Production:
- "Forgot Password" функц нэмэх (future feature)
- Email-ээр reset link илгээх
- Admin-аар солиулах

---

## 🎯 Role Comparison

| Feature | Super Admin | Admin | Operator | Driver | Driver Lead | Accounting | Warehouse |
|---------|-------------|-------|----------|--------|-------------|------------|-----------|
| Dashboard | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create Order | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Edit Order | ✅ | ✅ | ✅ | ⚠️ Status only | ⚠️ Assign driver | ⚠️ Payment | ❌ |
| View All Orders | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| View Own Orders | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Manage Products | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Manage Stock | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Manage Users | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Financials | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Driver Leads | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |

**Legend**:
- ✅ Full access
- ⚠️ Limited access
- ❌ No access

---

**Хамгаалалттай байгаарай! 🔐**
