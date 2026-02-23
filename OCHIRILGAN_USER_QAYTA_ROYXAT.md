# O'CHIRILGAN FOYDALANUVCHI QAYTA RO'YXATDAN O'TISHI

## ✅ BAJARILDI

O'chirilgan foydalanuvchi o'sha telefon raqami bilan yana ro'yxatdan o'tsa, avtomatik qayta faollashtiriladi.

### MUAMMO

Foydalanuvchi o'chirilgandan keyin (deleted: true):
- MongoDB da hali mavjud
- O'sha telefon raqami bilan yana ro'yxatdan o'tmoqchi bo'lsa
- "Bu telefon allaqachon ro'yxatdan o'tgan!" xatosi chiqadi

### YECHIM

Register endpointida deleted userlarni tekshirish:
1. Agar user.deleted === true bo'lsa
2. Userni qayta faollashtirish:
   - deleted: false
   - deletedAt o'chirish
   - Yangi parol va ism
   - approved: false (admin yana tasdiqlashi kerak)
   - Yangi createdAt

### YANGILANGAN FAYL

server.js - /api/register endpoint
- Deleted user tekshiruvi qo'shildi
- Qayta faollashtirish logikasi

### QANDAY ISHLAYDI

1. Foydalanuvchi o'chiriladi (deleted: true)
2. O'sha telefon raqami bilan yana ro'yxatdan o'tadi
3. Tizim avtomatik qayta faollashtiriladi
4. Admin tasdiqlashi kerak (approved: false)
5. Foydalanuvchi yana kirishi mumkin

### ALTERNATIV

Agar foydalanuvchini butunlay o'chirmoqchi bo'lsangiz:
1. "OCHIRILGANLAR" bo'limiga kiring
2. "BUTUNLAY O'CHIRISH" tugmasini bosing
3. Foydalanuvchi MongoDB dan butunlay o'chiriladi
4. O'sha telefon raqami bilan yangi akkaunt yaratish mumkin

### YAKUNIY HOLAT

✅ O'chirilgan user qayta ro'yxatdan o'tishi mumkin
✅ Avtomatik qayta faollashtiriladi
✅ Admin yana tasdiqlashi kerak
✅ Barcha ma'lumotlar saqlanadi

---

Sana: 2026-02-14
Status: TAYYOR ✅
