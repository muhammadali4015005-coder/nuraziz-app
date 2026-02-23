# 🏠 UY BEKASI FUNKSIYASI QO'SHILDI

## ✅ BAJARILGAN ISHLAR

### 1. JINS TANLASH (Erkak/Ayol)
- ✅ SettingsTab ga "JINS" bo'limi qo'shildi
- ✅ Erkak/Ayol tugmalari
- ✅ State o'zgaruvchilar: `gender`, `isHousewife`
- ✅ MongoDB ga saqlash

### 2. AYOL UCHUN QO'SHIMCHA TANLOV
- ✅ Ayol tanlansa: "Ishlayman" yoki "Uy bekasi" tanlash
- ✅ Uy bekasi tanlansa: Burger menyuga "Uy ishlari" chiqadi

### 3. UY ISHLARI TAB (HouseworkTab.jsx)
- ✅ WorkTab ga o'xshash struktura
- ✅ Kod himoyasi (4-6 raqam)
- ✅ Birinchi kirishda kod o'rnatish
- ✅ Keyingi kirishlarda kod bilan kirish

### 4. UY ISHLARI FUNKSIYALARI
**Bugungi vazifalar:**
- ✅ Vazifa qo'shish
- ✅ Vazifa belgilash (Qilindi/Qilinmadi)
- ✅ Vazifa o'chirish
- ✅ Progress bar

**Bugungi hisobot:**
- 🍳 Nonushta nima pishirdingiz?
- 🍲 Tushlik nima pishirdingiz?
- 🍽️ Kechki ovqat nima pishirdingiz?
- 🧹 Qayerlarni tozaladingiz?
- 👕 Kir yuvdingizmi?
- 🛒 Xarid qildingizmi?
- 📝 Boshqa ishlar

### 5. SIDEBAR INTEGRATSIYASI
- ✅ Agar `gender === 'female'` va `isHousewife === true` bo'lsa
- ✅ Burger menyuga "🏠 Uy ishlari" chiqadi
- ✅ Home icon qo'shildi

### 6. MAINSCREEN INTEGRATSIYASI
- ✅ HouseworkTab import qilindi
- ✅ tabs object ga qo'shildi
- ✅ `housework` tab ID bilan

## 📋 QANDAY ISHLAYDI

### 1-qadam: Jins tanlash
1. SOZLAMALAR ga kiring
2. "JINS" bo'limida "ERKAK" yoki "AYOL" ni tanlang

### 2-qadam: Ayol uchun qo'shimcha
1. Agar "AYOL" tanlasangiz
2. "ISHLAYMAN" yoki "UY BEKASI" ni tanlang

### 3-qadam: Uy ishlari ga kirish
1. Agar "UY BEKASI" tanlasangiz
2. Burger menyuda "🏠 Uy ishlari" paydo bo'ladi
3. Bosing

### 4-qadam: Kod o'rnatish (Birinchi kirish)
1. 4-6 raqamli kod kiriting
2. "O'RNATISH" ni bosing
3. Kod saqlanadi

### 5-qadam: Kod bilan kirish (Keyingi kirishlar)
1. Avval o'rnatgan kodingizni kiriting
2. "KIRISH" ni bosing
3. Uy ishlari ochiladi

### 6-qadam: Vazifalar qo'shish
1. "YANGI VAZIFA QO'SHISH" qismida
2. Vazifa nomini yozing
3. "QO'SHISH" ni bosing

### 7-qadam: Hisobot to'ldirish
1. Bugungi ovqatlar
2. Tozalash
3. Kir yuvish
4. Xarid
5. Boshqa ishlar

## 🗂️ YANGI FAYLLAR

1. **src/components/tabs/HouseworkTab.jsx** - Uy ishlari tab komponenti
2. **UY_BEKASI_FUNKSIYASI_QOSHILDI.md** - Bu hujjat

## 🔧 O'ZGARTIRILGAN FAYLLAR

1. **src/components/tabs/SettingsTab.jsx**
   - `gender` state qo'shildi
   - `isHousewife` state qo'shildi
   - JINS bo'limi UI qo'shildi
   - Ayol uchun qo'shimcha tanlov

2. **src/components/Sidebar.jsx**
   - `Home` icon import qilindi
   - Uy bekasi uchun "Uy ishlari" tab qo'shildi

3. **src/components/MainScreen.jsx**
   - `HouseworkTab` import qilindi
   - `housework` tab qo'shildi

## 💾 MA'LUMOTLAR STRUKTURASI

```javascript
{
  phone: "+998901234567",
  name: "Foydalanuvchi",
  settings: {
    gender: "female",           // 'male' yoki 'female'
    isHousewife: true,          // true yoki false
    // ... boshqa sozlamalar
  },
  houseworkCode: "1234",        // Kod himoyasi
  houseworkDaily: {
    "2024-02-16": {
      tasks: [
        { id: 123, text: "Oshxonani tozalash", completed: true },
        { id: 124, text: "Kir yuvish", completed: false }
      ],
      report: {
        breakfast: "Tuxum, non, choy",
        lunch: "Osh, salat",
        dinner: "Sho'rva, non",
        cleaning: "Oshxona, yotoqxona",
        laundry: "Oilaviy kiyimlar",
        shopping: "Sabzavot, meva",
        other: "Boshqa ishlar"
      }
    }
  }
}
```

## 🎨 DIZAYN

- **Rang:** Ko'k (#00d4ff) - asosiy
- **Rang:** Yashil (#00ff88) - bajarilgan
- **Rang:** Qizil (#ff0055) - o'chirish
- **Rang:** Sariq (#ffaa00) - hisobot
- **Icon:** 🏠 Home - Uy ishlari
- **Icon:** 🔒 Lock - Kod himoyasi

## ✅ TEST QILISH

1. **Jins tanlash:**
   - ERKAK tanlash ✓
   - AYOL tanlash ✓

2. **Ayol uchun:**
   - ISHLAYMAN tanlash ✓
   - UY BEKASI tanlash ✓

3. **Uy ishlari:**
   - Kod o'rnatish ✓
   - Kod bilan kirish ✓
   - Vazifa qo'shish ✓
   - Vazifa belgilash ✓
   - Vazifa o'chirish ✓
   - Hisobot to'ldirish ✓

## 🚀 KEYINGI QADAMLAR (Ixtiyoriy)

- [ ] Uy ishlari statistikasi
- [ ] Haftalik hisobot
- [ ] Ovqat retseptlari
- [ ] Xarid ro'yxati
- [ ] Tozalash jadvali

---

**HAMMASI TAYYOR!** 🎉

Endi ayollar uchun maxsus "Uy ishlari" funksiyasi mavjud!
