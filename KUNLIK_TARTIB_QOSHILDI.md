# KUNLIK TARTIB QOSHILDI ✅

## Nima qilindi?

Burger menyuga "Kunlik Tartib" bo'limi qo'shildi. Bu bo'limda foydalanuvchilar kunlik vazifalarini boshqarishi mumkin.

## Xususiyatlar

### 1. Vazifa qo'shish
- Vaqt tanlash (time input)
- Vazifa nomi yozish
- "VAZIFA QO'SHISH" tugmasi

### 2. Vazifalar ro'yxati
- Vaqt bo'yicha tartiblangan
- Har bir vazifa orasida `--|--` separator
- Vazifa holati: ✓ (bajarildi) yoki ✗ (bajarilmadi)
- Bajarilgan vazifalar yashil border va chizilgan matn
- Har bir vazifada:
  - Vaqt (ko'k rang)
  - Vazifa nomi
  - Holat tugmasi (✓/✗)
  - O'CHIRISH tugmasi (qizil)

### 3. Jildga saqlash
- "JILDGA SAQLASH" tugmasi
- Bugungi tartibni tarixga saqlaydi
- Yangi kun uchun vazifalar tozalanadi (completed = false)

### 4. Jildni ko'rish
- "JILDNI KO'RISH" tugmasi
- Avvalgi kunlarning tartiblarini ko'rsatadi
- Har bir kun uchun:
  - Sana (DD.MM.YYYY format)
  - Barcha vazifalar va ularning holati
  - Bajarilgan vazifalar yashil border
  - Bajarilmagan vazifalar qizil border

## Dizayn

### Ranglar
- Background: #0a0e27 (qora)
- Border: #0f3460 (to'q ko'k)
- Vaqt: #00d4ff (ochiq ko'k)
- Bajarildi: #00ff88 (yashil)
- Bajarilmadi: #ff0055 (qizil)
- Separator: #555 (kulrang)

### Layout
- Tartib ro'yxati: 300-400px balandlik, scroll
- Har bir vazifa: padding 12px, border-radius 8px
- Tugmalar: border-radius 6-8px, bold matn

## API Endpoints

### 1. `/api/save-daily-schedule` (POST)
```json
{
  "phone": "+998901234567",
  "dailySchedule": [
    {
      "id": 1234567890,
      "time": "06:00",
      "task": "Ertalabki mashq",
      "completed": false,
      "date": "2026-02-13"
    }
  ]
}
```

### 2. `/api/save-schedule-history` (POST)
```json
{
  "phone": "+998901234567",
  "scheduleHistory": [
    {
      "date": "2026-02-13",
      "schedule": [...]
    }
  ],
  "dailySchedule": [...]
}
```

## Fayllar

### Yangi fayllar
- `src/components/tabs/DailyScheduleTab.jsx` - Kunlik tartib komponenti

### O'zgartirilgan fayllar
- `src/components/MainScreen.jsx` - DailyScheduleTab import va tabs objectga qo'shildi
- `src/components/Sidebar.jsx` - "Kunlik Tartib" menu item qo'shildi
- `server.js` - 2 ta yangi API endpoint qo'shildi

## MongoDB

User objectga yangi fieldlar:
- `dailySchedule` - Bugungi kunlik tartib (array)
- `scheduleHistory` - Avvalgi kunlar tarixi (array)

## Test qilish

1. `npm run dev` ishga tushiring
2. Akkauntga kiring
3. Burger menyuni oching
4. "Kunlik Tartib" ni bosing
5. Vaqt va vazifa kiriting
6. "VAZIFA QO'SHISH" ni bosing
7. Vazifani bajarish/bajarmaslik tugmasini bosing
8. "JILDGA SAQLASH" ni bosing
9. "JILDNI KO'RISH" ni bosing

## Xususiyatlar

- ✅ Vaqt bo'yicha avtomatik tartiblash
- ✅ MongoDB ga saqlash
- ✅ Vazifa holati o'zgartirish
- ✅ Vazifa o'chirish
- ✅ Jildga saqlash
- ✅ Jild ko'rish
- ✅ Responsive dizayn
- ✅ Uzbek tili
- ✅ Modern UI

## Keyingi qadamlar

Agar kerak bo'lsa:
- Vazifani tahrirlash funksiyasi
- Vaqt oralig'i (boshlanish-tugash)
- Vazifa kategoriyalari
- Eslatmalar (notifications)
- Statistika (nechta vazifa bajarildi)
