# 🔔 Notifikatsiya Qo'llanmasi

## O'rnatish

Faylning boshiga qo'shing:

```javascript
import { notify, notifyShort } from '../utils/notify'
```

## Oddiy Foydalanish

### ✅ Muvaffaqiyat
```javascript
notify.success('Muvaffaq!', 'Ish tayyor')
notifyShort.success('Saqlandi!')
```

### ❌ Xato
```javascript
notify.error('Xato!', 'Noto\'g\'ri telefon raqami')
notifyShort.error('Notogri parol')
```

### ⚠️ Ogohlantirish
```javascript
notify.warning('Diqqat!', 'Bu harakat bekor qilinmaydi')
notifyShort.warning('Ma\'lumot')
```

### ℹ️ Ma'lumot
```javascript
notify.info('Bilgu', 'Ish boshlandi...')
notifyShort.info('Yuklanimoqda')
```

## Custom Vaqti

```javascript
// 1 soniya
notify.success('Tez', 'Xabar', 1000)

// 5 soniya
notify.error('Sekin', 'Xabar', 5000)

// Abadiy (o'zi yopilmaydi)
notify.info('Doimiy', 'Xabar', 0)
```

## Tugmalar Bilan

```javascript
NotificationManager.show({
  type: 'success',
  title: 'Tasdiqlash',
  message: 'Rostanham o\'chirmoqchisiz?',
  duration: 0,
  buttons: [
    { 
      text: 'Ha', 
      color: '#00ff88',
      onClick: () => handleDelete() 
    },
    { 
      text: 'Yo\'q', 
      color: '#ff0055',
      onClick: () => {} 
    }
  ]
})
```

## Turlar

- `success` - Yashil, Check icon
- `error` - Qizil, AlertCircle icon  
- `warning` - To\'q sariq, AlertTriangle icon
- `info` - Ko\'k, Info icon
- `blocked` - Qora/Qizil, Markazda (to\'liq ekran)

## Real Misollar

```javascript
// Login xatosi
if (!phone) {
  notifyShort.error('Telefon majburiy')
}

// Saqlash
try {
  await saveData()
  notify.success('Saqlandi', 'Barcha o\'zgarishlar saqlandi')
} catch (err) {
  notify.error('Xato', err.message)
}

// Yuklanish
notify.info('Yuklanimoqda...', '', 0)
// ... keyin
NotificationManager.close(id)
```

---

Sana: 2026-02-16
