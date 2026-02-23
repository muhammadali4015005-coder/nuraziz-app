# NURAZIZ - TOLIQ VERSIYA QOLLANMA

## YARATILGAN FAYL
- `nuraziz-complete-v2.html` - To'liq versiya (MongoDB integratsiya bilan)

## XUSUSIYATLAR

### 1. KIRISH TIZIMI
- Telefon raqam va parol bilan kirish
- Yangi akkaunt yaratish
- MongoDB orqali ma'lumotlar saqlash
- Demo akkaunt: +998 90 123 45 67 / 1234

### 2. ASOSIY BO'LIMLAR

#### KUNLIK JADVAL
- Vaqt va vazifa qo'shish
- Vazifalarni bajarilgan deb belgilash
- Vazifalarni o'chirish
- Bugungi vazifalar ro'yxati

#### ERTALAB MASHQLARI
- Sana, mashq nomi, maqsad qo'shish
- Bajarilgan miqdorni tahrirlash
- Progress bar ko'rsatish
- Status: pending, partial, completed

#### KECHQURUN MASHQLARI
- Sana, mashq nomi, og'irlik qo'shish
- Bajarilgan miqdorni tahrirlash
- Og'irlik va takrorlar soni

#### MAQSADLAR
- Maqsad nomi va raqam qo'shish
- Joriy holatni yangilash
- Progress bar bilan ko'rsatish
- Foiz hisobi

#### OVQATLANISH REJASI
- Ovqat nomi, kaloriya, vaqt qo'shish
- Bugungi jami kaloriya hisobi
- Ovqatlar ro'yxati
- Vaqt bo'yicha tartiblash

### 3. TAHLIL VA HISOBOTLAR

#### AI MASLAHATLAR
- Ertalab mashqlari tahlili
- Kechqurun mashqlari tahlili
- Maqsadlar holati
- Shaxsiy tavsiyalar
- Motivatsion xabarlar

#### HAFTALIK NATIJALAR
- So'nggi 7 kun statistikasi
- Ertalab va kechqurun mashqlari soni
- Kunlik o'rtacha hisob
- Umumiy natijalar

#### STATISTIKA
- Jami mashqlar soni
- Maqsadlar soni
- Bajarilish foizi
- Bugungi kaloriya
- Bajarilgan/bajarilmagan mashqlar

### 4. ADMIN PANEL

#### Narx Sozlamalari
- Oylik narx belgilash
- Chegirma foizi
- MongoDB ga saqlash

#### Foydalanuvchilar Boshqaruvi
- Barcha foydalanuvchilar ro'yxati
- Yangi foydalanuvchilarni tasdiqlash
- Foydalanuvchilarni bloklash
- Foydalanuvchilarni o'chirish
- Obuna holatini boshqarish


## TEXNIK XUSUSIYATLAR

### DIZAYN
- Qorongi rejim (dark mode)
- Zamonaviy gradient ranglar
- Responsive dizayn (mobil va desktop)
- Smooth animatsiyalar
- Progress bar'lar
- Modal oynalar
- Sidebar menyu
- Burger menyu

### RANGLAR
- Asosiy: #0a0e27 (qorongi ko'k)
- Ikkilamchi: #16213e (och qorongi)
- Accent: #00d4ff (moviy)
- Muvaffaqiyat: #00ff88 (yashil)
- Xato: #ff0055 (qizil)
- Ogohlantirish: #ffaa00 (sariq)

### FUNKSIYALAR
- MongoDB integratsiya
- Real-time saqlash
- Auto-save har 30 sekundda
- Multi-tab sinxronizatsiya
- Telefon raqam formatlash
- Notification tizimi
- Edit modal
- Progress tracking

## ISHGA TUSHIRISH

### 1. MongoDB ni ishga tushiring
```bash
mongod
```

### 2. Server ni ishga tushiring
```bash
node server.js
```

### 3. Brauzerda oching
```
http://localhost:5003/nuraziz-complete-v2.html
```

## API ENDPOINTLAR

### Foydalanuvchi
- POST `/api/register` - Ro'yxatdan o'tish
- POST `/api/login` - Kirish
- POST `/api/save-user` - Ma'lumotlarni saqlash
- POST `/api/get-user` - Ma'lumotlarni olish
- GET `/api/user/:phone` - Telefon bo'yicha olish

### Admin
- GET `/api/admin/users` - Barcha foydalanuvchilar
- POST `/api/admin/approve` - Tasdiqlash
- POST `/api/admin/remove` - O'chirish
- POST `/api/admin/block-subscription` - Bloklash
- POST `/api/admin/update-user` - Yangilash
- GET `/api/admin/price-settings` - Narx sozlamalari
- POST `/api/admin/save-price` - Narx saqlash
- POST `/api/admin/save-discount` - Chegirma saqlash


## FOYDALANISH

### KIRISH
1. Telefon raqamni kiriting (+998 XX XXX XX XX formatida)
2. Parolni kiriting (4-6 raqam)
3. "KIRISH" tugmasini bosing

### YANGI AKKAUNT
1. "YANGI AKKAUNT YARATISH" tugmasini bosing
2. Ismingizni kiriting
3. Telefon raqamni kiriting
4. Parol yarating (4-6 raqam)
5. Parolni tasdiqlang
6. "AKKAUNT YARATISH" tugmasini bosing

### KUNLIK JADVAL
1. Vaqtni tanlang
2. Vazifa nomini kiriting
3. "QO'SHISH" tugmasini bosing
4. Vazifani bajarilgan deb belgilash uchun "○" tugmasini bosing
5. O'chirish uchun "🗑️" tugmasini bosing

### MASHQLAR QO'SHISH
1. Sanani tanlang
2. Mashq nomini kiriting
3. Maqsad yoki og'irlikni kiriting
4. "QO'SHISH" tugmasini bosing
5. Tahrirlash uchun "✏️" tugmasini bosing
6. O'chirish uchun "🗑️" tugmasini bosing

### MAQSADLAR
1. Maqsad nomini kiriting
2. Maqsad raqamini kiriting
3. "QO'SHISH" tugmasini bosing
4. Joriy holatni yangilash uchun "✏️" tugmasini bosing

### OVQATLANISH
1. Ovqat nomini kiriting
2. Kaloriyani kiriting
3. Vaqtni tanlang
4. "QO'SHISH" tugmasini bosing
5. Bugungi jami kaloriya avtomatik hisoblanadi

### AI MASLAHATLAR
1. "AI MASLAHATLAR" bo'limiga o'ting
2. Avtomatik tahlil ko'rsatiladi
3. "YANGI MASLAHAT OLISH" tugmasini bosing

### ADMIN PANEL
1. "ADMIN PANEL" bo'limiga o'ting
2. Narx va chegirmani kiriting
3. "SAQLASH" tugmasini bosing
4. Foydalanuvchilarni boshqarish uchun "YANGILASH" tugmasini bosing


## XUSUSIYATLAR TAFSILOTI

### 1. TELEFON FORMATLASH
- Avtomatik +998 XX XXX XX XX formatiga o'tkazish
- Faqat raqamlar qabul qilinadi
- Maksimal 12 raqam

### 2. NOTIFICATION TIZIMI
- Muvaffaqiyatli amallar uchun yashil
- Xatolar uchun qizil
- Ma'lumot uchun moviy
- Ogohlantirish uchun sariq
- 3 soniyadan keyin avtomatik yo'qoladi

### 3. PROGRESS BAR
- Real-time yangilanish
- Gradient rang (moviy -> yashil)
- Foiz ko'rsatish
- Smooth animatsiya

### 4. EDIT MODAL
- Barcha maydonlarni tahrirlash
- Saqlash va bekor qilish
- Backdrop blur effekti
- Responsive dizayn

### 5. SIDEBAR MENYU
- Smooth ochilish/yopilish
- Overlay bilan
- Barcha bo'limlar
- Foydalanuvchi ma'lumotlari

### 6. AUTO-SAVE
- Har 30 sekundda avtomatik saqlash
- MongoDB ga yuborish
- Background da ishlaydi
- Xatoliklarni log qilish

### 7. MULTI-TAB SYNC
- Tab o'zgarganda ma'lumotlarni yangilash
- Real-time sinxronizatsiya
- Bir nechta tab ochish mumkin

### 8. STATUS TRACKING
- pending: Kutilmoqda (kulrang)
- partial: Qisman bajarilgan (sariq)
- completed: Bajarilgan (yashil)

## KELAJAKDA QO'SHILISHI MUMKIN

### Funksiyalar
- [ ] Video mashg'ulotlar
- [ ] Ovoz yozish
- [ ] Rasm yuklash
- [ ] PDF hisobot
- [ ] Email bildirishnomalar
- [ ] Push notifications
- [ ] Social media ulashish
- [ ] Grafik va diagrammalar
- [ ] Eksport/Import
- [ ] Backup tizimi

### Takomillashtirish
- [ ] PWA (Progressive Web App)
- [ ] Offline rejim
- [ ] Dark/Light mode toggle
- [ ] Ko'p tillilik
- [ ] Tema sozlamalari
- [ ] Font o'lchamini o'zgartirish
- [ ] Keyboard shortcuts
- [ ] Drag & drop

## MUAMMOLARNI HAL QILISH

### Server ishlamayapti
```bash
# Port bandligini tekshiring
netstat -ano | findstr :5003

# Jarayonni to'xtating
taskkill /PID <PID> /F

# Serverni qayta ishga tushiring
node server.js
```

### MongoDB ulanmayapti
```bash
# MongoDB holatini tekshiring
mongod --version

# MongoDB ni ishga tushiring
mongod

# Yoki Windows service sifatida
net start MongoDB
```

### Ma'lumotlar saqlanmayapti
1. MongoDB ishlab turganini tekshiring
2. Server console da xatolarni ko'ring
3. Browser console da xatolarni tekshiring
4. Network tab da API so'rovlarni ko'ring

### Sahifa yangilanmayapti
1. Ctrl+Shift+R (hard refresh)
2. Cache ni tozalang
3. Incognito mode da oching
4. Service worker ni o'chiring

## XAVFSIZLIK

### Parol
- 4-6 raqamli kod
- Hashing qo'shilishi kerak (production uchun)
- HTTPS ishlatish tavsiya etiladi

### API
- CORS sozlamalari
- Rate limiting qo'shish
- Input validation
- SQL injection himoyasi

### Ma'lumotlar
- MongoDB backup
- Encryption at rest
- Secure connection
- Access control

## YORDAM

Savollar yoki muammolar bo'lsa:
1. Console loglarni tekshiring
2. Network tab ni ko'ring
3. MongoDB loglarni o'qing
4. Server loglarni tahlil qiling

---

**Versiya:** 2.0 (To'liq)
**Sana:** 2026-02-10
**Muallif:** Kiro AI
**Litsenziya:** MIT
