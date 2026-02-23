# Admin Xabar Badge Qo'shildi

## Xususiyat
Foydalanuvchi xabar yozganda, admin uni ko'rmaguncha xabar belgisi (badge) ko'rinadi. Admin xabarni ko'rganidan keyin badge yo'qoladi. Yana xabar yozilsa, yana badge paydo bo'ladi.

## Qanday Ishlaydi

### 1. Foydalanuvchi Xabar Yozadi
- AdminChatTab.jsx da foydalanuvchi xabar yozadi
- Xabar `role: 'user'` va `read: false` bilan saqlanadi
- Admin panelida foydalanuvchi ro'yxatida qizil badge paydo bo'ladi

### 2. Admin Xabarni Ko'radi
- Admin "💬 XABAR" tugmasini bosadi
- `openChatModal()` funksiyasi chaqiriladi
- Barcha foydalanuvchi xabarlari `read: true` qilinadi
- Badge yo'qoladi

### 3. Yana Xabar Yozilsa
- Foydalanuvchi yana xabar yozadi
- Yangi xabar `read: false` bilan saqlanadi
- Badge yana paydo bo'ladi

## O'zgarishlar

### 1. AdminUsers.jsx

#### Badge Ko'rsatish
```jsx
<button onClick={() => openChatModal(user)}>
  💬 XABAR
  {user.adminMessages?.filter(m => m.role === 'user' && !m.read).length > 0 && (
    <span style={{
      position: 'absolute',
      top: '-6px',
      right: '-6px',
      background: '#ff0055',
      color: '#fff',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      fontSize: '11px',
      fontWeight: 'bold'
    }}>
      {user.adminMessages.filter(m => m.role === 'user' && !m.read).length}
    </span>
  )}
</button>
```

#### Yangi Funksiyalar
```javascript
// Xabarlarni o'qilgan deb belgilash
const markMessagesAsRead = async (phone) => {
  const response = await fetch('/api/admin/mark-messages-read', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  })
  if (response.ok) {
    loadUsers() // Badge yangilanadi
  }
}

// Chat modalini ochish va xabarlarni o'qilgan qilish
const openChatModal = (user) => {
  setChatUser(user)
  if (user.adminMessages?.some(m => m.role === 'user' && !m.read)) {
    markMessagesAsRead(user.phone)
  }
}
```

### 2. server.js

#### Yangi Endpoint: `/api/admin/mark-messages-read`
```javascript
if (pathname === '/api/admin/mark-messages-read' && req.method === 'POST') {
  const { phone } = JSON.parse(body)
  const user = await dbManager.getUser(phone)
  
  if (user && user.adminMessages) {
    // Barcha foydalanuvchi xabarlarini o'qilgan qilish
    user.adminMessages = user.adminMessages.map(msg => {
      if (msg.role === 'user') {
        msg.read = true
      }
      return msg
    })
    await dbManager.saveUser(phone, user)
  }
}
```

#### Admin Xabar Yuborish Yangilandi
```javascript
// Admin xabar yuborishda role va read qo'shildi
user.adminMessages.push({
  from: 'ADMIN',
  role: 'admin',
  message,
  timestamp: new Date().toISOString(),
  read: false
})
```

### 3. AdminChatTab.jsx

#### Xabar Yuborish Yangilandi
```javascript
const handleSendMessage = async (e) => {
  const response = await fetch('/api/admin-chat/send', {
    method: 'POST',
    body: JSON.stringify({
      phone: userData?.phone,
      message: newMessage,
      role: 'user',
      read: false,  // Yangi xabar o'qilmagan
      timestamp: new Date()
    })
  })
}
```

## Xabar Strukturasi

### Foydalanuvchi Xabari
```javascript
{
  role: 'user',
  message: 'Salom admin',
  timestamp: '2024-02-22T10:30:00.000Z',
  read: false  // Admin ko'rmaguncha false
}
```

### Admin Xabari
```javascript
{
  from: 'ADMIN',
  role: 'admin',
  message: 'Salom, qanday yordam bera olaman?',
  timestamp: '2024-02-22T10:31:00.000Z',
  read: false
}
```

## Badge Dizayni

- **Rang**: Qizil (#ff0055)
- **Shakl**: Doira
- **O'lcham**: 20x20px
- **Pozitsiya**: Tugma yuqori o'ng burchagida
- **Matn**: O'qilmagan xabarlar soni
- **Border**: 2px qora (#0a0e27)

## Foydalanish

1. Foydalanuvchi AdminChatTab.jsx da xabar yozadi
2. Admin panelida foydalanuvchi ro'yxatida qizil badge ko'rinadi
3. Admin "💬 XABAR" tugmasini bosadi
4. Badge yo'qoladi (xabarlar o'qilgan deb belgilanadi)
5. Foydalanuvchi yana xabar yozsa, badge yana paydo bo'ladi

## Fayl O'zgarishlari

**Fayllar**:
- `src/components/tabs/AdminUsers.jsx` - Badge ko'rsatish va o'qilgan qilish
- `src/components/tabs/AdminChatTab.jsx` - Xabar yuborishda read: false
- `server.js` - mark-messages-read endpoint

**Yangi Endpoint**:
- POST `/api/admin/mark-messages-read` - Xabarlarni o'qilgan qilish

## Natija

✅ O'qilmagan xabarlar soni ko'rinadi
✅ Admin ko'rganidan keyin badge yo'qoladi
✅ Yana xabar yozilsa, badge yana paydo bo'ladi
✅ Real-time yangilanish
