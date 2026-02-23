/**
 * ATHLETIC DATA MANAGER V2
 * Multi-user support with registration and login
 */

class AthleticDataManager {
    constructor() {
        this.STORAGE_KEYS = {
            USERS: 'athletic_users',
            CURRENT_USER: 'athletic_current_user'
        };
        
        this.init();
    }

    init() {
        // Initialize users storage with default user
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
        const currentUser = this.getCurrentUser();
        const users = this.getAllUsers();
        const userData = users[currentUser].data;
        
        const today = this.getTodayDateString();
        
        const newExercise = {
            id: Date.now(),
            date: today,
            name: exerciseName,
            targetReps: parseInt(targetReps),
            actualReps: parseInt(actualReps),
            status: status,
            timestamp: new Date().toISOString()
        };

        userData.morningExercises.push(newExercise);
        this.saveUserData(currentUser, userData);
        this.recordDailySnapshot();
        return newExercise;
    }

    getMorningExercises() {
        const currentUser = this.getCurrentUser();
        const users = this.getAllUsers();
        return users[currentUser] ? users[currentUser].data.morningExercises : [];
    }

    deleteMorningExercise(exerciseId) {
        const currentUser = this.getCurrentUser();
        const users = this.getAllUsers();
        let exercises = users[currentUser].data.morningExercises;
        exercises = exercises.filter(e => e.id !== exerciseId);
        users[currentUser].data.morningExercises = exercises;
        this.saveUserData(currentUser, users[currentUser].data);
        this.recordDailySnapshot();
    }

    // ============ EVENING EXERCISES ============
    addEveningExercise(name, weight, setsReps, actualReps, restSeconds, status) {
        const currentUser = this.getCurrentUser();
        const users = this.getAllUsers();
        const userData = users[currentUser].data;
        const today = this.getTodayDateString();

        const newExercise = {
            id: Date.now(),
            date: today,
            name: name,
            weight: parseFloat(weight),
            setsReps: setsReps,
            actualReps: parseInt(actualReps),
            restSeconds: parseInt(restSeconds),
            status: status,
            volume: parseFloat(weight) * parseInt(actualReps),
            timestamp: new Date().toISOString()
        };

        userData.eveningExercises.push(newExercise);
        this.saveUserData(currentUser, userData);
        this.recordDailySnapshot();
        return newExercise;
    }

    getEveningExercises() {
        const currentUser = this.getCurrentUser();
        const users = this.getAllUsers();
        return users[currentUser] ? users[currentUser].data.eveningExercises : [];
    }

    deleteEveningExercise(exerciseId) {
        const currentUser = this.getCurrentUser();
        const users = this.getAllUsers();
        let exercises = users[currentUser].data.eveningExercises;
        exercises = exercises.filter(e => e.id !== exerciseId);
        users[currentUser].data.eveningExercises = exercises;
        this.saveUserData(currentUser, users[currentUser].data);
        this.recordDailySnapshot();
    }

    // ============ DAILY SNAPSHOT ============
    recordDailySnapshot() {
        const currentUser = this.getCurrentUser();
        const users = this.getAllUsers();
        const userData = users[currentUser].data;
        const today = this.getTodayDateString();

        let todaySnapshot = userData.dailyHistory.find(h => h.date === today);

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
            userData.dailyHistory.push(todaySnapshot);
        }

        const morningExercises = userData.morningExercises.filter(e => e.date === today);
        todaySnapshot.morning = morningExercises;
        todaySnapshot.totalMorningVolume = morningExercises.reduce((sum, e) => sum + e.actualReps, 0);
        
        if (morningExercises.length > 0) {
            const completed = morningExercises.filter(e => e.status === 'completed').length;
            todaySnapshot.morningCompletion = Math.round((completed / morningExercises.length) * 100);
        }

        const eveningExercises = userData.eveningExercises.filter(e => e.date === today);
        todaySnapshot.evening = eveningExercises;
        todaySnapshot.totalEveningVolume = eveningExercises.reduce((sum, e) => sum + e.volume, 0);
        
        if (eveningExercises.length > 0) {
            const completed = eveningExercises.filter(e => e.status === 'completed').length;
            todaySnapshot.eveningCompletion = Math.round((completed / eveningExercises.length) * 100);
        }

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        userData.dailyHistory = userData.dailyHistory.filter(h => new Date(h.date) >= thirtyDaysAgo);

        this.saveUserData(currentUser, userData);
    }

    getDailyHistory() {
        const currentUser = this.getCurrentUser();
        const users = this.getAllUsers();
        return users[currentUser] ? users[currentUser].data.dailyHistory : [];
    }

    getTodayDateString() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    // ============ GOALS ============
    addGoal(title, type, targetValue, targetDate, description) {
        const currentUser = this.getCurrentUser();
        const users = this.getAllUsers();
        const userData = users[currentUser].data;

        const newGoal = {
            id: Date.now(),
            title: title,
            type: type,
            targetValue: parseFloat(targetValue),
            targetDate: targetDate,
            description: description,
            createdAt: new Date().toISOString(),
            status: 'active',
            currentValue: 0,
            progress: 0
        };

        userData.goals.push(newGoal);
        this.saveUserData(currentUser, userData);
        return newGoal;
    }

    getGoals() {
        const currentUser = this.getCurrentUser();
        const users = this.getAllUsers();
        return users[currentUser] ? users[currentUser].data.goals : [];
    }

    deleteGoal(goalId) {
        const currentUser = this.getCurrentUser();
        const users = this.getAllUsers();
        let goals = users[currentUser].data.goals;
        goals = goals.filter(g => g.id !== goalId);
        users[currentUser].data.goals = goals;
        this.saveUserData(currentUser, users[currentUser].data);
    }

    updateGoalProgress(goalId, currentValue) {
        const currentUser = this.getCurrentUser();
        const users = this.getAllUsers();
        const userData = users[currentUser].data;
        const goal = userData.goals.find(g => g.id === goalId);
        
        if (goal) {
            goal.currentValue = currentValue;
            goal.progress = Math.min((currentValue / goal.targetValue) * 100, 100);
            this.saveUserData(currentUser, userData);
        }
    }

    // ============ RECOVERY DATA ============
    recordRecoveryData(daysSinceLastWorkout, sleepHours, muscleGroupsFatigued) {
        const currentUser = this.getCurrentUser();
        const users = this.getAllUsers();
        const userData = users[currentUser].data;
        const today = this.getTodayDateString();

        const recoveryRecord = {
            date: today,
            daysSinceLastWorkout: daysSinceLastWorkout,
            sleepHours: sleepHours,
            muscleGroupsFatigued: muscleGroupsFatigued,
            recoveryScore: this.calculateRecoveryScore(daysSinceLastWorkout, sleepHours),
            timestamp: new Date().toISOString()
        };

        userData.recoveryData.push(recoveryRecord);
        this.saveUserData(currentUser, userData);
    }

    getRecoveryData() {
        const currentUser = this.getCurrentUser();
        const users = this.getAllUsers();
        return users[currentUser] ? users[currentUser].data.recoveryData : [];
    }

    calculateRecoveryScore(daysSinceLastWorkout, sleepHours) {
        let score = 0;
        
        if (sleepHours >= 8) score += 50;
        else if (sleepHours >= 7) score += 40;
        else if (sleepHours >= 6) score += 30;
        else score += 20;

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

    // ============ DATA EXPORT ============
    exportAllData() {
        const currentUser = this.getCurrentUser();
        const users = this.getAllUsers();
        const userData = users[currentUser];

        return {
            phone: userData.phone,
            morningExercises: userData.data.morningExercises,
            eveningExercises: userData.data.eveningExercises,
            goals: userData.data.goals,
            dailyHistory: userData.data.dailyHistory,
            recoveryData: userData.data.recoveryData,
            exportDate: new Date().toLocaleString('uz-UZ')
        };
    }

    clearAllData() {
        const currentUser = this.getCurrentUser();
        const users = this.getAllUsers();
        
        users[currentUser].data = {
            morningExercises: [],
            eveningExercises: [],
            goals: [],
            dailyHistory: [],
            recoveryData: []
        };

        localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));
    }
}

// Global instance
const athleticDataManager = new AthleticDataManager();
