# 🚀 NPM RUN DEV - TO'LIQ QOLLANMA

## ✅ HOZIR TAYYOR!

React + Vite loyihasi to'liq setup qilindi!

---

## 📦 QADAMLAR

### 1. Dependencies o'rnating
```bash
npm install
```

Bu buyruq barcha kerakli paketlarni o'rnatadi:
- `vite` - Dev server
- `react` - UI framework
- `react-dom` - React DOM
- `@vitejs/plugin-react` - React plugin
- `mongodb` - Database

### 2. Dev Server ni ishga tushiring
```bash
npm run dev
```

Bu buyruq:
- ✅ Vite dev server ni ishga tushiradi (port 5173)
- ✅ Brauzer avtomatik ochiladi
- ✅ Hot reload faol bo'ladi
- ✅ API proxy sozlangan (localhost:5003)

### 3. Server ni alohida terminal da ishga tushiring
```bash
npm run server
```

Yoki:
```bash
node server.js
```

---

## 🎯 NATIJA

### Dev Server
```
✅ http://localhost:5173
```

### Backend Server
```
✅ http://localhost:5003
```

### Demo Akkaunt
```
Telefon: +998 90 123 45 67
Parol: 1234
```

---

## 📁 LOYIHA STRUKTURA

```
nuraziz-premium/
├── src/
│   ├── components/
│   │   ├── LoginScreen.jsx
│   │   ├── MainScreen.jsx
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── tabs/
│   │   │   ├── ScheduleTab.jsx
│   │   │   ├── MorningTab.jsx
│   │   │   ├── EveningTab.jsx
│   │   │   ├── GoalsTab.jsx
│   │   │   ├── NutritionTab.jsx
│   │   │   ├── InsightsTab.jsx
│   │   │   ├── WeeklyTab.jsx
│   │   │   ├── StatsTab.jsx
│   │   │   ├── VideosTab.jsx
│   │   │   ├── GalleryTab.jsx
│   │   │   ├── ReportsTab.jsx
│   │   │   └── AdminTab.jsx
│   │   ├── LoginScreen.css
│   │   ├── Header.css
│   │   ├── Sidebar.css
│   │   └── MainScreen.css
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── package.json
├── server.js
└── .gitignore
```

---

## 🔧 BUYRUQLAR

### Development
```bash
npm run dev      # Dev server ishga tushirish
npm run build    # Production build
npm run preview  # Build preview
npm run server   # Backend server
npm start        # Backend server (alias)
```

---

## 🌐 API PROXY

Vite dev server API so'rovlarini avtomatik proxy qiladi:

```javascript
// Frontend so'rov
fetch('/api/login', { ... })

// Avtomatik proxy qilinadi
// http://localhost:5173/api/login -> http://localhost:5003/api/login
```

---

## 🔥 HOT RELOAD

Fayl o'zgartirilsa, brauzer avtomatik yangilanadi:
- JSX fayllar
- CSS fayllar
- JavaScript fayllar

---

## 📊 VITE FEATURES

### Development
- ⚡ Lightning fast HMR (Hot Module Replacement)
- 🚀 Instant server start
- 📦 Optimized dependencies
- 🔍 Source maps

### Production
- 📉 Minified output
- 🎯 Tree shaking
- 📦 Code splitting
- 🚀 Optimized build

---

## 🎨 REACT COMPONENTS

### Yaratilgan Komponentlar
1. **App.jsx** - Asosiy komponent
2. **LoginScreen.jsx** - Kirish ekrani
3. **MainScreen.jsx** - Asosiy ekran
4. **Header.jsx** - Header
5. **Sidebar.jsx** - Sidebar menyu
6. **Tab Komponentlari** - 12 ta tab

### Hooks Ishlatilgan
- `useState` - State boshqaruvi
- `useEffect` - Side effects

---

## 🚀 PRODUCTION BUILD

### Build qilish
```bash
npm run build
```

### Build preview
```bash
npm run preview
```

### Build natijasi
```
dist/
├── index.html
├── assets/
│   ├── index-xxxxx.js
│   └── index-xxxxx.css
```

---

## 🔐 ENVIRONMENT VARIABLES

`.env` faylini yarating (ixtiyoriy):

```env
VITE_API_URL=http://localhost:5003
VITE_APP_NAME=NURAZIZ
```

Foydalanish:
```javascript
const apiUrl = import.meta.env.VITE_API_URL
```

---

## 🐛 DEBUGGING

### Browser DevTools
1. F12 ni bosing
2. Console tab ni oching
3. Xatolarni ko'ring

### Vite Debug Mode
```bash
DEBUG=vite:* npm run dev
```

---

## 📱 RESPONSIVE DESIGN

Loyiha responsive:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

---

## 🎯 KEYINGI QADAMLAR

### Hozir qilish mumkin:
1. ✅ `npm install` - Dependencies o'rnating
2. ✅ `npm run dev` - Dev server ishga tushiring
3. ✅ Brauzerda `http://localhost:5173` ni oching
4. ✅ Demo akkaunt bilan kiring
5. ✅ Kunlik jadval qo'shish va boshqarish

### Kelajakda:
- [ ] Barcha tab komponentlarini to'ldirish
- [ ] API integratsiyasini yakunlash
- [ ] Styling takomillashtirish
- [ ] Testing qo'shish
- [ ] Production deploy

---

## 🆘 MUAMMOLARNI HAL QILISH

### Port band
```bash
# Port 5173 band bo'lsa, boshqa port ishlatish
npm run dev -- --port 5174
```

### Dependencies muammosi
```bash
# node_modules o'chirish va qayta o'rnating
rm -rf node_modules package-lock.json
npm install
```

### Cache muammosi
```bash
# Vite cache o'chirish
rm -rf .vite
npm run dev
```

### Server ulanmayapti
```bash
# Server ishlab turganini tekshiring
npm run server

# Yoki alohida terminal da
node server.js
```

---

## 📚 QOLLANMALAR

- `TOLIQ_VERSIYA_QOLLANMA.md` - To'liq qo'llanma
- `PREMIUM_V3_QOLLANMA.md` - Premium xususiyatlar
- `DAVOM_ETILGAN_VERSIYALAR.md` - Versiyalar taqqoslash
- `YAKUNIY_XULOSA.md` - Umumiy ma'lumot

---

## 🎊 TAYYOR!

Endi `npm run dev` buyrug'ini ishga tushiring va boshlang!

```bash
npm install
npm run dev
```

---

**Versiya:** 3.0 (React + Vite)
**Sana:** 2026-02-10
**Muallif:** Kiro AI
**Litsenziya:** MIT

🚀 **HAPPY CODING!** 🚀
