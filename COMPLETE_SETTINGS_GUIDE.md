# 📋 COMPLETE SETTINGS TAB GUIDE

## Overview

The Settings tab is now fully enhanced with all required fields for user profile configuration and sport preferences.

## All Settings Fields

### 1. 👤 Yosh (Age)
**Purpose**: Store user age
**Type**: Number input
**Range**: 1-120
**Required**: No
**Saved As**: `userData.settings.age`

**Example**:
```
Input: 25
Saved: "25"
```

### 2. 📝 Izohlar / Yozish (Notes)
**Purpose**: Personal notes and reminders
**Type**: Textarea (multi-line)
**Max Length**: Unlimited
**Required**: No
**Saved As**: `userData.settings.notes`

**Example**:
```
Input: "Maqsadim sog'lom bo'lish va 10kg vazn kamaytirish"
Saved: "Maqsadim sog'lom bo'lish va 10kg vazn kamaytirish"
```

### 3. 🏋️ Nechimahal Sport Qilishi (Sport Days)
**Purpose**: How many days per week to exercise
**Type**: Button selection (0-7)
**Options**:
- 0 = Yo'q (No sport)
- 1-7 = Days per week
**Required**: Yes
**Saved As**: `userData.settings.sportDays`

**Example**:
```
Selected: 3
Display: "Haftada 3 kun sport qilasiz"
```

### 4. ⏰ Qachon Sport Qilishi (Time Selection)
**Purpose**: When to exercise
**Type**: Button selection (conditional)
**Logic**:
- If 1 day: Choose morning OR evening
- If 2+ days: Both times automatically
**Required**: Yes (if sportDays > 0)
**Saved As**: `userData.settings.timeType`

**Examples**:
```
1 day selected:
- User chooses: "morning" or "evening"
- Display: "🌅 ERTALAB" or "🌙 KECHQURUN"

2+ days selected:
- Automatic: Both times
- Display: "✅ Ertalab va Kechqurun (ikkala vaqt)"
```

### 5. 📝 Sport Ismi (Sport Name)
**Purpose**: Customize sport name
**Type**: Text input
**Examples**: Yugurish, Suzish, Futbol, Velosiped
**Required**: No
**Saved As**: `userData.settings.sportName`

**Example**:
```
Input: "Yugurish"
Saved: "Yugurish"
```

### 6. 🏃 Sport Turlari (Sport Types)
**Purpose**: List of specific sport activities
**Type**: Array of strings
**Add Method**: Input + Button or Enter key
**Remove Method**: Delete button per item
**Required**: No
**Saved As**: `userData.settings.sportTypes` (array)

**Example**:
```
Added:
- "Yugurish"
- "Suzish"
- "Velosiped"

Saved: ["Yugurish", "Suzish", "Velosiped"]
```

## Complete Settings Object

```javascript
{
  age: "25",                    // User age
  notes: "Personal notes...",   // Notes/reminders
  sportDays: 3,                 // 0-7 days per week
  timeType: "morning",          // "morning" or "evening"
  sportName: "Yugurish",        // Sport name
  sportTypes: [                 // Array of sport types
    "Yugurish",
    "Suzish",
    "Velosiped"
  ]
}
```

## User Interface Layout

```
⚙️ SOZLAMALAR
├─ 👤 Yosh
│  └─ [Input: 25]
│
├─ 📝 Izohlar / Yozish
│  └─ [Textarea: Multi-line text]
│
├─ 🏋️ Nechimahal Sport Qilishi
│  └─ [0] [1] [2] [3] [4] [5] [6] [7]
│     "Haftada 3 kun sport qilasiz"
│
├─ ⏰ Qachon Sport Qilishi
│  └─ [🌅 ERTALAB] [🌙 KECHQURUN]
│     (or "✅ Ertalab va Kechqurun")
│
├─ 📝 Sport Ismi
│  └─ [Input: Yugurish]
│
├─ 🏃 Sport Turlari
│  ├─ [Input] [➕ QO'SHISH]
│  ├─ 🏃 Yugurish [🗑️ O'CHIRISH]
│  ├─ 🏃 Suzish [🗑️ O'CHIRISH]
│  └─ 🏃 Velosiped [🗑️ O'CHIRISH]
│
├─ [💾 SOZLAMALARNI SAQLASH]
│
└─ 📋 Sozlamalar Xulosasi
   ├─ 👤 Yosh: 25
   ├─ 📝 Izohlar: Personal notes...
   ├─ 🏋️ Sport kunlari: 3 kun
   ├─ ⏰ Vaqt: 🌅 Ertalab
   ├─ 📝 Sport ismi: Yugurish
   └─ 🏃 Sport turlari: Yugurish, Suzish, Velosiped
```

## Step-by-Step Usage

### Step 1: Enter Age
1. Click on age input field
2. Enter age (1-120)
3. Field auto-validates

### Step 2: Add Notes
1. Click on notes textarea
2. Type personal notes
3. Can be multi-line
4. No character limit

### Step 3: Select Sport Days
1. Click on day button (0-7)
2. Selected button highlights in cyan
3. Summary text updates

### Step 4: Choose Time (if sportDays > 0)
1. If 1 day: Click morning or evening button
2. If 2+ days: Both times shown automatically
3. Selection saved

### Step 5: Set Sport Name
1. Click on sport name input
2. Enter custom name
3. Examples: Yugurish, Suzish, etc.

### Step 6: Add Sport Types
1. Type sport type in input field
2. Click "➕ QO'SHISH" or press Enter
3. Type appears in list below
4. Click "🗑️ O'CHIRISH" to remove

### Step 7: Save Settings
1. Click "💾 SOZLAMALARNI SAQLASH"
2. Alert shows "✅ Sozlamalar saqlandi!"
3. Data saved to MongoDB

### Step 8: View Summary
1. Scroll to bottom
2. See "📋 Sozlamalar Xulosasi"
3. All settings displayed
4. Color-coded for clarity

## Data Flow

```
User Input
    ↓
State Update (React)
    ↓
Display Update (UI)
    ↓
Click Save Button
    ↓
Update userData object
    ↓
Save to MongoDB
    ↓
Alert: "✅ Sozlamalar saqlandi!"
    ↓
Data Persisted
```

## Validation Rules

| Field | Rule | Example |
|-------|------|---------|
| Age | 1-120 | 25 ✅, 150 ❌ |
| Notes | Any text | "Maqsadim..." ✅ |
| Sport Days | 0-7 | 3 ✅, 8 ❌ |
| Time Type | morning/evening | "morning" ✅ |
| Sport Name | Non-empty | "Yugurish" ✅, "" ❌ |
| Sport Types | Non-empty strings | ["Yugurish"] ✅ |

## Color Coding

| Color | Usage |
|-------|-------|
| 🔵 Cyan (#00d4ff) | Headers, labels, selected buttons |
| 🟢 Green (#00ff88) | Summary text, active status |
| ⚫ Dark (#0a0e27) | Background, cards |
| ⚪ White (#fff) | Regular text |
| 🔘 Gray (#aaa) | Helper text, descriptions |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Enter | Add sport type (in input field) |
| Tab | Move to next field |
| Shift+Tab | Move to previous field |

## Mobile Responsiveness

- ✅ Responsive grid layout
- ✅ Touch-friendly buttons
- ✅ Mobile-optimized inputs
- ✅ Scrollable sections
- ✅ Readable on small screens

## Performance

- ✅ Fast rendering
- ✅ Efficient state management
- ✅ Real-time updates
- ✅ Minimal re-renders
- ✅ Optimized MongoDB queries

## Security

- ✅ Input validation
- ✅ No sensitive data exposure
- ✅ MongoDB encryption
- ✅ User-specific data isolation

## Integration Points

- ✅ Integrated with MainScreen
- ✅ Added to Sidebar menu
- ✅ Part of SETTINGS section
- ✅ Accessible from burger menu
- ✅ Data synced with MongoDB

## Testing Checklist

- ✅ Age input accepts 1-120
- ✅ Notes textarea multi-line
- ✅ Sport days 0-7 selection
- ✅ Time selection conditional
- ✅ Sport name editable
- ✅ Sport types add/remove
- ✅ Save button works
- ✅ Summary displays correctly
- ✅ Data persists to MongoDB
- ✅ Data loads on app start

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Age not saving | Check MongoDB connection |
| Notes truncated | Check textarea height |
| Sport types not adding | Press Enter or click button |
| Settings not loading | Refresh page, check MongoDB |
| Summary not updating | Click save button |

---

**Status**: ✅ Complete and fully functional
**Version**: 2.0 (Enhanced)
**Last Updated**: February 10, 2026
