# VIDEO MASLAHAT INTEGRATSIYA - KELAJAK PROGNOZ

## ✅ BAJARILDI

### 1. `openVideoForGoal()` Funksiyasi Qo'shildi
**Fayl**: `nuraziz-pro.html` (line ~3310)

```javascript
function openVideoForGoal(query) {
    // Switch to video tab
    switchTab('video');
    
    // Set the query in the input field
    document.getElementById('video-question-input').value = query;
    
    // Automatically trigger the search
    setTimeout(() => {
        askVideoAdvice();
    }, 300);
}
```

### 2. Qanday Ishlaydi?

1. **KELAJAK PROGNOZ** tab da maqsad qo'shiladi
2. **"TAHLIL QILISH"** tugmasi bosiladi
3. Har bir maqsad uchun:
   - 🆓 Bepul eng yaxshi ustoz/resurs
   - 💰 Pullik eng yaxshi ustoz/kurs
   - 📹 **AI VIDEO MASLAHAT** tugmasi
4. **AI VIDEO MASLAHAT** tugmasi bosilganda:
   - Avtomatik **VIDEO MASLAHAT** tab ga o'tadi
   - Qidiruv maydoniga maqsad kiritiladi
   - Avtomatik qidiruv boshlanadi
   - AI tushuntirish va video ko'rsatiladi

### 3. Qo'llab-quvvatlanadigan Maqsadlar

| Maqsad | Bepul Maslahat | Pullik Maslahat | Video Query |
|--------|----------------|-----------------|-------------|
| **IELTS** | IELTS Liz (YouTube) | British Council IELTS | "IELTS tayyorgarlik o'zbek tilida" |
| **Biznes** | Startup School (Y Combinator) | MBA Online | "Biznes boshlash o'zbek tilida" |
| **Ingliz tili** | Duolingo + BBC Learning English | English First (EF) | "Ingliz tili o'rganish o'zbek tilida" |
| **Dasturlash** | freeCodeCamp + Codecademy | Udemy Premium | "Dasturlash o'rganish o'zbek tilida" |
| **Turnik** | Calisthenics Movement (YouTube) | Shaxsiy trener | "Turnik o'rganish o'zbek tilida" |
| **Yugurish** | Couch to 5K | Running Coach | "Yugurish texnikasi o'zbek tilida" |
| **Vazn** | MyFitnessPal + YouTube | Dietolog + Trener | "Vazn yo'qotish o'zbek tilida" |
| **YouTube kanal** | YouTube Creator Academy | VidIQ Pro | "YouTube kanal ochish o'zbek tilida" |
| **Pul ishlash** | Upwork + Fiverr | Business Mentor | "Pul ishlash yo'llari o'zbek tilida" |

### 4. Misol

**Foydalanuvchi**:
1. KELAJAK PROGNOZ ga kiradi
2. Maqsad: "IELTS 8 olish"
3. Hozir: "5.5"
4. Kuniga vaqt: "3 soat"
5. **MAQSAD QO'SHISH** tugmasi
6. **TAHLIL QILISH** tugmasi

**Natija**:
```
📚 IELTS 8 olish
Hozir: 5.5 → Maqsad: 8.0 (+2.5 ball)
Kunlik: 3 soat
Jami: 1080 soat tayyorgarlik

⏰ Vaqt: 9 oy
📅 Taxminiy sana: Noyabr 2026

📚 MASLAHATLAR:
🆓 IELTS Liz (YouTube) - Bepul eng yaxshi kanal
💰 British Council IELTS Kurs - Professional tayyorgarlik

[📹 AI VIDEO MASLAHAT] ← Tugma bosilganda
```

**VIDEO MASLAHAT tab ga o'tadi**:
- Input: "IELTS tayyorgarlik o'zbek tilida"
- AI tushuntirish ko'rsatiladi
- Video link ko'rsatiladi
- Boshqa video tugmasi

### 5. Texnik Tafsilotlar

**Funksiya joylashuvi**: Line ~3310
**Bog'liq funksiyalar**:
- `switchTab('video')` - Tab almashtirish
- `askVideoAdvice()` - Video qidiruv
- `displayCurrentVideo()` - Video ko'rsatish

**Timeout**: 300ms - Tab almashish uchun vaqt

### 6. Test Qilish

```bash
# Server ishga tushirish
npm run dev

# Brauzer
http://localhost:5002

# Test:
1. Login qiling
2. KELAJAK PROGNOZ tab ga o'ting
3. Maqsad qo'shing (masalan: "IELTS 8 olish")
4. TAHLIL QILISH tugmasi
5. AI VIDEO MASLAHAT tugmasi bosing
6. VIDEO MASLAHAT tab ga o'tishini tekshiring
7. Avtomatik qidiruv boshlanishini tekshiring
```

## 📊 NATIJA

✅ `openVideoForGoal()` funksiyasi qo'shildi
✅ VIDEO MASLAHAT integratsiyasi bajarildi
✅ Har bir maqsad uchun video maslahat
✅ Avtomatik tab almashtirish
✅ Avtomatik qidiruv
✅ Hech qanday syntax xato yo'q

## 🎯 KEYINGI QADAMLAR

Hamma narsa tayyor! Foydalanuvchi endi:
1. Maqsad qo'shishi
2. AI tahlil olishi
3. Bepul/pullik maslahatlar olishi
4. VIDEO MASLAHAT ga o'tishi
5. Video ko'rishi mumkin

**KELAJAK PROGNOZ funksiyasi to'liq tayyor!** 🚀
