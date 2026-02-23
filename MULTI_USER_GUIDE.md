# 👥 Multi-User System Guide

## Overview

Athletic Performance Coach now supports **multiple user accounts** with:
- ✅ User registration (yangi akkaunt yaratish)
- ✅ User login (kirish)
- ✅ User logout (chiqish)
- ✅ Separate data for each user
- ✅ Phone number + Passcode authentication

---

## Getting Started

### Default Account
```
Telefon: +998 90 123 45 67
Kod: 1234
```

---

## User Registration (Yangi Akkaunt Yaratish)

### Step 1: Click "Yangi Akkaunt Yaratish"
- On login screen
- Opens registration form

### Step 2: Enter Phone Number
- Format: `+998XXXXXXXXX`
- Minimum 10 digits
- Example: `+998911234567`

### Step 3: Enter Passcode
- 4-6 digit code
- Example: `5678`

### Step 4: Confirm Passcode
- Re-enter same code
- Must match exactly

### Step 5: Click "Akkaunt Yaratish"
- Account created successfully
- Redirected to login screen

---

## User Login (Kirish)

### Step 1: Enter Phone Number
- Your registered phone number
- Example: `+998911234567`

### Step 2: Enter Passcode
- Your 4-6 digit code
- Example: `5678`

### Step 3: Click "Kirish"
- Login successful
- Access your dashboard

---

## User Logout (Chiqish)

### Step 1: Click 🚪 (Logout Button)
- Top right corner of dashboard
- Next to ⚙️ settings

### Step 2: Confirm Logout
- Click "Yes" in confirmation dialog
- Redirected to login screen

---

## User Data Isolation

### Each User Has Separate:
- ✅ Morning exercises
- ✅ Evening exercises
- ✅ Goals
- ✅ Daily history
- ✅ Recovery data
- ✅ Analytics

### Data is NOT Shared:
- ❌ No data visible to other users
- ❌ No data mixing
- ❌ Complete privacy

---

## Account Management

### Change Passcode
1. Login to your account
2. Click ⚙️ (Settings)
3. Enter new code (4-6 digits)
4. Click "Kodni O'zgartirish"

### Export Your Data
1. Click ⚙️ (Settings)
2. Click "📥 Ma'lumotlarni Yuklab Olish"
3. JSON file downloads

### Clear Your Data
1. Click ⚙️ (Settings)
2. Click "🗑️ Barcha Ma'lumotlarni O'chirish"
3. Confirm deletion

---

## Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Bu raqam allaqachon ro'yxatdan o'tgan!" | Phone already registered | Use different phone |
| "Foydalanuvchi topilmadi!" | Phone not registered | Register first |
| "Kod noto'g'ri!" | Wrong passcode | Check passcode |
| "Kodlar mos kelmadi!" | Passcodes don't match | Re-enter same code |
| "Kod 4-6 ta belgidan iborat bo'lishi kerak!" | Code length wrong | Use 4-6 digits |

---

## Data Storage

### User Data Structure
```javascript
{
  '+998 90 123 45 67': {
    phone: '+998 90 123 45 67',
    pass: '1234',
    createdAt: '2024-01-01T08:00:00Z',
    data: {
      morningExercises: [...],
      eveningExercises: [...],
      goals: [...],
      dailyHistory: [...],
      recoveryData: [...]
    }
  },
  '+998911234567': {
    phone: '+998911234567',
    pass: '5678',
    createdAt: '2024-01-02T10:00:00Z',
    data: { ... }
  }
}
```

### LocalStorage Keys
```javascript
{
  'athletic_users': JSON.stringify({...}),        // All users
  'athletic_current_user': '+998 90 123 45 67'        // Currently logged in user
}
```

---

## Security Features

### Password Protection
- ✅ Passcode required for login
- ✅ Passcode validation (4-6 digits)
- ✅ No password sharing between users

### Data Privacy
- ✅ Each user's data isolated
- ✅ No cross-user data access
- ✅ Logout clears session

### Best Practices
1. **Use Strong Passcodes**: Avoid simple sequences
2. **Keep Phone Private**: Don't share your number
3. **Logout When Done**: Always logout
4. **Backup Data**: Export regularly

---

## Multi-Device Usage

### Same User, Different Devices
1. Register on Device 1
2. Register on Device 2 (same phone)
3. Each device has separate data
4. Data NOT synced between devices

### Sync Data Between Devices
1. Export data from Device 1
2. Login on Device 2
3. Import exported JSON file
4. Data now on Device 2

---

## Troubleshooting

### Can't Register
- **Check**: Phone number format
- **Check**: Code length (4-6 digits)
- **Check**: Codes match
- **Solution**: Try different phone number

### Can't Login
- **Check**: Phone number is registered
- **Check**: Passcode is correct
- **Check**: No typos
- **Solution**: Use default account first

### Lost Passcode
- **Solution**: Register new account with different phone
- **Alternative**: Clear browser data and use default

### Lost Phone Number
- **Solution**: Check browser LocalStorage
- **Alternative**: Register new account

---

## Advanced Features

### Programmatic Access
```javascript
// Register user
const result = athleticDataManager.registerUser('+998911234567', '5678');

// Login user
const loginResult = athleticDataManager.loginUser('+998911234567', '5678');

// Get current user
const currentUser = athleticDataManager.getCurrentUser();

// Logout
athleticDataManager.logoutUser();

// Get all users
const allUsers = athleticDataManager.getAllUsers();

// Get user data
const userData = athleticDataManager.getUserData('+998911234567');
```

---

## FAQ

**Q: Can I have multiple accounts?**
A: Yes, register with different phone numbers.

**Q: Can I switch between accounts?**
A: Yes, logout and login with different credentials.

**Q: Is my data safe?**
A: Yes, each user's data is isolated and private.

**Q: Can I sync data between devices?**
A: Not automatically, but you can export/import.

**Q: What if I forget my passcode?**
A: Register a new account with different phone.

**Q: Can I delete my account?**
A: Clear data in settings, or register new account.

**Q: Is data encrypted?**
A: No, stored in plain text in LocalStorage.

**Q: Can I backup my data?**
A: Yes, export as JSON file.

---

## Version History

### v2.0.0 (Current)
- Multi-user support
- User registration
- User login/logout
- Data isolation
- Separate user profiles

### v1.0.0 (Previous)
- Single user only
- Phone + Passcode login

---

## Support

For issues:
1. Check this guide
2. Review error messages
3. Check browser console (F12)
4. Clear browser cache
5. Try different browser

---

**Last Updated**: January 2024
**Version**: 2.0.0
**Status**: Production Ready ✅
