# MAQSAD VAZIFALAR TIZIMI

## ✅ QOSHILGAN FUNKSIYALAR

### 1. Har Bir Maqsad Uchun Vazifalar
Endi har bir maqsad o'zining vazifalar ro'yxatiga ega:
- **Masalan**: "IELTS 9" maqsadi uchun:
  - Har kuni 50 ta yangi so'z o'rganish
  - Listening mashqlari
  - Speaking practice
  - Writing essays

### 2. Vazifalar Boshqaruvi
- ✅ Yangi vazifa qo'shish
- ✅ Vazifani bajarilgan deb belgilash (checkbox)
- ✅ Vazifani o'chirish
- ✅ Vazifalar sonini ko'rish (bajarilgan/jami)

### 3. UI Dizayni
- **Yashil border**: Vazifalar bo'limi
- **Ochish/Yopish tugmasi**: Vazifalarni ko'rsatish/yashirish
- **Progress**: Bajarilgan vazifalar soni
- **Checkbox**: Vazifani bajarilgan deb belgilash
- **Yashil background**: Bajarilgan vazifalar

## 📋 QANDAY ISHLAYDI?

### Maqsad Obyekti:
```javascript
{
  id: 1234567890,
  title: "IELTS 9",
  target: 9,
  current: 0,
  unit: "ta",
  tasks: [
    {
      id: 1234567891,
      text: "Har kuni 50 ta yangi so'z o'rganish",
      completed: false,
      createdAt: "2025-01-19T..."
    },
    {
      id: 1234567892,
      text: "Listening mashqlari",
      completed: true,
      createdAt: "2025-01-19T..."
    }
  ],
  createdAt: "2025-01-19T..."
}
```

### Vazifalar Bo'limi:
1. **Ochish/Yopish**: ▼ OCHISH / ▲ YOPISH tugmasi
2. **Yangi vazifa**: Input + QO'SHISH tugmasi
3. **Vazifalar ro'yxati**: 
   - Checkbox (bajarilgan/bajarilmagan)
   - Vazifa matni
   - 🗑️ O'chirish tugmasi

### Funksiyalar:
```javascript
addTask(goalId, taskText)      // Yangi vazifa qo'shish
toggleTask(goalId, taskId)     // Bajarilgan/bajarilmagan
deleteTask(goalId, taskId)     // Vazifani o'chirish
```

## 🎨 DIZAYN

### Vazifalar Bo'limi:
- **Background**: `linear-gradient(135deg, #1a2a3a 0%, #0f1923 100%)`
- **Border**: `2px solid #00ff88`
- **Border Radius**: `10px`
- **Padding**: `16px`

### Vazifa Kartasi:
- **Background**: 
  - Bajarilgan: `rgba(0, 255, 136, 0.1)`
  - Bajarilmagan: `#16213e`
- **Border**: 
  - Bajarilgan: `2px solid #00ff88`
  - Bajarilmagan: `2px solid #0f3460`
- **Text Decoration**: 
  - Bajarilgan: `line-through`

### Tugmalar:
- **OCHISH/YOPISH**: Yashil/Qizil
- **QO'SHISH**: Yashil gradient
- **O'CHIRISH**: Qizil

## 📊 MISOL

### IELTS 9 Maqsadi:
```
📋 Vazifalar (2/5)  [▼ OCHISH]

[Yangi vazifa...] [+ QO'SHISH]

☑️ Har kuni 50 ta yangi so'z o'rganish  [🗑️]
☑️ Listening mashqlari                  [🗑️]
☐ Speaking practice                     [🗑️]
☐ Writing essays                        [🗑️]
☐ Reading comprehension                 [🗑️]
```

## 💾 MONGODB

Vazifalar `futureGoals` arrayida saqlanadi:
```javascript
user.futureGoals = [
  {
    id: 1234567890,
    title: "IELTS 9",
    target: 9,
    current: 0,
    unit: "ta",
    tasks: [
      { id: 1, text: "...", completed: false },
      { id: 2, text: "...", completed: true }
    ]
  }
]
```

## 🔄 STATE MANAGEMENT

```javascript
const [newTaskText, setNewTaskText] = useState({})  // { goalId: 'text' }
const [expandedGoal, setExpandedGoal] = useState(null)  // Ochiq maqsad ID
```

## ✅ XUSUSIYATLAR

1. **Har bir maqsad alohida**: Har bir maqsadning o'z vazifalari
2. **Ochish/Yopish**: Vazifalarni ko'rsatish/yashirish
3. **Progress tracking**: Bajarilgan vazifalar soni
4. **Checkbox**: Tez belgilash
5. **O'chirish**: Vazifani olib tashlash
6. **Enter tugmasi**: Tez qo'shish
7. **MongoDB saqlash**: Avtomatik saqlash

---

**Sana**: 2025-01-19
**Status**: ✅ TAYYOR
