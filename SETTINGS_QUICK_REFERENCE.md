# 🎯 SETTINGS TAB - QUICK REFERENCE

## All 6 Settings Fields

### 1️⃣ Age (Yosh)
```
Input: Number (1-120)
Example: 25
Saved: userData.settings.age
```

### 2️⃣ Notes (Izohlar)
```
Input: Multi-line text
Example: "Maqsadim sog'lom bo'lish"
Saved: userData.settings.notes
```

### 3️⃣ Sport Days (Nechimahal)
```
Input: Buttons (0-7)
Example: 3 kun
Saved: userData.settings.sportDays
```

### 4️⃣ Time (Qachon)
```
Input: Conditional buttons
1 day: Choose morning OR evening
2+ days: Both automatic
Saved: userData.settings.timeType
```

### 5️⃣ Sport Name (Ismi)
```
Input: Text field
Example: "Yugurish"
Saved: userData.settings.sportName
```

### 6️⃣ Sport Types (Turlari)
```
Input: Add/remove items
Example: ["Yugurish", "Suzish"]
Saved: userData.settings.sportTypes
```

## Quick Actions

| Action | How |
|--------|-----|
| Add age | Type number in age field |
| Add notes | Type in textarea |
| Select days | Click day button (0-7) |
| Choose time | Click morning or evening |
| Set sport name | Type in sport name field |
| Add sport type | Type + click button or press Enter |
| Remove sport type | Click delete button |
| Save all | Click save button |
| View summary | Scroll to bottom |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Enter | Add sport type (in input) |
| Tab | Move to next field |
| Shift+Tab | Move to previous field |

## Color Guide

| Color | Meaning |
|-------|---------|
| 🔵 Cyan | Headers, labels, selected |
| 🟢 Green | Summary text, active |
| ⚫ Dark | Background, cards |
| ⚪ White | Regular text |
| 🔘 Gray | Helper text |

## Data Structure

```javascript
{
  age: "25",
  notes: "Personal notes",
  sportDays: 3,
  timeType: "morning",
  sportName: "Yugurish",
  sportTypes: ["Yugurish", "Suzish"]
}
```

## Validation Rules

| Field | Rule |
|-------|------|
| Age | 1-120 |
| Days | 0-7 |
| Time | morning/evening |
| Name | Non-empty |
| Types | Non-empty strings |

## Time Selection Logic

```
If sportDays = 0:
  → No time selection

If sportDays = 1:
  → Choose: Morning OR Evening

If sportDays = 2+:
  → Both: Morning AND Evening
```

## Summary Display

Shows all configured settings:
- Age (if set)
- Notes preview (first 30 chars)
- Sport days
- Selected time
- Sport name
- All sport types

## Common Tasks

### Add Age
1. Click age input
2. Type number (1-120)
3. Click save

### Add Notes
1. Click notes textarea
2. Type text (multi-line)
3. Click save

### Select Sport Days
1. Click day button (0-7)
2. Button highlights
3. Summary updates

### Choose Time
1. If 1 day: Click morning or evening
2. If 2+ days: Both shown automatically
3. Click save

### Set Sport Name
1. Click sport name input
2. Type name (e.g., "Yugurish")
3. Click save

### Add Sport Type
1. Type in sport type input
2. Click "➕ QO'SHISH" or press Enter
3. Type appears in list
4. Click save

### Remove Sport Type
1. Find type in list
2. Click "🗑️ O'CHIRISH"
3. Type removed
4. Click save

## Status Indicators

| Indicator | Meaning |
|-----------|---------|
| ✅ | Saved successfully |
| 🔵 | Selected/Active |
| 🟢 | Active status |
| 🔴 | Delete/Remove |

## Tips & Tricks

- Press Enter to add sport type quickly
- Use Tab to navigate between fields
- Textarea supports multi-line text
- Age validates 1-120 automatically
- Summary updates in real-time
- All data saved to MongoDB
- Settings persist across sessions

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Age not saving | Check MongoDB connection |
| Notes truncated | Check textarea height |
| Sport type not adding | Press Enter or click button |
| Settings not loading | Refresh page |
| Summary not updating | Click save button |

## Mobile Tips

- Use portrait mode for better view
- Tap buttons instead of click
- Swipe to scroll sections
- Textarea expands on focus
- All fields touch-friendly

## Performance

- Fast rendering
- Real-time updates
- Minimal lag
- Optimized queries
- Efficient state management

## Security

- Input validation
- No data exposure
- MongoDB encrypted
- User-specific data

---

**Quick Reference**: All 6 settings fields with examples and shortcuts
**Version**: 2.0
**Date**: February 10, 2026
