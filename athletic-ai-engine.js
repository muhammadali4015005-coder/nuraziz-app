/**
 * ATHLETIC AI ENGINE
 * ETA Prediction, Recovery Optimization, Sequence Refinement, Personalized Coaching
 */

class AthleticAIEngine {
    constructor() {
        this.CONTENT_LIBRARY = {
            mobility: [
                { title: "Mobility Mastery", type: "book", category: "mobility" },
                { title: "Flexibility & Range", type: "podcast", category: "mobility" },
                { title: "Pre-workout Mobility Routine", type: "video", category: "mobility" }
            ],
            strength: [
                { title: "Starting Strength", type: "book", category: "strength" },
                { title: "Strength Training Podcast", type: "podcast", category: "strength" },
                { title: "Progressive Overload Guide", type: "video", category: "strength" }
            ],
            endurance: [
                { title: "Endurance Training", type: "book", category: "endurance" },
                { title: "Cardio & Conditioning", type: "podcast", category: "endurance" },
                { title: "Building Aerobic Capacity", type: "video", category: "endurance" }
            ],
            recovery: [
                { title: "Recovery Protocols", type: "book", category: "recovery" },
                { title: "Sleep & Performance", type: "podcast", category: "recovery" },
                { title: "Active Recovery Methods", type: "video", category: "recovery" }
            ],
            nutrition: [
                { title: "Sports Nutrition", type: "book", category: "nutrition" },
                { title: "Nutrition for Athletes", type: "podcast", category: "nutrition" },
                { title: "Meal Planning Guide", type: "video", category: "nutrition" }
            ]
        };

        this.EXERCISE_CATEGORIES = {
            'Pull-ups': 'back',
            'Dips': 'chest',
            'Push-ups': 'chest',
            'Sit-ups': 'core',
            'Squats': 'legs',
            '10m Running': 'cardio'
        };
    }

    // ============ ETA CALCULATION ALGORITHM ============
    /**
     * CORE ALGORITHM: Goal Achievement ETA Prediction
     * 
     * Uses linear and non-linear regression based on 7-14 days of historical data
     * 
     * Formula:
     * 1. Calculate daily progress rate
     * 2. Apply performance curve (non-linear adjustment)
     * 3. Estimate days to target
     * 4. Calculate confidence percentage
     */
    calculateGoalETA(goal) {
        const history = athleticDataManager.getDailyHistory();
        
        if (history.length < 3) {
            return {
                eta: null,
                daysToTarget: null,
                confidence: 0,
                message: 'Need 3+ days of data for prediction',
                status: 'insufficient_data'
            };
        }

        // Get relevant exercise history based on goal type
        const relevantData = this.getRelevantHistoryForGoal(goal);
        
        if (relevantData.length < 3) {
            return {
                eta: null,
                daysToTarget: null,
                confidence: 0,
                message: 'Need more data for this goal type',
                status: 'insufficient_data'
            };
        }

        // Calculate linear regression
        const regression = this.linearRegression(relevantData);
        
        // Calculate non-linear adjustment (performance curve)
        const performanceCurve = this.calculatePerformanceCurve(relevantData);
        
        // Estimate days to target
        const daysToTarget = this.estimateDaysToTarget(
            regression.slope,
            regression.intercept,
            goal.targetValue,
            performanceCurve
        );

        // Calculate confidence percentage
        const confidence = this.calculateConfidence(
            regression.rSquared,
            relevantData.length,
            performanceCurve.consistency
        );

        // Calculate target date
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + daysToTarget);

        // Calculate current progress
        const currentValue = relevantData[relevantData.length - 1];
        const progress = Math.min((currentValue / goal.targetValue) * 100, 100);

        return {
            eta: daysToTarget,
            targetDate: targetDate.toISOString().split('T')[0],
            confidence: Math.round(confidence),
            currentValue: Math.round(currentValue * 10) / 10,
            targetValue: goal.targetValue,
            progress: Math.round(progress),
            message: this.generateETAMessage(daysToTarget, confidence, goal),
            status: 'success',
            regression: regression,
            performanceCurve: performanceCurve
        };
    }

    /**
     * LINEAR REGRESSION CALCULATION
     * Calculates slope, intercept, and R² value
     */
    linearRegression(data) {
        const n = data.length;
        const x = Array.from({length: n}, (_, i) => i);
        const y = data;

        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Calculate R² (coefficient of determination)
        const yMean = sumY / n;
        const ssTotal = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
        const ssRes = y.reduce((sum, yi, i) => sum + Math.pow(yi - (slope * x[i] + intercept), 2), 0);
        const rSquared = 1 - (ssRes / ssTotal);

        return {
            slope: slope,
            intercept: intercept,
            rSquared: Math.max(0, rSquared) // Ensure non-negative
        };
    }

    /**
     * PERFORMANCE CURVE CALCULATION
     * Detects if performance is accelerating, decelerating, or plateauing
     */
    calculatePerformanceCurve(data) {
        if (data.length < 4) {
            return { type: 'linear', factor: 1, consistency: 0.5 };
        }

        // Split data into two halves
        const mid = Math.floor(data.length / 2);
        const firstHalf = data.slice(0, mid);
        const secondHalf = data.slice(mid);

        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

        const improvement = (secondAvg - firstAvg) / firstAvg;

        let type = 'linear';
        let factor = 1;
        let consistency = 0.7;

        if (improvement > 0.15) {
            type = 'accelerating';
            factor = 1.2; // Optimistic adjustment
            consistency = 0.8;
        } else if (improvement < -0.1) {
            type = 'decelerating';
            factor = 0.8; // Pessimistic adjustment
            consistency = 0.6;
        } else if (Math.abs(improvement) < 0.05) {
            type = 'plateauing';
            factor = 0.9;
            consistency = 0.5;
        }

        return {
            type: type,
            factor: factor,
            consistency: consistency,
            improvement: Math.round(improvement * 100)
        };
    }

    /**
     * ESTIMATE DAYS TO TARGET
     * Calculates how many days until goal is achieved
     */
    estimateDaysToTarget(slope, intercept, targetValue, performanceCurve) {
        if (slope <= 0) {
            return 999; // No progress or declining
        }

        // Basic calculation: (target - intercept) / slope
        let daysNeeded = (targetValue - intercept) / slope;

        // Apply performance curve adjustment
        daysNeeded = daysNeeded / performanceCurve.factor;

        // Add buffer for consistency
        daysNeeded = daysNeeded * (1 + (1 - performanceCurve.consistency) * 0.2);

        return Math.ceil(Math.max(1, daysNeeded));
    }

    /**
     * CONFIDENCE CALCULATION
     * Determines reliability of prediction (0-100%)
     */
    calculateConfidence(rSquared, dataPoints, consistency) {
        let confidence = 0;

        // R² component (0-40 points)
        confidence += rSquared * 40;

        // Data points component (0-30 points)
        const dataPointsScore = Math.min(dataPoints / 14, 1) * 30;
        confidence += dataPointsScore;

        // Consistency component (0-30 points)
        confidence += consistency * 30;

        return Math.min(100, confidence);
    }

    generateETAMessage(daysToTarget, confidence, goal) {
        if (daysToTarget === 999) {
            return `⚠️ No progress detected. Adjust your training plan.`;
        }

        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + daysToTarget);
        const dateStr = targetDate.toLocaleDateString('uz-UZ');

        if (confidence >= 80) {
            return `✅ ${confidence}% confident: Achieve "${goal.title}" by ${dateStr}`;
        } else if (confidence >= 60) {
            return `⚠️ ${confidence}% confident: Likely achieve by ${dateStr}`;
        } else {
            return `❌ ${confidence}% confident: May need ${daysToTarget} days`;
        }
    }

    getRelevantHistoryForGoal(goal) {
        const history = athleticDataManager.getDailyHistory();
        const data = [];

        history.forEach(day => {
            let value = 0;

            if (goal.type === 'reps') {
                // Sum all reps from morning exercises
                value = day.morning.reduce((sum, e) => sum + e.actualReps, 0);
            } else if (goal.type === 'weight') {
                // Get max weight from evening exercises
                if (day.evening.length > 0) {
                    value = Math.max(...day.evening.map(e => e.weight));
                }
            } else if (goal.type === 'volume') {
                // Total volume (kg × reps)
                value = day.totalEveningVolume;
            } else if (goal.type === 'bodyweight') {
                // Placeholder for body weight tracking
                value = 75; // Default
            }

            if (value > 0) {
                data.push(value);
            }
        });

        return data;
    }

    // ============ RECOVERY & SEQUENCE OPTIMIZATION ============
    /**
     * ADAPTIVE REST INTERVAL SUGGESTION
     * Based on performance and intensity, suggest optimal rest
     */
    suggestRestInterval(exerciseName, lastSetReps, targetReps, muscleGroup) {
        const completionRate = (lastSetReps / targetReps) * 100;

        let baseRest = 60; // seconds

        // Adjust based on muscle group
        if (muscleGroup === 'back' || muscleGroup === 'legs') {
            baseRest = 90; // Larger muscles need more rest
        } else if (muscleGroup === 'core') {
            baseRest = 45; // Core recovers faster
        }

        // Adjust based on performance
        if (completionRate < 70) {
            baseRest += 30; // Struggling - more rest
        } else if (completionRate > 95) {
            baseRest -= 15; // Strong performance - less rest
        }

        return Math.max(30, baseRest);
    }

    /**
     * SEQUENCE REFINEMENT ALGORITHM
     * Analyzes failed exercises and suggests optimal order
     */
    optimizeExerciseSequence(morningExercises, eveningExercises) {
        const failedExercises = [
            ...morningExercises.filter(e => e.status === 'missed' || e.status === 'partial'),
            ...eveningExercises.filter(e => e.status === 'missed' || e.status === 'partial')
        ];

        if (failedExercises.length === 0) {
            return {
                suggestion: 'Current sequence is working well!',
                recommendation: null
            };
        }

        // Analyze failure patterns
        const failureAnalysis = this.analyzeFailurePatterns(failedExercises);

        // Generate optimization suggestion
        const suggestion = this.generateSequenceSuggestion(failureAnalysis);

        return {
            suggestion: suggestion.message,
            recommendation: suggestion.recommendation,
            failureAnalysis: failureAnalysis
        };
    }

    analyzeFailurePatterns(failedExercises) {
        const patterns = {};

        failedExercises.forEach(exercise => {
            const muscleGroup = this.EXERCISE_CATEGORIES[exercise.name] || 'unknown';
            
            if (!patterns[muscleGroup]) {
                patterns[muscleGroup] = {
                    count: 0,
                    exercises: [],
                    avgCompletion: 0
                };
            }

            patterns[muscleGroup].count++;
            patterns[muscleGroup].exercises.push(exercise.name);
            
            const completion = (exercise.actualReps / exercise.targetReps) * 100;
            patterns[muscleGroup].avgCompletion += completion;
        });

        // Calculate averages
        Object.keys(patterns).forEach(group => {
            patterns[group].avgCompletion = Math.round(patterns[group].avgCompletion / patterns[group].count);
        });

        return patterns;
    }

    generateSequenceSuggestion(failureAnalysis) {
        const worstGroup = Object.entries(failureAnalysis)
            .sort((a, b) => a[1].avgCompletion - b[1].avgCompletion)[0];

        if (!worstGroup) {
            return { message: 'No issues detected', recommendation: null };
        }

        const [muscleGroup, data] = worstGroup;

        let recommendation = '';
        let message = '';

        if (muscleGroup === 'back') {
            recommendation = 'Move Pull-ups earlier in your session when energy is high';
            message = `⚠️ Back exercises struggling (${data.avgCompletion}% avg). ${recommendation}`;
        } else if (muscleGroup === 'chest') {
            recommendation = 'Reduce volume or add more rest between chest exercises';
            message = `⚠️ Chest exercises struggling (${data.avgCompletion}% avg). ${recommendation}`;
        } else if (muscleGroup === 'legs') {
            recommendation = 'Perform leg exercises earlier or reduce intensity';
            message = `⚠️ Leg exercises struggling (${data.avgCompletion}% avg). ${recommendation}`;
        } else if (muscleGroup === 'core') {
            recommendation = 'Add core work earlier in your routine';
            message = `⚠️ Core exercises struggling (${data.avgCompletion}% avg). ${recommendation}`;
        } else {
            recommendation = 'Review your exercise order and intensity';
            message = `⚠️ ${muscleGroup} exercises struggling. ${recommendation}`;
        }

        return { message, recommendation };
    }

    // ============ MISSING LINK ANALYSIS ============
    /**
     * IDENTIFIES GAPS IN TRAINING ROUTINE
     */
    analyzeMissingLinks(morningExercises, eveningExercises, goals) {
        const gaps = [];

        // Check for mobility work
        const hasMobility = [...morningExercises, ...eveningExercises]
            .some(e => e.name.toLowerCase().includes('mobility') || 
                      e.name.toLowerCase().includes('stretch'));
        
        if (!hasMobility) {
            gaps.push({
                type: 'mobility',
                message: 'Lack of mobility work detected',
                recommendation: 'Add 10-15 min mobility routine before workouts',
                content: this.CONTENT_LIBRARY.mobility
            });
        }

        // Check for cardio/endurance
        const hasCardio = morningExercises.some(e => e.name.includes('Running'));
        
        if (!hasCardio && morningExercises.length > 0) {
            gaps.push({
                type: 'endurance',
                message: 'No cardiovascular work in morning session',
                recommendation: 'Add 10m running or other cardio',
                content: this.CONTENT_LIBRARY.endurance
            });
        }

        // Check for recovery focus
        const recoveryData = athleticDataManager.getRecoveryData();
        const avgSleep = recoveryData.length > 0 
            ? recoveryData.slice(-7).reduce((sum, r) => sum + r.sleepHours, 0) / 7 
            : 0;

        if (avgSleep < 7) {
            gaps.push({
                type: 'recovery',
                message: `Low sleep average (${Math.round(avgSleep)} hours)`,
                recommendation: 'Prioritize 7-9 hours of sleep for recovery',
                content: this.CONTENT_LIBRARY.recovery
            });
        }

        return gaps;
    }

    // ============ PERSONALIZED RECOMMENDATIONS ============
    generateRecommendations(morningExercises, eveningExercises, goals) {
        const recommendations = [];

        // Missing links
        const gaps = this.analyzeMissingLinks(morningExercises, eveningExercises, goals);
        recommendations.push(...gaps);

        // Performance-based recommendations
        if (morningExercises.length > 0) {
            const morningFailRate = morningExercises.filter(e => e.status === 'missed').length / morningExercises.length;
            
            if (morningFailRate > 0.3) {
                recommendations.push({
                    type: 'strength',
                    message: 'High failure rate in morning session',
                    recommendation: 'Consider reducing volume or improving sleep',
                    content: this.CONTENT_LIBRARY.strength
                });
            }
        }

        // Nutrition recommendations
        if (eveningExercises.length > 5) {
            recommendations.push({
                type: 'nutrition',
                message: 'High training volume detected',
                recommendation: 'Ensure adequate protein and calorie intake',
                content: this.CONTENT_LIBRARY.nutrition
            });
        }

        return recommendations;
    }

    // ============ WEEKLY VOLUME ANALYSIS ============
    analyzeWeeklyVolume() {
        const weeklyVolume = athleticDataManager.getWeeklyVolume();
        
        if (weeklyVolume.length < 2) {
            return { trend: 'insufficient_data' };
        }

        const recent = weeklyVolume.slice(-7);
        const previous = weeklyVolume.slice(-14, -7);

        const recentAvg = recent.reduce((sum, d) => sum + d.totalVolume, 0) / recent.length;
        const previousAvg = previous.length > 0 
            ? previous.reduce((sum, d) => sum + d.totalVolume, 0) / previous.length 
            : recentAvg;

        const change = ((recentAvg - previousAvg) / previousAvg) * 100;

        let trend = 'stable';
        let message = '📊 Volume is stable';

        if (change > 15) {
            trend = 'increasing';
            message = '📈 Volume increasing - good progression!';
        } else if (change < -15) {
            trend = 'decreasing';
            message = '📉 Volume decreasing - check recovery';
        }

        return {
            trend: trend,
            message: message,
            change: Math.round(change),
            recentAvg: Math.round(recentAvg),
            previousAvg: Math.round(previousAvg)
        };
    }
}

// Global instance
const athleticAIEngine = new AthleticAIEngine();
