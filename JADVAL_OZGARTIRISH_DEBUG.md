# Jadval O'zgartirish Debug

## 📅 Sana: 2026-02-16
## ⏰ Vaqt: Hozir

---

## 🔍 MUAMMO

Haftalik jadvalni o'zgartirish tugmasini bosganda input maydonlari paydo bo'ladi, lekin foydalanuvchi matn kirita olmaydi.

---

## 🛠️ QILINGAN TUZATISH

### Console.log qo'shildi

`handleScheduleChange` funksiyasiga debug uchun console.log qo'shildi:

```javascript
const handleScheduleChange = (day, period, value) => {
  console.log('Schedule change:', day, period, value)
  setWeeklySchedule(prevSchedule => {
    const updated = {
      ...prevSchedule,
      [day]: {
        ...(prevSchedule[day] || { morning: '', evening: '' }),
        [period]: value
      }
    }
    console.log('Updated schedule:', updated)
    return updated
  })
}
```

---

## 🧪 TEST QILISH

### 1. Brauzerda Test
```
1. Sport Mashqlari tabiga kiring
2. Haftalik Jadval bo'limiga boring
3. "O'ZGARTIRISH" tugmasini bosing
4. Browser Console ni oching (F12)
5. Dushanba - Ertalab input ga "Turnik" yozing
6. Console da quyidagilarni tekshiring:
   - "Schedule change: Monday morning T" (har bir harf uchun)
   - "Updated schedule: {Monday: {morning: 'T', evening: ''}}"
```

### 2. Kutilgan Natija
- Har bir harf kiritilganda console da log paydo bo'lishi kerak
- Input maydonida matn ko'rinishi kerak
- Agar console da log ko'rinmasa - onChange ishlamayapti
- Agar console da log bor lekin input bo'sh - value binding muammosi

---

## 🔧 MUMKIN BO'LGAN MUAMMOLAR

### 1. Input disabled yoki readOnly
**Tekshirish**: Input elementida `disabled` yoki `readOnly` atributi bormi?

**Yechim**: Agar bor bo'lsa, olib tashlash kerak.

### 2. CSS pointer-events: none
**Tekshirish**: Input yoki parent elementda `pointer-events: none` bormi?

**Yechim**: CSS ni tekshirish va olib tashlash.

### 3. Z-index muammosi
**Tekshirish**: Input ustida boshqa element bormi?

**Yechim**: Z-index ni oshirish yoki parent elementni tekshirish.

### 4. Event handler bog'lanmagan
**Tekshirish**: Console da "Schedule change" log paydo bo'ladimi?

**Yechim**: Agar yo'q bo'lsa, onChange to'g'ri bog'lanmagan.

---

## 📊 KOD TAHLILI

### Input elementi
```javascript
<input
  type="text"
  value={schedule.morning}
  onChange={(e) => handleScheduleChange(day, 'morning', e.target.value)}
  placeholder="Dam olish yoki mashq nomi"
  className="input"
  style={{ fontSize: '12px' }}
/>
```

**To'g'ri jihatlari**:
- ✅ `value` prop bor
- ✅ `onChange` handler bor
- ✅ `e.target.value` to'g'ri uzatilgan
- ✅ `type="text"` to'g'ri

**Tekshirish kerak**:
- ❓ `className="input"` CSS da nima qiladi?
- ❓ Parent elementda event blocking bormi?

---

## 🎯 KEYINGI QADAMLAR

### Agar console da log ko'rinmasa:
1. `editingSchedule` state to'g'ri o'zgarayotganini tekshiring
2. Input elementi render bo'layotganini tekshiring (React DevTools)
3. onClick event parent elementda to'xtatilayotganini tekshiring

### Agar console da log bor lekin input bo'sh:
1. `weeklySchedule` state to'g'ri yangilanayotganini tekshiring
2. `schedule` o'zgaruvchisi to'g'ri olinayotganini tekshiring
3. React re-render bo'layotganini tekshiring

### Agar hamma narsa ishlayotgan ko'rinsa:
1. Browser cache ni tozalang (Ctrl+Shift+R)
2. React DevTools da state ni tekshiring
3. Network tab da API so'rovlarni tekshiring

---

## 💡 QISQA YECHIM

Agar muammo davom etsa, quyidagi yechimni sinab ko'ring:

### Variant 1: Controlled input o'rniga uncontrolled
```javascript
<input
  type="text"
  defaultValue={schedule.morning}
  onBlur={(e) => handleScheduleChange(day, 'morning', e.target.value)}
  placeholder="Dam olish yoki mashq nomi"
  className="input"
  style={{ fontSize: '12px' }}
/>
```

### Variant 2: Local state ishlatish
```javascript
const [localSchedule, setLocalSchedule] = useState(weeklySchedule)

// editingSchedule true bo'lganda
useEffect(() => {
  if (editingSchedule) {
    setLocalSchedule(weeklySchedule)
  }
}, [editingSchedule])

// Input
<input
  value={localSchedule[day]?.morning || ''}
  onChange={(e) => {
    setLocalSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], morning: e.target.value }
    }))
  }}
/>

// Saqlashda
const handleSaveSchedule = async () => {
  setWeeklySchedule(localSchedule)
  // ... API call
}
```

---

## ✅ TEKSHIRILGAN

- ✅ Sintaksis xatolari yo'q
- ✅ handleScheduleChange to'g'ri yozilgan
- ✅ Console.log qo'shildi
- ⏳ Browser testdan o'tishi kerak

---

**Status**: 🔍 DEBUG REJIMIDA  
**Keyingi qadam**: Browser console da test qilish
