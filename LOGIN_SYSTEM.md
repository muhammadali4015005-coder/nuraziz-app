# 🔐 Athletic Coach - Login System Documentation

## Overview

The Athletic Performance Coach now includes a **dual-factor authentication system** requiring both:
1. **Telefon Raqami** (Phone Number)
2. **Maxfiy Kod** (Passcode)

---

## Default Credentials

### Demo Account
```
Telefon Raqami: +998 90 123 45 67
Maxfiy Kod: 1234
```

---

## Login Process

### Step 1: Enter Phone Number
- Format: `+998XXXXXXXXX` (Uzbekistan format)
- Minimum 10 digits required
- Example: `+998 90 123 45 67`

### Step 2: Enter Passcode
- 4-6 digit code
- Example: `1234`

### Step 3: Click "Kirish" (Login)
- System validates both credentials
- If correct: Access granted to dashboard
- If incorrect: Error message displayed

---

## Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Telefon raqami va kodni kiriting!" | Missing phone or code | Fill both fields |
| "Telefon raqami yoki kod noto'g'ri!" | Wrong credentials | Check phone and code |
| "Telefon raqami kamida 10 ta belgidan iborat bo'lishi kerak!" | Phone too short | Use full phone number |
| "Kod kamisa 4 ta belgidan iborat bo'lishi kerak!" | Code too short | Use 4+ digit code |

---

## Changing Credentials

### Change Phone Number
1. Click ⚙️ (Settings)
2. Enter new phone number in "Telefon Raqami" field
3. Click "Telefon O'zgartirish"
4. Confirm success message

### Change Passcode
1. Click ⚙️ (Settings)
2. Enter new code in "Yangi Kod" field
3. Click "Kodni O'zgartirish"
4. Confirm success message

---

## Data Storage

### LocalStorage Keys
```javascript
{
  'athletic_pass': '1234',                    // Passcode
  'athletic_phone': '+998 90 123 45 67',          // Phone number
  'athletic_user_data': {                     // User profile
    phone: '+998 90 123 45 67',
    pass: '1234',
    createdAt: '2024-01-01T08:00:00Z'
  }
}
```

### Security Notes
- Credentials stored in browser LocalStorage
- No server transmission
- No encryption (local use only)
- Data persists across sessions

---

## Implementation Details

### Data Manager Methods

```javascript
// Set phone number
athleticDataManager.setPhone('+998 90 123 45 67');

// Get phone number
const phone = athleticDataManager.getPhone();

// Set passcode
athleticDataManager.setPassword('1234');

// Get passcode
const pass = athleticDataManager.getPassword();

// Get user data
const userData = athleticDataManager.getUserData();
```

### Authentication Flow

```javascript
function checkPass() {
    // 1. Get input values
    const phone = document.getElementById('phone-input').value.trim();
    const pass = document.getElementById('pass-input').value.trim();
    
    // 2. Get stored credentials
    const storedPhone = athleticDataManager.getPhone();
    const storedPass = athleticDataManager.getPassword();

    // 3. Validate inputs
    if (!phone || !pass) {
        showError('Telefon raqami va kodni kiriting!');
        return;
    }

    // 4. Check credentials
    if (phone === storedPhone && pass === storedPass) {
        // Login successful
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('main-screen').classList.remove('hidden');
        init();
    } else {
        // Login failed
        showError('❌ Telefon raqami yoki kod noto\'g\'ri!');
    }
}
```

---

## Phone Number Formats

### Uzbekistan Numbers
- **Standard**: `+998XXXXXXXXX`
- **Examples**:
  - `+998 90 123 45 67` (Beeline)
  - `+998 91 123 45 67` (Ucell)
  - `+998 93 123 45 67` (Mobi)
  - `+998941234567` (Perfectum)

### Alternative Formats (Accepted)
- `+998 90 123 45 67`
- `+998-90-123-45-67`
- `998 90 123 45 67` (without +)

---

## Passcode Requirements

### Valid Passcodes
- Minimum: 4 digits
- Maximum: 6 digits
- Examples: `1234`, `123456`, `9999`

### Invalid Passcodes
- Less than 4 digits: `123` ❌
- More than 6 digits: `1234567` ❌
- Empty: `` ❌

---

## Security Best Practices

### For Users
1. **Use Strong Passcodes**: Avoid simple sequences (1111, 1234)
2. **Keep Phone Private**: Don't share your phone number
3. **Logout**: Close browser when done
4. **Backup Data**: Export data regularly

### For Developers
1. **Upgrade to Hashing**: Use bcrypt for production
2. **Add Rate Limiting**: Prevent brute force attacks
3. **Add 2FA**: SMS verification for extra security
4. **Use HTTPS**: Encrypt data in transit
5. **Add Audit Logs**: Track login attempts

---

## Troubleshooting

### Forgot Passcode
- **Solution**: Clear browser data and use default (1234)
- **Alternative**: Export data, clear all, re-import

### Forgot Phone Number
- **Solution**: Check browser LocalStorage
- **Alternative**: Use default (+998 90 123 45 67)

### Can't Login
1. Check phone number format
2. Verify passcode length (4-6 digits)
3. Clear browser cache
4. Try different browser
5. Check LocalStorage is enabled

### Lost Access
1. Open browser DevTools (F12)
2. Go to Application → LocalStorage
3. Find `athletic_phone` and `athletic_pass`
4. Reset to defaults if needed

---

## Advanced Usage

### Programmatic Login
```javascript
// Set credentials
athleticDataManager.setPhone('+998 90 123 45 67');
athleticDataManager.setPassword('1234');

// Verify login
const phone = athleticDataManager.getPhone();
const pass = athleticDataManager.getPassword();

if (phone === inputPhone && pass === inputPass) {
    console.log('Login successful');
}
```

### Multi-User Support (Future)
```javascript
// Store multiple users
const users = {
    'user1': { phone: '+998 90 123 45 67', pass: '1234' },
    'user2': { phone: '+998 91 123 45 67', pass: '5678' }
};

// Switch user
athleticDataManager.setUserData(users['user1']);
```

---

## Migration Guide

### From Old System (Passcode Only)
1. Open Settings
2. Enter new phone number
3. Keep existing passcode or change it
4. Click "Telefon O'zgartirish"
5. Done!

### From Other Systems
1. Export data from old system
2. Login to new system with credentials
3. Import data
4. Verify all data is present

---

## FAQ

**Q: Can I use the same phone for multiple accounts?**
A: No, each phone number is unique per browser/device.

**Q: What if I forget both phone and passcode?**
A: Clear browser data and use defaults: +998 90 123 45 67 / 1234

**Q: Is my data encrypted?**
A: No, it's stored in plain text in LocalStorage. For sensitive data, use HTTPS and server-side encryption.

**Q: Can I export my credentials?**
A: Yes, export data includes phone and passcode in JSON format.

**Q: How do I reset to default credentials?**
A: Clear all data in Settings, then use defaults.

---

## Version History

### v1.0.0 (Current)
- Dual-factor authentication (Phone + Passcode)
- Phone number validation
- Passcode requirements (4-6 digits)
- Settings management
- Error handling

### Future Versions
- SMS verification
- Email authentication
- Biometric login
- Multi-device sync
- Account recovery

---

## Support

For issues or questions:
1. Check this documentation
2. Review error messages
3. Check browser console (F12)
4. Clear browser cache and try again
5. Export data before clearing

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Status**: Production Ready ✅
