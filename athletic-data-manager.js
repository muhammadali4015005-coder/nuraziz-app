/**
 * ATHLETIC DATA MANAGER
 * Manages dual-phase workout tracking, recovery data, and performance metrics
 */

class AthleticDataManager {
    constructor() {
        this.STORAGE_KEYS = {
            MORNING_EXERCISES: 'athletic_morning_exercises',
            EVENING_EXERCISES: 'athletic_evening_exercises',
            GOALS: 'athletic_goals',
            DAILY_HISTORY: 'athletic_daily_history',
            RECOVERY_DATA: 'athletic_recovery_data',
            USERS: 'athletic_users',
            CURRENT_USER: 'athletic_current_user'
        };
        
        this.init();
    }

    init() {
        // Initialize users storage
        if (!localStorage.getItem(this.STORAGE_KEYS.USERS)) {
            const defaultUsers = {
                '+998 90 123 45 67': {
                    phone: '+998 90 123 45 67',
                    pass: '1234',
                    createdAt: new Date().toISOString(),
                    data: {
                        morningExercises: [],
                        eveningExercises: [],
                        goals: [],
                        dailyHistory: [],
                        recoveryData: []
                    }
                }
            };
            localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
        }
    }

    // ============ USER MANAGEMENT ============
    registerUser(phone, pass) {
        const users = this.getAllUsers();
        
        if (users[phone]) {
            return { success: false, message: 'Bu raqam allaqachon ro\'yxatdan o\'tgan!' };
        }

        users[phone] = {
            phone: phone,
            pass: pass,
            createdAt: new Date().toISOString(),
            data: {
                morningExercises: [],
                eveningExercises: [],
                goals: [],
                dailyHistory: [],
                recoveryData: []
            }
        };

        localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));
        return { success: true, message: 'Akkaunt muvaffaqiyatli yaratildi!' };
    }

    loginUser(phone, pass) {
        const users = this.getAllUsers();
        const user = users[phone];

        if (!user) {
            return { success: false, message: 'Foydalanuvchi topilmadi!' };
        }

        if (user.pass !== pass) {
            return { success: false, message: 'Kod noto\'g\'ri!' };
        }

        localStorage.setItem(this.STORAGE_KEYS.CURRENT_USER, phone);
        return { success: true, message: 'Muvaffaqiyatli kirildi!', user: user };
    }

    logoutUser() {
        localStorage.removeItem(this.STORAGE_KEYS.CURRENT_USER);
    }

    getCurrentUser() {
        return localStorage.getItem(this.STORAGE_KEYS.CURRENT_USER);
    }

    getAllUsers() {
        const stored = localStorage.getItem(this.STORAGE_KEYS.USERS);
        return stored ? JSON.parse(stored) : {};
    }

    getUserData(phone) {
        const users = this.getAllUsers();
        return users[phone] ? users[phone].data : null;
    }

    saveUserData(phone, data) {
        const users = this.getAllUsers();
        if (users[phone]) {
            users[phone].data = data;
            localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));
        }
    }

    // ============ MORNING EXERCISES ============
    addMorningExercise(exerciseName, targetReps, actualReps, status) {
        const exercises = this.getMorningExercises();
        const today = this.getTodayDateString();
        
        const newExercise = {
            id: Date.now(),
            date: today,
            name: exerciseName,
            targetReps: parseInt(targetReps),
            actualReps: parseInt(actualReps),
            status: status, // 'completed', 'partial', 'missed'
            timestamp: new Date().toISOString()
        };

        exercises.push(newExercise);
        this.saveMorningExercises(exercises);
        this.recordDailySnapshot();
        return newExercise;
    }

    getMorningExercises() {
        const stored = localStorage.getItem(this.STORAGE_KEYS.MORNING_EXERCISES);
        return stored ? JSON.parse(stored) : [];
    }

    saveMorningExercises(exercises) {
        localStorage.setItem(this.STORAGE_KEYS.MORNING_EXERCISES, JSON.stringify(exercises));
    }

    deleteMorningExercise(exerciseId) {
        let exercises = this.getMorningExercises();
        exercises = exercises.filter(e => e.id !== exerciseId);
        this.saveMorningExercises(exercises);
        this.recordDailySnapshot();
    }

    // ============ EVENING EXERCISES ============
    addEveningExercise(name, weight, setsReps, actualReps, restSeconds, status) {
        const exercises = this.getEveningExercises();
        const today = this.getTodayDateString();

        const newExercise = {
            id: Date.now(),
            date: today,
            name: name,
            weight: parseFloat(weight),
            setsReps: setsReps, // e.g., "4x8"
            actualReps: parseInt(actualReps),
            restSeconds: parseInt(restSeconds),
            status: status,
            volume: parseFloat(weight) * parseInt(actualReps), // kg × reps
            timestamp: new Date().toISOString()
        };

        exercises.push(newExercise);
        this.saveEveningExercises(exercises);
        this.recordDailySnapshot();
        return newExercise;
    }

    getEveningExercises() {
        const stored = localStorage.getItem(this.STORAGE_KEYS.EVENING_EXERCISES);
        return stored ? JSON.parse(stored) : [];
    }

    saveEveningExercises(exercises) {
        localStorage.setItem(this.STORAGE_KEYS.EVENING_EXERCISES, JSON.stringify(exercises));
    }

    deleteEveningExercise(exerciseId) {
        let exercises = this.getEveningExercises();
        exercises = exercises.filter(e => e.id !== exerciseId);
        this.saveEveningExercises(exercises);
        this.recordDailySnapshot();
    }

    // ============ DAILY SNAPSHOT ============
    recordDailySnapshot() {
        const today = this.getTodayDateString();
        const history = this.getDailyHistory();

        let todaySnapshot = history.find(h => h.date === today);

        if (!todaySnapshot) {
            todaySnapshot = {
                date: today,
                morning: [],
                evening: [],
                totalMorningVolume: 0,
                totalEveningVolume: 0,
                morningCompletion: 0,
                eveningCompletion: 0,
                timestamp: new Date().toISOString()
            };
            history.push(todaySnapshot);
        }

        // Update morning data
        const morningExercises = this.getMorningExercises().filter(e => e.date === today);
        todaySnapshot.morning = morningExercises;
        todaySnapshot.totalMorningVolume = morningExercises.reduce((sum, e) => sum + e.actualReps, 0);
        
        if (morningExercises.length > 0) {
            const completed = morningExercises.filter(e => e.status === 'completed').length;
            todaySnapshot.morningCompletion = Math.round((completed / morningExercises.length) * 100);
        }

        // Update evening data
        const eveningExercises = this.getEveningExercises().filter(e => e.date === today);
        todaySnapshot.evening = eveningExercises;
        todaySnapshot.totalEveningVolume = eveningExercises.reduce((sum, e) => sum + e.volume, 0);
        
        if (eveningExercises.length > 0) {
            const completed = eveningExercises.filter(e => e.status === 'completed').length;
            todaySnapshot.eveningCompletion = Math.round((completed / eveningExercises.length) * 100);
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

    // ============ GOALS ============
    addGoal(title, type, targetValue, targetDate, description) {
        const goals = this.getGoals();

        const newGoal = {
            id: Date.now(),
            title: title,
            type: type, // 'reps', 'weight', 'volume', 'bodyweight'
            targetValue: parseFloat(targetValue),
            targetDate: targetDate,
            description: description,
            createdAt: new Date().toISOString(),
            status: 'active',
            currentValue: 0,
            progress: 0
        };

        goals.push(newGoal);
        this.saveGoals(goals);
        return newGoal;
    }

    getGoals() {
        const stored = localStorage.getItem(this.STORAGE_KEYS.GOALS);
        return stored ? JSON.parse(stored) : [];
    }

    saveGoals(goals) {
        localStorage.setItem(this.STORAGE_KEYS.GOALS, JSON.stringify(goals));
    }

    deleteGoal(goalId) {
        let goals = this.getGoals();
        goals = goals.filter(g => g.id !== goalId);
        this.saveGoals(goals);
    }

    updateGoalProgress(goalId, currentValue) {
        const goals = this.getGoals();
        const goal = goals.find(g => g.id === goalId);
        
        if (goal) {
            goal.currentValue = currentValue;
            goal.progress = Math.min((currentValue / goal.targetValue) * 100, 100);
            this.saveGoals(goals);
        }
    }

    // ============ RECOVERY DATA ============
    recordRecoveryData(daysSinceLastWorkout, sleepHours, muscleGroupsFatigued) {
        const recovery = this.getRecoveryData();
        const today = this.getTodayDateString();

        const recoveryRecord = {
            date: today,
            daysSinceLastWorkout: daysSinceLastWorkout,
            sleepHours: sleepHours,
            muscleGroupsFatigued: muscleGroupsFatigued,
            recoveryScore: this.calculateRecoveryScore(daysSinceLastWorkout, sleepHours),
            timestamp: new Date().toISOString()
        };

        recovery.push(recoveryRecord);
        localStorage.setItem(this.STORAGE_KEYS.RECOVERY_DATA, JSON.stringify(recovery));
    }

    getRecoveryData() {
        const stored = localStorage.getItem(this.STORAGE_KEYS.RECOVERY_DATA);
        return stored ? JSON.parse(stored) : [];
    }

    calculateRecoveryScore(daysSinceLastWorkout, sleepHours) {
        let score = 0;
        
        // Sleep component (0-50 points)
        if (sleepHours >= 8) score += 50;
        else if (sleepHours >= 7) score += 40;
        else if (sleepHours >= 6) score += 30;
        else score += 20;

        // Rest days component (0-50 points)
        if (daysSinceLastWorkout >= 2) score += 50;
        else if (daysSinceLastWorkout === 1) score += 30;
        else score += 10;

        return Math.round(score);
    }

    // ============ ANALYTICS ============
    getWeeklyVolume() {
        const history = this.getDailyHistory();
        const last7Days = history.slice(-7);

        return last7Days.map(day => ({
            date: day.date,
            morningVolume: day.totalMorningVolume,
            eveningVolume: day.totalEveningVolume,
            totalVolume: day.totalMorningVolume + day.totalEveningVolume
        }));
    }

    getTodayMetrics() {
        const today = this.getTodayDateString();
        const history = this.getDailyHistory();
        const todayData = history.find(h => h.date === today);

        if (!todayData) {
            return {
                totalExercises: 0,
                morningVolume: 0,
                eveningVolume: 0,
                morningCompletion: 0,
                eveningCompletion: 0
            };
        }

        return {
            totalExercises: todayData.morning.length + todayData.evening.length,
            morningVolume: todayData.totalMorningVolume,
            eveningVolume: todayData.totalEveningVolume,
            morningCompletion: todayData.morningCompletion,
            eveningCompletion: todayData.eveningCompletion
        };
    }

    getExerciseHistory(exerciseName) {
        const morningExercises = this.getMorningExercises();
        const eveningExercises = this.getEveningExercises();

        const morning = morningExercises.filter(e => e.name === exerciseName);
        const evening = eveningExercises.filter(e => e.name === exerciseName);

        return {
            morning: morning,
            evening: evening,
            allRecords: [...morning, ...evening].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        };
    }

    // ============ PASSWORD & PHONE ============
    setPassword(newPass) {
        localStorage.setItem(this.STORAGE_KEYS.PASS, newPass);
    }

    getPassword() {
        return localStorage.getItem(this.STORAGE_KEYS.PASS) || '1234';
    }

    setPhone(phone) {
        localStorage.setItem(this.STORAGE_KEYS.PHONE, phone);
    }

    getPhone() {
        return localStorage.getItem(this.STORAGE_KEYS.PHONE) || '+998 90 123 45 67';
    }

    setUserData(userData) {
        localStorage.setItem(this.STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    }

    getUserData() {
        const stored = localStorage.getItem(this.STORAGE_KEYS.USER_DATA);
        return stored ? JSON.parse(stored) : {
            phone: this.getPhone(),
            pass: this.getPassword(),
            createdAt: new Date().toISOString()
        };
    }

    // ============ DATA EXPORT ============
    exportAllData() {
        return {
            morningExercises: this.getMorningExercises(),
            eveningExercises: this.getEveningExercises(),
            goals: this.getGoals(),
            dailyHistory: this.getDailyHistory(),
            recoveryData: this.getRecoveryData(),
            exportDate: new Date().toLocaleString('uz-UZ')
        };
    }

    clearAllData() {
        localStorage.clear();
        this.init();
    }
}

// Global instance
const athleticDataManager = new AthleticDataManager();
