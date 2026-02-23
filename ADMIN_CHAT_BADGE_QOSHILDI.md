# Admin Chat Badge Qo'shildi

## O'zgarishlar

### 1. Sidebar.jsx - Badge Ko'rsatish
- "Chat Sorovlar" menyusiga o'qilmagan xabarlar soni ko'rsatiladi
- Badge qizil rangda (`#ff0055`) va tugmaning o'ng tomonida joylashgan
- Badge faqat o'qilmagan xabarlar mavjud bo'lganda ko'rinadi
- Har 30 sekundda avtomatik yangilanadi
- Admin xabarlarni ko'rganidan keyin darhol yangilanadi

### 2. AdminSorovlarTab.jsx - Yangilanish Eventi
- Admin foydalanuvchini tanlaganda va xabarlarni ko'rganida
- `window.dispatchEvent(new Event('refreshChatCount'))` orqali Sidebar'ga signal yuboriladi
- Bu badge'ni darhol yangilaydi

## Ishlash Tartibi

1. Foydalanuvchi admin bilan chat orqali xabar yuboradi
2. Sidebar'da "Chat Sorovlar" tugmasida qizil badge paydo bo'ladi
3. Badge ichida o'qilmagan xabarlar soni ko'rsatiladi
4. Admin "Chat Sorovlar" tabiga kiradi
5. Admin foydalanuvchini tanlaydi va xabarlarni ko'radi
6. Xabarlar avtomatik `read: true` qilib belgilanadi
7. Badge darhol yo'qoladi (agar boshqa o'qilmagan xabarlar bo'lmasa)
8. Agar yangi xabar kelsa, badge yana paydo bo'ladi

## Texnik Tafsilotlar

- Badge pozitsiyasi: `position: absolute`, tugmaning o'ng tomonida
- Badge rangi: `#ff0055` (qizil)
- Badge o'lchami: `minWidth: 20px`, `padding: 2px 8px`
- Shrift: `12px`, `bold`
- Yangilanish: 30 sekund interval + darhol yangilanish eventi

## Fayl O'zgarishlari

- `src/components/Sidebar.jsx` - Badge ko'rsatish va yangilanish logikasi
- `src/components/tabs/AdminSorovlarTab.jsx` - Yangilanish eventi qo'shildi

## Test Qilish

1. Oddiy foydalanuvchi sifatida kirish
2. "Admin bilan gaplashish" tabiga kirish
3. Xabar yuborish
4. Admin sifatida kirish
5. Sidebar'da "Chat Sorovlar" tugmasida badge ko'rinishini tekshirish
6. "Chat Sorovlar" tabiga kirish va foydalanuvchini tanlash
7. Badge yo'qolishini tekshirish
8. Yangi xabar yuborib, badge qayta paydo bo'lishini tekshirish
