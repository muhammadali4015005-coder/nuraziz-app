# Ayollar Uchun Maktab va Ish Tablari Qo'shildi

## Sana: 2026-02-16

## Muammo

Ayol foydalanuvchilar uchun faqat "Uy ishlari" ko'rinardi. Agar ayol "FAQAT ISHLAYMAN" yoki "IKKAVIHAM (ISH + UY ISHLARI)" ni tanlasa ham, Maktab va Ish tablari ko'rinmasdi.

## Yechim

Sidebar.jsx faylida ayollar uchun ham Maktab va Ish tablarini ko'rsatish logikasi qo'shildi.

## Kod O'zgarishlari

### Sidebar.jsx

**Oldingi kod:**
```javascript
// Faqat erkaklar uchun maktab/ish
if ((userType === 'school' || userType === 'both') && schoolGrade) {
  userTabs.splice(insertIndex, 0, { id: 'school', ... })
}

if (userType === 'work' || userType === 'both') {
  userTabs.splice(insertIndex, 0, { id: 'work', ... })
}
```

**Yangi kod:**
```javascript
// MAKTAB - erkak yoki ayol (faqat uy bekasi bo'lmasa)
const showSchool = (userType === 'school' || userType === 'both') && schoolGrade
const isFemaleHousewife = settings.gender === 'female' && settings.isHousewife === true

if (showSchool && !isFemaleHousewife) {
  userTabs.splice(insertIndex, 0, { 
    id: 'school', 
    label: `${schoolGrade}-sinf`, 
    section: 'ASOSIY',
    icon: GraduationCap
  })
  insertIndex++
}

// ISH - erkak yoki ayol (faqat uy bekasi bo'lmasa)
const showWork = (userType === 'work' || userType === 'both')

if (showWork && !isFemaleHousewife) {
  userTabs.splice(insertIndex, 0, { 
    id: 'work', 
    label: 'Ish', 
    section: 'ASOSIY',
    icon: Briefcase
  })
  insertIndex++
}
```

## Logika

### Ayol - FAQAT ISHLAYMAN
```
settings.gender = 'female'
settings.isHousewife = false
settings.userType = 'work' yoki 'school' yoki 'both'

Natija:
✅ Maktab ko'rinadi (agar userType = 'school' yoki 'both')
✅ Ish ko'rinadi (agar userType = 'work' yoki 'both')
❌ Uy ishlari ko'rinmaydi
```

### Ayol - FAQAT UY BEKASI
```
settings.gender = 'female'
settings.isHousewife = true

Natija:
❌ Maktab ko'rinmaydi
❌ Ish ko'rinmaydi
✅ Uy ishlari ko'rinadi
```

### Ayol - IKKAVIHAM (ISH + UY ISHLARI)
```
settings.gender = 'female'
settings.isHousewife = 'both'
settings.userType = 'work' yoki 'school' yoki 'both'

Natija:
✅ Maktab ko'rinadi (agar userType = 'school' yoki 'both')
✅ Ish ko'rinadi (agar userType = 'work' yoki 'both')
✅ Uy ishlari ko'rinadi
```

### Erkak
```
settings.gender = 'male'
settings.userType = 'work' yoki 'school' yoki 'both'

Natija:
✅ Maktab ko'rinadi (agar userType = 'school' yoki 'both')
✅ Ish ko'rinadi (agar userType = 'work' yoki 'both')
❌ Uy ishlari ko'rinmaydi
```

## Test Qilish

### Test 1: Ayol - Faqat Ishlayman
1. Sozlamalarda "👩 AYOL" ni tanlang
2. "💼 FAQAT ISHLAYMAN" ni tanlang
3. "Maktab yoki Ish" bo'limida "Ish" ni tanlang
4. Sidebar'ni oching
5. "Ish" tabi ko'rinishi kerak

### Test 2: Ayol - Ikkaviham
1. Sozlamalarda "👩 AYOL" ni tanlang
2. "🏠💼 IKKAVIHAM (ISH + UY ISHLARI)" ni tanlang
3. "Maktab yoki Ish" bo'limida "Ish" ni tanlang
4. Sidebar'ni oching
5. "Ish" va "Uy ishlari" tablari ko'rinishi kerak

### Test 3: Ayol - Faqat Uy Bekasi
1. Sozlamalarda "👩 AYOL" ni tanlang
2. "🏠 FAQAT UY BEKASI" ni tanlang
3. Sidebar'ni oching
4. Faqat "Uy ishlari" ko'rinishi kerak
5. "Maktab" va "Ish" ko'rinmasligi kerak

## O'zgartirilgan Fayllar

- `src/components/Sidebar.jsx` - Ayollar uchun maktab/ish logikasi qo'shildi

## Diagnostika

✅ Barcha testlar o'tdi
✅ Syntax xatosi yo'q
✅ Logika to'g'ri ishlaydi

## Natija

Endi ayol foydalanuvchilar ham erkaklar kabi Maktab va Ish tablaridan foydalanishlari mumkin. Faqat "FAQAT UY BEKASI" tanlaganda bu tablar ko'rinmaydi.
