# Uy Ishlari + Ish - Ikkaviham Varianti

## ✅ Qo'shilgan Xususiyat

### Muammo
Ba'zi ayollar ham uy ishlarini, ham ishni qiladi. Eski versiyada faqat 2 ta variant bor edi:
- 💼 ISHLAYMAN
- 🏠 UY BEKASI

### Yechim
Endi 3 ta variant mavjud:
1. 💼 **FAQAT ISHLAYMAN** - Faqat ish
2. 🏠 **FAQAT UY BEKASI** - Faqat uy ishlari
3. 💼🏠 **IKKAVIHAM (ISH + UY ISHLARI)** - Ikkala variant ham

---

## 📋 O'zgarishlar

### 1. SettingsTab.jsx - JINS Bo'limi

**Eski:**
```jsx
<button>💼 ISHLAYMAN</button>
<button>🏠 UY BEKASI</button>
```

**Yangi:**
```jsx
<button>💼 FAQAT ISHLAYMAN</button>
<button>🏠 FAQAT UY BEKASI</button>
<button>💼🏠 IKKAVIHAM (ISH + UY ISHLARI)</button>
```

**Tugmalar:**
- Vertikal tartibda (flexDirection: 'column')
- Har biri to'liq kenglikda
- Aniq matn bilan

### 2. MAKTAB YOKI ISH Bo'limi

**Eski:**
```jsx
{!isHousewife && (
  // MAKTAB YOKI ISH
)}
```

**Yangi:**
```jsx
{isHousewife !== true && (
  // MAKTAB YOKI ISH
)}
```

**Mantiq:**
- `isHousewife === false` → FAQAT ISHLAYMAN → MAKTAB/ISH ko'rinadi ✅
- `isHousewife === 'both'` → IKKAVIHAM → MAKTAB/ISH ko'rinadi ✅
- `isHousewife === true` → FAQAT UY BEKASI → MAKTAB/ISH yashirinadi ❌

### 3. Sidebar.jsx - Uy Ishlari Tab

**Eski:**
```jsx
if (settings.gender === 'female' && settings.isHousewife) {
  // Uy ishlari tab
}
```

**Yangi:**
```jsx
if (settings.gender === 'female' && 
    (settings.isHousewife === true || settings.isHousewife === 'both')) {
  // Uy ishlari tab
}
```

**Mantiq:**
- `isHousewife === false` → FAQAT ISHLAYMAN → Uy ishlari yo'q ❌
- `isHousewife === true` → FAQAT UY BEKASI → Uy ishlari bor ✅
- `isHousewife === 'both'` → IKKAVIHAM → Uy ishlari bor ✅

### 4. Xulosasi

**Yangi:**
```jsx
{gender === 'female' && isHousewife && (
  <p>
    🏠 Holat: 
    {isHousewife === true ? 'Faqat uy bekasi' : 
     isHousewife === 'both' ? 'Ish + Uy ishlari' : 
     'Faqat ishlayman'}
  </p>
)}
```

---

## 🎯 Foydalanuvchi Tajribasi

### Variant 1: FAQAT ISHLAYMAN
```
✓ JINS: Ayol
✓ Holat: FAQAT ISHLAYMAN
✓ MAKTAB YOKI ISH: Ko'rinadi
✓ Sidebar: Ish tab bor, Uy ishlari yo'q
✓ Xulosasi: "Faqat ishlayman"
```

### Variant 2: FAQAT UY BEKASI
```
✓ JINS: Ayol
✓ Holat: FAQAT UY BEKASI
✓ MAKTAB YOKI ISH: Yashirinadi
✓ Sidebar: Uy ishlari tab bor, Ish yo'q
✓ Xulosasi: "Faqat uy bekasi"
```

### Variant 3: IKKAVIHAM
```
✓ JINS: Ayol
✓ Holat: IKKAVIHAM (ISH + UY ISHLARI)
✓ MAKTAB YOKI ISH: Ko'rinadi
✓ Sidebar: Ish tab bor, Uy ishlari tab bor
✓ Xulosasi: "Ish + Uy ishlari"
```

---

## 🧪 Test Qilish

### 1. FAQAT ISHLAYMAN
```
1. Sozlamalarga kiring
2. JINS: Ayol tanlang
3. "FAQAT ISHLAYMAN" tugmasini bosing
4. MAKTAB YOKI ISH bo'limi ko'rinishi kerak
5. Sidebar da "Ish" tab bo'lishi kerak
6. Sidebar da "Uy ishlari" tab bo'lmasligi kerak
7. Xulosada "Faqat ishlayman" ko'rinishi kerak
```

### 2. FAQAT UY BEKASI
```
1. Sozlamalarga kiring
2. JINS: Ayol tanlang
3. "FAQAT UY BEKASI" tugmasini bosing
4. MAKTAB YOKI ISH bo'limi yashirilishi kerak
5. Sidebar da "Uy ishlari" tab bo'lishi kerak
6. Sidebar da "Ish" tab bo'lmasligi kerak
7. Xulosada "Faqat uy bekasi" ko'rinishi kerak
```

### 3. IKKAVIHAM
```
1. Sozlamalarga kiring
2. JINS: Ayol tanlang
3. "IKKAVIHAM (ISH + UY ISHLARI)" tugmasini bosing
4. MAKTAB YOKI ISH bo'limi ko'rinishi kerak
5. Sidebar da "Ish" tab bo'lishi kerak
6. Sidebar da "Uy ishlari" tab bo'lishi kerak
7. Xulosada "Ish + Uy ishlari" ko'rinishi kerak
```

---

## 📊 Ma'lumotlar Strukturasi

### Database
```javascript
{
  settings: {
    gender: 'female',
    isHousewife: false | true | 'both'
    // false - Faqat ishlayman
    // true - Faqat uy bekasi
    // 'both' - Ikkaviham
  }
}
```

### State
```javascript
const [isHousewife, setIsHousewife] = useState(false)
// false - Faqat ishlayman
// true - Faqat uy bekasi
// 'both' - Ikkaviham
```

---

## 📁 Fayllar

### O'zgartirilgan
- `src/components/tabs/SettingsTab.jsx` - 3 ta variant qo'shildi
- `src/components/Sidebar.jsx` - Uy ishlari tab shartini yangilandi

### Yaratilgan
- `UY_ISHLARI_IKKAVIHAM.md` - Bu fayl

---

## 💡 Muhim Eslatmalar

1. **Backward Compatibility**
   - Eski ma'lumotlar (`isHousewife: true/false`) ishlaydi
   - Yangi variant (`isHousewife: 'both'`) qo'shildi

2. **Sidebar**
   - "Ish" tab: `userType === 'work' || userType === 'both'`
   - "Uy ishlari" tab: `isHousewife === true || isHousewife === 'both'`

3. **MAKTAB YOKI ISH**
   - Faqat `isHousewife !== true` bo'lsa ko'rinadi
   - Ya'ni: FAQAT ISHLAYMAN va IKKAVIHAM uchun

4. **Xulosasi**
   - Aniq holat ko'rsatiladi
   - 3 ta variant: "Faqat ishlayman", "Faqat uy bekasi", "Ish + Uy ishlari"

---

## 🎉 Natija

Endi ayollar uchun 3 ta aniq variant mavjud:
1. ✅ Faqat ishlayman
2. ✅ Faqat uy bekasi
3. ✅ Ikkaviham (Ish + Uy ishlari)

Har bir variant uchun to'g'ri tablar va bo'limlar ko'rsatiladi!

---

**Versiya**: 2.2.0  
**Sana**: 2026-02-16  
**Status**: ✅ TAYYOR
