/**
 * ADVANCED ATHLETIC AI ENGINE - PRINCIPAL LEVEL
 * 
 * Features:
 * - 30-day historical tracking with daily snapshots
 * - Advanced ETA prediction with confidence scoring
 * - Recovery optimization algorithm
 * - Sequence refinement based on failure patterns
 * - Personalized recommendations
 * - Performance trend analysis
 * - Missing link identification
 */

class AdvancedAthleticAIEngine {
    constructor() {
        this.performanceThreshold = 0.7; // 70% success rate
        this.recoveryWeight = 0.3;
        this.performanceWeight = 0.7;
    }

    /**
     * Calculate ETA for goal achievement using linear regression
     * with performance curve detection
     */
    calculateETA(exerciseHistory, targetReps, currentReps) {
        if (!exerciseHistory || exerciseHistory.length < 2) {
            return { days: 30, confidence: 0.3, curve: 'insufficient_data' };
        }

        // Extract performance data
        const data = exerciseHistory.map((entry, idx) => ({
            day: idx,
            reps: entry.reps || 0,
            status: entry.status
        }));

        // Calculate linear regression
        const regression = this.linearRegression(data);
        const { slope, intercept, r2 } = regression;

        // Detect performance curve
        const curve = this.detectPerformanceCurve(data);

        // Calculate days to target
        let daysToTarget = 30;
        if (slope !== 0) {
            daysToTarget = Math.ceil((targetReps - currentReps) / slope);
            daysToTarget = Math.max(1, Math.min(daysToTarget, 90)); // 1-90 days
        }

        // Calculate confidence based on R² value
        const confidence = Math.min(r2, 1);

        return {
            days: daysToTarget,
            confidence: confidence,
            curve: curve,
            slope: slope,
            r2: r2
        };
    }

    /**
     * Linear regression calculation
     */
    linearRegression(data) {
        const n = data.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

        data.forEach(point => {
            sumX += point.day;
            sumY += point.reps;
            sumXY += point.day * point.reps;
            sumX2 += point.day * point.day;
            sumY2 += point.reps * point.reps;
        });

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Calculate R² (coefficient of determination)
        const meanY = sumY / n;
        const ssTotal = data.reduce((sum, p) => sum + Math.pow(p.reps - meanY, 2), 0);
        const ssRes = data.reduce((sum, p) => {
            const predicted = slope * p.day + intercept;
            return sum + Math.pow(p.reps - predicted, 2);
        }, 0);

        const r2 = ssTotal === 0 ? 0 : 1 - (ssRes / ssTotal);

        return { slope, intercept, r2 };
    }

    /**
     * Detect performance curve type
     */
    detectPerformanceCurve(data) {
        if (data.length < 3) return 'insufficient_data';

        const firstThird = data.slice(0, Math.ceil(data.length / 3));
        const lastThird = data.slice(-Math.ceil(data.length / 3));

        const firstAvg = firstThird.reduce((sum, p) => sum + p.reps, 0) / firstThird.length;
        const lastAvg = lastThird.reduce((sum, p) => sum + p.reps, 0) / lastThird.length;

        const improvement = lastAvg - firstAvg;
        const improvementRate = improvement / firstAvg;

        if (improvementRate > 0.15) return 'accelerating';
        if (improvementRate < -0.15) return 'decelerating';
        return 'plateauing';
    }

    /**
     * Calculate recovery score (0-100)
     */
    calculateRecoveryScore(sleepHours, daysSinceLastWorkout, restDays) {
        let score = 0;

        // Sleep component (0-50 points)
        if (sleepHours >= 8) score += 50;
        else if (sleepHours >= 7) score += 40;
        else if (sleepHours >= 6) score += 30;
        else if (sleepHours >= 5) score += 15;
        else score += 5;

        // Rest component (0-50 points)
        if (daysSinceLastWorkout >= 2) score += 50;
        else if (daysSinceLastWorkout === 1) score += 30;
        else score += 10;

        // Rest days bonus (0-10 points)
        if (restDays >= 2) score += 10;
        else if (restDays === 1) score += 5;

        return Math.min(score, 100);
    }

    /**
     * Analyze failure patterns by muscle group
     */
    analyzeFailurePatterns(exerciseData) {
        const patterns = {};

        exerciseData.forEach(exercise => {
            const muscleGroup = exercise.muscleGroup || 'unknown';
            if (!patterns[muscleGroup]) {
                patterns[muscleGroup] = {
                    total: 0,
                    failed: 0,
                    partial: 0,
                    completed: 0
                };
            }

            patterns[muscleGroup].total++;
            if (exercise.status === 'missed') patterns[muscleGroup].failed++;
            else if (exercise.status === 'partial') patterns[muscleGroup].partial++;
            else if (exercise.status === 'completed') patterns[muscleGroup].completed++;
        });

        // Calculate failure rates
        const analysis = {};
        Object.keys(patterns).forEach(group => {
            const p = patterns[group];
            analysis[group] = {
                failureRate: p.failed / p.total,
                partialRate: p.partial / p.total,
                successRate: p.completed / p.total,
                total: p.total
            };
        });

        return analysis;
    }

    /**
     * Suggest sequence optimization based on failure patterns
     */
    suggestSequenceOptimization(failureAnalysis) {
        const suggestions = [];

        Object.keys(failureAnalysis).forEach(group => {
            const analysis = failureAnalysis[group];
            if (analysis.failureRate > 0.3) {
                suggestions.push({
                    muscleGroup: group,
                    issue: 'high_failure_rate',
                    recommendation: `${group} uchun bajarilish darajasi past. Mashqni kunning boshida qo'ying yoki oraliq qo'shing.`,
                    priority: 'high'
                });
            }
            if (analysis.partialRate > 0.4) {
                suggestions.push({
                    muscleGroup: group,
                    issue: 'high_partial_rate',
                    recommendation: `${group} uchun qisman bajarilish ko'p. Maqsadni kamaytiring yoki mashq vaqtini oshiring.`,
                    priority: 'medium'
                });
            }
        });

        return suggestions.sort((a, b) => {
            const priorityMap = { high: 1, medium: 2, low: 3 };
            return priorityMap[a.priority] - priorityMap[b.priority];
        });
    }

    /**
     * Identify missing links in training
     */
    identifyMissingLinks(exerciseData, goals) {
        const missingLinks = [];
        const exercisedMuscles = new Set(exerciseData.map(e => e.muscleGroup));

        // Check for mobility work
        if (!exercisedMuscles.has('mobility')) {
            missingLinks.push({
                type: 'mobility',
                description: 'Mobillik mashqlari yo\'q',
                recommendation: 'Har kuni 10-15 minut mobillik mashqlari qo\'shing',
                priority: 'high'
            });
        }

        // Check for cardio
        if (!exercisedMuscles.has('cardio')) {
            missingLinks.push({
                type: 'cardio',
                description: 'Kardio mashqlari yo\'q',
                recommendation: 'Haftada 2-3 marta kardio mashqlari qo\'shing',
                priority: 'medium'
            });
        }

        // Check for core work
        if (!exercisedMuscles.has('core')) {
            missingLinks.push({
                type: 'core',
                description: 'Yadro mashqlari yo\'q',
                recommendation: 'Har kuni 5-10 minut yadro mashqlari qo\'shing',
                priority: 'high'
            });
        }

        return missingLinks;
    }

    /**
     * Generate personalized recommendations
     */
    generateRecommendations(userData, exerciseData, goals) {
        const recommendations = [];

        // Recovery-based recommendations
        const recoveryScore = userData.recoveryScore || 50;
        if (recoveryScore < 40) {
            recommendations.push({
                category: 'recovery',
                text: 'Uyqu va dam olish vaqtini oshiring',
                priority: 'high'
            });
        }

        // Performance-based recommendations
        const successRate = this.calculateSuccessRate(exerciseData);
        if (successRate < 0.6) {
            recommendations.push({
                category: 'performance',
                text: 'Maqsadlarni kamaytiring va asta-sekin oshiring',
                priority: 'high'
            });
        }

        // Variety recommendations
        const uniqueExercises = new Set(exerciseData.map(e => e.name)).size;
        if (uniqueExercises < 5) {
            recommendations.push({
                category: 'variety',
                text: 'Ko\'proq turli xil mashqlar qo\'shing',
                priority: 'medium'
            });
        }

        return recommendations;
    }

    /**
     * Calculate overall success rate
     */
    calculateSuccessRate(exerciseData) {
        if (exerciseData.length === 0) return 0;
        const completed = exerciseData.filter(e => e.status === 'completed').length;
        return completed / exerciseData.length;
    }

    /**
     * Analyze 30-day trend
     */
    analyze30DayTrend(dailySnapshots) {
        if (!dailySnapshots || dailySnapshots.length === 0) {
            return { trend: 'no_data', improvement: 0 };
        }

        const firstWeek = dailySnapshots.slice(0, 7);
        const lastWeek = dailySnapshots.slice(-7);

        const firstWeekAvg = firstWeek.reduce((sum, s) => sum + (s.successRate || 0), 0) / firstWeek.length;
        const lastWeekAvg = lastWeek.reduce((sum, s) => sum + (s.successRate || 0), 0) / lastWeek.length;

        const improvement = lastWeekAvg - firstWeekAvg;
        const improvementPercent = (improvement / firstWeekAvg) * 100;

        let trend = 'stable';
        if (improvementPercent > 10) trend = 'improving';
        else if (improvementPercent < -10) trend = 'declining';

        return {
            trend: trend,
            improvement: improvementPercent,
            firstWeekAvg: firstWeekAvg,
            lastWeekAvg: lastWeekAvg
        };
    }

    /**
     * Calculate streak
     */
    calculateStreak(exerciseData) {
        if (exerciseData.length === 0) return 0;

        let streak = 0;
        for (let i = exerciseData.length - 1; i >= 0; i--) {
            if (exerciseData[i].status === 'completed') {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    /**
     * Predict next week performance
     */
    predictNextWeekPerformance(exerciseHistory, currentTrend) {
        const baseSuccessRate = this.calculateSuccessRate(exerciseHistory);
        const trendMultiplier = currentTrend === 'improving' ? 1.05 : (currentTrend === 'declining' ? 0.95 : 1);

        const predictedSuccessRate = Math.min(baseSuccessRate * trendMultiplier, 1);

        return {
            predictedSuccessRate: predictedSuccessRate,
            predictedCompletions: Math.round(predictedSuccessRate * 7),
            confidence: Math.min(exerciseHistory.length / 30, 1)
        };
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedAthleticAIEngine;
}
