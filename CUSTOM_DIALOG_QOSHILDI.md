# CUSTOM DIALOG QOSHILDI ✅

## Nima qilindi:

### 1. ConfirmDialog komponenti yaratildi 🎨
- ✅ Markazda, katta, chiroyli dialog oynasi
- ✅ 3 xil rang rejimi: `warning`, `danger`, `info`
- ✅ Kod kiritish imkoniyati (masalan: "DELETE")
- ✅ Animatsiya bilan ochiladi va yopiladi
- ✅ Overlay (qora fon) bilan
- ✅ Ikki tugma: Tasdiqlash va Bekor qilish

### 2. AdminDeleted.jsx da ishlatildi
- ✅ Brauzerning `confirm()` va `prompt()` o'chirildi
- ✅ Qayta tiklash uchun `info` dialog
- ✅ Butunlay o'chirish uchun `danger` dialog + kod kiritish

## Dialog turlari:

### Warning (Ogohlantirish) 🟡
```javascript
type: 'warning'
// Sariq rang, ogohlantirish belgisi
```

### Danger (Xavfli) 🔴
```javascript
type: 'danger'
// Qizil rang, o'chirish belgisi
// Kod kiritish talab qilinadi
```

### Info (Ma'lumot) 🔵
```javascript
type: 'info'
// Ko'k rang, ma'lumot belgisi
```

## Qanday ishlatish:

### 1. State yaratish:
```javascript
const [confirmDialog, setConfirmDialog] = useState({
  isOpen: false,
  type: 'warning',
  title: '',
  message: '',
  onConfirm: null
})
```

### 2. Dialog ochish:
```javascript
setConfirmDialog({
  isOpen: true,
  type: 'danger',
  title: 'O\'CHIRISH TASDIQLASH',
  message: 'Bu foydalanuvchi o\'chiriladi!',
  confirmText: 'HA, O\'CHIRISH',
  cancelText: 'BEKOR QILISH',
  requireCode: true,
  requiredCode: 'DELETE',
  codePlaceholder: 'DELETE',
  onConfirm: async () => {
    // O'chirish logikasi
    setConfirmDialog({ ...confirmDialog, isOpen: false })
  }
})
```

### 3. Komponentda ko'rsatish:
```javascript
<ConfirmDialog
  isOpen={confirmDialog.isOpen}
  onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
  onConfirm={confirmDialog.onConfirm}
  title={confirmDialog.title}
  message={confirmDialog.message}
  confirmText={confirmDialog.confirmText}
  cancelText={confirmDialog.cancelText}
  type={confirmDialog.type}
  requireCode={confirmDialog.requireCode}
  requiredCode={confirmDialog.requiredCode}
  codePlaceholder={confirmDialog.codePlaceholder}
/>
```

## Props:

| Prop | Turi | Default | Tavsif |
|------|------|---------|--------|
| `isOpen` | boolean | false | Dialog ochiq/yopiq |
| `onClose` | function | - | Yopish funksiyasi |
| `onConfirm` | function | - | Tasdiqlash funksiyasi |
| `title` | string | "TASDIQLASH" | Sarlavha |
| `message` | string | "Davom etmoqchimisiz?" | Xabar |
| `confirmText` | string | "HA" | Tasdiqlash tugmasi matni |
| `cancelText` | string | "YO'Q" | Bekor qilish tugmasi matni |
| `type` | string | "warning" | Rang rejimi (warning/danger/info) |
| `requireCode` | boolean | false | Kod kiritish kerakmi? |
| `requiredCode` | string | "DELETE" | Talab qilinadigan kod |
| `codePlaceholder` | string | "Kodni kiriting" | Input placeholder |

## Fayllar:
- ✅ `src/components/ConfirmDialog.jsx` - Yangi komponent
- ✅ `src/components/tabs/AdminDeleted.jsx` - Dialog ishlatildi

## Dizayn xususiyatlari:
- 🎨 Gradient fon
- 🌟 Neon border effekti
- ✨ Hover animatsiyalari
- 🎭 Slide-in animatsiya
- 🔒 Kod kiritish input
- ❌ Xato xabarlari
- 📱 Responsive dizayn

## Test qilish:
1. Admin panelga kiring
2. "OCHIRILGAN AZOLAR" tabiga o'ting
3. "QAYTA TIKLASH" tugmasini bosing → Ko'k dialog
4. "BUTUNLAY O'CHIRISH" tugmasini bosing → Qizil dialog + kod kiritish
5. "DELETE" yozing va tasdiqlang

## Keyingi qadamlar:
Bu dialogni boshqa joylarda ham ishlatish mumkin:
- AdminUsers.jsx - Foydalanuvchini o'chirish
- AdminPending.jsx - Rad etish tasdiqlash
- Boshqa admin amallarida
