# MAKTAB VA ISH FUNKSIYASI - TO'LIQ INTEGRATSIYA

## ✅ AMALGA OSHIRILDI

### 1. SOZLAMALAR (Settings Tab)

**Foydalanuvchi turini tanlash:**
- ✅ "Maktab o'quvchisizmi?" yoki "Ishlaysizmi?" tugmalari
- ✅ Maktab tanlansa → Sinf tanlash (1-11)
- ✅ 1-4 sinf → "Bilan tuadi" xabari
- ✅ Ish tanlansa → Ish ma'lumotlari:
  - Ish turi (Dasturchi, O'qituvchi, Shifokor...)
  - Lavozim (Boshliq, Menejer, Ishchi, Boshqaruvchi, Mutaxassis, Yordamchi)
  - Necha yillik tajriba
  - Ish vaqti (boshlanish va tugash)

### 2. BURGER MENU (Sidebar)

**Dinamik ko'rsatish:**
- ✅ Maktab tanlangan → "7-sinf" (yoki boshqa sinf) tugmasi
- ✅ Ish tanlangan → "Ish" tugmasi
- ✅ Sozlamalar → Maktab/Ish → Boshqa tablar

### 3. MAKTAB TAB (SchoolTab.jsx)

**Kod himoyasi:**
- ✅ Birinchi kirish → 4-6 raqamli kod o'rnatish
- ✅ Keyingi kirishlar → Kod so'raladi
- ✅ Kod to'g'ri → Ochiladi

**1-4 sinf uchun:**
- ✅ Haftalik jadval (textarea)
- ✅ Yakshanba dam olish
- ✅ Bugungi darslarni ko'rsatish

**6-11 sinf uchun:**
- ✅ 6 kunlik jadval (Dushanba-Shanba)
- ✅ Har kun uchun darslar qo'shish
- ✅ Dars nomi va vaqti
- ✅ Darslarni o'chirish
- ✅ Bugungi darslarni ko'rsatish

**Xususiyatlar:**
- ✅ Yakshanba dam olish kuni
- ✅ Bugungi darslarni avtomatik ko'rsatish
- ✅ MongoDB ga saqlash

### 4. ISH TAB (WorkTab.jsx)

**Kod himoyasi:**
- ✅ Birinchi kirish → 4-6 raqamli kod o'rnatish
- ✅ Keyingi kirishlar → Kod so'raladi
- ✅ Kod to'g'ri → Ochiladi

**Ish ma'lumotlari:**
- ✅ Ish turi, lavozim, tajriba
- ✅ Ish vaqti (boshlanish-tugash)

**Bugungi vazifalar:**
- ✅ Vazifalar ro'yxati
- ✅ Checkbox (bajarildi/bajarilmadi)
- ✅ Progress bar
- ✅ Yangi vazifa qo'shish
- ✅ Vazifani o'chirish

**Bugungi hisobot:**
- ✅ Nechta mijoz bilan ishlandi
- ✅ Bugungi yutuqlar (textarea)
- ✅ O'zingizga maslahat (textarea)

**Xususiyatlar:**
- ✅ Kunlik ma'lumotlar
- ✅ MongoDB ga saqlash
- ✅ Tarix (workHistory)

### 5. SERVER API (server.js)

**Yangi endpointlar:**
- ✅ `/api/save-school` - Maktab ma'lumotlarini saqlash
  - schoolCode
  - schoolSchedule
  - weeklySchedule
  
- ✅ `/api/save-work` - Ish ma'lumotlarini saqlash
  - workCode
  - workDaily (kunlik vazifalar va hisobotlar)

### 6. MONGODB INTEGRATSIYA

**User schema qo'shimchalari:**
```javascript
{
  // Maktab
  schoolCode: String,
  schoolSchedule: Object,
  weeklySchedule: String,
  
  // Ish
  workCode: String,
  workDaily: Object // { "2026-02-14": { tasks: [], report: {} } }
}
```

## 📋 QANDAY ISHLAYDI

### Maktab o'quvchisi uchun:

1. **Sozlamalar** → "Maktab o'quvchisi" → Sinf tanlash
2. **Burger Menu** → "7-sinf" tugmasi paydo bo'ladi
3. **Maktab Tab** → Kod o'rnatish
4. **1-4 sinf:**
   - Haftalik jadval yozish
   - Bugungi darslarni ko'rish
5. **6-11 sinf:**
   - Har kun uchun darslar qo'shish
   - Bugungi darslarni ko'rish

### Ishlovchi uchun:

1. **Sozlamalar** → "Ishlayman" → Ish ma'lumotlari
2. **Burger Menu** → "Ish" tugmasi paydo bo'ladi
3. **Ish Tab** → Kod o'rnatish
4. **Bugungi vazifalar:**
   - Vazifalar qo'shish
   - Bajarilganini belgilash
5. **Bugungi hisobot:**
   - Mijozlar soni
   - Yutuqlar
   - Maslahatlar

## 🎯 XUSUSIYATLAR

### Xavfsizlik:
- ✅ Kod himoyasi (4-6 raqam)
- ✅ Birinchi kirish → Kod o'rnatish
- ✅ Keyingi kirishlar → Kod so'raladi

### Saqlash:
- ✅ MongoDB ga avtomatik saqlash
- ✅ Kunlik ma'lumotlar tarixi
- ✅ Offline rejim (localStorage)

### Foydalanuvchi tajribasi:
- ✅ Dinamik burger menu
- ✅ Bugungi ma'lumotlarni ko'rsatish
- ✅ Progress bar (vazifalar uchun)
- ✅ Yakshanba dam olish kuni

## 🚀 KEYINGI QADAMLAR

1. ✅ Barcha funksiyalar ishlaydi
2. ✅ MongoDB integratsiya
3. ✅ Kod himoyasi
4. ✅ Dinamik burger menu

## 📝 ESLATMA

- Maktab va Ish tablar faqat sozlamalarda tanlanganda ko'rinadi
- Kod birinchi kirishda o'rnatiladi
- Barcha ma'lumotlar MongoDB ga saqlanadi
- Yakshanba dam olish kuni (darslar yo'q)
- 1-4 sinf → Haftalik jadval
- 6-11 sinf → Kunlik jadval
- Ish → Kunlik vazifalar va hisobotlar

## ✨ YAKUNIY NATIJA

Endi foydalanuvchilar:
1. Sozlamalarda maktab yoki ishni tanlaydi
2. Burger menuda tegishli tab paydo bo'ladi
3. Kod bilan himoyalangan
4. Bugungi ma'lumotlarni ko'radi
5. Barcha ma'lumotlar saqlanadi

**Hammasi tayyor va ishlaydi!** 🎉
