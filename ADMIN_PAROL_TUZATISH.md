# 🔐 ADMIN PAROL VA TELEFON TUZATISH

## ✅ QILGAN ISHLAR

### 1. React Frontend (src/components/LoginScreen.jsx)
- ✅ Telefon validatsiyasi qo'shildi
- ✅ +998 dan keyin kamida 1 raqam kerak
- ✅ Admin parol = 1234 (demo kod)
- ✅ MongoDB da saqlash

### 2. Demo Akkaunt Yaratish
```bash
node init-demo-account.js
```

Bu buyruq:
- ✅ +998 90 123 45 67 telefon bilan akkaunt yaratadi
- ✅ Parol: 1234 (admin parol)
- ✅ MongoDB da saqlanadi
- ✅ Barcha ma'lumotlar saqlanadi

---

## 📱 TELEFON FORMATI

### Qabul qilinadi:
```
+998 90 123 45 67  ✅
+998 1             ✅ (kamida 1 raqam)
+998 9             ✅
+998 901           ✅
```

### Qabul qilinmaydi:
```
+998                ❌ (raqam yo'q)
998 90 123 45 67   ❌ (+998 kerak)
90 123 45 67       ❌ (+998 kerak)
```

---

## 🔐 PAROL TIZIMI

### Admin Parol
```
Parol: 1234
Turi: 4 raqamli kod
Foydalanish: Login va Register
```

### Parol Validatsiyasi
```
- Minimum: 4 raqam
- Maksimum: 6 raqam
- Faqat raqamlar
- Tasdiqlash kerak (Register)
```

---

## 📊 DEMO AKKAUNT

### Yaratish
```bash
node init-demo-account.js
```

### Kirish
```
Telefon: +998 90 123 45 67
Parol: 1234
```

### MongoDB da Saqlangan
```json
{
  "phone": "+998 90 123 45 67",
  "pass": "1234",
  "name": "Demo User",
  "approved": true,
  "schedule": {},
  "morning": [],
  "evening": [],
  "goals": [],
  "foods": [],
  "videos": [],
  "gallery": [],
  "settings": {},
  "createdAt": "2026-02-10T..."
}
```

---

## 🚀 QANDAY FOYDALANISH

### 1. Demo Akkauntni Yaratish
```bash
# Terminal da
node init-demo-account.js

# Natija:
# ✅ Demo akkaunt MongoDB da yaratildi!
# 📱 Telefon: +998 90 123 45 67
# 🔐 Parol: 1234
```

### 2. Frontend da Kirish
```
http://localhost:5173
Telefon: +998 90 123 45 67
Parol: 1234
```

### 3. Yangi Akkaunt Yaratish
```
Ismingiz: Sizning ismingiz
Telefon: +998 1 (kamida 1 raqam)
Parol: 1234 (4-6 raqam)
Tasdiqlash: 1234
```

---

## 💾 MONGODB INTEGRATSIYA

### Har bir ish saqlanadi:
- ✅ Kunlik jadval
- ✅ Ertalab mashqlari
- ✅ Kechqurun mashqlari
- ✅ Maqsadlar
- ✅ Ovqatlanish
- ✅ Video mashg'ulotlar
- ✅ Galereya
- ✅ Hisobotlar

### Saqlash Jarayoni
```javascript
// Frontend
await fetch('/api/save-user', {
  method: 'POST',
  body: JSON.stringify(userData)
})

// Backend
await dbManager.saveUser(phone, userData)

// MongoDB
db.users.updateOne(
  { phone },
  { $set: userData },
  { upsert: true }
)
```

---

## 🔍 VALIDATSIYA QOIDALARI

### Telefon
```
Format: +998 XX XXX XX XX
Minimum: +998 + 1 raqam
Maksimum: +998 + 9 raqam
Faqat raqamlar
```

### Parol
```
Minimum: 4 raqam
Maksimum: 6 raqam
Faqat raqamlar
Tasdiqlash kerak
```

### Ism
```
Minimum: 1 harf
Maksimum: 50 harf
Harflar va raqamlar
```

---

## 🎯 ADMIN PAROL TIZIMI

### Tizim
```
Admin Parol = Demo Kod = 1234
```

### Foydalanish
```
1. Login: +998 90 123 45 67 / 1234
2. Admin Panel ga o'tish
3. Narx va chegirma belgilash
4. Foydalanuvchilarni boshqarish
```

### Xavfsizlik
```
- Parol hashing (production)
- HTTPS (production)
- Rate limiting
- Input validation
```

---

## 📝 QADAMLAR

### 1. Demo Akkauntni Yaratish
```bash
node init-demo-account.js
```

### 2. Frontend ni Ishga Tushirish
```bash
npm run dev
```

### 3. Backend ni Ishga Tushirish
```bash
npm run server
```

### 4. Brauzerda Oching
```
http://localhost:5173
```

### 5. Kirish
```
Telefon: +998 90 123 45 67
Parol: 1234
```

### 6. Yangi Akkaunt Yaratish
```
Ismingiz: Test User
Telefon: +998 1
Parol: 1234
Tasdiqlash: 1234
```

---

## ✅ TEKSHIRISH

### Demo Akkaunt
```bash
# MongoDB da tekshirish
mongo
use nuraziz_db
db.users.findOne({ phone: "+998 90 123 45 67" })
```

### Frontend Validatsiya
```
1. +998 kiritish - Xato (raqam kerak)
2. +998 1 kiritish - OK
3. +998 90 123 45 67 kiritish - OK
4. Parol 123 - Xato (4-6 kerak)
5. Parol 1234 - OK
```

### MongoDB Saqlash
```
1. Yangi akkaunt yaratish
2. Kunlik jadval qo'shish
3. Mashq qo'shish
4. MongoDB da tekshirish
```

---

## 🆘 MUAMMOLAR

### Demo Akkaunt yaratilmadi
```bash
# MongoDB ishlab turganini tekshiring
mongod

# Qayta yaratish
node init-demo-account.js
```

### Telefon validatsiyasi ishlamayapti
```
Frontend: src/components/LoginScreen.jsx
validatePhone() funksiyasini tekshiring
```

### Parol noto'g'ri
```
Admin Parol = 1234
Boshqa parol = 4-6 raqam
```

### MongoDB da saqlanmadi
```
1. MongoDB ishlab turganini tekshiring
2. Server loglarni ko'ring
3. Browser console da xatolarni ko'ring
```

---

## 📚 FAYLLAR

### React Frontend
- `src/components/LoginScreen.jsx` - Validatsiya qo'shildi

### Backend
- `server.js` - API endpoints
- `db-manager.js` - MongoDB integratsiya
- `init-demo-account.js` - Demo akkaunt yaratish

### HTML Versiyalar
- `nuraziz-complete-v2.html` - To'liq versiya
- `nuraziz-premium-v3.html` - Premium versiya

---

## 🎊 TAYYOR!

### Hozir qilish mumkin:
1. ✅ `node init-demo-account.js` - Demo akkaunt yaratish
2. ✅ `npm run dev` - Frontend ishga tushirish
3. ✅ `npm run server` - Backend ishga tushirish
4. ✅ `http://localhost:5173` - Brauzerda oching
5. ✅ Demo akkaunt bilan kiring
6. ✅ Yangi akkaunt yaratish
7. ✅ Kunlik jadval qo'shish
8. ✅ MongoDB da tekshirish

---

**Versiya:** 4.1 (Admin Parol + Telefon Validatsiya)
**Sana:** 2026-02-10
**Muallif:** Kiro AI
**Litsenziya:** MIT

🔐 **ADMIN PAROL TIZIMI TAYYOR!** 🔐
