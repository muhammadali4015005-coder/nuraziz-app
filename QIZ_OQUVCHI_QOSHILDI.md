# Qiz va O'quvchi Variantlari Qo'shildi

## Sana: 2026-02-16

## Amalga Oshirilgan O'zgarishlar

### 1. "AYOL" → "QIZ" ✅

**Muammo:** Jins tanlashda "AYOL" so'zi ishlatilgan edi, lekin ko'pchilik foydalanuvchilar yosh qizlar.

**Yechim:**
- "👩 AYOL" → "👧 QIZ" ga o'zgartirildi
- Barcha ko'rsatish joylarida ham yangilandi

### 2. Qizlar Uchun "O'QIYMAN" Varianti ✅

**Muammo:** Qizlar uchun faqat 3 ta variant bor edi:
- FAQAT ISHLAYMAN
- FAQAT UY BEKASI
- IKKAVIHAM (ISH + UY ISHLARI)

O'quvchi qizlar uchun variant yo'q edi.

**Yechim:**
- "📚 O'QIYMAN" varianti qo'shildi
- Bu variant birinchi o'rinda
- O'quvchi qizlar uchun maktab tabi avtomatik ko'rinadi

## Kod O'zgarishlari

### SettingsTab.jsx

**1. Jins tanlash:**
```javascript
// Oldingi
👩 AYOL

// Yangi
👧 QIZ
```

**2. Qizlar uchun variantlar:**
```javascript
// Yangi tartib:
1. 📚 O'QIYMAN (isHousewife = 'student')
2. 💼 FAQAT ISHLAYMAN (isHousewife = false)
3. 🏠 FAQAT UY BEKASI (isHousewife = true)
4. 💼🏠 IKKAVIHAM (isHousewife = 'both')
```

**3. Savol matni:**
```javascript
// Oldingi
"Siz ishlaysizmi yoki uy bekasisizmi?"

// Yangi
"Siz o'qiysizmi, ishlaysizmi yoki uy bekasisizmi?"
```

### Sidebar.jsx

**Maktab ko'rsatish logikasi:**
```javascript
const isFemaleStudent = settings.gender === 'female' && settings.isHousewife === 'student'

// Maktab ko'rinadi agar:
if ((showSchool && !isFemaleHousewife) || isFemaleStudent) {
  // Maktab tabini qo'shish
}

// Ish ko'rinadi agar:
if (showWork && !isFemaleHousewife && !isFemaleStudent) {
  // Ish tabini qo'shish
}
```

## Logika

### Qiz - O'QIYMAN
```
settings.gender = 'female'
settings.isHousewife = 'student'
settings.userType = 'school'
settings.schoolGrade = '9-sinf'

Natija:
✅ Maktab ko'rinadi (9-sinf)
❌ Ish ko'rinmaydi
❌ Uy ishlari ko'rinmaydi
```

### Qiz - FAQAT ISHLAYMAN
```
settings.gender = 'female'
settings.isHousewife = false
settings.userType = 'work'

Natija:
❌ Maktab ko'rinmaydi
✅ Ish ko'rinadi
❌ Uy ishlari ko'rinmaydi
```

### Qiz - FAQAT UY BEKASI
```
settings.gender = 'female'
settings.isHousewife = true

Natija:
❌ Maktab ko'rinmaydi
❌ Ish ko'rinmaydi
✅ Uy ishlari ko'rinadi
```

### Qiz - IKKAVIHAM
```
settings.gender = 'female'
settings.isHousewife = 'both'
settings.userType = 'work'

Natija:
❌ Maktab ko'rinmaydi
✅ Ish ko'rinadi
✅ Uy ishlari ko'rinadi
```

## Test Qilish

### Test 1: Qiz - O'qiyman
1. Sozlamalarda "👧 QIZ" ni tanlang
2. "📚 O'QIYMAN" ni tanlang
3. "Maktab yoki Ish" bo'limida "Maktab" ni tanlang
4. Sinf raqamini tanlang (masalan: 9-sinf)
5. Sidebar'ni oching
6. "9-sinf" tabi ko'rinishi kerak

### Test 2: Qiz - Faqat Ishlayman
1. Sozlamalarda "👧 QIZ" ni tanlang
2. "💼 FAQAT ISHLAYMAN" ni tanlang
3. "Maktab yoki Ish" bo'limida "Ish" ni tanlang
4. Sidebar'ni oching
5. "Ish" tabi ko'rinishi kerak

### Test 3: Qiz - Faqat Uy Bekasi
1. Sozlamalarda "👧 QIZ" ni tanlang
2. "🏠 FAQAT UY BEKASI" ni tanlang
3. Sidebar'ni oching
4. Faqat "Uy ishlari" ko'rinishi kerak

### Test 4: Qiz - Ikkaviham
1. Sozlamalarda "👧 QIZ" ni tanlang
2. "💼🏠 IKKAVIHAM (ISH + UY ISHLARI)" ni tanlang
3. "Maktab yoki Ish" bo'limida "Ish" ni tanlang
4. Sidebar'ni oching
5. "Ish" va "Uy ishlari" tablari ko'rinishi kerak

## O'zgartirilgan Fayllar

1. `src/components/tabs/SettingsTab.jsx`
   - "AYOL" → "QIZ" ga o'zgartirildi
   - "O'QIYMAN" varianti qo'shildi
   - Savol matni yangilandi
   - Ko'rsatish qismi yangilandi

2. `src/components/Sidebar.jsx`
   - `isFemaleStudent` flag qo'shildi
   - Maktab ko'rsatish logikasi yangilandi
   - Ish ko'rsatish logikasi yangilandi

## Diagnostika

✅ Barcha testlar o'tdi
✅ Syntax xatosi yo'q
✅ Logika to'g'ri ishlaydi

## Natija

Endi qiz foydalanuvchilar uchun 4 ta variant mavjud:
1. 📚 O'QIYMAN - maktab tabi ko'rinadi
2. 💼 FAQAT ISHLAYMAN - ish tabi ko'rinadi
3. 🏠 FAQAT UY BEKASI - uy ishlari tabi ko'rinadi
4. 💼🏠 IKKAVIHAM - ish va uy ishlari tablari ko'rinadi

Jins tanlashda "QIZ" so'zi ishlatiladi, bu yoshroq foydalanuvchilar uchun mos.
