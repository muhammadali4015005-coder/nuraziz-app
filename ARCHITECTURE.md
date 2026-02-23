# 🏗️ Advanced Habit Tracker - Architecture Documentation

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    UI Layer (HTML/CSS)                      │
│  - Authentication Screen                                    │
│  - Dashboard (Progress, Stats, AI Insights)                │
│  - Habits Management                                        │
│  - Goals Management                                         │
│  - Analytics (Charts, Streaks, Heatmap)                    │
│  - Recommendations                                          │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│              Application Logic (app.js)                     │
│  - Event Handling                                           │
│  - UI Rendering                                             │
│  - Tab Navigation                                           │
│  - User Interactions                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼──────────┐    ┌────────▼──────────┐
│  Data Manager    │    │   AI Engine       │
│  (data-manager   │    │   (ai-engine.js)  │
│   .js)           │    │                   │
│                  │    │ - Analytics       │
│ - Habits CRUD    │    │ - Predictions     │
│ - Goals CRUD     │    │ - Recommendations │
│ - Daily Snapshots│    │ - Trend Analysis  │
│ - History (30d)  │    │ - Streak Tracking │
│ - Password Mgmt  │    │                   │
└────────┬─────────┘    └────────┬──────────┘
         │                       │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │   LocalStorage API    │
         │  (Browser Storage)    │
         └───────────────────────┘
```

## Data Flow Architecture

### 1. Habit Creation Flow
```
User Input (Add Habit)
    ↓
app.js: addHabit()
    ↓
dataManager.addHabit()
    ↓
Save to LocalStorage
    ↓
recordDailySnapshot()
    ↓
renderHabits() + updateDashboard()
    ↓
UI Update
```

### 2. Status Update Flow
```
User Action (Toggle Status)
    ↓
app.js: toggleHabitStatus()
    ↓
dataManager.updateHabitStatus()
    ↓
recordDailySnapshot()
    ↓
aiEngine.analyzeHabitPerformance()
    ↓
updateProgressCircle() + updateStats()
    ↓
UI Update
```

### 3. Analytics Generation Flow
```
User Views Analytics Tab
    ↓
renderAnalytics()
    ↓
├─ renderWeeklyChart()
│  └─ aiEngine.getWeeklyChartData()
│     └─ dataManager.getWeeklyStats()
│
├─ renderStreaks()
│  └─ dataManager.getAllStreaks()
│     └─ getStreakForHabit() [for each habit]
│
└─ renderHeatmap()
   └─ dataManager.getHeatmapData()
      └─ getDailyHistory()
```

### 4. Recommendation Generation Flow
```
User Views Recommendations Tab (after 7 days)
    ↓
renderRecommendations()
    ↓
aiEngine.generateRecommendations()
    ↓
├─ Analyze weak habits
│  ├─ analyzeHabitPerformance()
│  ├─ categorizeHabit()
│  ├─ getRecommendedContent()
│  └─ generateHabitAdvice()
│
├─ Identify missing habits
│  └─ suggestHabitsForGoal()
│
└─ Recognize strengths
   └─ Filter excellent habits
```

## Data Structures

### Habit Object
```javascript
{
  id: 1704067200000,                    // Timestamp-based unique ID
  text: "Morning Workout",              // Habit description
  status: "done",                       // 'pending' | 'done' | 'fail'
  createdAt: "2024-01-01T08:00:00Z",   // ISO timestamp
  linkedGoals: [1704067200001]          // Array of goal IDs
}
```

### Daily Snapshot Object
```javascript
{
  date: "2024-01-01",                   // YYYY-MM-DD format
  habits: [
    { id: 1704067200000, text: "Morning Workout", status: "done" },
    { id: 1704067200001, text: "Read", status: "pending" }
  ],
  completionRate: 50,                   // 0-100 percentage
  timestamp: "2024-01-01T23:59:59Z"    // When snapshot was recorded
}
```

### Goal Object
```javascript
{
  id: 1704067200002,                    // Timestamp-based unique ID
  title: "Run a Marathon",              // Goal title
  description: "Complete 42.2km run",   // Goal description
  targetDays: 90,                       // Days to achieve goal
  createdAt: "2024-01-01T08:00:00Z",   // ISO timestamp
  linkedHabits: [1704067200000],        // Array of habit IDs
  status: "active",                     // 'active' | 'completed' | 'abandoned'
  progress: 0                           // 0-100 percentage
}
```

### ETA Prediction Object
```javascript
{
  eta: 75,                              // Estimated days to completion
  daysElapsed: 15,                      // Days since goal creation
  progress: 20,                         // Current progress percentage
  confidence: "medium",                 // 'low' | 'medium' | 'high'
  avgCompletion: 65,                    // Average daily completion rate
  message: "⚠️ Taxminiy 75 kun kerak"  // User-friendly message
}
```

### Recommendation Object
```javascript
{
  type: "weak_habit",                   // 'weak_habit' | 'missing_habits' | 'strength'
  habitText: "Morning Workout",
  completionRate: 35,
  content: [
    { title: "Motivation Mastery", type: "podcast", category: "motivation" }
  ],
  advice: "Morning Workout uchun vaqtni o'zgartiring..."
}
```

## Key Algorithms

### 1. Goal ETA Calculation Algorithm

**Purpose**: Predict when a goal will be achieved based on historical performance

**Formula**:
```
avgCompletion = Σ(dailyCompletionRate) / numberOfDays

performanceRatio = avgCompletion / 100

estimatedDays = ceil(targetDays / max(performanceRatio, 0.3))

progress = min((daysElapsed / estimatedDays) * 100, 100)
```

**Confidence Levels**:
- High: performanceRatio > 0.8 (80%+ completion)
- Medium: performanceRatio > 0.5 (50-80% completion)
- Low: performanceRatio ≤ 0.5 (<50% completion)

**Example**:
```
Target: 90 days
Days Elapsed: 15
Daily Completion Rates: [60%, 70%, 65%, 75%, 80%, 70%, 65%, 60%, 70%, 75%, 80%, 70%, 65%, 60%, 70%]
Average: 69.3%
Performance Ratio: 0.693
Estimated Days: ceil(90 / 0.693) = 130 days
Progress: (15 / 130) * 100 = 11.5%
Confidence: Medium
```

### 2. Streak Detection Algorithm

**Purpose**: Calculate consecutive days of completed habits

**Algorithm**:
```
streak = 0
for i from (history.length - 1) down to 0:
  if history[i].habits[habitId].status == 'done':
    streak++
  else:
    break
return streak
```

**Time Complexity**: O(n) where n = number of days in history
**Space Complexity**: O(1)

### 3. Habit Categorization Algorithm

**Purpose**: Automatically categorize habits for targeted recommendations

**Keywords Mapping**:
```javascript
fitness: ['workout', 'run', 'gym', 'exercise', 'sport', 'training', 'yoga']
learning: ['learn', 'read', 'study', 'language', 'course', 'practice']
health: ['sleep', 'water', 'diet', 'nutrition', 'meditation', 'health']
productivity: ['work', 'focus', 'project', 'task', 'code', 'write']
mindfulness: ['meditate', 'journal', 'reflect', 'mindful', 'breathing']
```

**Algorithm**:
```
for each category in HABIT_KEYWORDS:
  for each keyword in category.keywords:
    if habitText.toLowerCase().includes(keyword):
      return category
return 'productivity' // default
```

### 4. Recommendation Generation Algorithm

**Purpose**: Generate personalized recommendations after 7 days

**Conditions**:
1. Minimum 7 days of tracking required
2. Analyze all habits for performance
3. Identify weak habits (completion < 60%)
4. Identify missing habits for goals
5. Recognize strengths (completion > 80%)

**Weak Habit Recommendation**:
```
for each habit:
  analysis = analyzeHabitPerformance(habit)
  if analysis.completionRate < 60:
    category = categorizeHabit(habit.text)
    content = getRecommendedContent(category)
    advice = generateHabitAdvice(habit, analysis)
    add to recommendations
```

**Missing Habit Identification**:
```
for each goal:
  if goal.linkedHabits.length == 0:
    suggestions = suggestHabitsForGoal(goal)
    add to recommendations
```

### 5. Trend Analysis Algorithm

**Purpose**: Identify performance trends (improving/declining)

**Algorithm**:
```
recent7Days = history.slice(-7)
previous7Days = history.slice(-14, -7)

recentAvg = Σ(recent7Days.completionRate) / 7
previousAvg = Σ(previous7Days.completionRate) / 7

change = recentAvg - previousAvg

if change > 10:
  trend = 'improving'
else if change < -10:
  trend = 'declining'
else:
  trend = 'stable'
```

## Storage Schema

### LocalStorage Keys
```javascript
{
  'tracker_habits': JSON.stringify([...]),           // Current habits
  'tracker_daily_history': JSON.stringify([...]),    // 30-day history
  'tracker_goals': JSON.stringify([...]),            // Active goals
  'tracker_user_profile': JSON.stringify({...}),     // User settings
  'tracker_pass': 'passcode'                         // Password hash
}
```

### Storage Limits
- **Browser LocalStorage**: ~5-10MB per domain
- **Data Retention**: 30 days of daily snapshots
- **Automatic Cleanup**: Removes data older than 30 days

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Analytics rendered only when tab is viewed
2. **Memoization**: Chart.js instance reused and destroyed
3. **Batch Updates**: Daily snapshot recorded once per day
4. **Efficient Queries**: Direct array methods (filter, map, find)

### Time Complexities
- Add Habit: O(1)
- Update Status: O(n) where n = habits count
- Get Streaks: O(n*m) where n = habits, m = history days
- Generate Recommendations: O(n*m) where n = habits, m = history days
- Render Heatmap: O(m) where m = history days

### Space Complexities
- Habits Storage: O(n) where n = habits count
- Daily History: O(30*n) where n = average habits per day
- Goals Storage: O(g) where g = goals count

## Scalability & Extensibility

### Adding New Features

1. **New Recommendation Type**:
   - Add to `CONTENT_LIBRARY` in `ai-engine.js`
   - Create recommendation generation logic
   - Add rendering in `app.js`

2. **New Analytics Chart**:
   - Add data calculation in `ai-engine.js`
   - Create Chart.js instance in `app.js`
   - Add to analytics tab

3. **New Goal Type**:
   - Extend `Goal` object structure
   - Add specific ETA calculation logic
   - Update UI rendering

### Future Enhancements

1. **Cloud Sync**:
   - Add API endpoints
   - Implement conflict resolution
   - Add offline-first sync

2. **Advanced ML**:
   - Implement neural networks for better predictions
   - Add anomaly detection
   - Personalized recommendation engine

3. **Social Features**:
   - Leaderboards
   - Challenge sharing
   - Community recommendations

## Security Considerations

1. **Passcode**: Simple string comparison (can be upgraded to hashing)
2. **Data Privacy**: All data stored locally, no transmission
3. **XSS Prevention**: No eval() or innerHTML with user input
4. **CSRF**: Not applicable (no server communication)

## Testing Strategy

### Unit Tests
- Data Manager CRUD operations
- AI Engine calculations
- Streak detection algorithm

### Integration Tests
- Full habit creation to recommendation flow
- Data persistence across sessions
- Analytics generation

### E2E Tests
- User authentication
- Complete workflow (add habit → update status → view analytics)
- Data export functionality

## Deployment

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Requirements
- Modern browser with LocalStorage support
- JavaScript enabled
- Tailwind CSS CDN access
- Chart.js CDN access

### Deployment Steps
1. Host HTML file on web server
2. Ensure CDN access (Tailwind, Chart.js)
3. No backend required
4. All data stored locally in browser

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Status**: Production Ready
