# Test Qilish Yo'riqnomasi

## ⚠️ MUHIM: Avval LocalStorage ni tozalang!

### 1. Brauzerda oching:
```
http://localhost:5002
```

### 2. Console ni oching:
- F12 tugmasini bosing
- "Console" tabini tanlang

### 3. LocalStorage ni tozalang:
Console ga quyidagini yozing va Enter bosing:
```javascript
localStorage.clear()
```

### 4. Sahifani yangilang:
- F5 yoki Ctrl+R

---

## ✅ Yangi Akkaunt Yaratish

### 1. "YANGI AKKAUNT" tugmasini bosing

### 2. Ma'lumotlarni kiriting:
- **Telefon:** `998918235858` (faqat raqamlar)
- **Kod:** `1234`
- **Tasdiqlash:** `1234`

### 3. "YARATISH" tugmasini bosing

### 4. Console da ko'ring:
```
Register clicked!
Register - Phone input: +998 91 823 58 58
Register - Clean phone: 998918235858
Register - Password: 1234
MongoDB not available, using LocalStorage
Current LocalStorage data: {}
Saved to LocalStorage: {phone: "998918235858", pass: "1234", ...}
```

### 5. Alert ko'rinadi:
```
Akkaunt yaratildi!
```

---

## ✅ Kirish

### 1. Ma'lumotlarni kiriting:
- **Telefon:** `998918235858` (faqat raqamlar)
- **Kod:** `1234`

### 2. "KIRISH" tugmasini bosing

### 3. Console da ko'ring:
```
Login clicked!
Login - Phone input: +998 91 823 58 58
Login - Clean phone: 998918235858
Login - Password: 1234
MongoDB not available, using LocalStorage
LocalStorage data: {998918235858: {...}}
Looking for phone: 998918235858
User data: {phone: "998918235858", pass: "1234", ...}
Login successful!
```

### 4. Kiradi! ✅

---

## ❌ Agar Xato Bo'lsa

### Console da qanday xabar ko'rsatyapti?

**Variant 1: User not found**
```
User not found!
```
Bu degani: Telefon raqam noto'g'ri yoki akkaunt yaratilmagan

**Variant 2: Password mismatch**
```
Password mismatch! Stored: 1234 Entered: 5678
```
Bu degani: Parol noto'g'ri

**Variant 3: Boshqa xato**
Console dagi barcha qizil xabarlarni ko'rsating

---

## 🔍 LocalStorage ni Tekshirish

Console ga yozing:
```javascript
JSON.parse(localStorage.getItem('nuraziz_local_db'))
```

Natija:
```javascript
{
  "998918235858": {
    "phone": "998918235858",
    "pass": "1234",
    "schedule": {},
    "morning": [],
    "evening": [],
    "goals": [],
    "foods": [],
    "settings": {...}
  }
}
```

Agar `{}` (bo'sh) bo'lsa - akkaunt yaratilmagan!

---

## 📸 Menga Yuboring

1. Console dagi barcha xabarlar (screenshot)
2. LocalStorage ma'lumotlari (yuqoridagi buyruq natijasi)
3. Qanday telefon va kod kiritdingiz

Shunda tezda tuzataman! 🔧
