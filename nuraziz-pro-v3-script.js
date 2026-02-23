// NURAZIZ PRO V3 - BURGER MENU VERSION
// JavaScript Logic

const API_URL = 'http://localhost:5003';
let currentUser = null;
let userData = null;

// ==================== UTILITY ====================
function formatPhone(input) {
    if (!input) return;
    let val = input.value.replace(/\D/g, '');
    if (val.length > 12) val = val.slice(0, 12);
    let formatted = '';
    if (val.length > 0) formatted = '+' + val.slice(0, 3);
    if (val.length > 3) formatted += ' ' + val.slice(3, 5);
    if (val.length > 5) formatted += ' ' + val.slice(5, 8);
    if (val.length > 8) formatted += ' ' + val.slice(8, 10);
    if (val.length > 10) formatted += ' ' + val.slice(10, 12);
    input.value = formatted;
}

function showNotification(message, type = 'info') {
    const colors = { success: '#00ff88', error: '#ff0055', info: '#00d4ff', warning: '#ffaa00' };
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: ${colors[type]}; color: #0a0e27;
        padding: 16px 24px; border-radius: 8px;
        font-weight: bold; z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== AUT