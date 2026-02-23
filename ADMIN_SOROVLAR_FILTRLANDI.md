# Admin Sorovlar Filtrlandi

## O'zgarishlar

### server.js - `/api/admin/chat-users` Endpoint

Endi sorovlar ro'yxatida faqat quyidagi shartlarga mos foydalanuvchilar ko'rsatiladi:

1. **O'chirilmagan foydalanuvchilar** - `deleted !== true`
2. **O'qilmagan xabarlari bor foydalanuvchilar** - Kamida bitta `role === 'user' && read !== true` xabar bo'lishi kerak

## Filtr Logikasi

```javascript
.filter(u => {
    // O'chirilgan foydalanuvchilarni ko'rsatmaslik
    if (u.deleted) return false;
    
    // Chat xabarlari bo'lishi kerak
    if (!u.chatMessages || u.chatMessages.length === 0) return false;
    
    // Kamida bitta o'qilmagan xabar bo'lishi kerak
    const hasUnreadMessages = u.chatMessages.some(m => m.role === 'user' && !m.read);
    return hasUnreadMessages;
})
```

## Natija

✅ O'chirilgan a'zolarning sorovlari ko'rinmaydi
✅ Admin ko'rgan (o'qigan) sorovlar avtomatik yo'qoladi
✅ Faqat yangi, o'qilmagan xabarlar bor foydalanuvchilar ko'rsatiladi
✅ Admin xabarni ko'rganidan keyin, foydalanuvchi ro'yxatdan avtomatik o'chadi

## Ishlash Tartibi

1. Foydalanuvchi admin bilan chat orqali xabar yuboradi
2. Sorovlar ro'yxatida paydo bo'ladi (qizil badge bilan)
3. Admin foydalanuvchini tanlaydi va xabarlarni ko'radi
4. Xabarlar avtomatik `read: true` qilib belgilanadi
5. Foydalanuvchi sorovlar ro'yxatidan avtomatik yo'qoladi
6. Agar foydalanuvchi yana xabar yozsa, qayta paydo bo'ladi

## Fayl O'zgarishlari

- `server.js` - `/api/admin/chat-users` endpoint yangilandi
