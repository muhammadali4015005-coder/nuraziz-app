# KELAJAK PROGNOZ - SPORT NATIJALARIGA ASOSLANGAN

## O'ZGARISHLAR

### FutureTab.jsx - calculateDaysToGoal funksiyasi yangilandi

**AVVALGI HOLAT:**
- Prognoz `dailySchedule` (kunlik tartib) ma'lumotlariga asoslangan edi
- Oxirgi 7 kunning umumiy vazifalarini tekshirardi
- Sport mashqlari bilan bog'liq emas edi

**YANGI HOLAT:**
- Prognoz **sport mashqlari** natijalariga asoslangan
- `morningExercises` va `eveningExercises` dan ma'lumot oladi
- Bajarilgan mashqlar sonini sanaydi
- Sport natijalariga qarab maqsadga erishish muddatini hisoblaydi

## QANDAY ISHLAYDI?

### 1. Sport Ma'lumotlarini Olish
```javascript
const morningExercises = user?.morningExercises || []
const eveningExercises = user?.eveningExercises || []
```

### 2. Bajarilgan Mashqlarni Sanash
```javascript
const completedMorning = morningExercises.filter(e => e.completed).length
const completedEvening = eveningExercises.filter(e => e.completed).length
const totalCompleted = completedMorning + completedEvening
```

### 3. Prognoz Hisoblash
- Haftalik o'rtacha progress = hozirgi holat / 7 kun
- Qolgan miqdor = maqsad - hozirgi holat
- Kerakli haftalar = qolgan miqdor / haftalik progress
- Kerakli kunlar = kerakli haftalar × 7

### 4. Ko'rsatiladigan Ma'lumotlar
- **Bajarilgan mashqlar**: Jami nechta mashq bajarilgan
- **Haftalik progress**: Haftada qancha progress qilasiz
- **Kunlik o'rtacha**: Har kuni o'rtacha qancha
- **Kerakli haftalar**: Necha hafta kerak
- **Taxminiy muddat**: Qachon maqsadga erishasiz

## FOYDALANISH

### 1. Sport Mashqlarini Qo'shish
- Sport Mashqlari tabiga o'ting
- Ertalab yoki kechqurun mashqlarini qo'shing
- Mashqlarni bajaring va belgilang (✓)

### 2. Maqsad Qo'yish
- Kelajak tabiga o'ting
- "YANGI MAQSAD QO'SHISH" tugmasini bosing
- Maqsad nomi, hozirgi holat, maqsad raqamini kiriting
- Masalan: "Turnik tortish", hozir: 10, maqsad: 100

### 3. Prognozni Ko'rish
- Maqsad kartasida avtomatik prognoz ko'rsatiladi
- Sport mashqlaringiz natijalariga qarab hisoblangan
- Muntazam mashq qilsangiz, prognoz aniqroq bo'ladi

## XUSUSIYATLAR

### ✅ Sport Natijalariga Asoslangan
- Faqat sport mashqlari hisobga olinadi
- Kunlik tartib bilan aralashmaydi
- Aniq va sport-ga oid prognoz

### ✅ Dinamik Hisoblash
- Har safar yangilanadi
- Hozirgi progressga qarab
- Real vaqtda ko'rsatiladi

### ✅ Tushunarli Ko'rinish
- Bajarilgan mashqlar soni
- Haftalik va kunlik o'rtacha
- Aniq sana va muddat
- Motivatsion xabar

### ✅ Xato Xabarlari
- Agar sport mashqlari bajarilmagan bo'lsa:
  - "PROGNOZ MAVJUD EMAS" xabari
  - "Sport mashqlarini bajaring" tavsiyasi
  - Qizil rangda ogohlantirish

## MISOL

### Maqsad: 100 ta turnik tortish
- **Hozirgi holat**: 20 ta
- **Bajarilgan mashqlar**: 15 ta (ertalab + kechqurun)
- **Haftalik progress**: ~20 ta
- **Kunlik o'rtacha**: ~2.9 ta
- **Kerakli haftalar**: 4 hafta
- **Taxminiy muddat**: 28 kun ichida

## TEXNIK TAFSILOTLAR

### Ma'lumotlar Manbai
```javascript
user.morningExercises = [
  { id: 1, time: '06:00', exercise: 'Turnik', duration: '10 ta', completed: true },
  { id: 2, time: '06:30', exercise: 'Yugurish', duration: '20 daqiqa', completed: true }
]

user.eveningExercises = [
  { id: 3, time: '18:00', exercise: 'Turnik', duration: '15 ta', completed: true }
]
```

### Prognoz Obyekti
```javascript
{
  days: 28,                    // Kerakli kunlar
  weeks: 4,                    // Kerakli haftalar
  activeDays: 15,              // Bajarilgan mashqlar soni
  weeklyProgress: 20,          // Haftalik progress
  dailyAverage: 2.9,           // Kunlik o'rtacha
  completedExercises: 15       // Jami bajarilgan mashqlar
}
```

## KELAJAKDA YAXSHILASH

### 1. Tarixiy Ma'lumotlar
- Oxirgi 30 kunning natijalarini saqlash
- Aniqroq prognoz uchun ko'proq ma'lumot

### 2. Mashq Turlari
- Har xil mashq turlariga qarab prognoz
- Masalan: turnik, yugurish, suzish

### 3. Grafik Ko'rinish
- Progress grafigi
- Kunlik natijalar diagrammasi
- Trend chizig'i

### 4. AI Tavsiyalar
- Qanday tezroq erishish mumkin
- Qaysi mashqlarni ko'paytirish kerak
- Dam olish kunlari tavsiyasi

## XULOSA

Kelajak tab endi sport mashqlari natijalariga asoslangan prognoz ko'rsatadi. Foydalanuvchi sport mashqlarini bajargani sari, maqsadga erishish muddati aniqroq hisoblanadi va ko'rsatiladi.

**Versiya**: 4.2.1 - Sport-based Future Predictions
**Sana**: 2026-02-15
**Status**: ✅ BAJARILDI
