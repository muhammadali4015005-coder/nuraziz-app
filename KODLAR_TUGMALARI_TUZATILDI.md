# KODLAR TUGMALARI TUZATILDI ✅

## Muammo:
Ba'zi foydalanuvchilarda "ISH KODI" va "MAKTAB KODI" tugmalari ko'rinmayapti.

## Sabab:
Tugmalar faqat `user.workCode` va `user.schoolCode` mavjud bo'lsa ko'rsatilgan edi:
```javascript
// ❌ Eski
{user.workCode && (
  <button>🔑 ISH KODI</button>
)}
{user.schoolCode && (
  <button>🔑 MAKTAB KODI</button>
)}
```

## Yechim:
Shartni o'chirib, tugmalarni har doim ko'rsatish:
```javascript
// ✅ Yangi
<button onClick={() => setChangingCode({ phone: user.phone, type: 'work' })}>
  🔑 ISH KODI
</button>
<button onClick={() => setChangingCode({ phone: user.phone, type: 'school' })}>
  🔑 MAKTAB KODI
</button>
```

## Natija:
Endi barcha foydalanuvchilarda 2 ta tugma ko'rinadi:
- 🔑 ISH KODI (ko'k)
- 🔑 MAKTAB KODI (sariq)

## Qanday ishlaydi:

### Kod mavjud bo'lmasa:
1. Admin tugmani bosadi
2. Modal ochiladi
3. Yangi kod kiritadi
4. Kod saqlanadi

### Kod mavjud bo'lsa:
1. Admin tugmani bosadi
2. Modal ochiladi
3. Eski kodni o'zgartiradi
4. Yangi kod saqlanadi

## Fayllar o'zgartirildi:
- ✅ `src/components/tabs/AdminUsers.jsx` - Shartli ko'rsatish o'chirildi

## Test qilish:
1. Admin panelga kiring
2. "AZOLAR" tabiga o'ting
3. Har qanday foydalanuvchida 2 ta tugma ko'rinishi kerak:
   - 🔑 ISH KODI
   - 🔑 MAKTAB KODI
4. Tugmani bosing va kod kiriting
5. Kod saqlanishi kerak ✅
