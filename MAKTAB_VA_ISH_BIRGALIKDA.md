# Maktab va Ish Birgalikda

## ✅ YANGI VERSIYA: 4.1.0

Endi foydalanuvchi maktabda o'qiydi va ishga ham boradi deb belgilashi mumkin!

## 🎓💼 YANGI FUNKSIYA

### Ikkala Variantni Ham Tanlash

**Avval:**
- Faqat maktab YOKI ish

**Endi:**
- Maktab
- Ish
- Maktab VA ish (ikkisi ham)

## 📋 QANDAY ISHLAYDI

### SettingsTab

1. **"Siz maktab o'quvchisizmi yoki ishlaysizmi?"**
2. **Ikkala tugmani ham bosish mumkin:**
   - 🎓 MAKTAB O'QUVCHISI
   - 💼 ISHLAYMAN

### Variantlar:

#### 1. Faqat Maktab
- Faqat "MAKTAB O'QUVCHISI" ni bosing
- Sinf tanlang
- Burger menyuda: "🎓 7-sinf"

#### 2. Faqat Ish
- Faqat "ISHLAYMAN" ni bosing
- Ish ma'lumotlarini to'ldiring
- Burger menyuda: "💼 Ish"

#### 3. Maktab VA Ish (Ikkisi ham)
- "MAKTAB O'QUVCHISI" ni bosing
- "ISHLAYMAN" ni ham bosing
- Ikkala ma'lumotni ham to'ldiring
- Burger menyuda: "🎓 7-sinf" va "💼 Ish"

## 🎨 DIZAYN

### Tanlangan Tugmalar
```
[🎓 MAKTAB O'QUVCHISI] - Ko'k rang (tanlangan)
[💼 ISHLAYMAN] - Ko'k rang (tanlangan)
```

### Tanlanmagan Tugmalar
```
[🎓 MAKTAB O'QUVCHISI] - Kulrang (tanlanmagan)
[💼 ISHLAYMAN] - Kulrang (tanlanmagan)
```

## 📱 FOYDALANISH

### Misol: Maktabda o'qiydi va ishga boradi

1. **Sozlamalarga kiring**

2. **"MAKTAB O'QUVCHISI" ni bosing:**
   - Tugma ko'k rangga o'zgaradi
   - Sinf tanlash paydo bo'ladi

3. **Sinf tanlang:**
   - Masalan: 11-sinf

4. **"ISHLAYMAN" ni ham bosing:**
   - Tugma ko'k rangga o'zgaradi
   - Ish ma'lumotlari paydo bo'ladi

5. **Ish ma'lumotlarini to'ldiring:**
   - Ish turi: "Dasturchi"
   - Lavozim: "Junior"
   - Tajriba: "1"
   - Ish vaqti: "14:00 - 18:00"

6. **"SOZLAMALARNI SAQLASH"**

7. **Burger menyuni oching:**
   - ✅ "🎓 11-sinf" ko'rinadi
   - ✅ "💼 Ish" ko'rinadi

## 🔧 TEXNIK TAFSILOTLAR

### userType Qiymatlari:

```javascript
userType = ''      // Hech narsa tanlanmagan
userType = 'school'  // Faqat maktab
userType = 'work'    // Faqat ish
userType = 'both'    // Maktab VA ish
```

### Sidebar Logikasi:

```javascript
// Maktab tabini qo'shish
if ((userType === 'school' || userType === 'both') && schoolGrade) {
  userTabs.splice(1, 0, { 
    id: 'school', 
    label: `${schoolGrade}-sinf`
  })
}

// Ish tabini qo'shish
if (userType === 'work' || userType === 'both') {
  const insertIndex = userTabs.findIndex(t => t.id === 'school') !== -1 ? 2 : 1
  userTabs.splice(insertIndex, 0, { 
    id: 'work', 
    label: 'Ish'
  })
}
```

### Tugma Logikasi:

```javascript
// Maktab tugmasi
onClick={() => {
  if (userType === 'school') {
    setUserType('')  // O'chirish
  } else if (userType === 'work') {
    setUserType('both')  // Ikkisini ham
  } else if (userType === 'both') {
    setUserType('work')  // Faqat ish
  } else {
    setUserType('school')  // Faqat maktab
  }
}}

// Ish tugmasi
onClick={() => {
  if (userType === 'work') {
    setUserType('')  // O'chirish
  } else if (userType === 'school') {
    setUserType('both')  // Ikkisini ham
  } else if (userType === 'both') {
    setUserType('school')  // Faqat maktab
  } else {
    setUserType('work')  // Faqat ish
  }
}}
```

## 🚀 TEST QILISH

### MUHIM: Incognito Mode!

```
Ctrl + Shift + N
http://localhost:5003
```

### Test Tartibi:

1. **Login**

2. **Sozlamalar:**
   - "MAKTAB O'QUVCHISI" ni bosing
   - Sinf: 11
   - "ISHLAYMAN" ni bosing
   - Ish turi: "Dasturchi"
   - Lavozim: "Junior"
   - Tajriba: "1"
   - Ish vaqti: "14:00 - 18:00"
   - "SOZLAMALARNI SAQLASH"

3. **Burger Menyu:**
   - ✅ "🎓 11-sinf" ko'rinishi kerak
   - ✅ "💼 Ish" ko'rinishi kerak

4. **Maktab Tabiga Kirish:**
   - Kod o'rnating
   - Darslar qo'shing

5. **Ish Tabiga Kirish:**
   - Kod o'rnating
   - Vazifalar qo'shing
   - Hisobot to'ldiring

## ✅ KUTILGAN NATIJA

- ✅ Ikkala tugmani ham bosish mumkin
- ✅ Ikkala tugma ham ko'k rangda
- ✅ Burger menyuda ikkisi ham ko'rinadi
- ✅ Har ikkisi ham to'liq ishlaydi
- ✅ MongoDB ga saqlanadi

## 📝 MISOL STSENARIY

### Talaba: Aziz (11-sinf, part-time dasturchi)

**Ertalab:**
- 08:00 - Maktabga boradi
- Maktab tabida: Bugungi darslarni ko'radi
- Darslarni tahrirlaydi

**Tushdan keyin:**
- 14:00 - Ishga boradi
- Ish tabida: Kod o'rnating
- Bugungi vazifalarni ko'radi
- Hisobot to'ldiradi

**Kechqurun:**
- Ikkala tabni ham tekshiradi
- Maktab: Uyga vazifa
- Ish: Bugungi yutuqlar

## 🎉 XULOSA

Endi foydalanuvchi maktabda o'qiydi va ishga ham boradi deb belgilashi mumkin!

- ✅ Ikkala variantni ham tanlash
- ✅ Burger menyuda ikkisi ham
- ✅ Har ikkisi ham to'liq ishlaydi
- ✅ Alohida kodlar
- ✅ Alohida ma'lumotlar

**Incognito mode da test qiling!**

Omad! 🚀
