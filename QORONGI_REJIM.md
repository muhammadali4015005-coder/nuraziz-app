# QORONG'I REJIM (DARK MODE)

## XUSUSIYATLAR

Qorong'i rejim qo'shildi - header da 🌙 tugmasi orqali yoqish/o'chirish mumkin.

---

## RANG SXEMASI

### Qorong'i Rejim Ranglari:
- **Ko'p joy (Fon):** #1a1a1a (Qora)
- **O'rtancha joy (Kartalar):** #2c2c2c (Kulrang-qora)
- **Ozgina joy (Urg'u):** #dc143c (Qizil - Crimson)
- **Matn:** #ffffff (Oq)

### Rang Taqsimoti:
```
🖤 Qora (70%):
- Body fon
- Input fon
- Menu tugmalar fon

⬛ Kulrang-qora (25%):
- Kartalar
- Sidebar
- Item lar

❤️ Qizil (5%):
- Chegaralar
- Tugmalar
- Urg'u elementlar
```

---

## DARK MODE TUGMASI

### Joylashuvi:
Header da, burger menyu va chiqish tugmasi orasida

### Ikonka:
- 🌙 Och rejimda: Moon (fa-moon)
- ☀️ Qorong'i rejimda: Sun (fa-sun)

### Tugma Dizayni:
```css
/* Och rejimda */
background: #2c2c2c;
color: #f5f1e8;

/* Qorong'i rejimda */
background: #dc143c;
color: #ffffff;
```

---

## CSS DARK MODE KLASSLARI

### Body
```css
body.dark-mode {
    background: #1a1a1a;
    color: #ffffff;
}
```

### Kartalar
```css
body.dark-mode .card {
    background: #2c2c2c;
    border: 2px solid #dc143c;
    color: #ffffff;
}
```

### Inputlar
```css
body.dark-mode .input {
    background: #1a1a1a;
    border: 2px solid #dc143c;
    color: #ffffff;
}
```

### Tugmalar
```css
body.dark-mode .btn {
    background: #dc143c;
    color: #ffffff;
}

body.dark-mode .btn:hover {
    background: #b01030;
}
```

### Sidebar
```css
body.dark-mode .sidebar {
    background: #2c2c2c;
    border-right: 2px solid #dc143c;
    color: #ffffff;
}
```

### Menu Tugmalari
```css
body.dark-mode .menu-btn {
    background: #1a1a1a;
    border: 2px solid #dc143c;
    color: #ffffff;
}

body.dark-mode .menu-btn:hover {
    background: #dc143c;
    color: #ffffff;
}
```

---

## JAVASCRIPT FUNKSIYALAR

### toggleDarkMode()
```javascript
function toggleDarkMode() {
    const body = document.body;
    const isDark = body.classList.toggle('dark-mode');
    
    // Save preference
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    
    // Update icon
    const icon = document.querySelector('#dark-mode-toggle i');
    if (isDark) {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}
```

### loadDarkMode()
```javascript
function loadDarkMode() {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        const icon = document.querySelector('#dark-mode-toggle i');
        if (icon) icon.className = 'fas fa-sun';
    }
}
```

---

## VIZUAL KO'RINISH

### Och Rejim (Light Mode):
```
┌─────────────────────────────────────┐
│  Header (Qora gradient)             │
│  🌙 ☰ [CHIQISH]                    │
├─────────────────────────────────────┤
│  Och jigarrang fon (#f5f1e8)       │
│  ┌───────────────────────────────┐ │
│  │  Oq karta (#ffffff)           │ │
│  │  Jigarrang chegara (#d4c5a9)  │ │
│  │  Qora matn (#2c2c2c)          │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Qorong'i Rejim (Dark Mode):
```
┌─────────────────────────────────────┐
│  Header (Qora gradient)             │
│  ☀️ ☰ [CHIQISH]                    │
├─────────────────────────────────────┤
│  Qora fon (#1a1a1a)                │
│  ┌───────────────────────────────┐ │
│  │  Kulrang-qora karta (#2c2c2c) │ │
│  │  Qizil chegara (#dc143c)      │ │
│  │  Oq matn (#ffffff)            │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## LOCALSTORAGE SAQLASH

### Kalit:
```javascript
localStorage.setItem('darkMode', 'enabled');  // Yoqilgan
localStorage.setItem('darkMode', 'disabled'); // O'chirilgan
```

### O'qish:
```javascript
const darkMode = localStorage.getItem('darkMode');
if (darkMode === 'enabled') {
    // Dark mode ni yoqish
}
```

---

## QORONG'I REJIM ELEMENTLARI

### Qizil Rangda:
- ❤️ Kartalar chegarasi
- ❤️ Input chegarasi
- ❤️ Tugmalar
- ❤️ Sidebar chegarasi
- ❤️ Menu tugmalar chegarasi
- ❤️ Settings section chegarasi
- ❤️ H3 sarlavhalar
- ❤️ Dark mode tugmasi (qorong'i rejimda)

### Qora Rangda:
- 🖤 Body fon
- 🖤 Input fon
- 🖤 Menu tugmalar fon
- 🖤 Header gradient

### Kulrang-qora Rangda:
- ⬛ Kartalar
- ⬛ Sidebar
- ⬛ Item lar
- ⬛ Settings section

### Oq Rangda:
- ⬜ Barcha matnlar
- ⬜ Tugmalar matni
- ⬜ Input matni

---

## O'ZGARTIRILGAN FAYLLAR
- `nuraziz-pro.html` - Dark mode CSS va JavaScript qo'shildi

---

## TEST QILISH

### 1. Brauzer Keshini Tozalash
```
Ctrl + Shift + R
```

### 2. Dark Mode Tugmasini Topish
1. Dasturga kiring
2. Header da 🌙 tugmasini toping
3. Burger menyu va CHIQISH orasida bo'lishi kerak ✅

### 3. Dark Mode Yoqish
1. 🌙 tugmasini bosing
2. Dastur qorong'i rejimga o'tishi kerak ✅
3. Ikonka ☀️ ga o'zgarishi kerak ✅
4. Fon qora bo'lishi kerak ✅
5. Kartalar kulrang-qora bo'lishi kerak ✅
6. Chegaralar qizil bo'lishi kerak ✅

### 4. Dark Mode O'chirish
1. ☀️ tugmasini bosing
2. Dastur och rejimga qaytishi kerak ✅
3. Ikonka 🌙 ga o'zgarishi kerak ✅
4. Fon och jigarrang bo'lishi kerak ✅

### 5. Saqlashni Tekshirish
1. Dark mode ni yoqing
2. Sahifani yangilang (F5)
3. Dark mode saqlanganligini tekshiring ✅

### 6. Barcha Tablarni Tekshirish
1. Sozlamalar - qorong'i rejimda ✅
2. Kunlik Jadval - qorong'i rejimda ✅
3. Ertalab - qorong'i rejimda ✅
4. Kechqurun - qorong'i rejimda ✅
5. Barcha elementlar to'g'ri ko'rinishi kerak ✅

---

## RANG KONTRASTI

### Qorong'i Rejimda:
- Oq matn (#ffffff) + Qora fon (#1a1a1a) = Yuqori kontrast ✅
- Qizil chegara (#dc143c) + Qora fon (#1a1a1a) = Yaxshi ko'rinish ✅
- Oq matn (#ffffff) + Kulrang-qora karta (#2c2c2c) = Yaxshi o'qiladi ✅

---

## HOLAT
✅ Dark mode tugmasi qo'shildi
✅ CSS dark mode klasslari yaratildi
✅ JavaScript funksiyalar qo'shildi
✅ LocalStorage saqlash ishlaydi
✅ Ikonka avtomatik o'zgaradi
✅ Barcha elementlar qorong'i rejimda ishlaydi
✅ Qizil, qora, oq ranglar to'g'ri

---

## KEYINGI QADAMLAR
1. Brauzer keshini tozalang: `Ctrl + Shift + R`
2. Dasturni oching: http://localhost:5002
3. Header da 🌙 tugmasini bosing
4. Qorong'i rejimni ko'ring
5. Barcha tablarni tekshiring

**Qorong'i rejim tayyor! Ko'p joy qora, o'rtancha joy kulrang-qora, ozgina joy qizil!** 🌙❤️
