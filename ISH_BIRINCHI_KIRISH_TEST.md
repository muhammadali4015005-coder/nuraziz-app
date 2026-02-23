# ISH TABIGA BIRINCHI KIRISH - TEST QILISH

## HOZIRGI HOLAT

WorkTab.jsx da birinchi kirish funksiyasi allaqachon mavjud va to'g'ri ishlaydi:

1. **Birinchi marta kirish:**
   - Kod o'rnatish ekrani ko'rsatiladi
   - 4-6 raqamli kod o'rnatish kerak
   - Kod MongoDB ga saqlanadi

2. **Keyingi kirishlar:**
   - Kod so'raladi
   - To'g'ri kod kiritilsa, ichkariga kirish mumkin

## MUAMMO

Agar siz allaqachon kod o'rnatgan bo'lsangiz, birinchi kirish ekranini ko'ra olmaysiz.

## YECHIM

### Variant 1: Yangi Foydalanuvchi Yaratish

1. Logout qiling
2. Yangi telefon raqam bilan ro'yxatdan o'ting
3. Sozlamalarda "Ishlayman" ni tanlang
4. Ish tabiga o'ting
5. Kod o'rnatish ekrani ko'rsatiladi

### Variant 2: Kod O'chirish (Test Uchun)

```bash
node reset-work-code.js
```

Bu script demo foydalanuvchi uchun workCode ni o'chiradi.

**Keyin:**
1. Brauzerda sahifani yangilang (F5)
2. Ish tabiga o'ting
3. Kod o'rnatish ekrani ko'rsatiladi

## TEST QILISH BOSQICHLARI

### 1. Kod O'chirish

```bash
node reset-work-code.js
```

**Kutilgan natija:**
```
✅ MongoDB ga ulandi
✅ Work code o'chirildi: +998901234567
Endi Ish tabiga kirganingizda kod o'rnatish ekrani ko'rsatiladi
```

### 2. Sahifani Yangilash

- Brauzerda F5 bosing
- Yoki Ctrl+Shift+R (hard refresh)

### 3. Ish Tabiga O'tish

- Burger menyudan "Ish" ni tanlang

**Kutilgan natija:**
- 🔒 Lock icon ko'rsatiladi
- "Kod o'rnating" sarlavhasi
- "Ish bo'limini himoya qilish uchun 4-6 raqamli kod o'rnating" matni
- Kod input maydoni
- "O'RNATISH" tugmasi

### 4. Kod O'rnatish

1. 4-6 raqamli kod kiriting (masalan: 1234)
2. "O'RNATISH" tugmasini bosing

**Kutilgan natija:**
- "Kod o'rnatildi!" alert
- Ish tabiga kirish
- Barcha funksiyalar ko'rsatiladi

### 5. Logout va Qayta Kirish

1. Logout qiling
2. Qayta login qiling
3. Ish tabiga o'ting

**Kutilgan natija:**
- 🔒 Lock icon ko'rsatiladi
- "Kodni kiriting" sarlavhasi
- "Ish bo'limiga kirish uchun kodni kiriting" matni
- Kod input maydoni
- "KIRISH" tugmasi

### 6. Kod Kiriting

1. O'rnatgan kodingizni kiriting (1234)
2. "KIRISH" tugmasini bosing

**Kutilgan natija:**
- Ish tabiga kirish
- Barcha funksiyalar ko'rsatiladi

## XUSUSIYATLAR

### ✅ Birinchi Kirish
- Kod o'rnatish ekrani
- 4-6 raqam validatsiya
- MongoDB ga saqlash
- Alert xabari

### ✅ Keyingi Kirishlar
- Kod so'rash ekrani
- Kod tekshirish
- Noto'g'ri kod uchun xabar
- To'g'ri kod bilan kirish

### ✅ Kod O'zgartirish
- Hozirgi ish kodi
- Akkaunt paroli
- Yangi kod
- 3 bosqichli tekshirish

## EKRAN KO'RINISHI

### Birinchi Kirish (Kod O'rnatish):
```
┌─────────────────────────────────┐
│           🔒 ISH                │
│                                 │
│         [Lock Icon]             │
│                                 │
│      Kod o'rnating              │
│                                 │
│  Ish bo'limini himoya qilish    │
│  uchun 4-6 raqamli kod          │
│  o'rnating                      │
│                                 │
│  [____________________]         │
│   Kod (4-6 raqam)               │
│                                 │
│     [O'RNATISH]                 │
│                                 │
└─────────────────────────────────┘
```

### Keyingi Kirishlar (Kod So'rash):
```
┌─────────────────────────────────┐
│           🔒 ISH                │
│                                 │
│         [Lock Icon]             │
│                                 │
│      Kodni kiriting             │
│                                 │
│  Ish bo'limiga kirish uchun     │
│  kodni kiriting                 │
│                                 │
│  [____________________]         │
│   Kod (4-6 raqam)               │
│                                 │
│     [KIRISH]                    │
│                                 │
└─────────────────────────────────┘
```

### Ichkariga Kirgan (Unlocked):
```
┌─────────────────────────────────┐
│  💼 ISH            [🔒 YOPISH]  │
│                                 │
│  ⚠️ Eslatma: Kodni o'zgartirish │
│  uchun hozirgi ish kodi va      │
│  akkaunt parolingiz kerak       │
│                                 │
│     [🔒 KOD O'ZGARTIRISH]       │
│                                 │
│  💼 ISH MA'LUMOTLARI            │
│  Ish turi: Dasturchi            │
│  Lavozim: Senior                │
│  Tajriba: 5 yil                 │
│  Ish vaqti: 09:00 - 18:00       │
│                                 │
│  ✅ BUGUNGI VAZIFALAR (2/5)     │
│  [Progress Bar]                 │
│  ☑ Vazifa 1                     │
│  ☐ Vazifa 2                     │
│  ...                            │
│                                 │
│  📊 BUGUNGI HISOBOT             │
│  Kelgan vaqt: [09:00]           │
│  Ish soatlari: [8]              │
│  Mijozlar: [5]                  │
│  ...                            │
│                                 │
└─────────────────────────────────┘
```

## XATOLAR VA YECHIMLAR

### Xato 1: Kod o'rnatish ekrani ko'rsatilmaydi
**Sabab:** Kod allaqachon o'rnatilgan
**Yechim:** `node reset-work-code.js` ni ishga tushiring

### Xato 2: "Kod noto'g'ri!" xabari
**Sabab:** Noto'g'ri kod kiritilgan
**Yechim:** To'g'ri kodni kiriting yoki kodni o'zgartiring

### Xato 3: Kod o'rnatilmaydi
**Sabab:** 4-6 raqam emas
**Yechim:** 4-6 raqamli kod kiriting

### Xato 4: MongoDB xatosi
**Sabab:** MongoDB ishlamayapti
**Yechim:** MongoDB ni ishga tushiring

## FAYLLAR

### Mavjud:
- `src/components/tabs/WorkTab.jsx` - Asosiy kod
- `server.js` - Backend API
- `db-manager.js` - MongoDB boshqaruv

### Yangi:
- `reset-work-code.js` - Test uchun kod o'chirish
- `ISH_BIRINCHI_KIRISH_TEST.md` - Bu qo'llanma

## XULOSA

WorkTab da birinchi kirish funksiyasi to'liq ishlaydi:
- ✅ Kod o'rnatish ekrani
- ✅ Kod so'rash ekrani
- ✅ Kod o'zgartirish
- ✅ MongoDB ga saqlash
- ✅ Validatsiya

Test qilish uchun `node reset-work-code.js` ni ishlatib, kodni o'chiring va qayta sinab ko'ring.

**Versiya**: 4.2.2
**Sana**: 2026-02-15
**Status**: ✅ ISHLAYDI
