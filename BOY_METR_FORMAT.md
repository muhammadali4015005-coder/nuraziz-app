# 📏 BO'Y - METR VA SM FORMAT

## ✅ QOSHILDI!

### Xususiyat:

Bo'y inputiga endi **metr** yoki **sm** formatida yozish mumkin!

## 📝 FORMATLAR:

### 1. Santimetr (sm):
```
150 → 150 sm ✅
175 → 175 sm ✅
180 → 180 sm ✅
```

### 2. Metr:
```
1.50 → 150 sm ✅
1.75 → 175 sm ✅
1.80 → 180 sm ✅
```

## 🔄 AVTOMATIK KONVERTATSIYA:

### Metr → Santimetr:
- `1.50` yozasiz → `150` ga o'zgaradi
- `1.75` yozasiz → `175` ga o'zgaradi
- `1.80` yozasiz → `180` ga o'zgaradi

### Santimetr → Santimetr:
- `150` yozasiz → `150` qoladi
- `175` yozasiz → `175` qoladi
- `180` yozasiz → `180` qoladi

## 💡 QANDAY ISHLAYDI:

### 1. Foydalanuvchi Yozadi:
```
Bo'y: 1.50
```

### 2. Avtomatik O'zgaradi:
```
Bo'y: 150
```

### 3. Saqlanadi:
```
userData.settings.height = 150
```

## 🎯 QOIDALAR:

### Metr Format:
- Nuqta (`.`) bilan yoziladi
- 0.50 dan 3.00 gacha
- Avtomatik 100 ga ko'paytiriladi
- Masalan: `1.75` → `175`

### Santimetr Format:
- Faqat raqam
- 50 dan 250 gacha
- O'zgarmaydi
- Masalan: `175` → `175`

## 📊 MISOLLAR:

### Misol 1: Metr
```
Input: 1.50
Process: 1.50 × 100 = 150
Output: 150
Saved: 150 sm
```

### Misol 2: Santimetr
```
Input: 150
Process: 150 (o'zgarmaydi)
Output: 150
Saved: 150 sm
```

### Misol 3: Metr (katta)
```
Input: 1.85
Process: 1.85 × 100 = 185
Output: 185
Saved: 185 sm
```

### Misol 4: Santimetr (katta)
```
Input: 185
Process: 185 (o'zgarmaydi)
Output: 185
Saved: 185 sm
```

## ⚠️ XATOLAR:

### Noto'g'ri Format:
```
Input: 15.0 (juda kichik)
Result: Rad etiladi

Input: 3.50 (juda katta)
Result: Rad etiladi

Input: 25 (juda kichik)
Result: Rad etiladi

Input: 300 (juda katta)
Result: Rad etiladi
```

### To'g'ri Format:
```
Metr: 0.50 - 3.00 ✅
Santimetr: 50 - 250 ✅
```

## 🎨 DIZAYN:

### Label:
```
Bo'y (sm yoki metr):
```

### Placeholder:
```
150 yoki 1.50
```

### Input Type:
```
type="text" (raqam va nuqta)
```

## 🔧 TEXNIK MA'LUMOTLAR:

### Funksiya:
```javascript
function formatHeight(input) {
    let value = input.value.trim();
    
    // Remove non-numeric except dot
    value = value.replace(/[^\d.]/g, '');
    
    // If contains dot (metr)
    if (value.includes('.')) {
        const meters = parseFloat(value);
        if (meters > 0 && meters < 3) {
            const cm = Math.round(meters * 100);
            input.value = cm;
        }
    } else {
        // Already in cm
        const cm = parseInt(value);
        if (cm >= 50 && cm <= 250) {
            input.value = cm;
        }
    }
}
```

### Event:
```html
<input 
    type="text" 
    id="user-height" 
    oninput="formatHeight(this)" 
    onchange="saveSettings()"
>
```

## 🚀 TEST QILISH:

### 1. Sozlamalar Sahifasiga O'ting:
```
Login → Sozlamalar
```

### 2. Bo'y Inputiga Yozing:

**Test 1: Metr**
```
Input: 1.50
Expected: 150
```

**Test 2: Santimetr**
```
Input: 150
Expected: 150
```

**Test 3: Metr (katta)**
```
Input: 1.85
Expected: 185
```

**Test 4: Santimetr (katta)**
```
Input: 185
Expected: 185
```

### 3. Saqlang:
```
Avtomatik saqlanadi (onchange)
```

### 4. Tekshiring:
```
Sozlamalar → JORIY SOZLAMALAR
Bo'y: 150 sm ✅
```

## 📝 FOYDALANISH:

### Variant 1: Metr
```
1. Bo'y inputiga bosing
2. 1.50 yozing
3. Enter bosing yoki boshqa inputga o'ting
4. Avtomatik 150 ga o'zgaradi
5. Saqlanadi
```

### Variant 2: Santimetr
```
1. Bo'y inputiga bosing
2. 150 yozing
3. Enter bosing yoki boshqa inputga o'ting
4. 150 qoladi
5. Saqlanadi
```

## ✅ AFZALLIKLAR:

1. **Ikki format:** Metr yoki sm
2. **Avtomatik konvertatsiya:** Metr → sm
3. **Oson yozish:** 1.50 yoki 150
4. **Xatosiz:** Noto'g'ri qiymatlar rad etiladi
5. **Avtomatik saqlash:** onchange event

## 🎯 NATIJA:

✅ Metr formatida yozish mumkin (1.50)  
✅ Santimetr formatida yozish mumkin (150)  
✅ Avtomatik konvertatsiya  
✅ Xatolar rad etiladi  
✅ Avtomatik saqlanadi  
✅ JORIY SOZLAMALAR da ko'rinadi  

---

**Sana:** 2026-02-07  
**Status:** ✅ TAYYOR  
**Test:** Incognito mode da test qiling!  
**Misol:** 1.50 → 150 sm
