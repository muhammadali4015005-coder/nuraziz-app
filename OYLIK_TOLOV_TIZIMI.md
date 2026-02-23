# 💰 OYLIK TO'LOV TIZIMI

## ✅ QOSHILDI!

### Xususiyatlar:

## 1. 📅 Avtomatik Oylik (30 Kun)
- Yangi foydalanuvchi ro'yxatdan o'tganda avtomatik 30 kun oylik beriladi
- `subscriptionDate` - Oylik boshlangan sana
- `subscriptionExpiry` - Oylik tugash sanasi
- `subscriptionActive` - Oylik faol/nofaol

## 2. 🔔 Login Paytida Tekshirish

### Oylik Tugagan (0 kun yoki kamroq):
```
❌ OYLIGINGIZ TUGADI!

Nuraziz, oyligingiz 2 kun oldin tugagan.

📞 918335005 raqamiga qo'ng'iroq qiling va oyligingizni to'lang!
```

### Oylik Tugashiga 5 Kun Qolganda:
```
⚠️ OGOHLANTIRISH!

Nuraziz, oyligingiz 3 kun ichida tugaydi!

📞 918335005 raqamiga qo'ng'iroq qiling.
```

### Oylik Faol (5 kundan ko'p):
```
✅ Subscription active: 15 days left
(Konsolda ko'rinadi, foydalanuvchiga xabar yo'q)
```

## 3. 📊 Admin Panel Statistika

### Yangi Statistika Qo'shildi:
- 🔔 **Oylik Tugagan** - Oylik muddati o'tgan foydalanuvchilar soni
- ⚠️ **5 Kun Ichida Tugaydi** - Oylik 5 kun ichida tugaydigan foydalanuvchilar

### Foydalanuvchilar Ro'yxati:
Har bir foydalanuvchi uchun oylik ma'lumoti ko'rinadi:

**Oylik Tugagan:**
```
🔔 Oylik 2 kun oldin tugagan!
(Qizil rang)
```

**Oylik Tugashiga Yaqin:**
```
⚠️ Oylik 3 kun ichida tugaydi
(Sariq rang)
```

**Oylik Faol:**
```
✅ Oylik: 15 kun qoldi
(Yashil rang)
```

## 4. ➕ Oylik Uzaytirish (Admin)

Admin har bir tasdiqlangan foydalanuvchi uchun oylikni uzaytirishi mumkin:

1. **"➕ Oylik Uzaytirish" tugmasini bosing**
2. **Necha kun uzaytirmoqchisiz?** (30 = 1 oy)
3. **Raqam kiriting** (masalan: 30, 60, 90)
4. **Natija:** "Oylik 30 kun uzaytirildi!"

### Misol:
- Hozirgi oylik: 2026-03-05 da tugaydi
- 30 kun uzaytirish: 2026-04-04 ga o'zgaradi
- 60 kun uzaytirish: 2026-05-04 ga o'zgaradi

## 5. 🎨 Rangli Indikatorlar

Admin panelda har bir foydalanuvchi kartasi rangli border bilan ko'rsatiladi:

- 🔴 **Qizil** - Oylik tugagan
- 🟡 **Sariq** - 5 kun ichida tugaydi
- 🟢 **Yashil** - Oylik faol
- 🟠 **To'q sariq** - Kutayotgan (pending)

## Test Qilish:

### 1. Yangi Akkaunt Yarating:
```
Ism: Test User
Telefon: 912345678
Kod: 1234
```

**Natija:** Avtomatik 30 kun oylik beriladi

### 2. Admin Panelda Ko'ring:
```
Admin Panel → Statistika:
- Jami: 1
- Kutayotgan: 1
- Tasdiqlangan: 0
- Oylik Tugagan: 0
- 5 Kun Ichida Tugaydi: 0
```

### 3. Foydalanuvchini Tasdiqlang:
```
✅ Tasdiqlash → OK
```

### 4. Foydalanuvchi bilan Kiring:
```
Telefon: 912345678
Kod: 1234
```

**Natija:** Hech qanday ogohlantirish yo'q (30 kun qolgan)

### 5. Oylikni Test Qilish (Manual):

LocalStorage da oylikni o'zgartiring:

```javascript
// Konsolda
const data = JSON.parse(localStorage.getItem('nuraziz_local_db'));
const user = data['998912345678'];

// Oylikni 3 kunga qisqartirish
const now = new Date();
user.subscriptionExpiry = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
localStorage.setItem('nuraziz_local_db', JSON.stringify(data));

// Sahifani qayta yuklang va login qiling
```

**Natija:** "⚠️ OGOHLANTIRISH! Oyligingiz 3 kun ichida tugaydi!"

### 6. Oylikni Tugat Test (Manual):

```javascript
// Konsolda
const data = JSON.parse(localStorage.getItem('nuraziz_local_db'));
const user = data['998912345678'];

// Oylikni 2 kun oldin tugat
const now = new Date();
user.subscriptionExpiry = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
localStorage.setItem('nuraziz_local_db', JSON.stringify(data));

// Sahifani qayta yuklang va login qiling
```

**Natija:** "❌ OYLIGINGIZ TUGADI! 2 kun oldin tugagan. 918335005 ga qo'ng'iroq qiling!"

### 7. Oylikni Uzaytirish (Admin):

```
Admin Panel → Foydalanuvchi → ➕ Oylik Uzaytirish
Necha kun? 30
OK
```

**Natija:** "Oylik 30 kun uzaytirildi!"

## Ma'lumotlar Strukturasi:

```javascript
{
  name: "Nuraziz",
  phone: "998912345678",
  pass: "1234",
  approved: true,
  createdAt: "2026-02-07T...",
  subscriptionDate: "2026-02-07T...",      // Oylik boshlangan
  subscriptionExpiry: "2026-03-09T...",    // Oylik tugash sanasi
  subscriptionActive: true,                 // Faol/nofaol
  schedule: {},
  morning: [],
  evening: [],
  goals: [],
  foods: [],
  settings: {...}
}
```

## Xususiyatlar:

### ✅ Avtomatik Oylik
- Yangi foydalanuvchi ro'yxatdan o'tganda 30 kun
- Eski foydalanuvchilar (oyliksiz) birinchi login da 30 kun oladi

### ✅ Login Tekshiruvi
- Har safar login qilganda oylik tekshiriladi
- Tugagan yoki tugashiga yaqin bo'lsa ogohlantirish

### ✅ Admin Statistika
- Oylik tugaganlar soni
- 5 kun ichida tugaydiganlar soni
- Rangli indikatorlar

### ✅ Admin Boshqaruv
- Oylikni uzaytirish (istalgan kun)
- Foydalanuvchi ma'lumotlarida oylik ko'rinadi
- Oylik bo'yicha saralash (tugagan → tugayotgan → faol)

### ✅ MongoDB va LocalStorage
- Ikkalasida ham ishlaydi
- Sinxronlashadi
- Fallback LocalStorage

## Telefon Raqam:

📞 **918335005** - Oylik to'lash uchun qo'ng'iroq qilish kerak

## Natija:

✅ Oylik tizimi to'liq ishlaydi  
✅ Avtomatik 30 kun beriladi  
✅ Login paytida tekshiriladi  
✅ Admin panelda ko'rinadi  
✅ Oylikni uzaytirish mumkin  
✅ Rangli indikatorlar  
✅ Ogohlantirish xabarlari  

---

**Test qiling va natijani ayting!** 🎯
