# Render.com Deploy Qilish Bo'yicha Qo'llanma

## Muammo
Hozirda Render.com da faqat backend server ishlamoqda, lekin React dasturi (npm run dev natijasi) ko'rinmayapti.

## Yechim
Render.com da quyidagi sozlamalarni o'zgartirish kerak:

### 1. Render.com Dashboard ga kiring
- https://dashboard.render.com ga o'ting
- `nuraziz-app` servisini toping va bosing

### 2. Settings ga o'ting
- Chap tarafdagi "Settings" tugmasini bosing

### 3. Build Command ni o'zgartiring
Quyidagi qatorni toping:
```
Build Command: npm install
```

Uni quyidagiga o'zgartiring:
```
npm install && npm run build
```

Bu buyruq:
- Avval barcha paketlarni o'rnatadi (`npm install`)
- Keyin React dasturini build qiladi (`npm run build`)
- `dist` papkasini yaratadi

### 4. Start Command ni tekshiring
Start Command quyidagicha bo'lishi kerak:
```
npm start
```
yoki
```
node server.js
```

### 5. Environment Variables (ixtiyoriy)
Agar MongoDB ishlatmoqchi bo'lsangiz:
- "Environment" bo'limiga o'ting
- Quyidagi o'zgaruvchilarni qo'shing:
  - `MONGODB_URI` = `mongodb+srv://username:password@cluster.mongodb.net/nuraziz_db`
  - `PORT` = `10000` (Render avtomatik beradi)

### 6. Saqlash va Deploy
- "Save Changes" tugmasini bosing
- Render avtomatik ravishda qayta deploy qiladi
- 2-3 daqiqa kutib turing

### 7. Natijani tekshirish
- https://nuraziz-app.onrender.com ga o'ting
- Endi React dasturi (login ekrani) ko'rinishi kerak

## Qanday ishlaydi?

1. **Build vaqtida** (`npm run build`):
   - Vite React dasturini build qiladi
   - `dist` papkasiga HTML, CSS, JS fayllarini joylashtiradi

2. **Ishga tushganda** (`node server.js`):
   - Server 5003 portda ishga tushadi
   - `/` ga kirganingizda `dist/index.html` ni ko'rsatadi
   - `/api/*` ga kirganingizda backend API ishlaydi
   - `/assets/*` ga kirganingizda CSS/JS fayllar yuklanadi

## Xatolik yuz bersa

Agar "Topilmadi" xatosi chiqsa:
1. Render.com Logs ni tekshiring
2. Build Command to'g'ri ishlayotganini tekshiring
3. `dist` papkasi yaratilganini tekshiring

## Qo'shimcha

Agar local da test qilmoqchi bo'lsangiz:
```bash
npm run build
npm start
```

Keyin http://localhost:5003 ga o'ting - xuddi deploy qilingan versiya kabi ishlaydi.
