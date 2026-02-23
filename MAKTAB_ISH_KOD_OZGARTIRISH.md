# MAKTAB VA ISH - KOD O'ZGARTIRISH FUNKSIYASI

## ✅ YANGI XUSUSIYATLAR

### 1. BURGER MENUGA QO'SHILISH SHARTI

**Ish uchun:**
- ✅ Faqat kod o'rnatilgandan keyin burger menuga qo'shiladi
- ✅ `userData.workCode` mavjud bo'lsa ko'rsatiladi
- ✅ Kod o'rnatilmagan bo'lsa ko'rsatilmaydi

**Maktab uchun:**
- ✅ Sinf tanlangandan keyin burger menuga qo'shiladi
- ✅ `userData.settings.schoolGrade` mavjud bo'lsa ko'rsatiladi

### 2. KOD O'ZGARTIRISH FUNKSIYASI

**Xususiyatlar:**
- ✅ Kod o'zgartirish tugmasi (🔑 KOD O'ZGARTIRISH)
- ✅ Admin paroli so'raladi
- ✅ Yangi kod 4-6 raqam bo'lishi kerak
- ✅ Admin paroli to'g'ri bo'lsa o'zgaradi
- ✅ Noto'g'ri parol kiritilsa xato ko'rsatiladi

**Qanday ishlaydi:**
1. Foydalanuvchi "KOD O'ZGARTIRISH" tugmasini bosadi
2. Forma ochiladi:
   - Yangi kod (4-6 raqam)
   - Admin paroli
3. Admin paroli tekshiriladi (`/api/admin/login`)
4. To'g'ri bo'lsa kod o'zgaradi
5. MongoDB ga saqlanadi

### 3. BOSHQA MA'LUMOTLARNI O'ZGARTIRISH

**Sozlamalardan o'zgartiriladi:**
- ✅ Ish turi
- ✅ Lavozim
- ✅ Necha yillik
- ✅ Ish vaqti (boshlanish-tugash)
- ✅ Sinf (faqat admin paroli bilan)

**Admin paroli kerak:**
- ❌ Kod o'zgartirish
- ❌ Sinf o'zgartirish (kelajakda)

**Admin paroli kerak emas:**
- ✅ Ish turi
- ✅ Lavozim
- ✅ Necha yillik
- ✅ Ish vaqti

## 📋 QANDAY ISHLAYDI

### Kod o'zgartirish (Ish):

1. **Ish tabiga o'ting**
2. **"KOD O'ZGARTIRISH" tugmasini bosing**
3. **Yangi kodni kiriting** (4-6 raqam)
4. **Admin parolini kiriting** (963)
5. **"O'ZGARTIRISH" tugmasini bosing**
6. Kod o'zgaradi va saqlanadi

### Kod o'zgartirish (Maktab):

1. **Maktab tabiga o'ting**
2. **"KOD O'ZGARTIRISH" tugmasini bosing**
3. **Yangi kodni kiriting** (4-6 raqam)
4. **Admin parolini kiriting** (963)
5. **"O'ZGARTIRISH" tugmasini bosing**
6. Kod o'zgaradi va saqlanadi

### Boshqa ma'lumotlarni o'zgartirish:

1. **Sozlamalar tabiga o'ting**
2. **"MAKTAB YOKI ISH" bo'limini toping**
3. **Kerakli maydonlarni o'zgartiring:**
   - Ish turi
   - Lavozim
   - Necha yillik
   - Ish vaqti
4. **Avtomatik saqlanadi** (1 soniya kutiladi)

## 🔒 XAVFSIZLIK

### Admin paroli tekshirish:

```javascript
const response = await fetch('/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ pass: adminPassword })
})

const data = await response.json()

if (data.success) {
  // Kod o'zgartirish
} else {
  alert('Admin paroli noto\'g\'ri!')
}
```

### Kod validatsiya:

```javascript
if (!newCode || newCode.length < 4 || newCode.length > 6) {
  alert('Yangi kod 4-6 raqam bo\'lishi kerak!')
  return
}
```

## 🎯 XUSUSIYATLAR

### Burger menuga qo'shilish:

**Ish:**
```javascript
if (userType === 'work' && userData?.workCode) {
  // Faqat kod o'rnatilgan bo'lsa
  userTabs.splice(1, 0, { 
    id: 'work', 
    label: 'Ish', 
    section: 'ASOSIY' 
  })
}
```

**Maktab:**
```javascript
if (userType === 'school' && schoolGrade) {
  userTabs.splice(1, 0, { 
    id: 'school', 
    label: `${schoolGrade}-sinf`, 
    section: 'ASOSIY' 
  })
}
```

### Kod o'zgartirish UI:

```jsx
<button onClick={() => setShowChangeCode(!showChangeCode)}>
  🔑 KOD O'ZGARTIRISH
</button>

{showChangeCode && (
  <div>
    <input type="password" value={newCode} />
    <input type="password" value={adminPassword} />
    <button onClick={handleChangeCode}>O'ZGARTIRISH</button>
  </div>
)}
```

## 📊 MISOLLAR

### Misol 1: Kod o'zgartirish

**Kirish:**
- Eski kod: 1234
- Yangi kod: 5678
- Admin paroli: 963

**Jarayon:**
1. "KOD O'ZGARTIRISH" tugmasini bosish
2. Yangi kod: 5678
3. Admin paroli: 963
4. "O'ZGARTIRISH" tugmasini bosish

**Natija:**
- ✅ Kod 5678 ga o'zgaradi
- ✅ MongoDB ga saqlanadi
- ✅ Xabar: "Kod muvaffaqiyatli o'zgartirildi!"

### Misol 2: Noto'g'ri admin paroli

**Kirish:**
- Yangi kod: 5678
- Admin paroli: 123 (noto'g'ri)

**Natija:**
- ❌ Xabar: "Admin paroli noto'g'ri!"
- ❌ Kod o'zgartirilmaydi

### Misol 3: Ish ma'lumotlarini o'zgartirish

**Kirish:**
- Ish turi: Dasturchi → O'qituvchi
- Lavozim: Ishchi → Menejer

**Jarayon:**
1. Sozlamalar tabiga o'tish
2. Ish turini o'zgartirish
3. Lavozimni o'zgartirish
4. 1 soniya kutish

**Natija:**
- ✅ Avtomatik saqlanadi
- ✅ Admin paroli kerak emas

## 🚀 KELAJAK YANGILANISHLAR

- [ ] Sinf o'zgartirish uchun admin paroli
- [ ] Kod tarixi (qachon o'zgartirilgan)
- [ ] Kod o'zgartirish cheklovi (kuniga 1 marta)
- [ ] Email orqali tasdiqlash
- [ ] 2FA (Two-Factor Authentication)

## ✨ YAKUNIY NATIJA

Endi foydalanuvchilar:
1. ✅ Ish saqlangandan keyin burger menuga qo'shiladi
2. ✅ Kodni admin paroli bilan o'zgartiradi
3. ✅ Boshqa ma'lumotlarni sozlamalardan o'zgartiradi
4. ✅ Xavfsiz va oson

**Hammasi tayyor va ishlaydi!** 🎉

---

**Admin paroli:** 963 (test uchun)
