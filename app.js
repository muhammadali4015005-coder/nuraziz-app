/**
 * MAIN APPLICATION - UI Logic and Event Handling
 */

let currentPass = dataManager.getPassword();
let weeklyChart = null;

// ============ AUTHENTICATION ============
function checkPass() {
    const input = document.getElementById('pass-input').value;
    if (input === currentPass) {
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('main-screen').classList.remove('hidden');
        document.getElementById('pass-input').value = '';
        init();
    } else {
        const errorMsg = document.getElementById('error-msg');
        errorMsg.classList.remove('hidden');
        setTimeout(() => errorMsg.classList.add('hidden'), 3000);
    }
}

// ============ INITIALIZATION ============
function init() {
    updateDateDisplay();
    renderHabits();
    renderGoals();
    updateDashboard();
    renderAnalytics();
    renderRecommendations();
}

function updateDateDisplay() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = today.toLocaleDateString('uz-UZ', options);
    document.getElementById('date-display').innerText = dateStr;
}

// ============ TAB NAVIGATION ============
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(`tab-${tabName}`).classList.remove('hidden');

    // Add active class to clicked button
    event.target.classList.add('active');

    // Render specific content
    if (tabName === 'analytics') {
        renderAnalytics();
    } else if (tabName === 'recommendations') {
        renderRecommendations();
    }
}

// ============ HABIT MANAGEMENT ============
function addHabit() {
    const input = document.getElementById('habit-input');
    if (input.value.trim() === '') {
        alert('Vazifa nomini kiriting!');
        return;
    }

    dataManager.addHabit(input.value);
    input.value = '';
    renderHabits();
    updateDashboard();
}

function toggleHabitStatus(habitId, newStatus) {
    dataManager.updateHabitStatus(habitId, newStatus);
    renderHabits();
    updateDashboard();
}

function deleteHabit(habitId) {
    if (confirm('Vazifani o\'chirmoqchimisiz?')) {
        dataManager.deleteHabit(habitId);
        renderHabits();
        updateDashboard();
    }
}

function renderHabits() {
    const list = document.getElementById('habit-list');
    const habits = dataManager.getHabits();

    if (habits.length === 0) {
        list.innerHTML = '<div class="text-center text-gray-400 py-8"><p class="text-lg">📝 Hali vazifa yo\'q</p></div>';
        return;
    }

    list.innerHTML = habits.map(h => {
        const analysis = aiEngine.analyzeHabitPerformance(h.id);
        const streakBadge = analysis.streak > 0 ? `<span class="streak-badge">🔥 ${analysis.streak} kun</span>` : '';

        return `
            <div class="bg-white rounded-xl shadow p-4 flex items-center justify-between habit-item">
                <div class="flex-1">
                    <p class="font-medium text-gray-800 ${h.status === 'done' ? 'line-through text-gray-400' : ''}">${h.text}</p>
                    <div class="flex gap-2 mt-2">
                        <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">${analysis.completionRate}%</span>
                        ${streakBadge}
                    </div>
                </div>
                <div class="flex gap-2">
                    <button 
                        onclick="toggleHabitStatus(${h.id}, 'done')" 
                        class="p-2 hover:bg-green-100 rounded-lg transition ${h.status === 'done' ? 'bg-green-200' : ''}"
                    >
                        ✅
                    </button>
                    <button 
                        onclick="toggleHabitStatus(${h.id}, 'fail')" 
                        class="p-2 hover:bg-red-100 rounded-lg transition ${h.status === 'fail' ? 'bg-red-200' : ''}"
                    >
                        ❌
                    </button>
                    <button 
                        onclick="deleteHabit(${h.id})" 
                        class="p-2 hover:bg-gray-200 rounded-lg transition"
                    >
                        🗑️
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ============ GOAL MANAGEMENT ============
function addGoal() {
    const title = document.getElementById('goal-title').value;
    const description = document.getElementById('goal-description').value;
    const targetDays = document.getElementById('goal-target-days').value;

    if (!title.trim() || !targetDays) {
        alert('Barcha maydonlarni to\'ldiring!');
        return;
    }

    dataManager.addGoal(title, description, targetDays);
    document.getElementById('goal-title').value = '';
    document.getElementById('goal-description').value = '';
    document.getElementById('goal-target-days').value = '';
    renderGoals();
    updateDashboard();
}

function deleteGoal(goalId) {
    if (confirm('Maqsadni o\'chirmoqchimisiz?')) {
        dataManager.deleteGoal(goalId);
        renderGoals();
        updateDashboard();
    }
}

function renderGoals() {
    const list = document.getElementById('goals-list');
    const goals = dataManager.getGoals();

    if (goals.length === 0) {
        list.innerHTML = '<div class="text-center text-gray-400 py-8"><p class="text-lg">🎯 Hali maqsad yo\'q</p></div>';
        return;
    }

    list.innerHTML = goals.map(goal => {
        const eta = aiEngine.calculateGoalETA(goal);
        const confidenceColor = eta.confidence === 'high' ? 'text-green-600' : 
                               eta.confidence === 'medium' ? 'text-yellow-600' : 'text-red-600';

        return `
            <div class="bg-white rounded-xl shadow p-4">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h3 class="font-bold text-gray-800">${goal.title}</h3>
                        <p class="text-sm text-gray-600 mt-1">${goal.description}</p>
                    </div>
                    <button onclick="deleteGoal(${goal.id})" class="text-red-500 hover:text-red-700">🗑️</button>
                </div>

                <div class="mb-3">
                    <div class="flex justify-between text-sm mb-1">
                        <span class="text-gray-600">Progress</span>
                        <span class="font-bold">${eta.progress}%</span>
                    </div>
                    <div class="goal-progress-bar">
                        <div class="goal-progress-fill" style="width: ${eta.progress}%"></div>
                    </div>
                </div>

                <div class="bg-blue-50 p-3 rounded-lg mb-3">
                    <p class="text-sm font-medium text-blue-900">${eta.message}</p>
                    <p class="text-xs text-blue-700 mt-1">
                        📊 O'rtacha samaradorlik: ${eta.avgCompletion}% | 
                        Ishonch: <span class="${confidenceColor}">${eta.confidence}</span>
                    </p>
                </div>

                <div class="grid grid-cols-3 gap-2 text-center text-xs">
                    <div class="bg-gray-50 p-2 rounded">
                        <p class="font-bold text-gray-800">${eta.daysElapsed}</p>
                        <p class="text-gray-600">Kun o'tdi</p>
                    </div>
                    <div class="bg-gray-50 p-2 rounded">
                        <p class="font-bold text-gray-800">${eta.eta}</p>
                        <p class="text-gray-600">Taxminiy</p>
                    </div>
                    <div class="bg-gray-50 p-2 rounded">
                        <p class="font-bold text-gray-800">${goal.targetDays}</p>
                        <p class="text-gray-600">Maqsad</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ============ DASHBOARD ============
function updateDashboard() {
    const habits = dataManager.getHabits();
    const today = dataManager.getTodayDateString();
    const history = dataManager.getDailyHistory();
    const todayData = history.find(h => h.date === today);

    // Update progress circle
    const completion = todayData ? todayData.completionRate : 0;
    updateProgressCircle(completion);

    // Update stats
    const completed = habits.filter(h => h.status === 'done').length;
    const goals = dataManager.getGoals();
    const streaks = dataManager.getAllStreaks();
    const maxStreak = Math.max(...Object.values(streaks).map(s => s.streak), 0);

    document.getElementById('total-habits').innerText = habits.length;
    document.getElementById('completed-today').innerText = completed;
    document.getElementById('active-goals').innerText = goals.filter(g => g.status === 'active').length;
    document.getElementById('current-streak').innerText = maxStreak;
    document.getElementById('stat-text').innerText = 
        habits.length === 0 ? 'Vazifalar qo\'shing' : `${completed}/${habits.length} bajarildi`;

    // Update AI insights
    updateAIInsights();
}

function updateProgressCircle(percentage) {
    const circle = document.getElementById('progress-circle-stroke');
    const percentText = document.getElementById('progress-percent');

    percentText.innerText = percentage + '%';

    let color = '#ef4444'; // Red
    if (percentage >= 80) color = '#10b981'; // Green
    else if (percentage >= 50) color = '#f59e0b'; // Yellow

    circle.setAttribute('stroke', color);

    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDashoffset = offset;
}

function updateAIInsights() {
    const container = document.getElementById('ai-insights-container');
    const trendAnalysis = aiEngine.getTrendAnalysis();

    let html = `<div class="ai-insight">${trendAnalysis.message}</div>`;

    if (trendAnalysis.trend !== 'insufficient_data') {
        html += `
            <div class="text-sm text-gray-600">
                <p>📊 O'tgan hafta: ${trendAnalysis.previousAvg}%</p>
                <p>📈 Bu hafta: ${trendAnalysis.recentAvg}%</p>
                <p>📍 O'zgarish: <span class="${trendAnalysis.change > 0 ? 'text-green-600' : 'text-red-600'}">${trendAnalysis.change > 0 ? '+' : ''}${trendAnalysis.change}%</span></p>
            </div>
        `;
    }

    container.innerHTML = html;
}

// ============ ANALYTICS ============
function renderAnalytics() {
    renderWeeklyChart();
    renderStreaks();
    renderHeatmap();
}

function renderWeeklyChart() {
    const ctx = document.getElementById('weekly-chart');
    if (!ctx) return;

    const chartData = aiEngine.getWeeklyChartData();

    if (weeklyChart) {
        weeklyChart.destroy();
    }

    weeklyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Kunlik Samaradorlik (%)',
                data: chartData.data,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: { font: { size: 12 } }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { callback: value => value + '%' }
                }
            }
        }
    });
}

function renderStreaks() {
    const container = document.getElementById('streaks-list');
    const streaks = dataManager.getAllStreaks();
    const habits = dataManager.getHabits();

    if (habits.length === 0) {
        container.innerHTML = '<p class="text-gray-500">Hali vazifa yo\'q</p>';
        return;
    }

    const streakArray = Object.entries(streaks)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.streak - a.streak);

    container.innerHTML = streakArray.map(item => `
        <div class="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg">
            <div class="flex justify-between items-center">
                <span class="font-medium text-gray-800">${item.habitText}</span>
                <span class="streak-badge">🔥 ${item.streak} kun</span>
            </div>
        </div>
    `).join('');
}

function renderHeatmap() {
    const container = document.getElementById('heatmap-container');
    const heatmapData = dataManager.getHeatmapData();
    const history = dataManager.getDailyHistory();

    if (history.length === 0) {
        container.innerHTML = '<p class="text-gray-500">Hali ma\'lumot yo\'q</p>';
        return;
    }

    container.innerHTML = history.map(day => {
        const rate = day.completionRate;
        let cellClass = 'heatmap-empty';
        
        if (rate > 0 && rate < 30) cellClass = 'heatmap-low';
        else if (rate >= 30 && rate < 70) cellClass = 'heatmap-medium';
        else if (rate >= 70) cellClass = 'heatmap-high';

        const date = new Date(day.date);
        const dateStr = date.toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' });

        return `
            <div class="heatmap-cell ${cellClass}" title="${dateStr}: ${rate}%">
                <div class="text-xs font-bold text-center pt-1">${rate}%</div>
            </div>
        `;
    }).join('');
}

// ============ RECOMMENDATIONS ============
function renderRecommendations() {
    const container = document.getElementById('recommendations-container');
    const result = aiEngine.generateRecommendations();

    if (!result.ready) {
        container.innerHTML = `<p class="text-gray-500">⏳ ${result.message}</p>`;
        return;
    }

    let html = '';

    result.recommendations.forEach(rec => {
        if (rec.type === 'weak_habit') {
            html += `
                <div class="recommendation-card">
                    <h3 class="font-bold mb-2">⚠️ "${rec.habitText}" odatini mustahkamlang</h3>
                    <p class="text-sm mb-3">${rec.advice}</p>
                    <p class="text-xs mb-2">📊 Samaradorlik: ${rec.completionRate}%</p>
                    <div class="text-xs">
                        <p class="font-semibold mb-1">Tavsiya etilgan manbalar:</p>
                        ${rec.content.map(c => `<p>📚 ${c.title} (${c.type})</p>`).join('')}
                    </div>
                </div>
            `;
        } else if (rec.type === 'missing_habits') {
            html += `
                <div class="recommendation-card">
                    <h3 class="font-bold mb-2">💡 ${rec.suggestion}</h3>
                    <p class="text-xs mb-2">Tavsiya etilgan odatlar:</p>
                    <ul class="text-xs">
                        ${rec.suggestedHabits.map(h => `<li>• ${h}</li>`).join('')}
                    </ul>
                </div>
            `;
        } else if (rec.type === 'strength') {
            html += `
                <div class="recommendation-card">
                    <h3 class="font-bold mb-2">${rec.message}</h3>
                    <ul class="text-xs">
                        ${rec.habits.map(h => `<li>✅ ${h}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
    });

    container.innerHTML = html || '<p class="text-gray-500">Hali tavsiyalar yo\'q</p>';
}

// ============ SETTINGS ============
function openSettings() {
    document.getElementById('settings-modal').classList.remove('hidden');
}

function closeSettings() {
    document.getElementById('settings-modal').classList.add('hidden');
    document.getElementById('new-pass-input').value = '';
}

function changePassword() {
    const newPass = document.getElementById('new-pass-input').value;
    if (newPass.trim().length < 4) {
        alert('Kod kamida 4 ta belgidan iborat bo\'lishi kerak!');
        return;
    }
    currentPass = newPass;
    dataManager.setPassword(currentPass);
    alert('✅ Kod muvaffaqiyatli o\'zgartirildi!');
    closeSettings();
}

function exportData() {
    const data = dataManager.exportAllData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tracker-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function clearAllData() {
    if (confirm('⚠️ Barcha ma\'lumotlar o\'chiriladi! Davom etmoqchimisiz?')) {
        dataManager.clearAllData();
        alert('✅ Barcha ma\'lumotlar o\'chirildi!');
        location.reload();
    }
}

// ============ STARTUP ============
window.addEventListener('load', () => {
    updateDateDisplay();
});
