# KELAJAK TAB - MAQSADLAR VA PROGNOZ

## ✅ BAJARILDI

Yangi "KELAJAK" bo'limi qo'shildi - maqsadlar va ularga erishish prognozi.

### FUNKSIYALAR

#### 1. Maqsad Qo'shish
- Maqsad nomi (masalan: "100 ta turnik tortish")
- Hozirgi holat (masalan: 20)
- Maqsad (masalan: 100)
- Birlik (marta, kg, daqiqa, km)

#### 2. Progress Tracking
- Hozirgi holatni yangilash
- Progress bar (0-100%)
- Foiz ko'rsatkichi

#### 3. Prognoz Hisoblash
- Kunlik jadvaldan sport kunlarini hisoblash
- O'rtacha kunlik progressni aniqlash
- Qachon erishishni taxmin qilish
- Aniq sanani ko'rsatish

#### 4. Maqsadga Erishish
- Maqsad bajarilganda yashil rang
- "Maqsadga erishildi!" xabari
- ✅ belgisi

### PROGNOZ ALGORITMI

```javascript
1. Sport kunlarini sanash (dailySchedule dan)
2. O'rtacha kunlik progress = current / sportDays
3. Qolgan = target - current
4. Kerakli kunlar = qolgan / o'rtacha progress
5. Sana = bugun + kerakli kunlar
```

### MISOL

Maqsad: 100 ta turnik tortish
- Hozir: 20 ta
- Qolgan: 80 ta
- Sport kunlari: 10 kun
- O'rtacha: 20 / 10 = 2 ta/kun
- Kerakli: 80 / 2 = 40 kun
- Sana: 40 kun ichida

### YANGI FAYLLAR

1. src/components/tabs/FutureTab.jsx
   - Maqsadlar ro'yxati
   - Yangi maqsad qo'shish
   - Progress yangilash
   - Prognoz hisoblash
   - Maqsad o'chirish

2. src/components/MainScreen.jsx
   - FutureTab import
   - future tab render

3. src/components/Sidebar.jsx
   - "Kelajak" menyu qo'shildi

### MA'LUMOTLAR STRUKTURASI

```javascript
user.futureGoals = [
  {
    id: 1234567890,
    title: "100 ta turnik tortish",
    current: 20,
    target: 100,
    unit: "marta",
    createdAt: "2026-02-14T..."
  }
]
```

### DIZAYN

- Faol maqsad: ko'k border (#00d4ff)
- Bajarilgan: yashil border (#00ff88)
- Progress bar: ko'k/yashil
- Prognoz: sariq (#ffaa00)
- Input: qora background, ko'k border

### QANDAY ISHLAYDI

1. "KELAJAK" bo'limiga kiring
2. "+ YANGI MAQSAD QO'SHISH" tugmasini bosing
3. Maqsad ma'lumotlarini kiriting
4. "QO'SHISH" tugmasini bosing
5. Hozirgi holatni yangilang
6. Prognozni ko'ring

### YAKUNIY HOLAT

✅ KELAJAK tab qo'shildi
✅ Maqsadlar qo'shish
✅ Progress tracking
✅ Prognoz hisoblash
✅ Maqsadga erishish
✅ MongoDB da saqlanadi

---

Sana: 2026-02-14
Status: TAYYOR ✅
