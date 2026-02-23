# ✅ O'ZIM YOZAMAN - CUSTOM SPORT INPUT

## O'ZGARISHLAR

### 1. Custom Input Maydonlari Qo'shildi
"O'zim yozaman" tanlanganda maxsus input maydoni ko'rsatiladi:

**Ertalab:**
```
┌─────────────────────────────────────────────┐
│ ✏️ Sport turini yozing:                     │
│ [Masalan: Suzish, Velosiped, Tennis...]    │
│ Bu nom "Mashq nomi" maydoniga avtomatik    │
│ qo'yiladi                                   │
└─────────────────────────────────────────────┘
```

**Kechqurun:**
```
┌─────────────────────────────────────────────┐
│ ✏️ Sport turini yozing:                     │
│ [Masalan: Bench Press, Squat, Deadlift...] │
│ Bu nom "Mashq nomi" maydoniga avtomatik    │
│ qo'yiladi                                   │
└─────────────────────────────────────────────┘
```

### 2. Avtomatik Ko'chirish
Custom inputga yozilgan matn avtomatik ravishda "Mashq nomi" maydoniga ko'chiriladi:
- Real-time yangilanish
- Har bir belgi kiritilganda
- JavaScript event listener orqali

### 3. Show/Hide Logic
Sport turi o'zgarganda:
- "O'zim yozaman" → Custom input ko'rsatiladi
- Boshqa variant → Custom input yashiriladi

## TEXNIK DETALLARI

### HTML Struktura

#### Ertalab Custom Input
```html
<div id="morning-custom-input" class="hidden" style="...">
    <label>
        <i class="fas fa-edit"></i> Sport turini yozing:
    </label>
    <input type="text" id="morning-custom-sport" 
           placeholder="Masalan: Suzish, Velosiped, Tennis...">
    <p>Bu nom "Mashq nomi" maydoniga avtomatik qo'yiladi</p>
</div>
```

#### Kechqurun Custom Input
```html
<div id="evening-custom-input" class="hidden" style="...">
    <label>
        <i class="fas fa-edit"></i> Sport turini yozing:
    </label>
    <input type="text" id="evening-custom-sport" 
           placeholder="Masalan: Bench Press, Squat, Deadlift...">
    <p>Bu nom "Mashq nomi" maydoniga avtomatik qo'yiladi</p>
</div>
```

### JavaScript Funksiyalar

#### 1. updateSportLabels() - Yangilandi
```javascript
function updateSportLabels() {
    const morningSport = document.getElementById('morning-sport-select').value;
    const eveningSport = document.getElementById('evening-sport-select').value;
    
    // Show/hide custom input fields
    const morningCustomInput = document.getElementById('morning-custom-input');
    const eveningCustomInput = document.getElementById('evening-custom-input');
    
    if (morningSport === 'custom') {
        morningCustomInput.classList.remove('hidden');
    } else {
        morningCustomInput.classList.add('hidden');
    }
    
    if (eveningSport === 'custom') {
        eveningCustomInput.classList.remove('hidden');
    } else {
        eveningCustomInput.classList.add('hidden');
    }
    
    // ... rest of the function
}
```

#### 2. Event Listeners - DOMContentLoaded
```javascript
document.addEventListener('DOMContentLoaded', function() {
    // Custom sport input listeners
    const morningCustomSport = document.getElementById('morning-custom-sport');
    const eveningCustomSport = document.getElementById('evening-custom-sport');
    
    if (morningCustomSport) {
        morningCustomSport.addEventListener('input', function() {
            document.getElementById('morning-name').value = this.value;
        });
    }
    
    if (eveningCustomSport) {
        eveningCustomSport.addEventListener('input', function() {
            document.getElementById('evening-name').value = this.value;
        });
    }
});
```

## FOYDALANISH

### Ertalab Mashq Qo'shish

1. **Sozlamalar** tabiga o'ting
2. **Ertalab Sport Turi** dropdown dan "✏️ O'zim yozaman" ni tanlang
3. Yangi input maydoni paydo bo'ladi
4. Sport turini yozing (masalan: "Suzish")
5. **ERTALAB** tabiga o'ting
6. "Mashq nomi" maydonida avtomatik "Suzish" yozilgan
7. Sanani va maqsadni kiriting
8. "QO'SHISH" tugmasini bosing

### Kechqurun Mashq Qo'shish

1. **Sozlamalar** tabiga o'ting
2. **Kechqurun Sport Turi** dropdown dan "✏️ O'zim yozaman" ni tanlang
3. Yangi input maydoni paydo bo'ladi
4. Sport turini yozing (masalan: "Bench Press")
5. **KECHQURUN** tabiga o'ting
6. "Mashq nomi" maydonida avtomatik "Bench Press" yozilgan
7. Sanani va og'irlikni kiriting
8. "QO'SHISH" tugmasini bosing

## MISOLLAR

### Ertalab Sport Turlari
- Suzish
- Velosiped
- Tennis
- Badminton
- Futbol
- Basketbol
- Voleybol
- Ping-pong
- Shaxmat (harakatli)
- Raqsga tushish

### Kechqurun Sport Turlari
- Bench Press
- Squat
- Deadlift
- Shoulder Press
- Biceps Curl
- Triceps Extension
- Leg Press
- Lat Pulldown
- Cable Fly
- Dumbbell Row

## DIZAYN

### Custom Input Box
```css
background: #1a2332;
border: 2px solid #00d4ff;
border-radius: 8px;
padding: 15px;
margin-bottom: 15px;
```

### Label
```css
color: #00d4ff;
font-weight: bold;
```

### Input
```css
width: 100%;
padding: 10px;
background: #0a0e27;
border: 2px solid #0f3460;
color: #00d4ff;
border-radius: 6px;
```

### Hint Text
```css
color: #aaa;
font-size: 12px;
```

## AFZALLIKLARI

### 1. Moslashuvchanlik ✅
- Har qanday sport turini yozish mumkin
- Cheklovlar yo'q
- O'zingizning mashqlaringiz

### 2. Oson Foydalanish ✅
- Avtomatik ko'chirish
- Real-time yangilanish
- Qo'shimcha bosish kerak emas

### 3. Zamonaviy Dizayn ✅
- Font Awesome ikonlar
- Chiroyli ranglar
- Responsive

### 4. Aniq Ko'rsatmalar ✅
- Placeholder misollar
- Hint text
- Tushunarli label

## SINASH

1. Serverni ishga tushiring: `npm run dev`
2. Brauzerda **Ctrl+Shift+R** bosing
3. Login qiling
4. **Sozlamalar** tabiga o'ting
5. "Ertalab Sport Turi" dan "O'zim yozaman" ni tanlang
6. Custom input paydo bo'lishini ko'ring
7. Biror narsa yozing (masalan: "Suzish")
8. **ERTALAB** tabiga o'ting
9. "Mashq nomi" maydonida "Suzish" yozilganini ko'ring
10. Mashq qo'shing va saqlang

## FAYL
- `nuraziz-pro.html` - asosiy fayl

## SERVER
- Port: 5002
- URL: http://localhost:5002
- Status: ✅ Ishlamoqda (Process ID: 5)

## XULOSA

✅ **Custom input maydonlari qo'shildi**
✅ **Avtomatik ko'chirish ishlaydi**
✅ **Show/hide logic to'g'ri**
✅ **Zamonaviy dizayn**
✅ **Oson foydalanish**
✅ **Real-time yangilanish**
