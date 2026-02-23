# ADMIN BURGER MENYU - O'CHIRILGAN AZOLAR

## ✅ BAJARILDI

Admin burger menyusidagi "TASDIQLASH SOROVLARI" bo'limiga o'chirilgan azolarni ko'rish, tiklash va butunlay o'chirish funksiyalari qo'shildi.

### YANGI FUNKSIYALAR

#### 1. Toggle Tugmasi
- SOROVLAR ⟷ O'CHIRILGANLAR
- Tasdiqlash kutayotgan yangi foydalanuvchilar
- O'chirilgan azolar ro'yxati

#### 2. O'chirilgan Azolar Ko'rinishi
- Qizil border bilan ajratilgan
- O'chirilgan sana ko'rsatiladi
- QAYTA TIKLASH tugmasi (yashil)
- BUTUNLAY O'CHIRISH tugmasi (qizil)

#### 3. Xavfsizlik Modal
- Butunlay o'chirish uchun tasdiqlash
- Qizil border
- Ogohlantirish: "Bu amalni qaytarib bo'lmaydi!"

### YANGILANGAN FAYL

src/components/tabs/AdminPending.jsx
- showDeleted state
- permanentDeleteConfirm state
- restoreUser() funksiyasi
- permanentDeleteUser() funksiyasi
- Toggle tugmasi
- Permanent delete modal

### QANDAY ISHLAYDI

1. Admin panelga kiring (parol: 963)
2. Burger menyuni oching
3. "TASDIQLASH SOROVLARI" bo'limiga kiring
4. "O'CHIRILGANLAR" tugmasini bosing
5. Azoni tiklang yoki butunlay o'chiring

### YAKUNIY HOLAT

✅ Toggle tugmasi ishlaydi
✅ O'chirilgan azolar ko'rinadi
✅ Qayta tiklash ishlaydi
✅ Butunlay o'chirish ishlaydi
✅ Toast notifications ishlaydi

---

Sana: 2026-02-14
Status: TAYYOR ✅
