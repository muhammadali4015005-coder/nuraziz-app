# MAKTAB VA ISH FUNKSIYASI - REJA

## VAZIFA

Foydalanuvchi maktab o'quvchisi yoki ishchi ekanligini aniqlash va ularga mos funksiyalar qo'shish.

## 1. SOZLAMALAR - Maktab yoki Ish

### Savol
"Siz maktab o'quvchisizmi yoki ishlaysizmi?"
- MAKTAB O'QUVCHISI
- ISHLAYMAN

### Agar MAKTAB tanlansa:
1. "Nechinchi sinfda o'qiysiz?" (1-11)
2. Agar 1-4 sinf → "Bilan tuadi" (erta turish)
3. Agar 5-11 sinf → Oddiy rejim

### Agar ISH tanlansa:
1. Ish turi (masalan: Dasturchi, O'qituvchi, Shifokor)
2. Lavozim (Boshliq, Menejer, Ishchi, Boshqaruvchi)
3. Necha yillik (masalan: 2 yil)
4. Ish boshlanish vaqti (masalan: 09:00)
5. Ish tugash vaqti (masalan: 18:00)

## 2. BURGER MENYU - Yangi Bo'limlar

### Agar MAKTAB tanlangan bo'lsa:
**"MAKTAB" bo'limi qo'shiladi**

#### Birinchi kirish:
- Kod so'raladi (4-6 raqam)
- Kod o'rnatiladi

#### Keyingi kirishlar:
- Kod so'raladi
- To'g'ri kod kiritilsa ochiladi

#### Maktab bo'limi ichida:
1. **Dars Jadvali (Raspisaniya)**
   - 6 kunlik (Dushanba-Shanba)
   - Yakshanba dam olish
   - Har bir kun uchun darslar ro'yxati
   - Dars nomi, vaqti

2. **Bugungi Darslar**
   - Bugun qanday darslar bor
   - Qaysi dars o'tildi, qaysi yo'q
   - Vazifalar

3. **Kunlik Hisobot**
   - Bugun maktabda nima qildim
   - Qanday foydalandim
   - Qanday darslar bo'ldi

### Agar ISH tanlangan bo'lsa:
**"ISH" bo'limi qo'shiladi**

#### Birinchi kirish:
- Kod so'raladi (4-6 raqam)
- Kod o'rnatiladi

#### Keyingi kirishlar:
- Kod so'raladi
- To'g'ri kod kiritilsa ochiladi

#### Ish bo'limi ichida:
1. **Ish Ma'lumotlari**
   - Ish turi
   - Lavozim
   - Necha yillik
   - Ish vaqti (boshlanish-tugash)

2. **Bugungi Vazifalar**
   - Bugun qanday ish qilish kerak
   - Bajarildi/Bajarilmadi
   - Qanday bo'ldi

3. **Kunlik Hisobot**
   - Bugun ishda nima qildim
   - Nechta klient bilan gaplashdim
   - Qanday natijalar bo'ldi
   - O'zimga olgan maslahatlar

4. **Ish Statistikasi**
   - Haftalik natijalar
   - Oylik natijalar
   - Klientlar soni

## 3. MA'LUMOTLAR STRUKTURASI

```javascript
// Maktab
user.settings.userType = 'school'
user.settings.schoolGrade = 7
user.settings.schoolCode = '1234'

user.schoolSchedule = {
  monday: [
    { subject: 'Matematika', time: '08:00-08:45' },
    { subject: 'Ingliz tili', time: '08:55-09:40' }
  ],
  tuesday: [...],
  // ...
}

user.schoolDaily = {
  '2026-02-14': {
    lessons: [
      { subject: 'Matematika', completed: true, notes: 'Yaxshi o\'tildi' }
    ],
    report: 'Bugun maktabda...'
  }
}

// Ish
user.settings.userType = 'work'
user.settings.workType = 'Dasturchi'
user.settings.workPosition = 'Menejer'
user.settings.workYears = 2
user.settings.workStartTime = '09:00'
user.settings.workEndTime = '18:00'
user.settings.workCode = '1234'

user.workDaily = {
  '2026-02-14': {
    tasks: [
      { task: 'Kod yozish', completed: true, notes: 'Tugallandi' }
    ],
    clients: 5,
    report: 'Bugun ishda...',
    advice: 'Ertaga...'
  }
}
```

## 4. YANGI KOMPONENTLAR

### SchoolTab.jsx
- Dars jadvali
- Bugungi darslar
- Kunlik hisobot
- Kod himoyasi

### WorkTab.jsx
- Ish ma'lumotlari
- Bugungi vazifalar
- Kunlik hisobot
- Statistika
- Kod himoyasi

### CodeProtection.jsx
- Kod so'rash modali
- Kod o'rnatish
- Kod tekshirish

## 5. BOSQICHLAR

### Bosqich 1: SettingsTab yangilash ✅
- userType state qo'shildi
- schoolGrade, workType va boshqalar qo'shildi

### Bosqich 2: SettingsTab UI (KEYINGI)
- "Maktab yoki Ish" bo'limi
- Conditional rendering
- Form inputs

### Bosqich 3: SchoolTab yaratish (KEYINGI)
- Dars jadvali
- Bugungi darslar
- Kod himoyasi

### Bosqich 4: WorkTab yaratish (KEYINGI)
- Ish ma'lumotlari
- Vazifalar
- Kod himoyasi

### Bosqich 5: Sidebar yangilash (KEYINGI)
- Conditional menu items
- Maktab/Ish bo'limlari

### Bosqich 6: Server endpoints (KEYINGI)
- /api/save-school-schedule
- /api/save-school-daily
- /api/save-work-daily

## YAKUNIY HOLAT

Bu juda katta funksiya! Men faqat asosiy strukturani tayyorladim.

Keyingi qadamlar:
1. SettingsTab ga UI qo'shish
2. SchoolTab yaratish
3. WorkTab yaratish
4. Sidebar yangilash
5. Server endpoints

---

Sana: 2026-02-14
Status: BOSHLANDI (State qo'shildi)
Keyingi: UI qo'shish
