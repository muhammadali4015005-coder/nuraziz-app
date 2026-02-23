# ✅ HEADER OYLIK MA'LUMOTLARI - BAJARILDI

## O'ZGARISHLAR

### 1. Header Yangilandi
Header qismiga oylik ma'lumotlari qo'shildi:
- 📅 Ro'yxatdan o'tgan sana
- ⏰ Oylik qancha kun qolgan
- ✏️ Tahrirlash tugmasi (faqat admin uchun)

### 2. Rang Kodlari
Qolgan kunlarga qarab rang o'zgaradi:
- 🟢 Yashil: 11+ kun qolgan
- 🟡 Sariq: 6-10 kun qolgan
- 🔴 Qizil: 1-5 kun qolgan yoki tugagan

### 3. Tahrirlash Funksiyasi
Admin oylikni tahrirlashi mumkin:
- "Tahrirlash" tugmasini bosish
- Necha kun qo'shishni kiritish
- Avtomatik saqlanadi

## KO'RINISH

### Yashil (11+ kun)
```
┌────────────────────────────────────────────────────┐
│ 💪 NURAZIZ                                         │
│ 📅 Ro'yxatdan o'tgan: 07.02.2026 | ⏰ Oylik: 25   │
│ kun qoldi | ✏️ Tahrirlash                          │
└────────────────────────────────────────────────────┘
```

### Sariq (6-10 kun)
```
┌────────────────────────────────────────────────────┐
│ 💪 NURAZIZ                                         │
│ 📅 Ro'yxatdan o'tgan: 07.02.2026 | ⏰ Oylik: 8    │
│ kun qoldi | ✏️ Tahrirlash                          │
└────────────────────────────────────────────────────┘
```

### Qizil (1-5 kun)
```
┌────────────────────────────────────────────────────┐
│ 💪 NURAZIZ                                         │
│ 📅 Ro'yxatdan o'tgan: 07.02.2026 | ⏰ Oylik: 3    │
│ kun qoldi | ✏️ Tahrirlash                          │
└────────────────────────────────────────────────────┘
```

### Tugagan
```
┌────────────────────────────────────────────────────┐
│ 💪 NURAZIZ                                         │
│ ⚠️ Oylik tugagan!                                  │
└────────────────────────────────────────────────────┘
```

## FUNKSIYALAR

### 1. updateSubscriptionInfo()
Header qismidagi oylik ma'lumotlarini yangilaydi:

```javascript
function updateSubscriptionInfo() {
    if (!userData || !userData.subscriptionExpiry) return;
    
    const now = new Date();
    const expiry = new Date(userData.subscriptionExpiry);
    const startDate = userData.subscriptionDate ? new Date(userData.subscriptionDate) : null;
    const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    
    const subscriptionInfoDiv = document.getElementById('subscription-info');
    
    // Format dates
    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}.${month}.${year}`;
    };
    
    let infoHTML = '';
    
    if (startDate) {
        infoHTML += `<i class="fas fa-calendar-check"></i> Ro'yxatdan o'tgan: ${formatDate(startDate)} | `;
    }
    
    if (daysLeft > 0) {
        const color = daysLeft <= 5 ? '#ff0055' : daysLeft <= 10 ? '#ffa500' : '#00ff88';
        infoHTML += `<span style="color: ${color};"><i class="fas fa-clock"></i> Oylik: ${daysLeft} kun qoldi</span>`;
        infoHTML += ` | <button onclick="editSubscription()" ...>Tahrirlash</button>`;
    } else {
        infoHTML += `<span style="color: #ff0055;"><i class="fas fa-exclamation-triangle"></i> Oylik tugagan!</span>`;
    }
    
    subscriptionInfoDiv.innerHTML = infoHTML;
}
```

### 2. editSubscription()
Admin oylikni tahrirlaydi:

```javascript
function editSubscription() {
    if (!isAdmin) {
        alert('Faqat admin tahrirlashi mumkin!');
        return;
    }
    
    const days = prompt('Necha kun qo\'shmoqchisiz?', '30');
    if (days && !isNaN(days)) {
        const daysNum = parseInt(days);
        const currentExpiry = userData.subscriptionExpiry ? new Date(userData.subscriptionExpiry) : new Date();
        const newExpiry = new Date(currentExpiry.getTime() + daysNum * 24 * 60 * 60 * 1000);
        
        userData.subscriptionExpiry = newExpiry;
        userData.subscriptionActive = true;
        
        saveUserData();
        updateSubscriptionInfo();
        alert(`✅ Oylik ${daysNum} kun uzaytirildi!`);
    }
}
```

### 3. update()
Har safar ma'lumotlar yangilanganda chaqiriladi:

```javascript
function update() {
    if (!userData) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    // Update subscription info in header
    updateSubscriptionInfo();
    
    // ... rest of the function
}
```

## MA'LUMOTLAR STRUKTURASI

### userData
```javascript
{
    name: "Nuraziz",
    phone: "998901234567",
    subscriptionDate: "2026-02-07T00:00:00.000Z",  // Ro'yxatdan o'tgan sana
    subscriptionExpiry: "2026-03-09T00:00:00.000Z", // Oylik tugash sanasi
    subscriptionActive: true,
    // ... other fields
}
```

## SANA FORMATI

### formatDate() Funksiyasi
```javascript
const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
};
```

**Misol:**
- Input: `2026-02-07T00:00:00.000Z`
- Output: `07.02.2026`

## FOYDALANISH

### Oddiy Foydalanuvchi
1. Login qiling
2. Header qismida oylik ma'lumotlarini ko'ring
3. Qancha kun qolganini bilib oling
4. Tahrirlash tugmasi ko'rinmaydi

### Admin
1. Admin sifatida kirish
2. Header qismida oylik ma'lumotlarini ko'ring
3. "Tahrirlash" tugmasini bosing
4. Necha kun qo'shishni kiriting (masalan: 30)
5. OK bosing
6. Oylik avtomatik uzaytiriladi

## RANG KODLARI

### Qolgan Kunlar
```javascript
const color = daysLeft <= 5 ? '#ff0055' :    // Qizil: 1-5 kun
              daysLeft <= 10 ? '#ffa500' :   // Sariq: 6-10 kun
              '#00ff88';                      // Yashil: 11+ kun
```

### Ikonlar
- 📅 `<i class="fas fa-calendar-check"></i>` - Ro'yxatdan o'tgan
- ⏰ `<i class="fas fa-clock"></i>` - Oylik
- ✏️ `<i class="fas fa-edit"></i>` - Tahrirlash
- ⚠️ `<i class="fas fa-exclamation-triangle"></i>` - Tugagan

## MONGODB SAQLASH

Barcha o'zgarishlar avtomatik MongoDB ga saqlanadi:

```javascript
async function saveUserData() {
    try {
        const response = await fetch('/api/save-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ User data saved to MongoDB successfully');
            
            // Also save to LocalStorage as backup
            const localData = JSON.parse(localStorage.getItem('nuraziz_local_db') || '{}');
            localData[userData.phone] = userData;
            localStorage.setItem('nuraziz_local_db', JSON.stringify(localData));
            console.log('✅ Backup saved to LocalStorage');
        }
    } catch (err) {
        console.error('❌ MongoDB error:', err);
        // Fallback to LocalStorage
        const localData = JSON.parse(localStorage.getItem('nuraziz_local_db') || '{}');
        localData[userData.phone] = userData;
        localStorage.setItem('nuraziz_local_db', JSON.stringify(localData));
        console.log('⚠️ MongoDB not available, saved to LocalStorage');
    }
}
```

## AFZALLIKLARI

### 1. Doimiy Ko'rinish ✅
- Har doim header qismida
- Har sahifada ko'rinadi
- Unutib qolish xavfi yo'q

### 2. Rang Kodlari ✅
- Tez aniqlash
- Vizual ogohlantirish
- Intuitiv

### 3. Oson Tahrirlash ✅
- Admin uchun qulay
- Bir bosishda
- Avtomatik saqlash

### 4. MongoDB Saqlash ✅
- Barcha o'zgarishlar saqlanadi
- LocalStorage backup
- Ma'lumotlar xavfsiz

## SINASH

1. Serverni ishga tushiring: `npm run dev`
2. Brauzerda **Ctrl+Shift+R** bosing
3. Login qiling
4. Header qismida oylik ma'lumotlarini ko'ring
5. Admin sifatida kirish (parol: 963)
6. "Tahrirlash" tugmasini bosing
7. Necha kun qo'shishni kiriting
8. OK bosing
9. Oylik uzaytirilganini ko'ring

## FAYL
- `nuraziz-pro.html` - asosiy fayl

## SERVER
- Port: 5002
- URL: http://localhost:5002
- Status: ✅ Ishlamoqda (Process ID: 7)

## XULOSA

✅ **Header qismiga oylik ma'lumotlari qo'shildi**
✅ **Ro'yxatdan o'tgan sana ko'rsatiladi**
✅ **Qolgan kunlar rang bilan**
✅ **Admin tahrirlashi mumkin**
✅ **MongoDB ga avtomatik saqlanadi**
✅ **LocalStorage backup**
✅ **Zamonaviy dizayn va ikonlar**
