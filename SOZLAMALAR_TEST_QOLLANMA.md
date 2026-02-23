# Sozlamalar Tab - Test Qo'llanma

## Yangi Struktura

Sozlamalar tab to'liq qayta tuzildi va quyidagi tartibda ishlaydi:

### 1. ISM / YOSH (👤)
- **Rang**: Ko'k (#00d4ff)
- **Maydonlar**: 
  - Ism (demo foydalanuvchi uchun o'zgartirib bo'lmaydi)
  - Yosh (1-120)
- **Test**: Ismni va yoshni kiriting, 1 soniyadan keyin avtomatik saqlanadi

### 2. JINS (👤)
- **Rang**: Pushti (#ff00ff)
- **Tanlovlar**:
  - 👨 ERKAK
  - 👩 AYOL
- **Ayol tanlansa**:
  - 💼 ISHLAYMAN
  - 🏠 UY BEKASI
- **Test**: 
  - Erkak tanlang → Uy bekasi tanlovi ko'rinmasligi kerak
  - Ayol tanlang → Ishlayman/Uy bekasi tanlovi paydo bo'lishi kerak
  - Uy bekasi tanlang → "MAKTAB YOKI ISH" bo'limi yashirilishi kerak

### 3. IZOH (📝)
- **Rang**: To'q sariq (#ffaa00)
- **Maydon**: Textarea (ko'p qatorli matn)
- **Test**: Uzun matn yozing, xulosada 50 belgidan keyin "..." bilan qisqartirilishi kerak

### 4. SPORT QILASIZMI? (💪)
- **Rang**: Yashil (#00ff88)
- **Tanlovlar**:
  - ✅ HA
  - ❌ YO'Q
- **Ha tanlansa**:
  - Mahal: 1 MAHAL / 2 MAHAL
  - 1 mahal → 1 ta sport turi nomi
  - 2 mahal → 2 ta sport turi nomi
- **Test**:
  - Yo'q tanlang → Sport maydonlari yashirilishi kerak
  - Ha tanlang → Mahal tanlovi paydo bo'lishi kerak
  - 1 mahal → Faqat 1 ta input ko'rinishi kerak
  - 2 mahal → 2 ta input ko'rinishi kerak

### 5. MAKTAB YOKI ISH (🎓💼)
- **Rang**: Qizil (#ff6b6b)
- **Ko'rinish**: Faqat uy bekasi bo'lmasa
- **Tanlovlar**:
  - 🎓 MAKTAB O'QUVCHISI
  - 💼 ISHLAYMAN
  - 🎓💼 IKKAVIHAM
- **Maktab tanlansa**:
  - Sinf: 1-11 (dropdown)
- **Ish tanlansa**:
  - Ish turi (input)
  - Lavozim (dropdown)
  - Necha yillik (number)
  - Boshlanish/Tugash vaqti (time)
- **Test**:
  - Uy bekasi tanlangan bo'lsa → Bu bo'lim ko'rinmasligi kerak
  - Ikkaviham tanlang → Maktab va Ish maydonlari ko'rinishi kerak

### 6. SOZLAMALAR XULOSASI (📋)
- **Rang**: Ko'k (#00d4ff)
- **Ko'rinish**: Barcha to'ldirilgan ma'lumotlar
- **Test**:
  - Hech narsa to'ldirilmasa → "Hozircha sozlamalar kiritilmagan"
  - Ma'lumot to'ldirilsa → Ikonka bilan ko'rsatilishi kerak
  - Izoh 50 belgidan uzun bo'lsa → "..." bilan qisqartirilishi kerak

## Auto-Save

- **Debounce**: 1 soniya
- **Endpoint**: `/api/save-settings`
- **Demo foydalanuvchi**: Saqlanmaydi (faqat local state)
- **Test**: 
  - Biror maydonni o'zgartiring
  - 1 soniya kuting
  - Browser console da "💾 Saving settings to MongoDB" ko'rinishi kerak
  - "✅ Settings saved successfully" ko'rinishi kerak

## Backward Compatibility

Eski sozlamalar saqlanadi:
- `sportDays` (eski)
- `morningType` (eski)
- `eveningType` (eski)
- `sportTypes` (eski)
- `sportName` (eski)

Yangi sozlamalar:
- `doesSport` (yangi)
- `sportFrequency` (yangi)
- `sport1Name` (yangi)
- `sport2Name` (yangi)
- `gender` (yangi)
- `isHousewife` (yangi)
- `notes` (yangi)

## Xatolarni Tekshirish

1. **Console Errors**: Browser console da xatolar bo'lmasligi kerak
2. **Network**: Network tab da `/api/save-settings` so'rovi muvaffaqiyatli bo'lishi kerak
3. **Database**: MongoDB da `settings` maydoni yangilanishi kerak
4. **Refresh**: Sahifani yangilanganda ma'lumotlar saqlanib qolishi kerak

## Fayllar

- `src/components/tabs/SettingsTab.jsx` - Yangi versiya (ishlatilmoqda)
- `server.js` - `/api/save-settings` endpoint
- `db-manager.js` - MongoDB saqlash

## Keyingi Qadamlar

1. ✅ Yangi SettingsTab yaratildi
2. ✅ Auto-save qo'shildi
3. ✅ Backward compatibility qo'shildi
4. ✅ Xulosasi qo'shildi
5. ✅ Eski backup o'chirildi
6. ⏳ Test qilish kerak (npm run dev)
7. ⏳ Production ga deploy qilish
