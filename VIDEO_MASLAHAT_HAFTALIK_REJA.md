# VIDEO MASLAHAT - HAFTALIK REJA FUNKSIYASI

## ✅ YANGI XUSUSIYATLAR

### 1. MAQSAD TURI ANIQLASH

**Avtomatik aniqlash:**
- ✅ Ingliz tili (english, ingliz, ielts, toefl)
- ✅ Fitness (kg, vazn, turnik, yugur, pull, run)
- ✅ Boshqa maqsadlar

**Qanday ishlaydi:**
1. Foydalanuvchi maqsad tanlaydi
2. Tizim avtomatik maqsad turini aniqlaydi
3. Tegishli forma ko'rsatiladi

### 2. BATAFSIL MA'LUMOT FORMASI

**So'raladigan ma'lumotlar:**
- ✅ Hozirgi daraja (A1, A2, B1, Boshlang'ich...)
- ✅ Maqsad daraja (B2, C1, IELTS 7.0, Yuqori...)
- ✅ Kuniga necha soat o'rganish/mashq qilish
- ✅ Qaysi kunlarda (Dushanba-Yakshanba)
- ✅ Qachongacha erishish (deadline)

**Xususiyatlar:**
- Barcha maydonlar majburiy
- Kunlarni tanlash (checkbox)
- Deadline bugundan keyin bo'lishi kerak
- Soatlar 0.5 dan boshlanadi

### 3. HAFTALIK REJA GENERATSIYA

**Hisoblash:**
- ✅ Jami kunlar (deadline gacha)
- ✅ Jami haftalar
- ✅ Jami soatlar (kuniga × kunlar × haftalar)
- ✅ Tanlangan kunlar

**Ingliz tili uchun reja:**
```
1-hafta: Grammar basics, Simple tenses
2-hafta: Vocabulary building, Reading practice
3-hafta: Listening practice, Pronunciation
4-hafta: Speaking practice, Conversation
5-hafta: Grammar basics, Simple tenses (takror)
...
```

**Fitness uchun reja:**
```
1-hafta: Warm-up, Basic exercises, Stretching
2-hafta: Strength training, Core exercises
3-hafta: Cardio, Endurance training
4-hafta: Advanced exercises, High intensity
5-hafta: Warm-up, Basic exercises, Stretching (takror)
...
```

**Boshqa maqsadlar uchun:**
```
1-hafta: Week 1 - Practice and improve
2-hafta: Week 2 - Practice and improve
...
```

### 4. REJA KO'RINISHI

**Umumiy ma'lumot:**
- Jami kunlar
- Jami haftalar
- Jami soatlar
- Kuniga soatlar
- Tanlangan kunlar (rangli ko'rsatkich)

**Haftalik jadval:**
- Har hafta uchun:
  - Hafta raqami
  - Fokus (nima o'rganish/mashq qilish)
  - Soatlar soni
- Birinchi 8 hafta ko'rsatiladi
- Qolgan haftalar soni ko'rsatiladi

### 5. ANIQ KUN AYTISH

**Tanlangan kunlar:**
- Foydalanuvchi qaysi kunlarda o'rganishini tanlaydi
- Tizim faqat o'sha kunlarni hisobga oladi
- Kunlar rangli ko'rsatkichda ko'rsatiladi

**Misol:**
```
Tanlangan kunlar: Dushanba, Chorshanba, Juma
Kuniga: 2 soat
Haftada: 6 soat (3 kun × 2 soat)
```

## 📋 QANDAY ISHLAYDI

### Foydalanuvchi uchun:

1. **Maqsad tanlash:**
   - Video Maslahat tabiga o'ting
   - Maqsadingizni tanlang

2. **Ma'lumot kiriting:**
   - Hozirgi darajangiz: A2
   - Maqsad darajangiz: B2
   - Kuniga: 2 soat
   - Kunlar: Dushanba, Chorshanba, Juma
   - Deadline: 2026-06-01

3. **Reja yaratish:**
   - "HAFTALIK REJA YARATISH" tugmasini bosing
   - Tizim avtomatik reja yaratadi

4. **Rejani ko'rish:**
   - Jami kunlar, haftalar, soatlar
   - Tanlangan kunlar
   - Har hafta uchun fokus

### Tizim uchun:

1. **Maqsad turi aniqlash:**
```javascript
if (title.includes('english')) {
  goalType = 'english'
} else if (title.includes('kg')) {
  goalType = 'fitness'
} else {
  goalType = 'other'
}
```

2. **Hisoblash:**
```javascript
const daysUntilDeadline = (deadline - today) / (1000 * 60 * 60 * 24)
const weeksUntilDeadline = Math.ceil(daysUntilDeadline / 7)
const totalHours = hoursPerDay × selectedDays.length × weeksUntilDeadline
```

3. **Reja generatsiya:**
```javascript
for (let i = 1; i <= weeksUntilDeadline; i++) {
  schedule.push({
    week: i,
    focus: getFocusForWeek(i, goalType),
    hours: hoursPerDay × selectedDays.length
  })
}
```

## 🎯 XUSUSIYATLAR

### Yetarli ma'lumot tekshirish:
- ✅ Barcha maydonlar to'ldirilganmi?
- ✅ Kamida bitta kun tanlanganmi?
- ✅ Deadline to'g'rimi?

### Aniq kun aytish:
- ✅ Foydalanuvchi qaysi kunlarda o'rganishini tanlaydi
- ✅ Tizim faqat o'sha kunlarni hisobga oladi
- ✅ Haftalik soatlar to'g'ri hisoblanadi

### Moslashuvchan:
- ✅ Har qanday maqsad turi
- ✅ Har qanday deadline
- ✅ Har qanday kunlik soat
- ✅ Har qanday kunlar kombinatsiyasi

## 📊 MISOLLAR

### Misol 1: Ingliz tili

**Kirish:**
- Maqsad: Ingliz tilini o'rganish
- Hozirgi: A2
- Maqsad: B2
- Kuniga: 2 soat
- Kunlar: Dushanba, Chorshanba, Juma (3 kun)
- Deadline: 3 oy (90 kun)

**Natija:**
- Jami kunlar: 90 kun
- Jami haftalar: 13 hafta
- Jami soatlar: 78 soat (2 × 3 × 13)
- Haftalik: 6 soat (2 × 3)

**Reja:**
```
1-hafta: Grammar basics, Simple tenses (6 soat)
2-hafta: Vocabulary building, Reading practice (6 soat)
3-hafta: Listening practice, Pronunciation (6 soat)
4-hafta: Speaking practice, Conversation (6 soat)
5-hafta: Grammar basics, Simple tenses (6 soat)
...
```

### Misol 2: Fitness

**Kirish:**
- Maqsad: 10 kg yo'qotish
- Hozirgi: 80 kg
- Maqsad: 70 kg
- Kuniga: 1.5 soat
- Kunlar: Dushanba, Seshanba, Payshanba, Shanba (4 kun)
- Deadline: 2 oy (60 kun)

**Natija:**
- Jami kunlar: 60 kun
- Jami haftalar: 9 hafta
- Jami soatlar: 54 soat (1.5 × 4 × 9)
- Haftalik: 6 soat (1.5 × 4)

**Reja:**
```
1-hafta: Warm-up, Basic exercises, Stretching (6 soat)
2-hafta: Strength training, Core exercises (6 soat)
3-hafta: Cardio, Endurance training (6 soat)
4-hafta: Advanced exercises, High intensity (6 soat)
5-hafta: Warm-up, Basic exercises, Stretching (6 soat)
...
```

## 🚀 KELAJAK YANGILANISHLAR

- [ ] Rejani MongoDB ga saqlash
- [ ] Kunlik progress tracking
- [ ] Eslatmalar (notifications)
- [ ] Rejani tahrirlash
- [ ] Rejani export qilish (PDF)
- [ ] Rejani ulashish
- [ ] Video tavsiyalar har hafta uchun
- [ ] AI bilan suhbat (reja bo'yicha)

## ✨ YAKUNIY NATIJA

Endi foydalanuvchilar:
1. Maqsad turini avtomatik aniqlaydi
2. Batafsil ma'lumot kiritadi
3. Aniq kunlarni tanlaydi
4. Haftalik reja oladi
5. Har hafta nima qilish kerakligini biladi

**Hammasi tayyor va ishlaydi!** 🎉

---

**Keyingi qadam:** Rejani MongoDB ga saqlash va kunlik progress tracking qo'shish.
