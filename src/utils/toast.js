// Global Toast Notification System
export function showToast(message, type = 'error') {
  // Use global function if available
  if (typeof window !== 'undefined' && window.showToast) {
    window.showToast(message, type);
    return;
  }
  
  // Fallback implementation
  console.log('[TOAST] Fallback:', message, type);
  alert(message);
}
