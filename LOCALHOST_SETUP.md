# 🚀 Localhost Setup Guide

## Prerequisites

### Required
- **Node.js** (v12 or higher)
- **npm** (comes with Node.js)

### Check Installation
```bash
node --version
npm --version
```

---

## Installation & Setup

### Step 1: Download Files
Make sure you have all these files in one folder:
```
project-folder/
├── server.js
├── package.json
├── athletic-tracker.html
├── athletic-data-manager-v2.js
├── athletic-ai-engine.js
├── athletic-app.js
├── MULTI_USER_GUIDE.md
└── ... (other documentation files)
```

### Step 2: Open Terminal/Command Prompt
- Windows: Press `Win + R`, type `cmd`, press Enter
- Mac: Press `Cmd + Space`, type `terminal`, press Enter
- Linux: Open terminal application

### Step 3: Navigate to Project Folder
```bash
cd path/to/project-folder
```

Example:
```bash
cd C:\Users\YourName\Desktop\athletic-coach
```

### Step 4: Start Server
```bash
node server.js
```

Or use npm:
```bash
npm start
```

### Step 5: Open in Browser
Go to: **http://localhost:3000**

---

## Server Output

When server starts, you'll see:
```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║     🏋️  ATHLETIC PERFORMANCE COACH - LOCAL SERVER        ║
║                                                            ║
║     Server running at: http://localhost:3000              ║
║                                                            ║
║     📱 Open browser and go to:                            ║
║        http://localhost:3000                              ║
║                                                            ║
║     Demo Credentials:                                     ║
║        Telefon: +998 90 123 45 67                             ║
║        Kod: 1234                                          ║
║                                                            ║
║     Press Ctrl+C to stop server                           ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## Using the Application

### Login
1. Go to http://localhost:3000
2. Enter phone: `+998 90 123 45 67`
3. Enter code: `1234`
4. Click "Kirish"

### Create New Account
1. Click "Yangi Akkaunt Yaratish"
2. Enter phone number
3. Enter 4-6 digit code
4. Confirm code
5. Click "Akkaunt Yaratish"

### Logout
1. Click 🚪 button (top right)
2. Confirm logout

---

## Stopping Server

### Method 1: Keyboard Shortcut
Press `Ctrl + C` in terminal

### Method 2: Close Terminal
Close the terminal window

---

## Troubleshooting

### "Port 3000 is already in use"
**Problem**: Another application is using port 3000

**Solution 1**: Use different port
```bash
# Edit server.js and change PORT = 3000 to PORT = 3001
node server.js
# Then go to http://localhost:3001
```

**Solution 2**: Kill process using port 3000

Windows:
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Mac/Linux:
```bash
lsof -i :3000
kill -9 <PID>
```

### "Cannot find module 'http'"
**Problem**: Node.js not installed properly

**Solution**: Reinstall Node.js from https://nodejs.org

### "File not found" error
**Problem**: Files not in correct location

**Solution**: 
1. Check all files are in same folder
2. Check file names are correct
3. Restart server

### "Blank page" or "Cannot GET /"
**Problem**: Server not running or wrong URL

**Solution**:
1. Check server is running (see terminal)
2. Go to http://localhost:3000 (not http://localhost)
3. Restart server

### "Styles not loading" or "JavaScript not working"
**Problem**: Browser cache issue

**Solution**:
1. Press `Ctrl + Shift + Delete` (clear cache)
2. Or use Incognito/Private mode
3. Restart browser

---

## Advanced Usage

### Change Port
Edit `server.js`:
```javascript
const PORT = 3000;  // Change to 3001, 8000, etc.
```

### Access from Other Devices
Instead of `localhost`, use your computer's IP:
```
http://192.168.1.100:3000
```

Find your IP:
- Windows: `ipconfig` in cmd
- Mac/Linux: `ifconfig` in terminal

### Enable HTTPS (SSL)
For production, use HTTPS. See Node.js documentation.

---

## File Structure

```
project-folder/
│
├── server.js                          # Local server
├── package.json                       # Node.js config
│
├── athletic-tracker.html              # Main app
├── athletic-data-manager-v2.js        # Data management
├── athletic-ai-engine.js              # AI algorithms
├── athletic-app.js                    # App logic
│
├── LOCALHOST_SETUP.md                 # This file
├── MULTI_USER_GUIDE.md                # User guide
├── ATHLETIC_ARCHITECTURE.md           # Technical docs
├── ATHLETIC_QUICK_START.md            # Quick start
└── ... (other documentation)
```

---

## Performance Notes

- **First Load**: ~1-2 seconds
- **File Serving**: Instant
- **Data Processing**: <1 second
- **Analytics**: 1-3 seconds

---

## Security Notes

### Local Development
- ✅ Safe for local use
- ✅ No data sent to internet
- ✅ All data stored locally

### For Production
- ❌ Don't use this simple server
- ✅ Use Express.js or similar
- ✅ Add HTTPS/SSL
- ✅ Add authentication
- ✅ Add database

---

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

---

## FAQ

**Q: Do I need to install anything else?**
A: Only Node.js. Everything else is included.

**Q: Can I access from my phone?**
A: Yes, use your computer's IP address instead of localhost.

**Q: Will my data be saved?**
A: Yes, all data is saved in browser's LocalStorage.

**Q: Can I run multiple instances?**
A: Yes, use different ports (3000, 3001, 3002, etc.)

**Q: Is it safe to use?**
A: Yes, for local development. For production, use proper server.

**Q: How do I backup my data?**
A: Use Export feature in Settings.

**Q: Can I share the server with others?**
A: Yes, if they're on same network, use your IP address.

---

## Support

For issues:
1. Check this guide
2. Check terminal output
3. Try restarting server
4. Clear browser cache
5. Try different browser

---

## Next Steps

1. ✅ Start server: `node server.js`
2. ✅ Open browser: http://localhost:3000
3. ✅ Login with demo account
4. ✅ Create new account
5. ✅ Start tracking workouts!

---

**Happy Training!** 💪

---

**Last Updated**: January 2024
**Version**: 2.0.0
**Status**: Production Ready ✅
