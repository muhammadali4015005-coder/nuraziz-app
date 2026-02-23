# MongoDB O'rnatish va Ishga Tushirish

## ✅ TAYYOR!

Dastur MongoDB bilan ishlash uchun tayyor. Endi MongoDB ni o'rnatish va ishga tushirish kerak.

## 1️⃣ MongoDB O'rnatish (Windows)

### Variant A: MongoDB Community Server
1. Saytga kiring: https://www.mongodb.com/try/download/community
2. Windows versiyasini yuklab oling
3. O'rnating (default sozlamalar bilan)
4. MongoDB Compass ham o'rnatiladi (GUI dastur)

### Variant B: Chocolatey orqali (tezroq)
```bash
choco install mongodb
```

## 2️⃣ MongoDB Ishga Tushirish

### Windows Service sifatida (avtomatik)
MongoDB o'rnatilgandan keyin avtomatik ishga tushadi.

Tekshirish:
```bash
mongod --version
```

### Qo'lda ishga tushirish
Agar service ishlamasa:
```bash
mongod
```

## 3️⃣ Dasturni Ishlatish

### Server ishga tushirish:
```bash
npm run dev
```

### Brauzerda ochish:
```
http://localhost:5002
```

## 📊 MongoDB Ma'lumotlarni Ko'rish

### MongoDB Compass (GUI)
1. MongoDB Compass ni oching
2. Connection string: `mongodb://localhost:27017`
3. Connect bosing
4. Database: `nuraziz_db`
5. Collection: `users`

### Mongo Shell (CLI)
```bash
mongosh
use nuraziz_db
db.users.find()
```

## 🔄 Qanday Ishlaydi?

1. **Ro'yxatdan o'tish**: Yangi akkaunt yaratilganda MongoDB ga saqlanadi
2. **Kirish**: MongoDB dan ma'lumotlar yuklanadi
3. **O'zgarishlar**: Har bir o'zgarish avtomatik MongoDB ga saqlanadi
4. **Xavfsizlik**: Har bir foydalanuvchi o'z ma'lumotlariga ega

## ⚠️ MongoDB O'rnatilmagan Bo'lsa?

Agar MongoDB o'rnatilmagan bo'lsa, dastur ishlaydi lekin:
- Ma'lumotlar faqat brauzer LocalStorage da saqlanadi
- Brauzer tozalansa, ma'lumotlar yo'qoladi
- Console da ogohlantirish ko'rinadi: "⚠️ MongoDB not available"

## 🎯 Afzalliklari

### MongoDB bilan:
✅ Ma'lumotlar doimiy saqlanadi
✅ Brauzer tozalansa ham ma'lumotlar saqlanadi
✅ Bir nechta qurilmadan kirish mumkin
✅ Backup oson
✅ Ko'p foydalanuvchi uchun mos

### LocalStorage bilan:
⚠️ Faqat bitta brauzerda ishlaydi
⚠️ Brauzer tozalansa ma'lumotlar yo'qoladi
⚠️ Cheklangan hajm (5-10MB)

## 🚀 Tayyor!

MongoDB o'rnatilgandan keyin:
1. `npm run dev` - serverni ishga tushiring
2. `http://localhost:5002` - brauzerda oching
3. Yangi akkaunt yarating
4. Ma'lumotlar MongoDB da saqlanadi!

## 📞 Demo Akkaunt

Telefon: +998 91 823 58 58
Kod: 1234
