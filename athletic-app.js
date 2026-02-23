/**
 * ATHLETIC APP - Main Application Logic
 */

let volumeChart = null;

// ============ AUTHENTICATION ============
function checkPass() {
    const phone = document.getElementById('phone-input').value.trim();
    const pass = document.getElementById('pass-input').value.trim();

    if (!phone || !pass) {
        showError('Telefon raqami va kodni kiriting!');
        return;
    }

    const result = athleticDataManager.loginUser(phone, pass);
    
    if (result.success) {
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('main-screen').classList.remove('hidden');
        document.getElementById('phone-input').value = '';
        document.getElementById('pass-input').value = '';
        init();
    } else {
        showError('❌ ' + result.message);
    }
}

function registerUser() {
    const phone = document.getElementById('reg-phone-input').value.trim();
    const pass = document.getElementById('reg-pass-input').value.trim();
    const passConfirm = document.getElementById('reg-pass-confirm-input').value.trim();

    if (!phone || !pass || !passConfirm) {
        showRegisterError('Barcha maydonlarni to\'ldiring!');
        return;
    }

    if (phone.length < 10) {
        showRegisterError('Telefon raqami kamida 10 ta belgidan iborat bo\'lishi kerak!');
        return;
    }

    if (pass.length < 4 || pass.length > 6) {
        showRegisterError('Kod 4-6 ta belgidan iborat bo\'lishi kerak!');
        return;
    }

    if (pass !== passConfirm) {
        showRegisterError('Kodlar mos kelmadi!');
        return;
    }

    const result = athleticDataManager.registerUser(phone, pass);
    
    if (result.success) {
        alert('✅ ' + result.message);
        switchToLogin();
    } else {
        showRegisterError('❌ ' + result.message);
    }
}

function switchToRegister() {
    document.getElementById('login-tab').classList.add('hidden');
    document.getElementById('register-tab').classList.remove('hidden');
}

function switchToLogin() {
    document.getElementById('register-tab').classList.add('hidden');
    document.getElementById('login-tab').classList.remove('hidden');
    document.getElementById('reg-phone-input').value = '';
    document.getElementById('reg-pass-input').value = '';
    document.getElementById('reg-pass-confirm-input').value = '';
}

function showError(message) {
    const errorMsg = document.getElementById('error-msg');
    errorMsg.innerText = message;
    errorMsg.classList.remove('hidden');
    setTimeout(() => errorMsg.classList.add('hidden'), 4000);
}

function showRegisterError(message) {
    const errorMsg = document.getElementById('register-error-msg');
    errorMsg.innerText = message;
    errorMsg.classList.remove('hidden');
    setTimeout(() => errorMsg.classList.add('hidden'), 4000);
}

function logout() {
    if (confirm('Chiqmoqchimisiz?')) {
        athleticDataManager.logoutUser();
        document.getElementById('main-screen').classList.add('hidden');
        document.getElementById('auth-screen').classList.remove('hidden');
        document.getElementById('phone-input').value = '';
        document.getElementById('pass-input').value = '';
        switchToLogin();
    }
}

// ============ INITIALIZATION ============
function init() {
    const currentUser = athleticDataManager.getCurrentUser();
    document.getElementById('current-phone').innerText = currentUser;
    
    updateDateDisplay();
    updateDashboard();
    renderMorningExercises();
    renderEveningExercises();
    renderGoals();
}

function updateDateDisplay() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = today.toLocaleDateString('uz-UZ', options);
    document.getElementById('date-display').innerText = dateStr;
}

// ============ TAB NAVIGATION ============
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });

    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(`tab-${tabName}`).classList.remove('hidden');
    event.target.classList.add('active');

    if (tabName === 'analytics') {
        renderAnalytics();
    } else if (tabName === 'coaching') {
        renderCoaching();
    }
}

// ============ MORNING EXERCISES ============
function addMorningExercise() {
    const name = document.getElementById('morning-exercise-select').value;
    const targetReps = document.getElementById('morning-target-reps').value;
    const actualReps = document.getElementById('morning-actual-reps').value;
    const status = document.getElementById('morning-status').value;

    if (!name || !targetReps || !actualReps) {
        alert('Please fill all fields');
        return;
    }

    athleticDataManager.addMorningExercise(name, targetReps, actualReps, status);
    
    // Clear form
    document.getElementById('morning-exercise-select').value = '';
    document.getElementById('morning-target-reps').value = '';
    document.getElementById('morning-actual-reps').value = '';
    document.getElementById('morning-status').value = 'completed';

    renderMorningExercises();
    updateDashboard();
}

function deleteMorningExercise(exerciseId) {
    if (confirm('Delete this exercise?')) {
        athleticDataManager.deleteMorningExercise(exerciseId);
        renderMorningExercises();
        updateDashboard();
    }
}

function renderMorningExercises() {
    const list = document.getElementById('morning-exercises-list');
    const today = athleticDataManager.getTodayDateString();
    const exercises = athleticDataManager.getMorningExercises()
        .filter(e => e.date === today);

    if (exercises.length === 0) {
        list.innerHTML = '<p class="text-gray-500 text-center py-8">No exercises logged yet</p>';
        return;
    }

    list.innerHTML = exercises.map(e => {
        const completion = Math.round((e.actualReps / e.targetReps) * 100);
        const statusClass = `status-${e.status}`;

        return `
            <div class="exercise-item">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h3 class="font-bold text-gray-800">${e.name}</h3>
                        <p class="text-sm text-gray-600">${e.actualReps}/${e.targetReps} reps (${completion}%)</p>
                    </div>
                    <span class="status-badge ${statusClass}">${e.status.toUpperCase()}</span>
                </div>
                <button onclick="deleteMorningExercise(${e.id})" class="text-red-500 hover:text-red-700 text-sm">🗑️ Delete</button>
            </div>
        `;
    }).join('');
}

// ============ EVENING EXERCISES ============
function addEveningExercise() {
    const name = document.getElementById('evening-exercise-name').value;
    const weight = document.getElementById('evening-weight').value;
    const setsReps = document.getElementById('evening-sets-reps').value;
    const actualReps = document.getElementById('evening-actual-reps').value;
    const rest = document.getElementById('evening-rest').value;
    const status = document.getElementById('evening-status').value;

    if (!name || !weight || !setsReps || !actualReps) {
        alert('Please fill all fields');
        return;
    }

    athleticDataManager.addEveningExercise(name, weight, setsReps, actualReps, rest, status);

    // Clear form
    document.getElementById('evening-exercise-name').value = '';
    document.getElementById('evening-weight').value = '';
    document.getElementById('evening-sets-reps').value = '';
    document.getElementById('evening-actual-reps').value = '';
    document.getElementById('evening-rest').value = '';
    document.getElementById('evening-status').value = 'completed';

    renderEveningExercises();
    updateDashboard();
}

function deleteEveningExercise(exerciseId) {
    if (confirm('Delete this exercise?')) {
        athleticDataManager.deleteEveningExercise(exerciseId);
        renderEveningExercises();
        updateDashboard();
    }
}

function renderEveningExercises() {
    const list = document.getElementById('evening-exercises-list');
    const today = athleticDataManager.getTodayDateString();
    const exercises = athleticDataManager.getEveningExercises()
        .filter(e => e.date === today);

    if (exercises.length === 0) {
        list.innerHTML = '<p class="text-gray-500 text-center py-8">No exercises logged yet</p>';
        return;
    }

    list.innerHTML = exercises.map(e => {
        const completion = Math.round((e.actualReps / parseInt(e.setsReps.split('x')[1])) * 100);
        const statusClass = `status-${e.status}`;

        return `
            <div class="exercise-item">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h3 class="font-bold text-gray-800">${e.name}</h3>
                        <p class="text-sm text-gray-600">${e.weight}kg × ${e.setsReps} | ${e.actualReps} reps (${completion}%)</p>
                        <p class="text-xs text-gray-500">Rest: ${e.restSeconds}s | Volume: ${e.volume.toFixed(0)} kg×reps</p>
                    </div>
                    <span class="status-badge ${statusClass}">${e.status.toUpperCase()}</span>
                </div>
                <button onclick="deleteEveningExercise(${e.id})" class="text-red-500 hover:text-red-700 text-sm">🗑️ Delete</button>
            </div>
        `;
    }).join('');
}

// ============ GOALS ============
function addGoal() {
    const title = document.getElementById('goal-title').value;
    const type = document.getElementById('goal-type').value;
    const target = document.getElementById('goal-target').value;
    const date = document.getElementById('goal-date').value;
    const description = document.getElementById('goal-description').value;

    if (!title || !target || !date) {
        alert('Please fill required fields');
        return;
    }

    athleticDataManager.addGoal(title, type, target, date, description);

    // Clear form
    document.getElementById('goal-title').value = '';
    document.getElementById('goal-type').value = 'reps';
    document.getElementById('goal-target').value = '';
    document.getElementById('goal-date').value = '';
    document.getElementById('goal-description').value = '';

    renderGoals();
    updateDashboard();
}

function deleteGoal(goalId) {
    if (confirm('Delete this goal?')) {
        athleticDataManager.deleteGoal(goalId);
        renderGoals();
        updateDashboard();
    }
}

function renderGoals() {
    const list = document.getElementById('goals-list');
    const goals = athleticDataManager.getGoals();

    if (goals.length === 0) {
        list.innerHTML = '<p class="text-gray-500 text-center py-8">No goals created yet</p>';
        return;
    }

    list.innerHTML = goals.map(goal => {
        const eta = athleticAIEngine.calculateGoalETA(goal);
        const progressPercent = eta.progress || 0;

        return `
            <div class="bg-white rounded-xl shadow p-4">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h3 class="font-bold text-gray-800">${goal.title}</h3>
                        <p class="text-sm text-gray-600">${goal.description}</p>
                    </div>
                    <button onclick="deleteGoal(${goal.id})" class="text-red-500 hover:text-red-700">🗑️</button>
                </div>

                <div class="mb-3">
                    <div class="flex justify-between text-sm mb-1">
                        <span class="text-gray-600">Progress</span>
                        <span class="font-bold">${progressPercent}%</span>
                    </div>
                    <div class="goal-progress-bar">
                        <div class="goal-progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                </div>

                <div class="bg-blue-50 p-3 rounded-lg">
                    <p class="text-sm font-medium text-blue-900">${eta.message}</p>
                    <p class="text-xs text-blue-700 mt-1">
                        Current: ${eta.currentValue} | Target: ${eta.targetValue} | 
                        Confidence: ${eta.confidence}%
                    </p>
                </div>
            </div>
        `;
    }).join('');
}

// ============ DASHBOARD ============
function updateDashboard() {
    const metrics = athleticDataManager.getTodayMetrics();
    const goals = athleticDataManager.getGoals();
    const weeklyVolume = athleticDataManager.getWeeklyVolume();

    // Update session cards
    document.getElementById('morning-volume').innerText = metrics.morningVolume;
    document.getElementById('morning-completion').innerText = metrics.morningCompletion + '%';
    document.getElementById('evening-volume').innerText = Math.round(metrics.eveningVolume);
    document.getElementById('evening-completion').innerText = metrics.eveningCompletion + '%';

    // Update quick stats
    document.getElementById('total-exercises').innerText = metrics.totalExercises;
    document.getElementById('active-goals').innerText = goals.filter(g => g.status === 'active').length;
    
    const totalWeeklyVolume = weeklyVolume.reduce((sum, d) => sum + d.totalVolume, 0);
    document.getElementById('weekly-volume').innerText = Math.round(totalWeeklyVolume);

    // Recovery status
    const recoveryData = athleticDataManager.getRecoveryData();
    const lastRecovery = recoveryData.length > 0 ? recoveryData[recoveryData.length - 1] : null;
    const recoveryStatus = lastRecovery && lastRecovery.recoveryScore > 70 ? '✅' : '⚠️';
    document.getElementById('recovery-status').innerText = recoveryStatus;

    // Update AI insights
    updateAIInsights();
}

function updateAIInsights() {
    const container = document.getElementById('ai-insights-container');
    const volumeAnalysis = athleticAIEngine.analyzeWeeklyVolume();

    let html = `<div class="insight-card">${volumeAnalysis.message}</div>`;

    if (volumeAnalysis.trend !== 'insufficient_data') {
        html += `
            <div class="text-sm text-gray-600">
                <p>📊 Previous week: ${volumeAnalysis.previousAvg} total volume</p>
                <p>📈 This week: ${volumeAnalysis.recentAvg} total volume</p>
                <p>📍 Change: <span class="${volumeAnalysis.change > 0 ? 'text-green-600' : 'text-red-600'}">${volumeAnalysis.change > 0 ? '+' : ''}${volumeAnalysis.change}%</span></p>
            </div>
        `;
    }

    container.innerHTML = html;
}

// ============ ANALYTICS ============
function renderAnalytics() {
    renderVolumeChart();
    renderExercisePerformance();
    renderRecoveryMetrics();
}

function renderVolumeChart() {
    const ctx = document.getElementById('volume-chart');
    if (!ctx) return;

    const weeklyVolume = athleticDataManager.getWeeklyVolume();

    if (volumeChart) {
        volumeChart.destroy();
    }

    volumeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: weeklyVolume.map(d => {
                const date = new Date(d.date);
                return date.toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' });
            }),
            datasets: [
                {
                    label: 'Morning Volume (reps)',
                    data: weeklyVolume.map(d => d.morningVolume),
                    borderColor: '#f5576c',
                    backgroundColor: 'rgba(245, 87, 108, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Evening Volume (kg×reps)',
                    data: weeklyVolume.map(d => d.eveningVolume / 100), // Scale for visibility
                    borderColor: '#00f2fe',
                    backgroundColor: 'rgba(0, 242, 254, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: true, labels: { font: { size: 12 } } }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function renderExercisePerformance() {
    const container = document.getElementById('exercise-performance');
    const morningExercises = athleticDataManager.getMorningExercises();
    const eveningExercises = athleticDataManager.getEveningExercises();

    const allExercises = [...morningExercises, ...eveningExercises];
    const exerciseStats = {};

    allExercises.forEach(e => {
        if (!exerciseStats[e.name]) {
            exerciseStats[e.name] = {
                total: 0,
                completed: 0,
                avgCompletion: 0
            };
        }

        exerciseStats[e.name].total++;
        if (e.status === 'completed') {
            exerciseStats[e.name].completed++;
        }

        const completion = (e.actualReps / e.targetReps) * 100;
        exerciseStats[e.name].avgCompletion += completion;
    });

    Object.keys(exerciseStats).forEach(name => {
        exerciseStats[name].avgCompletion = Math.round(exerciseStats[name].avgCompletion / exerciseStats[name].total);
    });

    if (Object.keys(exerciseStats).length === 0) {
        container.innerHTML = '<p class="text-gray-500">No exercise data yet</p>';
        return;
    }

    container.innerHTML = Object.entries(exerciseStats).map(([name, stats]) => `
        <div class="bg-gray-50 p-3 rounded-lg">
            <div class="flex justify-between items-center mb-2">
                <span class="font-medium text-gray-800">${name}</span>
                <span class="text-sm font-bold text-blue-600">${stats.avgCompletion}%</span>
            </div>
            <div class="text-xs text-gray-600">
                ${stats.completed}/${stats.total} completed | Avg: ${stats.avgCompletion}%
            </div>
        </div>
    `).join('');
}

function renderRecoveryMetrics() {
    const container = document.getElementById('recovery-metrics');
    const recoveryData = athleticDataManager.getRecoveryData();

    if (recoveryData.length === 0) {
        container.innerHTML = '<p class="text-gray-500">No recovery data yet</p>';
        return;
    }

    const recent = recoveryData.slice(-7);
    const avgSleep = recent.reduce((sum, r) => sum + r.sleepHours, 0) / recent.length;
    const avgRecoveryScore = recent.reduce((sum, r) => sum + r.recoveryScore, 0) / recent.length;

    container.innerHTML = `
        <div class="bg-green-50 p-3 rounded-lg">
            <p class="text-sm font-medium text-green-900">Average Sleep: ${avgSleep.toFixed(1)} hours</p>
        </div>
        <div class="bg-blue-50 p-3 rounded-lg">
            <p class="text-sm font-medium text-blue-900">Recovery Score: ${Math.round(avgRecoveryScore)}/100</p>
        </div>
        <div class="bg-yellow-50 p-3 rounded-lg">
            <p class="text-sm font-medium text-yellow-900">Status: ${avgRecoveryScore > 70 ? '✅ Good' : '⚠️ Needs Attention'}</p>
        </div>
    `;
}

// ============ COACHING ============
function renderCoaching() {
    renderETAPredictions();
    renderRecommendations();
    renderSequenceOptimization();
}

function renderETAPredictions() {
    const container = document.getElementById('eta-container');
    const goals = athleticDataManager.getGoals();

    if (goals.length === 0) {
        container.innerHTML = '<p class="text-gray-500">Create goals to see ETA predictions...</p>';
        return;
    }

    container.innerHTML = goals.map(goal => {
        const eta = athleticAIEngine.calculateGoalETA(goal);

        return `
            <div class="eta-card">
                <h3 class="font-bold mb-2">${goal.title}</h3>
                <p class="text-sm mb-3">${eta.message}</p>
                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: ${eta.confidence}%"></div>
                </div>
                <p class="text-xs mt-2">Confidence: ${eta.confidence}%</p>
            </div>
        `;
    }).join('');
}

function renderRecommendations() {
    const container = document.getElementById('recommendations-container');
    const morningExercises = athleticDataManager.getMorningExercises();
    const eveningExercises = athleticDataManager.getEveningExercises();
    const goals = athleticDataManager.getGoals();

    const recommendations = athleticAIEngine.generateRecommendations(
        morningExercises,
        eveningExercises,
        goals
    );

    if (recommendations.length === 0) {
        container.innerHTML = '<p class="text-gray-500">No recommendations yet...</p>';
        return;
    }

    container.innerHTML = recommendations.map(rec => `
        <div class="recommendation-card">
            <h3 class="font-bold mb-2">📚 ${rec.message}</h3>
            <p class="text-sm mb-3">${rec.recommendation}</p>
            <div class="text-xs">
                <p class="font-semibold mb-1">Suggested Content:</p>
                ${rec.content.map(c => `<p>• ${c.title} (${c.type})</p>`).join('')}
            </div>
        </div>
    `).join('');
}

function renderSequenceOptimization() {
    const container = document.getElementById('sequence-optimization');
    const morningExercises = athleticDataManager.getMorningExercises();
    const eveningExercises = athleticDataManager.getEveningExercises();

    const optimization = athleticAIEngine.optimizeExerciseSequence(
        morningExercises,
        eveningExercises
    );

    let html = `<div class="insight-card">${optimization.suggestion}</div>`;

    if (optimization.recommendation) {
        html += `
            <div class="bg-blue-50 p-4 rounded-lg">
                <p class="text-sm font-medium text-blue-900">${optimization.recommendation}</p>
            </div>
        `;
    }

    container.innerHTML = html;
}

// ============ SETTINGS ============
function openSettings() {
    document.getElementById('settings-modal').classList.remove('hidden');
}

function closeSettings() {
    document.getElementById('settings-modal').classList.add('hidden');
    document.getElementById('new-phone-input').value = '';
    document.getElementById('new-pass-input').value = '';
}

function changePhone() {
    const newPhone = document.getElementById('new-phone-input').value.trim();
    if (!newPhone) {
        alert('Telefon raqamini kiriting!');
        return;
    }
    if (newPhone.length < 10) {
        alert('Telefon raqami kamida 10 ta belgidan iborat bo\'lishi kerak!');
        return;
    }
    athleticDataManager.setPhone(newPhone);
    alert('✅ Telefon raqami muvaffaqiyatli o\'zgartirildi!');
    document.getElementById('new-phone-input').value = '';
}

function changePassword() {
    const newPass = document.getElementById('new-pass-input').value.trim();
    if (!newPass) {
        alert('Kodni kiriting!');
        return;
    }
    if (newPass.length < 4) {
        alert('Kod kamida 4 ta belgidan iborat bo\'lishi kerak!');
        return;
    }
    athleticDataManager.setPassword(newPass);
    alert('✅ Kod muvaffaqiyatli o\'zgartirildi!');
    document.getElementById('new-pass-input').value = '';
}

function exportData() {
    const data = athleticDataManager.exportAllData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `athletic-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function clearAllData() {
    if (confirm('⚠️ This will delete all data! Continue?')) {
        athleticDataManager.clearAllData();
        alert('✅ All data cleared!');
        location.reload();
    }
}

// ============ STARTUP ============
window.addEventListener('load', () => {
    updateDateDisplay();
});
