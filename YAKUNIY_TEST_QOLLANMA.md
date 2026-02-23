# Yakuniy Test Qo'llanmasi

## 🚀 VERSIYA: 4.0.0 - USER CAN CHANGE CODE

Server qayta ishga tushirildi! Endi test qilish vaqti.

## ⚠️ MUHIM: INCOGNITO MODE ISHLATNG!

Eski kesh muammosini hal qilish uchun:

```
Ctrl + Shift + N (Chrome/Edge)
Ctrl + Shift + P (Firefox)
```

Keyin:
```
http://localhost:5003
```

## 📋 TO'LIQ TEST TARTIBI

### 1. Login

```
Telefon: +998901234567
Parol: demo123
```

### 2. Console Tekshirish

F12 → Console:
```
🚀 APP VERSION: 4.0.0 - USER CAN CHANGE CODE
```

Agar eski versiya ko'rsatsa - incognito mode ishlatng!

### 3. Sozlamalar

1. Burger menyu → Sozlamalar
2. "Ishlayman" ni tanlang
3. Ish ma'lumotlarini to'ldiring:
   - Ish turi: "Dasturchi"
   - Lavozim: "Junior"
   - Tajriba: "2"
   - Boshlanish: "09:00"
   - Tugash: "18:00"
4. "SOZLAMALARNI SAQLASH"

### 4. Burger Menyu Tekshirish

Burger menyuni oching:
- ✅ "💼 Ish" tugmasi ko'rinishi kerak

### 5. Ish Tabiga Kirish

1. "💼 Ish" ni bosing
2. Kod o'rnating: **1234**
3. "O'RNATISH" ni bosing

### 6. Ish Tab Tekshirish

Quyidagilar ko'rinishi kerak:

```
💼 ISH                    [🔒 YOPISH]

⚠️ Eslatma: Kodni o'zgartirish uchun hozirgi ish kodi 
va akkaunt parolingiz kerak bo'ladi.

[🔒 KOD O'ZGARTIRISH]

💼 ISH MA'LUMOTLARI
- Ish turi: Dasturchi
- Lavozim: Junior
- Tajriba: 2 yil
- Ish vaqti: 09:00 - 18:00

✅ BUGUNGI VAZIFALAR (0/0)
[Vazifalar bo'limi]

📊 BUGUNGI HISOBOT
[Hisobot maydonlari]
```

### 7. Kod O'zgartirish Testi

1. **"KOD O'ZGARTIRISH" tugmasini bosing**

2. **Modal oynasi ochiladi:**
   ```
   ISH KODINI O'ZGARTIRISH
   
   1. Hozirgi ish kodi: [____]
   2. Akkaunt paroli: [____]
   3. Yangi ish kodi: [____]
   
   [O'ZGARTIRISH] [BEKOR QILISH]
   ```

3. **Ma'lumotlarni kiriting:**
   - Hozirgi kod: **1234**
   - Akkaunt paroli: **demo123**
   - Yangi kod: **5678**

4. **"O'ZGARTIRISH" ni bosing**

5. **Xabar ko'rinishi kerak:**
   ```
   Kod muvaffaqiyatli o'zgartirildi!
   ```

### 8. Yangi Kod Bilan Kirish

1. **"YOPISH" tugmasini bosing** (Ish tabidan chiqish)
2. **Qaytadan "💼 Ish" ni bosing**
3. **Yangi kod bilan kirish:** **5678**
4. **"KIRISH" ni bosing**
5. **Ish tabi ochilishi kerak!**

### 9. Vazifalar Testi

1. **Yangi vazifa qo'shing:**
   - "Mijozlarga qo'ng'iroq qilish"
   - "QO'SHISH"

2. **Vazifani belgilang:**
   - Checkbox ni bosing
   - Progress bar yangilanishi kerak

3. **Vazifani o'chiring:**
   - "O'CHIRISH" tugmasini bosing

### 10. Hisobot Testi

Barcha maydonlarni to'ldiring:
- Kelgan vaqt: 09:00
- Ish soatlari: 8
- Mijozlar: 5
- Sotilganlar: "3 ta mahsulot"
- O'rganganlar: "Yangi texnika"
- Yutuqlar: "5 ta mijoz topildi"
- Maslahat: "Ertaga qo'ng'iroq"

### 11. Sahifani Yangilash

1. **F5 ni bosing**
2. **Ish tabiga qaytadan kiring** (kod: 5678)
3. **Barcha ma'lumotlar saqlanganligini tekshiring**

## ✅ KUTILGAN NATIJALAR

### Ish Tab
- ✅ Kod himoyasi ishlaydi
- ✅ Kod o'zgartirish ishlaydi
- ✅ Ish ma'lumotlari ko'rinadi
- ✅ Vazifalar qo'shish/belgilash/o'chirish ishlaydi
- ✅ Progress bar ishlaydi
- ✅ Hisobot maydonlari ishlaydi
- ✅ MongoDB ga saqlanadi
- ✅ Barcha ikonlar ko'rinadi

### Kod O'zgartirish
- ✅ Modal oynasi ochiladi
- ✅ 3 ta input maydon
- ✅ Hozirgi kod tekshiriladi
- ✅ Akkaunt paroli tekshiriladi
- ✅ Yangi kod o'rnatiladi
- ✅ MongoDB ga saqlanadi
- ✅ Yangi kod bilan kirish mumkin

## 🐛 AGAR MUAMMO BO'LSA

### Eski Versiya Ko'rsatsa

1. **Incognito mode ishlatng!**
   ```
   Ctrl + Shift + N
   ```

2. **Yoki keshni tozalang:**
   ```
   Ctrl + Shift + Delete
   - Cached images and files
   - Clear data
   ```

3. **Hard refresh:**
   ```
   Ctrl + Shift + R
   ```

### Ish Tugmasi Ko'rinmasa

1. **Console tekshiring:**
   ```
   F12 → Console
   🔍 Sidebar Debug: {
     userType: "work",
     workType: "Dasturchi"
   }
   ```

2. **Agar userType bo'sh:**
   - Sozlamalarga kiring
   - "Ishlayman" ni qayta tanlang
   - Saqlang
   - Sahifani yangilang

### Kod O'zgartirish Ishlamasa

1. **Hozirgi kodingizni to'g'ri kiriting**
2. **Akkaunt parolingizni to'g'ri kiriting** (demo123)
3. **Yangi kod 4-6 raqam bo'lishi kerak**

## 📊 NATIJA

Agar barcha testlar muvaffaqiyatli bo'lsa:

**TABRIKLAYMIZ!** 🎉

Ish tab to'liq ishlaydi:
- ✅ Kod himoyasi
- ✅ Foydalanuvchi o'zi kod o'zgartira oladi
- ✅ Ish ma'lumotlari
- ✅ Vazifalar
- ✅ Hisobot
- ✅ MongoDB saqlash
- ✅ Zamonaviy ikonlar

**Keyingi:** Maktab tabini ham test qiling!

Omad! 🚀
