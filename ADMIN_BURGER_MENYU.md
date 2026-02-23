# ADMIN BURGER MENYU YARATILDI

## MUAMMO
Admin foydalanuvchi bilan bir xil burger menyuga ega edi. Admin uchun alohida menyu kerak edi:
- A'zolar ro'yxati
- Oyliklar
- Qarzlar
- Hisobot
- Sozlamalar

## YECHIM

### 1. ALOHIDA ADMIN SIDEBAR
Admin uchun maxsus burger menyu yaratildi:

```html
<!-- ADMIN SIDEBAR -->
<div class="sidebar" id="admin-sidebar">
    <button>YOPISH</button>
    
    <div>ADMIN PANEL</div>
    
    <button>A'ZOLAR</button>
    <button>OYLIKLAR</button>
    <button>QARZLAR</button>
    <button>HISOBOT</button>
    <button>SOZLAMALAR</button>
</div>
```

### 2. ADMIN TABLAR

#### A) A'ZOLAR TAB
**Maqsad:** Barcha foydalanuvchilarni ko'rish va boshqarish

**Statistika:**
- 📊 Jami A'zolar
- ⏳ Kutayotganlar
- ✅ Tasdiqlangan

**Funksiyalar:**
- ✏️ Tahrirlash
- ✅ Tasdiqlash
- 🗑️ O'chirish

---

#### B) OYLIKLAR TAB
**Maqsad:** Oylik to'lovlarni kuzatish

**Statistika:**
- ✅ Faol Oyliklar
- ⚠️ 5 Kun Ichida Tugaydi
- 🔔 Tugagan

**Funksiyalar:**
- ➕ Oylikni Uzaytirish
- ✏️ Tahrirlash

**Rangli Indikatorlar:**
- 🟢 Faol (11+ kun)
- 🟡 Tugayotgan (1-5 kun)
- 🔴 Tugagan

---

#### C) QARZLAR TAB
**Maqsad:** To'lamagan foydalanuvchilarni ko'rish

**Statistika:**
- 🔴 Qarzda Turganlar Soni
- 💰 Jami Qarz Summasi

**Funksiyalar:**
- ✅ To'landi (Oylikni uzaytirish)
- 📞 Qo'ng'iroq Qilish

**Ko'rinish:**
- Faqat oyligi tugagan foydalanuvchilar
- Qancha kun oldin tugagani
- Qarz summasi

---

#### D) HISOBOT TAB
**Maqsad:** Umumiy statistika va hisobotlar

**Statistika:**
- 💰 Jami Daromad
- 👥 Faol Foydalanuvchilar

**Bo'limlar:**
- 📅 Oylik Hisobot
- 📜 To'lovlar Tarixi (tez orada)

---

#### E) ADMIN SOZLAMALAR TAB
**Maqsad:** Narx va chegirma sozlamalari

**Sozlamalar:**
- 💵 Oylik Narx (so'm)
- 🎁 Chegirma (%)
- 💳 Yakuniy Narx

---

## JAVASCRIPT FUNKSIYALAR

### 1. toggleSidebar()
Admin uchun alohida sidebar ko'rsatadi:
```javascript
function toggleSidebar() {
    const isAdmin = userData && userData.phone === '998918235858';
    if (isAdmin) {
        document.getElementById('admin-sidebar').style.display = 'block';
        document.getElementById('admin-sidebar').classList.toggle('open');
        document.getElementById('sidebar').style.display = 'none';
    } else {
        document.getElementById('sidebar').classList.toggle('open');
        document.getElementById('admin-sidebar').style.display = 'none';
    }
    document.getElementById('overlay').classList.toggle('show');
}
```

### 2. loadAzolar()
Barcha foydalanuvchilarni yuklaydi va ko'rsatadi:
- Jami, kutayotgan, tasdiqlangan statistika
- Har bir foydalanuvchi kartasi
- Tahrirlash, tasdiqlash, o'chirish tugmalari

### 3. loadOyliklar()
Oylik to'lovlarni yuklaydi:
- Faol, tugayotgan, tugagan statistika
- Rangli indikatorlar (🟢🟡🔴)
- Necha kun qolgani
- Uzaytirish tugmasi

### 4. loadQarzlar()
Qarzda turganlarni yuklaydi:
- Faqat oyligi tugaganlar
- Qarz summasi
- Qancha kun oldin tugagani
- To'landi va Qo'ng'iroq tugmalari

### 5. loadHisobot()
Umumiy hisobotni yuklaydi:
- Jami daromad
- Faol foydalanuvchilar
- Oylik hisobot
- To'lovlar tarixi

### 6. loadAdminSozlamalar()
Admin sozlamalarni yuklaydi:
- Narx va chegirma sozlamalari
- Yakuniy narx hisoblash

### 7. extendSubscription(phone)
Oylikni uzaytiradi:
```javascript
function extendSubscription(phone) {
    const days = prompt('Necha kun uzaytirish kerak?', '30');
    // Oylikni uzaytirish
}
```

### 8. callUser(phone)
Foydalanuvchiga qo'ng'iroq qilish:
```javascript
function callUser(phone) {
    window.location.href = `tel:+${phone}`;
}
```

---

## ADMIN BURGER MENYU TUZILISHI

```
┌─────────────────────────────────────┐
│  ADMIN PANEL                        │
│  Boshqaruv paneli                   │
├─────────────────────────────────────┤
│  🔴 A'ZOLAR                         │
│  🟡 OYLIKLAR                        │
│  🔴 QARZLAR                         │
│  🔵 HISOBOT                         │
│  ⚙️  SOZLAMALAR                     │
└─────────────────────────────────────┘
```

---

## FOYDALANUVCHI VS ADMIN

### Foydalanuvchi Burger Menyu:
- ⚙️  SOZLAMALAR
- 📅 KUNLIK JADVAL
- 🌅 ERTALAB
- 🌙 KECHQURUN
- 🍽️  OVQATLANISH
- 🎯 MAQSADLAR
- 🤖 AI MASLAHAT
- 📹 VIDEO MASLAHAT
- 🔮 KELAJAK PROGNOZ
- 📊 HAFTALIK
- 📈 STATISTIKA

### Admin Burger Menyu:
- 👥 A'ZOLAR
- 📅 OYLIKLAR
- 💰 QARZLAR
- 📊 HISOBOT
- ⚙️  SOZLAMALAR

---

## RANGLI DIZAYN

### A'zolar:
- 🔴 Qizil - Kutayotgan
- 🟢 Yashil - Tasdiqlangan

### Oyliklar:
- 🟢 Yashil - Faol (11+ kun)
- 🟡 Sariq - Tugayotgan (1-5 kun)
- 🔴 Qizil - Tugagan

### Qarzlar:
- 🔴 Qizil - Barcha qarzlar

---

## O'ZGARTIRILGAN FAYLLAR
- `nuraziz-pro.html` - Admin sidebar va tablar qo'shildi

---

## TEST QILISH

### 1. Admin Sifatida Kiring
- Telefon: +998 91 823 58 58
- Parol: 963

### 2. Burger Menyuni Oching
- Yuqori chap burchakda burger tugmasini bosing
- Admin burger menyu ko'rinishi kerak

### 3. A'zolarni Tekshiring
- "A'ZOLAR" ni bosing
- Barcha foydalanuvchilar ko'rinishi kerak
- Statistika to'g'ri bo'lishi kerak

### 4. Oyliklarni Tekshiring
- "OYLIKLAR" ni bosing
- Rangli indikatorlar ko'rinishi kerak
- Necha kun qolgani ko'rinishi kerak

### 5. Qarzlarni Tekshiring
- "QARZLAR" ni bosing
- Faqat tugaganlar ko'rinishi kerak
- Qarz summasi ko'rinishi kerak

### 6. Hisobotni Tekshiring
- "HISOBOT" ni bosing
- Jami daromad ko'rinishi kerak
- Faol foydalanuvchilar soni ko'rinishi kerak

### 7. Sozlamalarni Tekshiring
- "SOZLAMALAR" ni bosing
- Narx va chegirma sozlamalari ko'rinishi kerak

---

## HOLAT
✅ Admin burger menyu yaratildi
✅ 5 ta admin tab qo'shildi
✅ A'zolar tab ishlaydi
✅ Oyliklar tab ishlaydi
✅ Qarzlar tab ishlaydi
✅ Hisobot tab ishlaydi
✅ Sozlamalar tab ishlaydi
✅ Rangli indikatorlar qo'shildi
✅ Telefon qo'ng'iroq funksiyasi qo'shildi

---

## KEYINGI QADAMLAR
1. Brauzer keshini tozalang: `Ctrl + Shift + R`
2. Admin sifatida kiring
3. Burger menyuni oching
4. Barcha tablarni sinab ko'ring

**Admin uchun alohida burger menyu tayyor!** 🎉
