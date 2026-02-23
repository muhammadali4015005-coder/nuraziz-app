# KELAJAK PROGNOZ - TEZKOR MA'LUMOTNOMA

## QISQACHA

Kelajak tab endi sport mashqlari natijalariga qarab maqsadga erishish muddatini ko'rsatadi.

## ISHLATISH

### 1. Sport Mashqlarini Bajaring
```
Sport Mashqlari → Mashq qo'shish → ✓ Bajarildi
```

### 2. Maqsad Qo'ying
```
Kelajak → + YANGI MAQSAD → Kiriting → QO'SHISH
```

### 3. Prognozni Ko'ring
```
Avtomatik ko'rsatiladi:
- Bajarilgan mashqlar: 5 ta
- Haftalik progress: 20 marta
- Taxminiy muddat: 28 kun
```

## ASOSIY XUSUSIYATLAR

| Xususiyat | Tavsif |
|-----------|--------|
| 📊 Sport asosida | Faqat sport mashqlari hisobga olinadi |
| 📈 Dinamik | Har safar yangilanadi |
| 📅 Aniq muddat | Kun va sana ko'rsatiladi |
| ⚠️ Ogohlantirish | Sport yo'q bo'lsa xabar beradi |
| 💡 Motivatsion | Maqsadga yaqinlashish ko'rinadi |

## PROGNOZ FORMULASI

```
Haftalik progress = Hozirgi holat / 7 kun
Kerakli haftalar = (Maqsad - Hozirgi) / Haftalik progress
Kerakli kunlar = Kerakli haftalar × 7
```

## MISOL

**Maqsad:** 100 ta turnik
**Hozirgi:** 20 ta
**Bajarilgan mashqlar:** 5 ta

**Prognoz:**
- Haftalik: ~20 ta
- Kunlik: ~2.9 ta
- Muddat: 28 kun (4 hafta)
- Sana: 15 Mart 2026

## XATOLAR

| Xato | Sabab | Yechim |
|------|-------|--------|
| Prognoz yo'q | Sport mashqlari bajarilmagan | Mashq bajaring va belgilang |
| Noto'g'ri raqam | Hozirgi holat 0 | To'g'ri raqam kiriting |
| Yangilanmaydi | Kesh muammosi | Incognito mode ishlating |

## FAYLLAR

- `src/components/tabs/FutureTab.jsx` - Asosiy kod
- `KELAJAK_PROGNOZ_QOSHILDI.md` - To'liq hujjat
- `KELAJAK_PROGNOZ_TEST.md` - Test qo'llanmasi

## VERSIYA

**4.2.1** - Sport-based Future Predictions (2026-02-15)

---

**Status:** ✅ TAYYOR
**Test:** `npm run dev` → http://localhost:5173
