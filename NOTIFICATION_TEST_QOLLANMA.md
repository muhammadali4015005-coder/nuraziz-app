# BLOCKED USER NOTIFICATION - TEST QILISH

## MUAMMO
Toxtatilgan foydalanuvchi kirmoqchi bo'lganda notification chiqmayapti. Bu brauzer keshi muammosi.

## YECHIM - 3 QADAM

### 1. SERVERNI ISHGA TUSHIRISH
```bash
npm run dev
```

Kutish: Backend (port 5003) va Frontend (port 5174) ishga tushadi.

### 2. BRAUZERNI TOZALASH (MUHIM!)

**VARIANT A: Incognito Mode (ENG OSON)**
- Chrome: `Ctrl + Shift + N`
- Edge: `Ctrl + Shift + P`
- Firefox: `Ctrl + Shift + P`
- Keyin: `http://localhost:5174` ga kiring

**VARIANT B: Keshni To'liq Tozalash**
1. `Ctrl + Shift + Delete` bosing
2. "All time" yoki "Barcha vaqt" tanlang
3. Quyidagilarni belgilang:
   - ✅ Cached images and files
   - ✅ Cookies and site data
4. "Clear data" bosing
5. Brauzerni yoping va qayta oching

### 3. TEST QILISH

**Demo User (Toxtatilgan):**
- Telefon: `+998 11 111 11 11`
- Parol: `1111`

**Kutilayotgan Natija:**
1. Telefon va parol kiriting
2. KIRISH tugmasini bosing
3. To'liq ekranda qizil notification chiqadi:
   ```
   ⚠
   Sizning oylik to'lovingizning muddati tugagan!
   
   Iltimos +998 91 833 5005 raqamiga telefon qiling.
   ```
4. 4 soniyadan keyin avtomatik yo'qoladi

## CONSOLE LOGLAR

Agar notification chiqmasa, F12 bosib Console ni tekshiring:

**To'g'ri loglar:**
```
📥 Login response: {success: false, error: "blocked"}
🚫 Error blocked - showing notification
```

**Xato loglar (kesh muammosi):**
```
SyntaxError: Unexpected identifier 'response'
SyntaxError: Unexpected identifier 'blocked'
```

Agar xato loglar ko'rsatilsa → Incognito mode ishlatish SHART!

## ADMIN PANEL ORQALI TOXTATISH

1. Admin sifatida kiring (kod: `963`)
2. AZOLAR tabiga o'ting
3. Foydalanuvchini toping
4. TOXTATISH tugmasini bosing
5. Foydalanuvchi `subscriptionActive: false` bo'ladi
6. Endi u foydalanuvchi kirmoqchi bo'lganda notification ko'radi

## QAYTA FAOLLASHTIRISH

1. Admin panelda QAYTA FAOLLASH tugmasini bosing
2. Foydalanuvchi `subscriptionActive: true` bo'ladi
3. Endi u oddiy tarzda kirishi mumkin

## TEXNIK TAFSILOTLAR

**Notification Component:**
- Fayl: `src/components/Notification.jsx`
- To'liq ekran overlay
- Qizil gradient background
- Pulse animation
- 4 soniya ko'rsatiladi

**LoginScreen Logic:**
```javascript
if (result.user.subscriptionActive === false) {
  setNotification('Sizning oylik to\'lovingizning muddati tugagan!\n\nIltimos +998 91 833 5005 raqamiga telefon qiling.')
  return
}
```

**Server Response:**
```javascript
if (user.subscriptionActive === false) {
  res.end(JSON.stringify({ success: false, error: 'blocked' }))
}
```

## AGAR HALI HAM ISHLAMASA

1. Barcha node processlarni to'xtatish:
   ```bash
   Get-Process -Name node | Stop-Process -Force
   ```

2. node_modules/.vite papkasini o'chirish:
   ```bash
   Remove-Item -Recurse -Force node_modules/.vite
   ```

3. Qayta ishga tushirish:
   ```bash
   npm run dev
   ```

4. Incognito mode ishlatish (SHART!)

---

**Yaratilgan:** 2026-02-13
**Status:** TAYYOR - TEST QILISH MUMKIN
