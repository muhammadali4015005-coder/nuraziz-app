# 🧪 TEST QILISH - TELEFON FORMATLASH

## 1️⃣ Serverni Ishga Tushiring

```bash
npm run dev
```

**Natija ko'rinishi kerak:**
```
✅ Server running at http://localhost:5002
✅ MongoDB connected (yoki LocalStorage fallback)
```

## 2️⃣ Brauzer Keshini Tozalang

### Usul 1: Hard Refresh (ENG OSON)
1. Brauzerda `http://localhost:5002` ni oching
2. `Ctrl + Shift + R` bosing (yoki `Ctrl + F5`)
3. Sahifa yangilanadi

### Usul 2: Incognito Mode (100% ISHLAYDI)
1. `Ctrl + Shift + N` bosing
2. `http://localhost:5002` ni oching
3. Eski kesh yo'q, yangi versiya ko'rinadi

### Usul 3: Keshni To'liq Tozalash
1. Chrome: `Ctrl + Shift + Delete`
2. "Cached images and files" ni belgilang
3. "Clear data" bosing
4. Sahifani qayta yuklang

## 3️⃣ Telefon Formatni Test Qiling

### Login Forma:

1. **Telefon inputiga bosing**
   - Placeholder: `+998` ko'rinadi

2. **Birinchi raqamni yozing: `9`**
   - Natija: `+998 9` ✅

3. **Ikkinchi raqamni yozing: `1`**
   - Natija: `+998 91` ✅

4. **Uchinchi raqamni yozing: `2`**
   - Natija: `+998 91 2` ✅

5. **To'liq raqamni yozing: `912345678`**
   - Natija: `+998 91 234 5678` ✅

6. **10-raqamni yozishga harakat qiling**
   - Natija: Qabul qilmaydi, maksimal 9 raqam ✅

### Register Forma:

1. **"YANGI AKKAUNT" tugmasini bosing**

2. **Ketma-ketlikni tekshiring:**
   - ✅ Ism inputi (birinchi)
   - ✅ Telefon inputi (ikkinchi)
   - ✅ Kod inputi (uchinchi)
   - ✅ Tasdiqlang inputi (to'rtinchi)
   - ✅ Tugmalar (oxirida)

3. **Telefon inputini test qiling:**
   - Xuddi login formadagidek ishlashi kerak
   - Format: `+998 91 234 5678`

## 4️⃣ Xatolarni Tekshiring

### Brauzer Konsolini Oching:
- `F12` yoki `Ctrl + Shift + I`
- "Console" tabiga o'ting

### Quyidagi xatolar BO'LMASLIGI kerak:
- ❌ "formatPhoneInput is not defined"
- ❌ "Illegal return statement"

### Quyidagi xatolar BO'LISHI mumkin (muhim emas):
- ⚠️ "Password field is not in a form" (bu ogohlantirish, xato emas)

## 5️⃣ Login/Register Test

### Test Akkaunt Yaratish:

1. **"YANGI AKKAUNT" bosing**
2. **Ma'lumotlarni kiriting:**
   - Ism: `Test User`
   - Telefon: `912345678` → avtomatik `+998 91 234 5678` bo'ladi
   - Kod: `1234`
   - Tasdiqlang: `1234`
3. **"YARATISH" bosing**
4. **Natija:** "Akkaunt yaratildi! Admin tasdig'ini kuting."

### Admin Tasdiqlash:

1. **"🔐 ADMIN KIRISH" bosing**
2. **Admin ma'lumotlarini kiriting:**
   - Telefon: `918235858` → `+998 91 823 5858`
   - Kod: `aliyevnuraziz2012`
3. **Admin panelda test foydalanuvchini tasdiqlang**

### Test Akkaunt bilan Kirish:

1. **Login formaga qayting**
2. **Ma'lumotlarni kiriting:**
   - Telefon: `912345678` → `+998 91 234 5678`
   - Kod: `1234`
3. **"KIRISH" bosing**
4. **Natija:** Asosiy sahifaga o'tadi ✅

## 6️⃣ Muammolarni Hal Qilish

### Agar "formatPhoneInput is not defined" xatosi ko'rinsa:

1. **Keshni tozalang:** `Ctrl + Shift + R`
2. **Incognito ishlatng:** `Ctrl + Shift + N`
3. **Konsolda tekshiring:**
   ```javascript
   typeof formatPhoneInput
   ```
   - Agar `"function"` → Yaxshi ✅
   - Agar `"undefined"` → Sahifani qayta yuklang

### Agar telefon formatlash ishlamasa:

1. **Konsolda xatolarni ko'ring:** `F12` → Console
2. **Sahifani qayta yuklang:** `F5`
3. **Hard refresh:** `Ctrl + Shift + R`
4. **Incognito:** `Ctrl + Shift + N`

### Agar "100" yoki boshqa qiymat ko'rinsa:

1. **Bu eski kesh!**
2. **Hard refresh qiling:** `Ctrl + Shift + R`
3. **Yoki incognito:** `Ctrl + Shift + N`
4. **Input `value=""` bo'lishi kerak**

## 7️⃣ Kutilayotgan Natija

### ✅ Login Forma:
```
┌─────────────────────────────┐
│     NURAZIZ PRO            │
├─────────────────────────────┤
│ [+998 91 234 5678]         │ ← Telefon (formatted)
│ [••••]                     │ ← Kod
│ [KIRISH]                   │
│ [YANGI AKKAUNT]            │
│ [🔐 ADMIN KIRISH]          │
└─────────────────────────────┘
```

### ✅ Register Forma:
```
┌─────────────────────────────┐
│   YANGI AKKAUNT            │
├─────────────────────────────┤
│ [Test User]                │ ← Ism
│ [+998 91 234 5678]         │ ← Telefon (formatted)
│ [••••]                     │ ← Kod
│ [••••]                     │ ← Tasdiqlang
│ [YARATISH]                 │
│ [ORQAGA]                   │
└─────────────────────────────┘
```

## 8️⃣ Yakuniy Tekshiruv

- ✅ Serverni ishga tushiring: `npm run dev`
- ✅ Keshni tozalang: `Ctrl + Shift + R`
- ✅ Telefon formatni test qiling: `9` → `+998 9`
- ✅ To'liq raqam: `912345678` → `+998 91 234 5678`
- ✅ Login ishlaydi
- ✅ Register ishlaydi
- ✅ Admin panel ishlaydi
- ✅ Hech qanday xato yo'q

---

**Agar hammasi ishlasa:** 🎉 MUVAFFAQIYATLI! ✅

**Agar muammo bo'lsa:** Konsolni tekshiring va xatolarni ko'rsating.
