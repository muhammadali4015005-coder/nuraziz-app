# MongoDB O'rnatish (Windows)

## ✅ HOZIRGI HOLAT

Dastur hozir **LocalStorage** da ishlaydi. MongoDB o'rnatilgandan keyin avtomatik MongoDB ga o'tadi.

---

## 📥 VARIANT 1: MongoDB Community Server (Tavsiya etiladi)

### 1. Yuklab Olish
1. Saytga kiring: https://www.mongodb.com/try/download/community
2. **Version**: Latest (masalan 7.0.x)
3. **Platform**: Windows
4. **Package**: MSI
5. **Download** tugmasini bosing

### 2. O'rnatish
1. Yuklab olingan `.msi` faylni oching
2. **Complete** setup ni tanlang
3. **Install MongoDB as a Service** - ✅ belgilangan bo'lsin
4. **Run service as Network Service user** - tanlangan bo'lsin
5. **Install MongoDB Compass** - ✅ belgilangan bo'lsin (GUI dastur)
6. **Next** → **Install**
7. Kutib turing (5-10 daqiqa)

### 3. Tekshirish
PowerShell da:
```powershell
mongod --version
```

Agar versiya ko'rsatsa - muvaffaqiyatli o'rnatildi! ✅

---

## 📥 VARIANT 2: MongoDB ZIP (Qo'lda)

### 1. Yuklab Olish
1. https://www.mongodb.com/try/download/community
2. **Package**: ZIP ni tanlang
3. Download

### 2. O'rnatish
1. ZIP ni ochib `C:\mongodb` ga ko'chiring
2. `C:\mongodb\data\db` papka yarating
3. `C:\mongodb\log` papka yarating

### 3. Ishga Tushirish
PowerShell da:
```powershell
cd C:\mongodb\bin
.\mongod.exe --dbpath C:\mongodb\data\db
```

---

## 🚀 DASTURNI ISHLATISH

### MongoDB O'rnatilgandan Keyin:

1. **Server ishga tushirish:**
```bash
npm run dev
```

2. **Brauzerda ochish:**
```
http://localhost:5002
```

3. **Yangi akkaunt yaratish:**
- Telefon: +998 91 823 58 58
- Kod: 1234
- Ma'lumotlar MongoDB da saqlanadi! ✅

---

## 🔍 MONGODB TEKSHIRISH

### MongoDB Compass (GUI)
1. MongoDB Compass ni oching
2. Connection: `mongodb://localhost:27017`
3. Connect
4. Database: `nuraziz_db`
5. Collection: `users`
6. Barcha foydalanuvchilarni ko'rasiz

### Mongo Shell (CLI)
```bash
mongosh
use nuraziz_db
db.users.find().pretty()
```

---

## ⚙️ MONGODB SERVICE

### Service Holatini Tekshirish
```powershell
Get-Service MongoDB
```

### Service Ishga Tushirish
```powershell
Start-Service MongoDB
```

### Service To'xtatish
```powershell
Stop-Service MongoDB
```

---

## 🔄 QANDAY ISHLAYDI?

### MongoDB Bilan:
1. Yangi akkaunt yaratiladi → MongoDB ga saqlanadi
2. Kirish → MongoDB dan yuklanadi
3. O'zgarishlar → MongoDB ga saqlanadi
4. LocalStorage backup sifatida ishlatiladi

### MongoDB Bo'lmasa:
1. Yangi akkaunt yaratiladi → LocalStorage ga saqlanadi
2. Kirish → LocalStorage dan yuklanadi
3. O'zgarishlar → LocalStorage ga saqlanadi
4. Console da: "MongoDB not available, using LocalStorage"

---

## 📊 AFZALLIKLARI

### MongoDB:
✅ Doimiy saqlash
✅ Bir nechta qurilmadan kirish
✅ Katta hajm
✅ Tezkor qidiruv
✅ Backup oson

### LocalStorage:
✅ O'rnatish shart emas
✅ Oddiy
⚠️ Faqat bitta brauzerda
⚠️ Cheklangan hajm (5-10MB)
⚠️ Brauzer tozalansa yo'qoladi

---

## 🎯 TAVSIYA

**Shaxsiy foydalanish uchun:** LocalStorage yetarli
**Ko'p foydalanuvchi uchun:** MongoDB kerak
**Professional dastur uchun:** MongoDB + backup

---

## 🆘 MUAMMOLAR

### "mongod not recognized"
- MongoDB PATH ga qo'shilmagan
- Kompyuterni qayta ishga tushiring
- Yoki to'liq yo'lni kiriting: `C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe`

### "Service not found"
- MongoDB service sifatida o'rnatilmagan
- ZIP versiyasini ishlatgan bo'lsangiz, qo'lda ishga tushiring

### Port 27017 band
```powershell
netstat -ano | findstr :27017
taskkill /F /PID <PID>
```

---

## ✅ XULOSA

1. **Hozir:** Dastur LocalStorage da ishlaydi ✅
2. **MongoDB o'rnatilsa:** Avtomatik MongoDB ga o'tadi ✅
3. **Ikkalasi ham:** Backup uchun LocalStorage saqlanadi ✅

**Dastur har qanday holatda ishlaydi!** 💪
