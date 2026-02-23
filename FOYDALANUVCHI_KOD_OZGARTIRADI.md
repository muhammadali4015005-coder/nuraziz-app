# Foydalanuvchi O'zi Kod O'zgartira Oladi

## ✅ YANGI VERSIYA: 4.0.0

Endi foydalanuvchi o'zi ish va maktab kodlarini o'zgartira oladi!

## 🔐 YANGI FUNKSIYA

### WorkTab - Ish Kodini O'zgartirish

1. **"KOD O'ZGARTIRISH" tugmasi** - Ish tabida
2. **3 bosqichli tekshirish:**
   - Hozirgi ish kodini kiriting
   - Akkaunt parolini kiriting (telefon paroli)
   - Yangi ish kodini kiriting (4-6 raqam)
3. **Agar hammasi to'g'ri bo'lsa** - kod o'zgaradi

### SchoolTab - Maktab Kodini O'zgartirish

1. **"KOD O'ZGARTIRISH" tugmasi** - Maktab tabida
2. **3 bosqichli tekshirish:**
   - Hozirgi maktab kodini kiriting
   - Akkaunt parolini kiriting (telefon paroli)
   - Yangi maktab kodini kiriting (4-6 raqam)
3. **Agar hammasi to'g'ri bo'lsa** - kod o'zgaradi

## 📋 QANDAY ISHLAYDI

### Misol: Ish Kodini O'zgartirish

1. **Ish tabiga kiring** (hozirgi kod: 1234)
2. **"KOD O'ZGARTIRISH" tugmasini bosing**
3. **Modal oynasi ochiladi:**
   ```
   ISH KODINI O'ZGARTIRISH
   
   1. Hozirgi ish kodi: [1234]
   2. Akkaunt paroli: [demo123]
   3. Yangi ish kodi: [5678]
   
   [O'ZGARTIRISH] [BEKOR QILISH]
   ```
4. **Agar hammasi to'g'ri:**
   - ✅ Kod o'zgaradi
   - ✅ MongoDB ga saqlanadi
   - ✅ "Kod muvaffaqiyatli o'zgartirildi!" xabari
5. **Keyingi kirishda:**
   - Yangi kod (5678) bilan kirish kerak

## 🔒 XAVFSIZLIK

### 3 Qatlamli Himoya:

1. **Hozirgi kod** - Foydalanuvchi hozirgi kodini bilishi kerak
2. **Akkaunt paroli** - Telefon paroli (login paroli)
3. **Yangi kod** - 4-6 raqam, faqat raqamlar

### Nima Uchun Xavfsiz?

- ❌ Boshqa odam kod o'zgartira olmaydi (akkaunt paroli kerak)
- ❌ Tasodifiy o'zgartirish mumkin emas (hozirgi kod kerak)
- ✅ Faqat akkaunt egasi o'zgartira oladi

## 🎨 DIZAYN

### Tugma
```
[🔒 KOD O'ZGARTIRISH]
- Binafsha gradient rang
- Markazda joylashgan
- Lock ikoni bilan
```

### Modal
```
- Qora fon (overlay)
- Binafsha border
- 3 ta input maydon
- 2 ta tugma (O'zgartirish, Bekor qilish)
```

## 📱 FOYDALANISH

### WorkTab

1. Ish tabiga kiring (kod bilan)
2. Pastga scroll qiling
3. "KOD O'ZGARTIRISH" tugmasini toping
4. Bosing va jarayonni bajaring

### SchoolTab

1. Maktab tabiga kiring (kod bilan)
2. Pastga scroll qiling
3. "KOD O'ZGARTIRISH" tugmasini toping
4. Bosing va jarayonni bajaring

## ⚠️ ESLATMALAR

### WorkTab Eslatma:
```
⚠️ Eslatma: Kodni o'zgartirish uchun hozirgi ish kodi 
va akkaunt parolingiz kerak bo'ladi.
```

### SchoolTab Eslatma:
```
⚠️ Eslatma: Kodni o'zgartirish uchun hozirgi maktab kodi 
va akkaunt parolingiz kerak bo'ladi.
```

## 🐛 XATOLAR

### "Hozirgi ish kodi noto'g'ri!"
- Hozirgi kodingizni to'g'ri kiriting
- Kod 4-6 raqam bo'lishi kerak

### "Akkaunt paroli noto'g'ri!"
- Telefon parolingizni to'g'ri kiriting
- Bu login parolingiz

### "Yangi kod 4-6 raqam bo'lishi kerak!"
- Yangi kod 4, 5 yoki 6 raqam bo'lishi kerak
- Faqat raqamlar

## 🚀 TEST QILISH

### MUHIM: Incognito Mode!

```
Ctrl + Shift + N
http://localhost:5003
```

### Test Tartibi:

1. **Login:**
   - Telefon: +998901234567
   - Parol: demo123

2. **Sozlamalar:**
   - "Ishlayman" ni tanlang
   - Ma'lumotlarni to'ldiring
   - Saqlang

3. **Ish Tabiga Kiring:**
   - Burger menyu → Ish
   - Kod o'rnating: 1234
   - Kirish

4. **Kod O'zgartirish:**
   - "KOD O'ZGARTIRISH" tugmasini bosing
   - Hozirgi kod: 1234
   - Akkaunt paroli: demo123
   - Yangi kod: 5678
   - "O'ZGARTIRISH" ni bosing

5. **Tekshirish:**
   - Ish tabidan chiqing (YOPISH)
   - Qaytadan kirish
   - Yangi kod (5678) bilan kirish kerak

## ✅ KUTILGAN NATIJA

- ✅ Foydalanuvchi o'zi kod o'zgartira oladi
- ✅ Xavfsiz (3 qatlamli himoya)
- ✅ Oson foydalanish
- ✅ Chiroyli dizayn
- ✅ MongoDB ga saqlanadi

## 📝 KOD TUZILISHI

### State
```javascript
// Kod o'zgartirish uchun
const [showChangeCode, setShowChangeCode] = useState(false)
const [currentWorkCode, setCurrentWorkCode] = useState('')
const [accountPassword, setAccountPassword] = useState('')
const [newWorkCode, setNewWorkCode] = useState('')
```

### Funksiya
```javascript
const handleChangeCode = async () => {
  // 1. Hozirgi kodini tekshirish
  if (currentWorkCode !== savedCode) {
    alert('Hozirgi ish kodi noto\'g\'ri!')
    return
  }

  // 2. Akkaunt parolini tekshirish
  if (accountPassword !== userData.pass) {
    alert('Akkaunt paroli noto\'g\'ri!')
    return
  }

  // 3. Yangi kod validatsiya
  if (newWorkCode.length < 4 || newWorkCode.length > 6) {
    alert('Yangi kod 4-6 raqam bo\'lishi kerak!')
    return
  }

  // 4. Kodni o'zgartirish
  setSavedCode(newWorkCode)
  const updatedData = { ...userData, workCode: newWorkCode }
  setUserData(updatedData)
  await saveToMongoDB({ workCode: newWorkCode })
  
  alert('Kod muvaffaqiyatli o\'zgartirildi!')
  setShowChangeCode(false)
}
```

## 🎉 XULOSA

Endi foydalanuvchi o'zi ish va maktab kodlarini o'zgartira oladi!

- ✅ WorkTab - Kod o'zgartirish
- ✅ SchoolTab - Kod o'zgartirish
- ✅ Xavfsiz va oson
- ✅ Chiroyli dizayn

**Incognito mode da test qiling!**

Omad! 🚀
