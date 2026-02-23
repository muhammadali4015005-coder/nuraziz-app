# MONGODB SAQLASH TO'LIQ ✅

## Barcha ma'lumotlar MongoDB ga saqlanadi

Har bir o'zgarish darhol MongoDB ga saqlanadi. Quyida barcha API endpointlar ro'yxati:

### 1. KUNLIK TARTIB
**Endpoint:** `/api/save-daily-schedule` (POST)
**Ma'lumot:**
```json
{
  "phone": "+998 XX XXX XX XX",
  "dailySchedule": [
    {
      "id": 1234567890,
      "time": "06:00",
      "task": "Ertalabki mashq",
      "completed": null,
      "date": "2026-02-13"
    }
  ]
}
```
**Qachon saqlanadi:**
- Vazifa qo'shilganda
- Bajarildi/Bajarilmadi belgilanganda
- Vazifa tahrirlan ganda
- Vazifa o'chirilganda

### 2. KUNLIK TARTIB TARIXI
**Endpoint:** `/api/save-schedule-history` (POST)
**Ma'lumot:**
```json
{
  "phone": "+998 XX XXX XX XX",
  "scheduleHistory": [
    {
      "date": "2026-02-13",
      "schedule": [...]
    }
  ],
  "dailySchedule": [...]
}
```
**Qachon saqlanadi:**
- Jildga saqlanganda
- Ertasi kuni avtomatik

### 3. REJALAR
**Endpoint:** `/api/save-plans` (POST)
**Ma'lumot:**
```json
{
  "phone": "+998 XX XXX XX XX",
  "plans": [
    {
      "id": 1234567890,
      "name": "Kuch liylik",
      "description": "100 ta turnik",
      "startDate": "2026-02-13",
      "endDate": "2026-12-31",
      "completed": false
    }
  ]
}
```
**Qachon saqlanadi:**
- Reja qo'shilganda
- Reja tahrirlan ganda
- Reja o'chirilganda
- Reja bajarildi/bajarilmadi belgilanganda

### 4. SPORT MAQSADI
**Endpoint:** `/api/save-sport-goal` (POST)
**Ma'lumot:**
```json
{
  "phone": "+998 XX XXX XX XX",
  "sportGoal": "100 ta turnik qilish"
}
```
**Qachon saqlanadi:**
- Maqsad saqlanganda

### 5. ERTALABKI MASHQLAR
**Endpoint:** `/api/save-morning-exercises` (POST)
**Ma'lumot:**
```json
{
  "phone": "+998 XX XXX XX XX",
  "morningExercises": [
    {
      "id": 1234567890,
      "time": "06:00",
      "exercise": "Yugurish",
      "duration": "10 daqiqa",
      "completed": false
    }
  ]
}
```
**Qachon saqlanadi:**
- Mashq qo'shilganda
- Mashq bajarildi belgilanganda
- Mashq o'chirilganda

### 6. KECHKI MASHQLAR
**Endpoint:** `/api/save-evening-exercises` (POST)
**Ma'lumot:**
```json
{
  "phone": "+998 XX XXX XX XX",
  "eveningExercises": [
    {
      "id": 1234567890,
      "time": "18:00",
      "exercise": "Turnik",
      "duration": "100 ta",
      "completed": false
    }
  ]
}
```
**Qachon saqlanadi:**
- Mashq qo'shilganda
- Mashq bajarildi belgilanganda
- Mashq o'chirilganda

### 7. SOZLAMALAR (Haftalik Jadval)
**Endpoint:** `/api/save-settings` (POST)
**Ma'lumot:**
```json
{
  "phone": "+998 XX XXX XX XX",
  "name": "Foydalanuvchi",
  "settings": {
    "age": "25",
    "notes": "...",
    "weeklySchedule": {
      "Monday": { "morning": "Calish tenks", "evening": "Grud" },
      "Tuesday": { "morning": "Dam olish", "evening": "Yelka" },
      ...
    }
  }
}
```
**Qachon saqlanadi:**
- Haftalik jadval o'zgartirilganda
- Sozlamalar o'zgartirilganda

### 8. OVQATLANISH
**Endpoint:** `/api/save-nutrition` (POST)
**Ma'lumot:**
```json
{
  "phone": "+998 XX XXX XX XX",
  "nutrition": {
    "breakfast": { "time": "08:00", "water": 2, "foods": "..." },
    "lunch": { "time": "12:00", "water": 2, "foods": "..." },
    "dinner": { "time": "18:00", "water": 2, "foods": "..." }
  },
  "nutritionChat": [
    { "role": "user", "content": "..." },
    { "role": "ai", "content": "..." }
  ]
}
```
**Qachon saqlanadi:**
- Ovqat ma'lumoti saqlanganda
- AI suhbat yuborilganda

### 9. ADMIN CHAT
**Endpoint:** `/api/admin-chat/send` (POST)
**Ma'lumot:**
```json
{
  "phone": "+998 XX XXX XX XX",
  "name": "Foydalanuvchi",
  "message": "Salom",
  "role": "user"
}
```
**Qachon saqlanadi:**
- Xabar yuborilganda (user yoki admin)

**Endpoint:** `/api/admin-chat/update` (POST)
**Ma'lumot:**
```json
{
  "phone": "+998 XX XXX XX XX",
  "messages": [...]
}
```
**Qachon saqlanadi:**
- Xabar tahrirlan ganda
- Xabar o'chirilganda

### 10. FOYDALANUVCHI MA'LUMOTLARI
**Endpoint:** `/api/save-user` (POST)
**Ma'lumot:**
```json
{
  "phone": "+998 XX XXX XX XX",
  "name": "Foydalanuvchi",
  "pass": "1234",
  "approved": true,
  "subscriptionActive": true,
  ...
}
```
**Qachon saqlanadi:**
- Foydalanuvchi ro'yxatdan o'tganda
- Admin tasdiqlaganda
- Obuna to'xtatilganda/faollashtirilganda

## MongoDB Structure

```javascript
{
  // Asosiy ma'lumotlar
  phone: "+998 XX XXX XX XX",
  pass: "1234",
  name: "Foydalanuvchi",
  approved: true,
  subscriptionActive: true,
  subscriptionExpiry: Date,
  planCode: "ABC123",
  createdAt: Date,
  updatedAt: Date,
  
  // Kunlik Tartib
  dailySchedule: [
    {
      id: Number,
      time: String,
      task: String,
      completed: Boolean | null,
      date: String
    }
  ],
  scheduleHistory: [
    {
      date: String,
      schedule: Array
    }
  ],
  
  // Rejalar
  plans: [
    {
      id: Number,
      name: String,
      description: String,
      startDate: String,
      endDate: String,
      completed: Boolean
    }
  ],
  
  // Sport
  sportGoal: String,
  morningExercises: [
    {
      id: Number,
      time: String,
      exercise: String,
      duration: String,
      completed: Boolean
    }
  ],
  eveningExercises: [
    {
      id: Number,
      time: String,
      exercise: String,
      duration: String,
      completed: Boolean
    }
  ],
  
  // Sozlamalar
  settings: {
    age: String,
    notes: String,
    sportDays: String,
    morningType: String,
    eveningType: String,
    sportTypes: Array,
    sportName: String,
    weeklySchedule: {
      Monday: { morning: String, evening: String },
      Tuesday: { morning: String, evening: String },
      ...
    }
  },
  
  // Ovqatlanish
  nutrition: {
    breakfast: { time: String, water: Number, foods: String },
    lunch: { time: String, water: Number, foods: String },
    dinner: { time: String, water: Number, foods: String }
  },
  nutritionChat: [
    { role: String, content: String }
  ],
  
  // Admin Chat
  chatMessages: [
    {
      role: String,
      message: String,
      timestamp: Date
    }
  ]
}
```

## Avtomatik Saqlash

Barcha o'zgarishlar darhol MongoDB ga saqlanadi:
- ✅ Vazifa qo'shish
- ✅ Vazifa tahrirlash
- ✅ Vazifa o'chirish
- ✅ Vazifa bajarish
- ✅ Reja qo'shish
- ✅ Reja tahrirlash
- ✅ Reja o'chirish
- ✅ Mashq qo'shish
- ✅ Mashq bajarish
- ✅ Mashq o'chirish
- ✅ Maqsad saqlash
- ✅ Jadval o'zgartirish
- ✅ Ovqat saqlash
- ✅ Xabar yuborish

## Tekshirish

MongoDB ga saqlanganligini tekshirish uchun:

1. MongoDB Compass ochilsin
2. `athletic_coach` database ni tanlang
3. `users` collection ni oching
4. Foydalanuvchini toping (phone bo'yicha)
5. Barcha ma'lumotlarni ko'ring

Yoki terminal orqali:
```bash
mongosh
use athletic_coach
db.users.findOne({ phone: "+998 XX XXX XX XX" })
```

## Xulosa

Barcha funksiyalar MongoDB ga saqlanadi. Har bir o'zgarish darhol saqlanadi va keyingi safar dasturga kirganingizda barcha ma'lumotlar yuklanadi.
