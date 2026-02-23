# ISH TAB DEBUG - MUAMMONI TOPISH

## MUAMMO

Rasmda faqat "ISH" sarlavhasi va "Ish tab test" matni ko'rsatilmoqda, lekin barcha funksiyalar ko'rinmayapti.

## DEBUG BOSQICHLARI

### 1. Brauzer Konsolini Ochish

1. Brauzerda F12 bosing
2. "Console" tabini tanlang
3. Ish tabiga o'ting
4. Console da quyidagi loglar ko'rsatilishi kerak:

```
WorkTab userData: {phone: "+998...", name: "...", ...}
WorkTab isLocked: true/false
WorkTab savedCode: "..." yoki ""
```

### 2. isLocked Holatini Tekshirish

**Agar `isLocked: true` bo'lsa:**
- Kod ekrani ko'rsatilishi kerak
- Lock icon, kod input, tugma

**Agar `isLocked: false` bo'lsa:**
- Barcha funksiyalar ko'rsatilishi kerak
- Ish ma'lumotlari, vazifalar, hisobot

### 3. savedCode Tekshirish

**Agar `savedCode: ""` (bo'sh) bo'lsa:**
- Birinchi kirish
- "Kod o'rnating" ekrani
- "O'RNATISH" tugmasi

**Agar `savedCode: "1234"` (kod bor) bo'lsa:**
- Keyingi kirish
- "Kodni kiriting" ekrani
- "KIRISH" tugmasi

## KENG TARQALGAN MUAMMOLAR

### Muammo 1: Faqat "ISH" sarlavhasi ko'rsatilmoqda

**Sabab:** isLocked = true, lekin kod ekrani render qilinmayapti

**Yechim:**
1. Brauzer konsolida xatolar bormi tekshiring
2. React DevTools ishlatib, WorkTab komponentini tekshiring
3. Sahifani yangilang (F5)
4. Incognito mode ishlatib ko'ring

### Muammo 2: "Ish tab test" matni qayerdan?

**Sabab:** Bu test uchun qo'lda yozilgan matn yoki eski kod

**Yechim:**
1. WorkTab.jsx da "Ish tab test" qidiring
2. Agar topilmasa, boshqa komponentlarda qidiring
3. Brauzer keshini tozalang

### Muammo 3: Kod kiritilmaydi

**Sabab:** handleCodeSubmit funksiyasi ishlamayapti

**Yechim:**
1. Console da xatolar bormi tekshiring
2. MongoDB ishlab turganini tekshiring
3. Network tabida API so'rovlarni tekshiring

## TEZKOR YECHIM

### Variant 1: Sahifani Yangilash

```
1. Ctrl+Shift+R (hard refresh)
2. Yoki Incognito mode
3. Qayta login qiling
4. Ish tabiga o'ting
```

### Variant 2: Kodni O'chirish

```bash
# Terminal da
node reset-work-code.js

# Keyin brauzerda
F5 (yangilash)
```

### Variant 3: Yangi Foydalanuvchi

```
1. Logout qiling
2. Yangi telefon raqam bilan ro'yxatdan o'ting
3. Sozlamalarda "Ishlayman" ni tanlang
4. Ish tabiga o'ting
```

## KUTILGAN KO'RINISH

### Birinchi Kirish (savedCode = ""):

```
┌─────────────────────────────────┐
│           💼 ISH                │
│                                 │
│         [Lock Icon 80px]        │
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

### Keyingi Kirish (savedCode = "1234"):

```
┌─────────────────────────────────┐
│           💼 ISH                │
│                                 │
│         [Lock Icon 80px]        │
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

### Ichkariga Kirgan (isLocked = false):

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
│  [Progress Bar ████░░░░░]       │
│  ☑ Vazifa 1                     │
│  ☐ Vazifa 2                     │
│  ☐ Vazifa 3                     │
│  ...                            │
│                                 │
│  📊 BUGUNGI HISOBOT             │
│  Qachon kelganingiz: [09:00]    │
│  Necha soat o'tirasiz: [8]      │
│  Nechta mijoz: [5]              │
│  Nima sotdingiz: [...]          │
│  Nima o'rgandingiz: [...]       │
│  Bugungi yutuqlar: [...]        │
│  O'zingizga maslahat: [...]     │
│                                 │
└─────────────────────────────────┘
```

## TEKSHIRISH RO'YXATI

- [ ] Brauzer konsolida xatolar yo'q
- [ ] WorkTab userData to'g'ri
- [ ] isLocked holati to'g'ri
- [ ] savedCode to'g'ri
- [ ] Kod ekrani ko'rsatilmoqda
- [ ] Kod kiritish ishlayapti
- [ ] Barcha funksiyalar ko'rsatilmoqda
- [ ] MongoDB ga saqlanmoqda

## KEYINGI QADAMLAR

1. **Brauzer konsolini tekshiring** - F12 → Console
2. **Loglarni o'qing** - WorkTab userData, isLocked, savedCode
3. **Muammoni aniqlang** - Qaysi holat noto'g'ri?
4. **Yechimni qo'llang** - Yuqoridagi yechimlardan birini tanlang

## YORDAM

Agar muammo hal bo'lmasa:
1. Brauzer konsol loglarini screenshot qiling
2. Network tabini tekshiring (F12 → Network)
3. React DevTools ishlatib, WorkTab komponentini tekshiring
4. MongoDB ishlab turganini tekshiring

---

**Versiya**: 4.2.2
**Sana**: 2026-02-15
