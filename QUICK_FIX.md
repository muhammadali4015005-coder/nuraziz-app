# ⚡ Quick Fix (2 Minutes)

## Problem
Service worker errors, Failed to fetch

## Solution

### Step 1: Clear Cache (30 seconds)
**Windows/Linux:**
- Press `Ctrl + Shift + Delete`
- Select "All time"
- Check all boxes
- Click "Clear data"

**Mac:**
- Press `Cmd + Shift + Delete`
- Select "All time"
- Check all boxes
- Click "Clear data"

### Step 2: Unregister Service Workers (30 seconds)
1. Press `F12` (DevTools)
2. Open Console tab
3. Paste this:
```javascript
navigator.serviceWorker.getRegistrations().then(r => r.forEach(x => x.unregister()));
```
4. Press Enter

### Step 3: Restart Server (30 seconds)
```bash
# Stop: Ctrl + C
# Start:
node server.js
```

### Step 4: Open in Incognito (30 seconds)
- **Chrome**: `Ctrl + Shift + N`
- **Firefox**: `Ctrl + Shift + P`
- **Mac**: `Cmd + Shift + N`

Go to: **http://localhost:3000**

---

## Done! ✅

If still seeing errors, they're from old cache, not the server.

---

For detailed help, see: **FIX_ERRORS.md**
