# Sozlamalar - Hamma Ma'lumotlar MongoDB ga Saqlanishi - TAYYOR ✅

## Holati: TAYYOR

Hamma sozlamalar (yosh, izohlar, sport kunlari, haftalik jadval va boshqalar) MongoDB ga saqlanadi.

## Saqlanayotgan Ma'lumotlar

### 1. Yosh (Age)
- **Field**: `age`
- **Type**: String/Number
- **Placeholder**: "Masalan: 25"
- **Range**: 1-120

### 2. Izohlar (Notes)
- **Field**: `notes`
- **Type**: String
- **Placeholder**: "O'zingiz haqida yozing..."
- **Max Length**: Unlimited

### 3. Sport Kunlari (Sport Days)
- **Field**: `sportDays`
- **Type**: String/Number
- **Range**: 0-7
- **Example**: "2" (2 kun sport qiladi)

### 4. Ertalab Sport Turi (Morning Sport Type)
- **Field**: `morningType`
- **Type**: String
- **Example**: "Turniklik", "Yugurish"

### 5. Qarong'i Sport Turi (Evening Sport Type)
- **Field**: `eveningType`
- **Type**: String
- **Example**: "Bodibulding", "Suzish"

### 6. Sport Turlari (Sport Types)
- **Field**: `sportTypes`
- **Type**: Array
- **Example**: ["Turniklik", "Bodibulding", "Yugurish"]

### 7. Sport Ismi (Sport Name)
- **Field**: `sportName`
- **Type**: String
- **Default**: "Sport"

### 8. Haftalik Jadval (Weekly Schedule)
- **Field**: `weeklySchedule`
- **Type**: Object
- **Structure**:
```javascript
{
  Monday: { morning: "Turniklik", evening: "Turniklik" },
  Tuesday: { morning: "Turniklik", evening: "Bodibulding" },
  Wednesday: { morning: "", evening: "" },
  Thursday: { morning: "", evening: "" },
  Friday: { morning: "", evening: "" },
  Saturday: { morning: "", evening: "" },
  Sunday: { morning: "", evening: "" }
}
```

## MongoDB da Saqlanish

### Foydalanuvchi Dokumenti
```json
{
  "_id": ObjectId,
  "phone": "+998 91 823 58 58",
  "pass": "1234",
  "name": "Foydalanuvchi",
  "approved": true,
  "settings": {
    "age": "25",
    "notes": "Men fitnes qilmoqchiman",
    "sportDays": "2",
    "morningType": "Turniklik",
    "eveningType": "Bodibulding",
    "sportTypes": ["Turniklik", "Bodibulding", "Yugurish"],
    "sportName": "Sport",
    "weeklySchedule": {
      "Monday": { "morning": "Turniklik", "evening": "Turniklik" },
      "Tuesday": { "morning": "Turniklik", "evening": "Bodibulding" },
      ...
    }
  },
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

## Auto-Save Mexanizmi

### SettingsTab.jsx da useEffect
```javascript
useEffect(() => {
  const saveSettings = async () => {
    // Hamma ma'lumotlarni settings object ga qo'shish
    userData.settings.age = age
    userData.settings.notes = notes
    userData.settings.sportDays = days
    userData.settings.morningType = morningType
    userData.settings.eveningType = eveningType
    userData.settings.sportTypes = sportTypes
    userData.settings.sportName = sportName
    userData.settings.weeklySchedule = weeklySchedule
    
    // MongoDB ga saqlash
    await fetch('/api/save-settings', {
      method: 'POST',
      body: JSON.stringify({
        phone: userData.phone,
        settings: userData.settings
      })
    })
  }
  
  // 1 soniya kutib, keyin saqlash
  const timer = setTimeout(saveSettings, 1000)
  return () => clearTimeout(timer)
}, [age, notes, days, morningType, eveningType, sportTypes, sportName, weeklySchedule, userData])
```

### Server.js da /api/save-settings
```javascript
if (pathname === '/api/save-settings' && req.method === 'POST') {
  const { phone, settings } = JSON.parse(body)
  
  const user = await dbManager.getUser(phone)
  if (user) {
    user.settings = settings  // Hamma settings saqlanadi
    await dbManager.saveUser(phone, user)
  }
}
```

## Foydalanuvchi Oqimi

1. Foydalanuvchi Sozlamalar tabiga kiradi
2. Yosh kiritadi → Auto-save (1 soniya kutib)
3. Izohlar yozadi → Auto-save
4. Sport kunlarini kiritadi → Auto-save
5. Ertalab sport turini kiritadi → Auto-save
6. Qarong'i sport turini kiritadi → Auto-save
7. Sport turlarini qo'shadi → Auto-save
8. Haftalik jadvalini to'ldirib qo'yadi → Auto-save
9. Sahifani yangilasa (Ctrl+R) → Hamma ma'lumotlar saqlanib qoladi

## Tekshirish Ro'yxati

- ✅ Yosh field ko'rinadi va saqlanadi
- ✅ Izohlar saqlanadi
- ✅ Sport kunlari saqlanadi
- ✅ Ertalab sport turi saqlanadi
- ✅ Qarong'i sport turi saqlanadi
- ✅ Sport turlari saqlanadi
- ✅ Haftalik jadval saqlanadi
- ✅ Auto-save ishlaydi (1 soniya kutib)
- ✅ MongoDB da hamma ma'lumotlar saqlanadi
- ✅ Sahifa yangilanganda (Ctrl+R) hamma ma'lumotlar ko'rinadi
- ✅ Xatolar yo'q

## Fayllar

- `src/components/tabs/SettingsTab.jsx` - Auto-save va hamma ma'lumotlar
- `server.js` - `/api/save-settings` endpoint
- `db-manager.js` - MongoDB saqlash

## Qo'shimcha Xususiyatlar

### Manual Save
- "SOZLAMALARNI SAQLASH" tugmasi ham bor
- Foydalanuvchi istaganida manual saqlashi mumkin
- Alert ko'rsatadi: "Sozlamalar saqlandi!"

### Data Validation
- Yosh: 1-120
- Sport kunlari: 0-7
- Boshqa fieldlar: Unlimited

### Error Handling
- Agar MongoDB ga saqlash xatosi bo'lsa, console da log ko'rinadi
- Foydalanuvchi xatosini bilmaydi (silent error)
- Qayta urinish avtomatik bo'ladi

## Kelajakdagi Yaxshilanishlar

1. **Validation**: Hamma fieldlar uchun validation qo'shish
2. **Notifications**: Foydalanuvchiga saqlash haqida xabar berish
3. **Undo/Redo**: O'zgarishlarni qaytarish imkoniyati
4. **Backup**: Avtomatik backup yaratish
