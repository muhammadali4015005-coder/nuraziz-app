# Ikonlar Test Qilish Qo'llanmasi

## 🚀 TEZKOR TEST

### 1. Serverni Ishga Tushiring

```bash
npm run dev
```

### 2. Brauzerda Oching

```
http://localhost:5003
```

### 3. Incognito Mode (Tavsiya)

```
Ctrl + Shift + N (Chrome/Edge)
Ctrl + Shift + P (Firefox)
```

## ✅ TEKSHIRISH RO'YXATI

### Header (Yuqori Panel)

- [ ] **Burger Menyu Tugmasi** - Menu ikoni (☰ o'rniga)
- [ ] **Foydalanuvchi Nomi** - User ikoni yonida
- [ ] **Chiqish Tugmasi** - LogOut ikoni bilan

**Kutilgan ko'rinish:**
```
[☰ Menu] [👤 FOYDALANUVCHI] [🚪 CHIQISH]
```

### Sidebar (Burger Menyu)

#### Yopish Tugmasi
- [ ] **X ikoni** - "YOPISH" yozuvi bilan

#### ASOSIY Bo'lim
- [ ] ⚙️ Sozlamalar
- [ ] 🎥 Video Maslahat
- [ ] 🍽️ AI Ovqatlanish
- [ ] 🎯 Rejalar
- [ ] 📅 Kunlik Tartib
- [ ] 💪 Sport Mashqlari
- [ ] ✨ Kelajak
- [ ] 💬 Admin bilan gaplashish

#### Maktab/Ish (Agar tanlangan bo'lsa)
- [ ] 🎓 Maktab (sinf raqami bilan)
- [ ] 💼 Ish

#### TAHLIL Bo'lim
- [ ] 📈 AI Maslahat
- [ ] 📊 Haftalik
- [ ] 📉 Statistika

#### ADMIN PANEL (Admin uchun)
- [ ] 📊 Boshi
- [ ] 👥 Azolar
- [ ] 🗑️ Ochirilganlar
- [ ] ✅ Sorovlar
- [ ] 💬 Chat Sorovlar
- [ ] 📄 Hisobot
- [ ] 📊 Statistika

## 🎨 VIZUAL TEKSHIRISH

### Ikonlar O'lchami
- Sidebar: 18px
- Header: 18-24px
- Ranglar mos kelishi kerak

### Oraliqlar
- Ikon va matn orasida 6-8px
- Chiroyli va o'qilishi oson

### Hover Effektlar
- Tugmalar ustiga borganda animatsiya
- Ikonlar bilan birga harakat qilishi

## 🔍 BATAFSIL TEST

### 1. Header Test

1. **Burger Menyu:**
   - Menu ikoni ko'rinishini tekshiring
   - Bosganda sidebar ochilishini tekshiring
   - Ikon animatsiya qilishini tekshiring

2. **Foydalanuvchi:**
   - User ikoni ko'rinishini tekshiring
   - Ism to'g'ri ko'rinishini tekshiring

3. **Chiqish:**
   - LogOut ikoni ko'rinishini tekshiring
   - Bosganda chiqishni tekshiring

### 2. Sidebar Test

1. **Yopish Tugmasi:**
   - X ikoni ko'rinishini tekshiring
   - Bosganda yopilishini tekshiring

2. **Har Bir Tab:**
   - Ikon to'g'ri ko'rinishini
   - Matn bilan bir qatorda ekanligini
   - Hover effekt ishlashini
   - Active holat ishlashini

3. **Scroll:**
   - Ko'p tablar bo'lsa scroll ishlashini
   - Ikonlar buzilmasligini

### 3. Responsive Test

1. **Desktop (1920px):**
   - Barcha ikonlar to'liq ko'rinishi
   - Oraliqlar chiroyli

2. **Tablet (768px):**
   - Ikonlar moslashishi
   - Matn qisqarmasligi

3. **Mobile (375px):**
   - Ikonlar ko'rinishi
   - Sidebar to'liq ishlashi

## 🐛 MUAMMOLARNI HAL QILISH

### Ikonlar Ko'rinmasa

1. **Brauzer Keshini Tozalash:**
   ```
   Ctrl + Shift + R
   yoki
   Ctrl + F5
   ```

2. **Node Modules Qayta O'rnatish:**
   ```bash
   npm install
   ```

3. **Server Qayta Ishga Tushirish:**
   ```bash
   Ctrl + C
   npm run dev
   ```

### Ikonlar Buzilgan Bo'lsa

1. **Console Tekshirish:**
   - F12 ni bosing
   - Console tabida xatolar bormi?

2. **Network Tekshirish:**
   - F12 ni bosing
   - Network tabida lucide-react yuklanganmi?

3. **Import Tekshirish:**
   - Sidebar.jsx da import to'g'rimi?
   - Header.jsx da import to'g'rimi?

### Ikonlar Juda Katta/Kichik

1. **Size Prop:**
   ```javascript
   <Icon size={18} />  // Sidebar
   <Icon size={24} />  // Header burger
   ```

2. **CSS Tekshirish:**
   - Sidebar.css da flexbox to'g'rimi?
   - Header.css da flexbox to'g'rimi?

## 📸 SCREENSHOT

Test qilishda quyidagilarni screenshot oling:

1. Header - barcha ikonlar bilan
2. Sidebar - ochiq holat, barcha tablar
3. Sidebar - active tab
4. Sidebar - hover holat
5. Mobile ko'rinish

## ✅ MUVAFFAQIYATLI TEST

Agar quyidagilar ishlasa, test muvaffaqiyatli:

- ✅ Barcha ikonlar ko'rinadi
- ✅ Ikonlar to'g'ri joyda
- ✅ Ranglar mos keladi
- ✅ Oraliqlar chiroyli
- ✅ Hover effektlar ishlaydi
- ✅ Active holat ishlaydi
- ✅ Responsive ishlaydi
- ✅ Hech qanday xato yo'q

## 🎉 NATIJA

Agar hammasi ishlasa:

**Tabriklaymiz!** 🎉

Dasturga zamonaviy ikonlar muvaffaqiyatli qo'shildi!

- Professional ko'rinish ✅
- Yaxshi UX/UI ✅
- Zamonaviy dizayn ✅
- Oson tushunish ✅

## 📝 KEYINGI QADAMLAR

1. LoginScreen ga ikonlar qo'shish
2. Tab komponentlariga ikonlar qo'shish
3. Admin panelga ikonlar qo'shish
4. Input maydonlariga ikonlar qo'shish

**Omad!** 🚀
