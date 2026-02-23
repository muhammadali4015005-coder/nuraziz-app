# 🚀 Ishga Tushirish Qo'llanmasi

## Tezkor Boshlash

### 1. Development Rejimida

```bash
npm run dev
```

Bu buyruq:
- ✅ Backend serverni ishga tushiradi (port 5003)
- ✅ Frontend Vite dev serverni ishga tushiradi (port 5174)
- ✅ Brauzer avtomatik ochiladi

### 2. Alohida Ishga Tushirish

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 3. Production Build

```bash
# Build qilish
npm run build

# Build ni test qilish
npm run preview

# Production serverni ishga tushirish
npm start
```

---

## 📍 Manzillar

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:5003
- **MongoDB**: mongodb://localhost:27017

---

## 🧪 Sozlamalar Tab Testi

### Kirish
1. Brauzerda http://localhost:5174 oching
2. Login qiling yoki ro'yxatdan o'ting
3. Sidebar dan "Sozlamalar" ni tanlang

### Test Qilish

#### 1. ISM / YOSH
- ✓ Ismni kiriting
- ✓ Yoshni kiriting (1-120)
- ✓ 1 soniya kuting → Auto-save

#### 2. JINS
- ✓ Erkak tanlang → Uy bekasi ko'rinmasligi kerak
- ✓ Ayol tanlang → Ishlayman/Uy bekasi paydo bo'lishi kerak
- ✓ Uy bekasi tanlang → "MAKTAB YOKI ISH" yashirilishi kerak

#### 3. IZOH
- ✓ Uzun matn yozing
- ✓ Xulosada 50 belgidan keyin "..." ko'rinishi kerak

#### 4. SPORT
- ✓ Yo'q tanlang → Sport maydonlari yashirilishi kerak
- ✓ Ha tanlang → Mahal tanlovi paydo bo'lishi kerak
- ✓ 1 mahal → 1 ta sport input
- ✓ 2 mahal → 2 ta sport input

#### 5. MAKTAB/ISH
- ✓ Maktab tanlang → Sinf dropdown
- ✓ Ish tanlang → Ish maydonlari
- ✓ Ikkaviham → Barcha maydonlar

#### 6. XULOSASI
- ✓ Barcha to'ldirilgan ma'lumotlar ko'rinishi kerak
- ✓ Ikonkalar bilan
- ✓ Ranglar to'g'ri

### Console Tekshiruvi

Browser console ni oching (F12) va quyidagilarni tekshiring:

```
✓ Xatolar yo'q
✓ "💾 Saving settings to MongoDB" ko'rinadi
✓ "✅ Settings saved successfully" ko'rinadi
```

### Network Tekshiruvi

Network tab ni oching va quyidagilarni tekshiring:

```
✓ /api/save-settings - Status: 200
✓ Response: {"success": true}
```

### Refresh Testi

```
✓ Sahifani yangilang (F5)
✓ Barcha ma'lumotlar saqlanib qolishi kerak
```

---

## 🐛 Muammolarni Hal Qilish

### 1. Server Ishlamayapti

```bash
# MongoDB ishga tushirish
mongod

# Yoki MongoDB o'rnatilmagan bo'lsa
# Fayl bazasiga avtomatik o'tadi
```

### 2. Port Band

```bash
# 5003 portni tekshirish
netstat -ano | findstr :5003

# 5174 portni tekshirish
netstat -ano | findstr :5174

# Agar band bo'lsa, process ni to'xtatish
taskkill /PID <PID> /F
```

### 3. Build Xatosi

```bash
# node_modules ni tozalash
rmdir /s /q node_modules
del package-lock.json

# Qayta o'rnatish
npm install

# Build
npm run build
```

### 4. Ma'lumotlar Saqlanmayapti

- ✓ MongoDB ishga tushganini tekshiring
- ✓ Console da xatolar borligini tekshiring
- ✓ Network tab da API so'rovlarini tekshiring
- ✓ Demo foydalanuvchi (+998901234567) emasligini tekshiring

---

## 📚 Qo'shimcha Hujjatlar

- `SOZLAMALAR_README.md` - To'liq qo'llanma
- `SOZLAMALAR_TEST_QOLLANMA.md` - Batafsil test qo'llanmasi
- `SOZLAMALAR_YAKUNIY_HOLAT.md` - Texnik tafsilotlar
- `YAKUNIY_XULOSA_2026_02_16.md` - Yakuniy xulosa

---

## ✅ Tayyor!

Agar hamma narsa to'g'ri ishlasa:

```
╔════════════════════════════════════════╗
║                                        ║
║     🎉 TABRIKLAYMIZ!                   ║
║                                        ║
║  Sozlamalar tab muvaffaqiyatli         ║
║  ishga tushdi va ishlayapti!           ║
║                                        ║
║  Endi foydalanishingiz mumkin! 🚀      ║
║                                        ║
╚════════════════════════════════════════╝
```

---

**Versiya**: 2.0.0  
**Sana**: 2026-02-16  
**Status**: ✅ TAYYOR
