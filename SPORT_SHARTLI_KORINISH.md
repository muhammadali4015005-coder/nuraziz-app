# Sport Tab - Shartli Ko'rinish

## ✅ Muammo va Yechim

### Muammo
Sozlamalarda "Sport qilasizmi?" da "YO'Q" tanlansa ham, burger menyuda (Sidebar) "Sport Mashqlari" tab ko'rinardi.

### Yechim
Endi "Sport Mashqlari" tab faqat `doesSport === true` bo'lsa ko'rinadi.

---

## 📋 O'zgarishlar

### Sidebar.jsx

**Eski:**
```jsx
const userTabs = [
  { id: 'sport', label: 'Sport Mashqlari', ... },
  // Doim ko'rinardi
]
```

**Yangi:**
```jsx
const userTabs = [
  // Sport yo'q (faqat shartli qo'shiladi)
]

// Sport faqat doesSport === true bo'lsa
if (settings.doesSport === true) {
  userTabs.splice(insertIndex, 0, { 
    id: 'sport', 
    label: 'Sport Mashqlari', 
    section: 'ASOSIY',
    icon: Dumbbell
  })
}
```

---

## 🎯 Mantiq

### doesSport === false (YO'Q)
```
✓ Sozlamalar: "Sport qilasizmi?" → YO'Q
✓ Sidebar: "Sport Mashqlari" tab YO'Q ❌
✓ Sport maydonlari: Yashiringan
```

### doesSport === true (HA)
```
✓ Sozlamalar: "Sport qilasizmi?" → HA
✓ Sidebar: "Sport Mashqlari" tab BOR ✅
✓ Sport maydonlari: Ko'rinadi (1/2 mahal, sport nomlari)
```

---

## 🧪 Test Qilish

### Test 1: Sport YO'Q
```
1. Sozlamalarga kiring
2. "SPORT QILASIZMI?" → "YO'Q" tanlang
3. Sidebar ni oching (burger menyu)
4. "Sport Mashqlari" tab ko'rinmasligi kerak ❌
5. Faqat: Sozlamalar, Kunlik Tartib, AI Ovqatlanish, va boshqalar
```

### Test 2: Sport HA
```
1. Sozlamalarga kiring
2. "SPORT QILASIZMI?" → "HA" tanlang
3. 1 yoki 2 mahal tanlang
4. Sport nomlarini kiriting
5. Sidebar ni oching (burger menyu)
6. "Sport Mashqlari" tab ko'rinishi kerak ✅
7. Tab ni bosing → Sport Mashqlari sahifasi ochiladi
```

### Test 3: O'zgartirish
```
1. Avval "HA" tanlang → Sport tab paydo bo'ladi
2. Sozlamalarga qaytib "YO'Q" tanlang
3. Sidebar ni oching
4. "Sport Mashqlari" tab yo'qolishi kerak ❌
```

---

## 📊 Sidebar Tab Tartibi

### Sport YO'Q bo'lsa:
```
ASOSIY:
1. Sozlamalar
2. Kunlik Tartib
3. [Maktab/Ish] (agar bor bo'lsa)
4. [Uy ishlari] (agar bor bo'lsa)
5. AI Ovqatlanish
6. Video Maslahat
7. Maqsadlar
8. Rejalar
9. Admin bilan gaplashish

TAHLIL:
10. AI Maslahat
11. Haftalik
12. Statistika
```

### Sport HA bo'lsa:
```
ASOSIY:
1. Sozlamalar
2. Kunlik Tartib
3. [Maktab/Ish] (agar bor bo'lsa)
4. [Uy ishlari] (agar bor bo'lsa)
5. Sport Mashqlari ✅ (yangi)
6. AI Ovqatlanish
7. Video Maslahat
8. Maqsadlar
9. Rejalar
10. Admin bilan gaplashish

TAHLIL:
11. AI Maslahat
12. Haftalik
13. Statistika
```

---

## 💡 Muhim Eslatmalar

1. **Dinamik Tab**
   - Sport tab dinamik qo'shiladi
   - Faqat `doesSport === true` bo'lsa
   - Maktab/Ish/Uy ishlari dan keyin

2. **insertIndex**
   - Maktab/Ish/Uy ishlari qo'shilgandan keyin
   - Sport shu pozitsiyaga qo'shiladi
   - Tartib saqlanadi

3. **Backward Compatibility**
   - Eski foydalanuvchilar uchun: `doesSport` undefined bo'lsa, sport ko'rinmaydi
   - Yangi foydalanuvchilar: Aniq "HA" tanlashlari kerak

4. **Auto-Save**
   - Sozlamalarda o'zgartirish avtomatik saqlanadi
   - Sidebar avtomatik yangilanadi
   - Sahifani yangilash kerak emas

---

## 📁 Fayllar

### O'zgartirilgan
- `src/components/Sidebar.jsx` - Sport tab shartli qo'shiladi

### Yaratilgan
- `SPORT_SHARTLI_KORINISH.md` - Bu fayl

---

## 🎉 Natija

Endi "Sport Mashqlari" tab faqat foydalanuvchi sport qilishni tanlasa ko'rinadi!

**Mantiq:**
- Sport YO'Q → Tab yo'q ❌
- Sport HA → Tab bor ✅

---

**Versiya**: 2.2.1  
**Sana**: 2026-02-16  
**Status**: ✅ TAYYOR
