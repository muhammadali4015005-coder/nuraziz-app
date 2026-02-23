/**
 * DATA MANAGER - Handles all data persistence and historical tracking
 * Stores: Daily snapshots, Goals, User profile, Historical data (30 days)
 */

class DataManager {
    constructor() {
        this.STORAGE_KEYS = {
            HABITS: 'tracker_habits',
            DAILY_HISTORY: 'tracker_daily_history',
            GOALS: 'tracker_goals',
            USER_PROFILE: 'tracker_user_profile',
            PASS: 'tracker_pass'
        };
        
        this.init();
    }

    init() {
        // Initialize storage if empty
        if (!localStorage.getItem(this.STORAGE_KEYS.DAILY_HISTORY)) {
            localStorage.setItem(this.STORAGE_KEYS.DAILY_HISTORY, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.GOALS)) {
            localStorage.setItem(this.STORAGE_KEYS.GOALS, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.HABITS)) {
            localStorage.setItem(this.STORAGE_KEYS.HABITS, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.STORAGE_KEYS.PASS)) {
            localStorage.setItem(this.STORAGE_KEYS.PASS, '1234');
        }
    }

    // ============ HABIT MANAGEMENT ============
    addHabit(text) {
        const habits = this.getHabits();
        const newHabit = {
            id: Date.now(),
            text: text.trim(),
            status: 'pending',
            createdAt: new Date().toISOString(),
            linkedGoals: []
        };
        habits.push(newHabit);
        this.saveHabits(habits);
        return newHabit;
    }

    updateHabitStatus(habitId, status) {
        const habits = this.getHabits();
        const habit = habits.find(h => h.id === habitId);
        if (habit) {
            habit.status = status;
            this.saveHabits(habits);
            this.recordDailySnapshot(); // Record the change
        }
    }

    deleteHabit(habitId) {
        let habits = this.getHabits();
        habits = habits.filter(h => h.id !== habitId);
        this.saveHabits(habits);
    }

    getHabits() {
        const stored = localStorage.getItem(this.STORAGE_KEYS.HABITS);
        return stored ? JSON.parse(stored) : [];
    }

    saveHabits(habits) {
        localStorage.setItem(this.STORAGE_KEYS.HABITS, JSON.stringify(habits));
    }

    // ============ DAILY SNAPSHOT RECORDING ============
    recordDailySnapshot() {
        const today = this.getTodayDateString();
        const history = this.getDailyHistory();
        
        // Check if today's snapshot already exists
        let todaySnapshot = history.find(h => h.date === today);
        
        if (!todaySnapshot) {
            todaySnapshot = {
                date: today,
                habits: [],
                completionRate: 0,
                timestamp: new Date().toISOString()
            };
            history.push(todaySnapshot);
        }

        // Update today's snapshot with current habits
        const habits = this.getHabits();
        todaySnapshot.habits = habits.map(h => ({
            id: h.id,
            text: h.text,
            status: h.status
        }));

        // Calculate completion rate
        if (habits.length > 0) {
            const completed = habits.filter(h => h.status === 'done').length;
            todaySnapshot.completionRate = Math.round((completed / habits.length) * 100);
        }

        // Keep only last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const filteredHistory = history.filter(h => new Date(h.date) >= thirtyDaysAgo);

        localStorage.setItem(this.STORAGE_KEYS.DAILY_HISTORY, JSON.stringify(filteredHistory));
    }

    getDailyHistory() {
        const stored = localStorage.getItem(this.STORAGE_KEYS.DAILY_HISTORY);
        return stored ? JSON.parse(stored) : [];
    }

    getTodayDateString() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    // ============ GOAL MANAGEMENT ============
    addGoal(title, description, targetDays) {
        const goals = this.getGoals();
        const newGoal = {
            id: Date.now(),
            title: title.trim(),
            description: description.trim(),
            targetDays: parseInt(targetDays),
            createdAt: new Date().toISOString(),
            linkedHabits: [],
            status: 'active', // active, completed, abandoned
            progress: 0
        };
        goals.push(newGoal);
        this.saveGoals(goals);
        return newGoal;
    }

    updateGoal(goalId, updates) {
        const goals = this.getGoals();
        const goal = goals.find(g => g.id === goalId);
        if (goal) {
            Object.assign(goal, updates);
            this.saveGoals(goals);
        }
    }

    deleteGoal(goalId) {
        let goals = this.getGoals();
        goals = goals.filter(g => g.id !== goalId);
        this.saveGoals(goals);
    }

    getGoals() {
        const stored = localStorage.getItem(this.STORAGE_KEYS.GOALS);
        return stored ? JSON.parse(stored) : [];
    }

    saveGoals(goals) {
        localStorage.setItem(this.STORAGE_KEYS.GOALS, JSON.stringify(goals));
    }

    linkHabitToGoal(habitId, goalId) {
        const goals = this.getGoals();
        const goal = goals.find(g => g.id === goalId);
        if (goal && !goal.linkedHabits.includes(habitId)) {
            goal.linkedHabits.push(habitId);
            this.saveGoals(goals);
        }
    }

    // ============ ANALYTICS ============
    getWeeklyStats() {
        const history = this.getDailyHistory();
        const last7Days = history.slice(-7);
        
        return last7Days.map(day => ({
            date: day.date,
            completionRate: day.completionRate,
            totalHabits: day.habits.length,
            completedHabits: day.habits.filter(h => h.status === 'done').length
        }));
    }

    getStreakForHabit(habitId) {
        const history = this.getDailyHistory();
        let streak = 0;
        
        // Start from today and go backwards
        for (let i = history.length - 1; i >= 0; i--) {
            const daySnapshot = history[i];
            const habit = daySnapshot.habits.find(h => h.id === habitId);
            
            if (habit && habit.status === 'done') {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    getAllStreaks() {
        const habits = this.getHabits();
        const streaks = {};
        
        habits.forEach(habit => {
            streaks[habit.id] = {
                habitText: habit.text,
                streak: this.getStreakForHabit(habit.id)
            };
        });
        
        return streaks;
    }

    getHeatmapData() {
        const history = this.getDailyHistory();
        const heatmap = {};
        
        history.forEach(day => {
            heatmap[day.date] = day.completionRate;
        });
        
        return heatmap;
    }

    // ============ PASSWORD MANAGEMENT ============
    setPassword(newPass) {
        localStorage.setItem(this.STORAGE_KEYS.PASS, newPass);
    }

    getPassword() {
        return localStorage.getItem(this.STORAGE_KEYS.PASS) || '1234';
    }

    // ============ DATA EXPORT ============
    exportAllData() {
        return {
            habits: this.getHabits(),
            goals: this.getGoals(),
            dailyHistory: this.getDailyHistory(),
            exportDate: new Date().toLocaleString('uz-UZ')
        };
    }

    clearAllData() {
        localStorage.clear();
        this.init();
    }

    // ============ UTILITY ============
    getDaysActive() {
        const history = this.getDailyHistory();
        return history.length;
    }

    getTodayCompletion() {
        const today = this.getTodayDateString();
        const history = this.getDailyHistory();
        const todayData = history.find(h => h.date === today);
        return todayData ? todayData.completionRate : 0;
    }
}

// Global instance
const dataManager = new DataManager();
