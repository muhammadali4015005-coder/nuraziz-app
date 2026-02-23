# Sport Funksiyalari - Test Qo'llanma

## 🎯 Maqsad
Sport tab va uning barcha funksiyalarini test qilish.

---

## 🚀 Dasturni Ochish

```
Brauzer: http://localhost:5177
Login: +998901234567
Parol: 123456
```

---

## 📋 Test Ketma-ketligi

### TEST 1: Sport Tab Shartli Ko'rinish

#### 1.1 Sport YO'Q
```
1. Login qiling
2. Burger menyuni oching (☰)
3. "Sozlamalar" ni bosing
4. "SPORT QILASIZMI?" bo'limiga boring
5. "❌ YO'Q" tugmasini bosing
6. Burger menyuni oching
7. KUTILGAN: "Sport Mashqlari" tab YO'Q ❌
```

#### 1.2 Sport HA
```
1. "Sozlamalar" ga qaytib kiring
2. "SPORT QILASIZMI?" bo'limida "✅ HA" ni bosing
3. "1 MAHAL" yoki "2 MAHAL" tanlang
4. Sport nomini kiriting (masalan: "Turnik")
5. Burger menyuni oching
6. KUTILGAN: "Sport Mashqlari" tab BOR ✅
7. Tab ni bosing
8. KUTILGAN: Sport Mashqlari sahifasi ochiladi
```

---

### TEST 2: Maqsad va Progress Bar

#### 2.1 Maqsad Kiritish
```
1. Sport Mashqlari tabiga kiring
2. "🎯 MAQSAD" bo'limini toping
3. KUTILGAN: Yuqorida "Sport turi: Turnik" ko'rinadi
4. "Maqsadingiz" maydoniga yozing: "100 ta turnik"
5. "Hozir qancha chiqadi?" maydoniga yozing: "10 ta turnik"
6. KUTILGAN: Progress bar paydo bo'ladi
7. KUTILGAN: Progress bar 10% ko'rsatadi
8. KUTILGAN: Pastda "10 ta turnik" va "100 ta turnik" ko'rinadi
```

#### 2.2 Maqsadni Saqlash
```
1. "MAQSADNI SAQLASH" tugmasini bosing
2. KUTILGAN: Kichik notifikatsiya paydo bo'ladi
3. KUTILGAN: Matn: "✓ Sport maqsadi saqlandi"
4. KUTILGAN: 1.5 soniyadan keyin yo'qoladi
5. Sahifani yangilang (F5)
6. KUTILGAN: Maqsad va hozirgi daraja saqlanib qolgan
```

#### 2.3 Progress Hisoblash
```
Test quyidagi qiymatlar bilan:

Maqsad: "100 ta turnik", Hozir: "10 ta turnik"
KUTILGAN: 10%

Maqsad: "100 ta turnik", Hozir: "50 ta turnik"
KUTILGAN: 50%

Maqsad: "100 ta turnik", Hozir: "100 ta turnik"
KUTILGAN: 100%

Maqsad: "5 km yugurish", Hozir: "1 km yugurish"
KUTILGAN: 20%

Maqsad: "10 daqiqa", Hozir: "2 daqiqa"
KUTILGAN: 20%
```

---

### TEST 3: Mashq Qo'shish

#### 3.1 Ertalabki Mashq
```
1. "💪 MASHQ QO'SHISH" bo'limiga boring
2. Agar 2 mahal sport qilsangiz, "ERTALAB" tugmasini bosing
3. Vaqt: 06:00
4. Mashq nomi: "Turnik"
5. Davomiyligi: "10 ta"
6. "MASHQ QO'SHISH" tugmasini bosing
7. KUTILGAN: Kichik notifikatsiya "✓ Mashq qo'shildi"
8. KUTILGAN: Pastda "ERTALABKI MASHQLAR" bo'limi paydo bo'ladi
9. KUTILGAN: Mashq ro'yxatda ko'rinadi: "06:00 Turnik (10 ta)"
```

#### 3.2 Kechki Mashq
```
1. "KECHQURUN" tugmasini bosing
2. Vaqt: 18:00
3. Mashq nomi: "Yugurish"
4. Davomiyligi: "30 daqiqa"
5. "MASHQ QO'SHISH" tugmasini bosing
6. KUTILGAN: "KECHKI MASHQLAR" bo'limi paydo bo'ladi
7. KUTILGAN: Mashq ro'yxatda ko'rinadi: "18:00 Yugurish (30 daqiqa)"
```

#### 3.3 Mashqni Bajarish
```
1. Mashq yonidagi "○" tugmasini bosing
2. KUTILGAN: Tugma "✓" ga o'zgaradi
3. KUTILGAN: Mashq matni chiziladi (line-through)
4. KUTILGAN: Border rangi yashil (#00ff88) bo'ladi
5. Yana "✓" tugmasini bosing
6. KUTILGAN: Mashq bajarilmagan holatga qaytadi
```

#### 3.4 Mashqni O'chirish
```
1. Mashq yonidagi "✗" tugmasini bosing
2. KUTILGAN: Tasdiqlash oynasi paydo bo'ladi
3. "OK" ni bosing
4. KUTILGAN: Mashq ro'yxatdan o'chadi
```

---

### TEST 4: Haftalik Jadval

#### 4.1 Jadvalni Ko'rish
```
1. "HAFTALIK JADVAL" bo'limiga boring
2. KUTILGAN: 7 kun ko'rinadi (Dushanba - Yakshanba)
3. KUTILGAN: Har bir kun uchun Ertalab/Kechqurun ko'rinadi
4. KUTILGAN: Bo'sh kunlarda "Dam olish" yozuvi
```

#### 4.2 Jadvalni O'zgartirish
```
1. "O'ZGARTIRISH" tugmasini bosing
2. KUTILGAN: Har bir kun uchun input maydonlari paydo bo'ladi
3. Dushanba - Ertalab: "Turnik"
4. Dushanba - Kechqurun: "Yugurish"
5. Seshanba - Ertalab: "Dam olish"
6. "JADVALNI SAQLASH" tugmasini bosing
7. KUTILGAN: Kichik notifikatsiya "✓ Jadval saqlandi"
8. KUTILGAN: Jadval o'qish rejimiga o'tadi
9. KUTILGAN: Kiritilgan ma'lumotlar ko'rinadi
```

---

### TEST 5: 1 Mahal Sport

#### 5.1 Vaqt Tanlash
```
1. Sozlamalarga kiring
2. Sport: "HA", "1 MAHAL" tanlang
3. Sport Mashqlari tabiga kiring
4. KUTILGAN: "QAYSI VAQTDA SPORT QILASIZ?" oynasi paydo bo'ladi
5. "ERTALAB" yoki "KECHQURUN" tanlang
6. KUTILGAN: Oyna yo'qoladi
7. KUTILGAN: Faqat tanlangan vaqt uchun mashqlar ko'rinadi
```

#### 5.2 Mashq Qo'shish (1 Mahal)
```
1. "MASHQ QO'SHISH" bo'limida
2. KUTILGAN: Faqat tanlangan vaqt ko'rinadi (Ertalab yoki Kechqurun)
3. KUTILGAN: Vaqt tanlash tugmalari yo'q
4. Mashq qo'shing
5. KUTILGAN: Faqat tanlangan vaqt uchun mashq qo'shiladi
```

---

### TEST 6: Sport Turi Ko'rsatish

#### 6.1 1 Sport Turi
```
1. Sozlamalar → Sport: "HA", "1 MAHAL"
2. Sport turi: "Turnik"
3. Sport Mashqlari tabiga kiring
4. KUTILGAN: "Sport turi: Turnik" ko'rinadi
```

#### 6.2 2 Sport Turi
```
1. Sozlamalar → Sport: "HA", "2 MAHAL"
2. 1-sport turi: "Turnik"
3. 2-sport turi: "Yugurish"
4. Sport Mashqlari tabiga kiring
5. KUTILGAN: "Sport turi: Turnik va Yugurish" ko'rinadi
```

---

## ✅ Kutilgan Natijalar

### Progress Bar
- Gradient rang: #00d4ff → #00ff88
- Foiz to'g'ri hisoblanadi
- Maksimum 100%
- Hozirgi va maqsad ko'rsatiladi

### Notifikatsiyalar
- Kichik hajm
- 1.5 soniya ko'rinadi
- "✓" belgisi bor
- Qisqa matn

### Mashqlar
- Vaqt bo'yicha tartiblangan
- Bajarish/bekor qilish ishlaydi
- O'chirish tasdiqlash so'raydi
- Ranglar to'g'ri

### Jadval
- 7 kun ko'rinadi
- O'zgartirish/saqlash ishlaydi
- Bo'sh kunlar "Dam olish"
- Saqlangan ma'lumotlar saqlanadi

---

## ❌ Xatolar

Agar quyidagi xatolar bo'lsa, xabar bering:

1. Sport tab ko'rinmayapti (sozlamalarda "HA" bo'lsa ham)
2. Progress bar noto'g'ri hisoblayapti
3. Notifikatsiya juda katta yoki uzoq ko'rinadi
4. Mashqlar saqlanmayapti
5. Jadval o'zgarishlari yo'qoladi
6. Sport turi ko'rinmayapti

---

## 🎨 Dizayn Tekshiruvi

### Ranglar
- MAQSAD border: #00d4ff (ko'k) ✓
- MASHQ QO'SHISH border: #00ff88 (yashil) ✓
- HAFTALIK JADVAL border: #ffaa00 (sariq) ✓
- Progress bar: Gradient ✓
- Bajarilgan mashq: #00ff88 (yashil) ✓

### Tugmalar
- Gradient tugmalar ✓
- Hover effekt ✓
- Border radius: 8px ✓
- Font weight: bold ✓

### Font o'lchamlari
- Sarlavha: 18px ✓
- Oddiy matn: 13-14px ✓
- Kichik matn: 11-12px ✓

---

## 📊 Test Natijalari Jadvali

| Test | Holat | Izoh |
|------|-------|------|
| Sport tab shartli ko'rinish | ⬜ | |
| Maqsad kiritish | ⬜ | |
| Progress bar | ⬜ | |
| Maqsad saqlash | ⬜ | |
| Mashq qo'shish | ⬜ | |
| Mashq bajarish | ⬜ | |
| Mashq o'chirish | ⬜ | |
| Jadval o'zgartirish | ⬜ | |
| 1 mahal sport | ⬜ | |
| Sport turi ko'rsatish | ⬜ | |

✅ - Ishlayapti  
❌ - Ishlamayapti  
⬜ - Test qilinmagan

---

## 🚀 Tezkor Test

Agar vaqt kam bo'lsa, quyidagi asosiy testlarni bajaring:

1. Sport tab ko'rinish/yo'qolish (2 daqiqa)
2. Maqsad va progress bar (2 daqiqa)
3. Mashq qo'shish va bajarish (2 daqiqa)

**Jami: 6 daqiqa**

---

## 📝 Eslatma

- Har bir test dan keyin sahifani yangilang (F5)
- Ma'lumotlar saqlanganini tekshiring
- Brauzer konsolida xatolar yo'qligini tekshiring (F12)
- Notifikatsiyalar to'g'ri ko'rinishini kuzating

---

**Versiya**: 2.3.0  
**Sana**: 2026-02-16  
**Maqsad**: Sport funksiyalarini to'liq test qilish
