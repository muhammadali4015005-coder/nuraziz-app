/**
 * AI ENGINE - Advanced analytics, predictions, and recommendations
 * Features: Goal ETA prediction, Streak analysis, Personalized recommendations
 */

class AIEngine {
    constructor() {
        this.CONTENT_LIBRARY = {
            motivation: [
                { title: "The Power of Habit", type: "book", category: "motivation" },
                { title: "Atomic Habits", type: "book", category: "motivation" },
                { title: "Motivation Mastery Podcast", type: "podcast", category: "motivation" },
                { title: "How to Build Unstoppable Momentum", type: "article", category: "motivation" }
            ],
            fitness: [
                { title: "Morning Workout Routine", type: "article", category: "fitness" },
                { title: "Fitness Fundamentals", type: "podcast", category: "fitness" },
                { title: "Complete Fitness Guide", type: "book", category: "fitness" },
                { title: "Building Strength Daily", type: "article", category: "fitness" }
            ],
            learning: [
                { title: "Learning How to Learn", type: "book", category: "learning" },
                { title: "Language Learning Tips", type: "podcast", category: "learning" },
                { title: "Effective Study Techniques", type: "article", category: "learning" },
                { title: "Polyglot's Guide", type: "book", category: "learning" }
            ],
            productivity: [
                { title: "Deep Work", type: "book", category: "productivity" },
                { title: "Productivity Hacks", type: "podcast", category: "productivity" },
                { title: "Time Management Mastery", type: "article", category: "productivity" },
                { title: "Focus and Flow", type: "book", category: "productivity" }
            ],
            health: [
                { title: "Nutrition Basics", type: "article", category: "health" },
                { title: "Health Podcast Daily", type: "podcast", category: "health" },
                { title: "Wellness Guide", type: "book", category: "health" },
                { title: "Sleep Science", type: "article", category: "health" }
            ]
        };

        this.HABIT_KEYWORDS = {
            fitness: ['workout', 'run', 'gym', 'exercise', 'sport', 'training', 'yoga'],
            learning: ['learn', 'read', 'study', 'language', 'course', 'practice'],
            health: ['sleep', 'water', 'diet', 'nutrition', 'meditation', 'health'],
            productivity: ['work', 'focus', 'project', 'task', 'code', 'write'],
            mindfulness: ['meditate', 'journal', 'reflect', 'mindful', 'breathing']
        };
    }

    // ============ GOAL PROJECTION & ETA ============
    calculateGoalETA(goal) {
        const history = dataManager.getDailyHistory();
        
        if (history.length < 3) {
            return {
                eta: goal.targetDays,
                confidence: 'low',
                message: 'Yetarli ma\'lumot yo\'q. Iltimos, 3-5 kun kuting.'
            };
        }

        // Calculate average completion rate
        const avgCompletion = history.reduce((sum, day) => sum + day.completionRate, 0) / history.length;
        
        // Estimate days needed based on performance
        const performanceRatio = avgCompletion / 100;
        const estimatedDays = Math.ceil(goal.targetDays / Math.max(performanceRatio, 0.3));
        
        // Determine confidence level
        let confidence = 'low';
        if (performanceRatio > 0.8) confidence = 'high';
        else if (performanceRatio > 0.5) confidence = 'medium';

        // Calculate progress
        const daysElapsed = history.length;
        const progress = Math.min((daysElapsed / estimatedDays) * 100, 100);

        return {
            eta: estimatedDays,
            daysElapsed: daysElapsed,
            progress: Math.round(progress),
            confidence: confidence,
            avgCompletion: Math.round(avgCompletion),
            message: this.generateETAMessage(estimatedDays, goal.targetDays, confidence)
        };
    }

    generateETAMessage(estimated, target, confidence) {
        if (confidence === 'high') {
            return `✅ Siz maqsadga ${estimated} kundan keyin erishasiz!`;
        } else if (confidence === 'medium') {
            return `⚠️ Taxminiy ${estimated} kun kerak. Harakatni oshiring!`;
        } else {
            return `❌ Hozirgi tezlikda ${estimated} kun kerak. Odatlarni mustahkamlang!`;
        }
    }

    // ============ HABIT ANALYSIS ============
    analyzeHabitPerformance(habitId) {
        const history = dataManager.getDailyHistory();
        const completedDays = history.filter(day => {
            const habit = day.habits.find(h => h.id === habitId);
            return habit && habit.status === 'done';
        }).length;

        const totalDays = history.length;
        const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
        const streak = dataManager.getStreakForHabit(habitId);

        return {
            completionRate: Math.round(completionRate),
            completedDays: completedDays,
            totalDays: totalDays,
            streak: streak,
            status: this.getHabitStatus(completionRate)
        };
    }

    getHabitStatus(completionRate) {
        if (completionRate >= 80) return 'excellent';
        if (completionRate >= 60) return 'good';
        if (completionRate >= 40) return 'fair';
        return 'poor';
    }

    // ============ PERSONALIZED RECOMMENDATIONS ============
    generateRecommendations() {
        const history = dataManager.getDailyHistory();
        const daysActive = history.length;

        // Only generate recommendations after 7 days
        if (daysActive < 7) {
            return {
                ready: false,
                message: `${7 - daysActive} kundan keyin tavsiyalar paydo bo'ladi...`
            };
        }

        const habits = dataManager.getHabits();
        const goals = dataManager.getGoals();
        const recommendations = [];

        // Analyze weak habits
        habits.forEach(habit => {
            const analysis = this.analyzeHabitPerformance(habit.id);
            
            if (analysis.status === 'poor' || analysis.status === 'fair') {
                const category = this.categorizeHabit(habit.text);
                const content = this.getRecommendedContent(category, analysis.status);
                
                recommendations.push({
                    type: 'weak_habit',
                    habitText: habit.text,
                    completionRate: analysis.completionRate,
                    content: content,
                    advice: this.generateHabitAdvice(habit.text, analysis)
                });
            }
        });

        // Identify missing habits for goals
        goals.forEach(goal => {
            if (goal.linkedHabits.length === 0) {
                recommendations.push({
                    type: 'missing_habits',
                    goalTitle: goal.title,
                    suggestion: `"${goal.title}" maqsadi uchun yangi odatlar qo'shing!`,
                    suggestedHabits: this.suggestHabitsForGoal(goal)
                });
            }
        });

        // Identify strengths
        const strongHabits = habits.filter(h => {
            const analysis = this.analyzeHabitPerformance(h.id);
            return analysis.status === 'excellent';
        });

        if (strongHabits.length > 0) {
            recommendations.push({
                type: 'strength',
                message: `🌟 Siz ${strongHabits.length} ta odatda juda yaxshi! Davom eting!`,
                habits: strongHabits.map(h => h.text)
            });
        }

        return {
            ready: true,
            recommendations: recommendations,
            totalRecommendations: recommendations.length
        };
    }

    categorizeHabit(habitText) {
        const text = habitText.toLowerCase();
        
        for (const [category, keywords] of Object.entries(this.HABIT_KEYWORDS)) {
            if (keywords.some(keyword => text.includes(keyword))) {
                return category;
            }
        }
        
        return 'productivity';
    }

    getRecommendedContent(category, status) {
        const categoryContent = this.CONTENT_LIBRARY[category] || this.CONTENT_LIBRARY.motivation;
        
        // Return top 2 recommendations
        return categoryContent.slice(0, 2);
    }

    generateHabitAdvice(habitText, analysis) {
        const streak = analysis.streak;
        const rate = analysis.completionRate;

        if (streak === 0) {
            return `"${habitText}" odatini boshlab ko'ring. Birinchi qadam eng muhimi!`;
        } else if (rate < 30) {
            return `"${habitText}" uchun vaqtni o'zgartiring yoki osonroq qiling.`;
        } else if (rate < 60) {
            return `"${habitText}" ni mustahkamlash uchun yana bir oz harakat qiling.`;
        } else {
            return `"${habitText}" da yaxshi progres! Davom eting!`;
        }
    }

    suggestHabitsForGoal(goal) {
        const keywords = goal.title.toLowerCase();
        const suggestions = [];

        if (keywords.includes('run') || keywords.includes('fitness')) {
            suggestions.push('Har kuni 30 minut yugurish');
            suggestions.push('Stretching va warm-up');
        } else if (keywords.includes('learn') || keywords.includes('language')) {
            suggestions.push('Har kuni 30 minut o\'qish');
            suggestions.push('Yangi so\'zlar o\'rganish');
        } else if (keywords.includes('read')) {
            suggestions.push('Har kuni 20 sahifa o\'qish');
            suggestions.push('Kitob haqida qayd olish');
        } else {
            suggestions.push('Har kuni 30 minut vaqt ajrating');
            suggestions.push('Maqsadga yo\'naltirilgan amaliyot');
        }

        return suggestions;
    }

    // ============ TREND ANALYSIS ============
    getTrendAnalysis() {
        const history = dataManager.getDailyHistory();
        
        if (history.length < 2) {
            return { trend: 'insufficient_data', message: 'Yetarli ma\'lumot yo\'q' };
        }

        const recent = history.slice(-7);
        const previous = history.slice(-14, -7);

        const recentAvg = recent.reduce((sum, day) => sum + day.completionRate, 0) / recent.length;
        const previousAvg = previous.length > 0 
            ? previous.reduce((sum, day) => sum + day.completionRate, 0) / previous.length 
            : recentAvg;

        const change = recentAvg - previousAvg;
        let trend = 'stable';
        let message = '📊 Samaradorlik o\'zgarishsiz';

        if (change > 10) {
            trend = 'improving';
            message = '📈 Siz yaxshilanmoqdasiz!';
        } else if (change < -10) {
            trend = 'declining';
            message = '📉 Ehtiyot! Samaradorlik kamaymoqda.';
        }

        return {
            trend: trend,
            message: message,
            change: Math.round(change),
            recentAvg: Math.round(recentAvg),
            previousAvg: Math.round(previousAvg)
        };
    }

    // ============ WEEKLY CHART DATA ============
    getWeeklyChartData() {
        const weeklyStats = dataManager.getWeeklyStats();
        
        return {
            labels: weeklyStats.map(day => {
                const date = new Date(day.date);
                return date.toLocaleDateString('uz-UZ', { weekday: 'short', month: 'short', day: 'numeric' });
            }),
            data: weeklyStats.map(day => day.completionRate)
        };
    }
}

// Global instance
const aiEngine = new AIEngine();
