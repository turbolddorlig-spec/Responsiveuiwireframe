# 🎮 DEMO MODE - Суpabase хэрэггүй шууд туршиж үзэх!

## ✨ Demo Mode гэж юу вэ?

**Demo Mode** нь танд **Supabase setup хийхгүйгээр** шууд апп-ыг туршиж үзэх боломж олгоно. Бүх өгөгдөл browser-ийн **LocalStorage** дээр хадгалагдана.

---

## 🚀 Яаж ашиглах вэ?

### Алхам 1: Demo Mode эхлүүлэх

Нэвтрэх дэлгэц дээр:

1. **🎮 Demo Mode эхлүүлэх** (улаан товч) дарна
2. Апп автоматаар **Super Admin** (99000000) нэвтэрнэ
3. Dashboard харагдана - бэлэн!

### Алхам 2: Апп-ыг туршиж үзэх

Demo Mode дээр дараах зүйлсийг хийж болно:

✅ Захиалга үүсгэх, засах, устгах  
✅ Бүтээгдэхүүн нэмэх, өөрчлөх  
✅ Хэрэглэгч удирдах  
✅ Driver Lead удирдах  
✅ Dashboard статистик харах  
✅ Бүх эрхийн түвшингүүдийг туршиж үзэх  

---

## 📊 Demo өгөгдөл

Demo Mode дээр дараах өгөгдлүүд ачаалагдана:

### 👥 Demo хэрэглэгчид (7):

| Нэвтрэх нэр | Нууц үг | Эрх | Нэр |
|-------------|---------|-----|-----|
| 99000000 | super123 | Super Admin | Супер Админ |
| 99000001 | admin123 | Admin | Админ Дорж |
| 99000002 | operator123 | Operator | Оператор Болд |
| 99112233 | driver123 | Driver | Жолооч Бат |
| 99112234 | lead123 | Driver Lead | Ахлагч Цэрэн |
| 99112235 | account123 | Accounting | Нягтлан Сара |
| 99112236 | warehouse123 | Warehouse | Агуулах Ганбат |

### 📦 Demo бүтээгдэхүүн (10):

- Сүү 1л - 3,500₮
- Талх - 2,000₮
- Төмс - 1,500₮
- Лууван - 2,500₮
- ...10 бүтээгдэхүүн

### 📝 Demo захиалгууд (3):

- **NEW** - Шинэ захиалга (СБД)
- **IN_TRANSIT** - Хүргэлтэнд (ХУД)
- **DELIVERED** - Хүргэгдсэн (БЗД)

---

## ⚠️ Хязгаарлалтууд

Demo Mode ашиглахдаа дараах зүйлсийг анхаарна уу:

### ❌ Юу ажиллахгүй:

- **Browser refresh** хийвэл өгөгдөл **АЛДАГДАНА**
- Бусад төхөөрөмж дээр харагдахгүй (LocalStorage)
- Production-д ашиглаж болохгүй

### ✅ Юу ажиллана:

- Бүх CRUD үйлдлүүд (Create, Read, Update, Delete)
- Захиалга, бүтээгдэхүүн, хэрэглэгч удирдлага
- Role-based эрхийн систем
- Dashboard, статистик

---

## 🔄 Demo Mode дуусгах

Demo Mode-оос гарахын тулд:

1. Баруун дээд буланд **Logout** товч дарна
2. Browser-ийн LocalStorage цэвэрлэгдэнэ
3. Нэвтрэх дэлгэц дээр **Supabase эсвэл Demo Mode** дахин сонгоно

---

## 🎯 Хэзээ ашиглах вэ?

### Demo Mode-г ашиглах нь:

- ✅ Апп-ыг **хурдан туршиж үзэх** хүсвэл
- ✅ Supabase setup хийх **цаг байхгүй** бол
- ✅ UI/UX **шалгах** хүсвэл
- ✅ **Figma Make** дээр prototype харуулах хүсвэл

### Supabase-г ашиглах нь:

- ✅ **Production** апп үүсгэх бол
- ✅ **Бодит өгөгдөл** хадгалах хүсвэл
- ✅ **Олон хэрэглэгчтэй** ажиллах бол
- ✅ **Өгөгдөл алдагдахгүй** байх хүсвэл

---

## 🔧 Technical Details

Demo Mode нь дараах технологи ашигладаг:

```typescript
// LocalStorage wrapper
localStorage.setItem('logistics_demo_products', JSON.stringify(products));

// Demo API functions
demoProductsAPI.getAll()
demoOrdersAPI.create(order)
demoUsersAPI.update(id, updates)
```

**Файлууд:**
- `/utils/demoData.ts` - Demo өгөгдлийн бүтэц
- `/utils/demoStorage.ts` - LocalStorage wrapper & Demo API

---

## 💡 Санамж

- 🎮 **Demo Mode** = Суpabase хэрэггүй, хурдан туршилт
- 🗄️ **Supabase** = Бодит database, production-ready

**Та Demo Mode дээр апп-ыг туршиж үзээд, дараа нь Supabase-д шилжиж болно!**

---

## 📚 Холбоотой заавар:

- **ШУУД_ЗАСАХ.md** - Supabase setup хийх (3 минут)
- **CREDENTIALS.md** - Бүх хэрэглэгчдийн жагсаалт
- **QUICK_FIX.md** - Алдаа засах хурдан заавар

**Амжилт хүсье!** 🚀
