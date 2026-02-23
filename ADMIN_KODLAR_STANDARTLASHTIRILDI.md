# Admin Kodlari Standartlashtirildi

## O'zgarishlar

### Kod Konstantalari
Barcha admin kodlari endi konstantalar orqali boshqariladi:

```javascript
const DELETE_CONFIRMATION_CODE = '2.3.N.A'    // O'chirish
const EDIT_CONFIRMATION_CODE = '2.3.N.A'      // Tahrirlash
const PAYMENT_CODE = '2.3.N.A'                // To'lov
const BLOCK_CODE = '2.3.N.A'                  // Toxtatish/Faollashtirish
const WORK_SCHOOL_CODE = '2.3.n.a'            // Ish va Maktab kodlari (kichik harf)
```

### Yangi Xavfsizlik Tekshiruvlari

#### 1. TO'LOV (PAYMENT) - Kod talab qilinadi
- To'lov ma'lumotlarini saqlashdan oldin `2.3.N.A` kodi talab qilinadi
- To'lov modalida kod kiritish maydoni qo'shildi
- Noto'g'ri kod kiritilsa xato xabari ko'rsatiladi

#### 2. TOXTATISH/FAOLLASHTIRISH (BLOCK/UNBLOCK) - Kod talab qilinadi
- Obunani toxtatish yoki faollashtirishdan oldin `2.3.N.A` kodi talab qilinadi
- Yangi tasdiqlash modali qo'shildi
- Noto'g'ri kod kiritilsa xato xabari ko'rsatiladi

#### 3. ISH VA MAKTAB KODLARI - Kichik harf
- Ish va maktab kodlarini o'zgartirish uchun `2.3.n.a` (kichik harf) master kod ishlatiladi
- `WORK_SCHOOL_CODE` konstantasi qo'shildi

### Yangi Modallar

#### Block/Unblock Confirmation Modal
```
⏸️ OBUNANI TOXTATISH / ✅ OBUNANI FAOLLASHTIRISH
- Foydalanuvchi ma'lumotlari
- Kod kiritish maydoni (2.3.N.A)
- TASDIQLASH va BEKOR tugmalari
```

#### Payment Modal - Kod Maydoni
```
💰 TO'LOV BOSHQARUVI
- Obuna muddati
- Tugash sanasi
- To'langan summa
- Qarz
- 🔐 TO'LOV KODI (yangi)
```

### Xavfsizlik Yaxshilashlari

1. **Kod Tekshiruvi**: Barcha muhim operatsiyalar uchun kod talab qilinadi
2. **Xato Xabarlari**: Noto'g'ri kod kiritilganda aniq xabar ko'rsatiladi
3. **Kod Tozalash**: Modal yopilganda kodlar avtomatik tozalanadi
4. **Konstantalar**: Qattiq kodlangan qiymatlar o'rniga konstantalar ishlatiladi

### Fayl O'zgarishlari

**Fayl**: `src/components/tabs/AdminUsers.jsx`

**Qo'shilgan State**:
- `paymentCode` - To'lov kodi
- `blockConfirm` - Toxtatish/Faollashtirish tasdiqlash
- `blockCode` - Toxtatish/Faollashtirish kodi

**Yangilangan Funksiyalar**:
- `blockSubscription()` - Kod tekshiruvi qo'shildi
- `unblockSubscription()` - Kod tekshiruvi qo'shildi
- `savePaymentData()` - Kod tekshiruvi qo'shildi
- `changeUserCode()` - `WORK_SCHOOL_CODE` konstantasi ishlatiladi

## Foydalanish

### Admin Kodlari
- **O'chirish**: `2.3.N.A`
- **Tahrirlash**: `2.3.N.A`
- **To'lov**: `2.3.N.A`
- **Toxtatish**: `2.3.N.A`
- **Ish Kodi**: `2.3.n.a` (master kod)
- **Maktab Kodi**: `2.3.n.a` (master kod)

### Xavfsizlik Darajalari
1. **Yuqori xavfsizlik** (2.3.N.A): O'chirish, Tahrirlash, To'lov, Toxtatish
2. **O'rta xavfsizlik** (2.3.n.a): Ish va Maktab kodlarini o'zgartirish

## Natija

✅ Barcha admin kodlari standartlashtirildi
✅ To'lov operatsiyalari himoyalandi
✅ Obunani toxtatish/faollashtirish himoyalandi
✅ Kod konstantalari markazlashtirildi
✅ Xavfsizlik yaxshilandi
