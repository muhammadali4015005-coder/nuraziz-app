// Custom Alert - Brauzer alert o'rniga
export function customAlert(message, type = 'error') {
  // Remove existing alert
  const existing = document.getElementById('custom-alert-modal')
  if (existing) existing.remove()

  // Create overlay
  const overlay = document.createElement('div')
  overlay.id = 'custom-alert-modal'
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999999;
    animation: fadeIn 0.2s ease-out;
  `

  // Create modal
  const modal = document.createElement('div')
  const bgColor = type === 'error' ? '#ff0055' : '#00ff88'
  const borderColor = type === 'error' ? '#ff3377' : '#00ffaa'
  
  modal.style.cssText = `
    background: #0a0e27;
    border: 4px solid ${borderColor};
    border-radius: 16px;
    padding: 30px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9);
    animation: slideDown 0.3s ease-out;
  `

  // Create message
  const messageEl = document.createElement('div')
  messageEl.textContent = message
  messageEl.style.cssText = `
    color: ${bgColor};
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
    line-height: 1.5;
    font-family: Arial, sans-serif;
  `

  // Create button
  const button = document.createElement('button')
  button.textContent = 'OK'
  button.style.cssText = `
    width: 100%;
    padding: 14px;
    background: ${bgColor};
    color: #0a0e27;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
    font-family: Arial, sans-serif;
  `

  button.onmouseover = () => {
    button.style.transform = 'scale(1.05)'
    button.style.boxShadow = `0 4px 12px ${bgColor}80`
  }
  button.onmouseout = () => {
    button.style.transform = 'scale(1)'
    button.style.boxShadow = 'none'
  }

  button.onclick = () => {
    overlay.style.animation = 'fadeOut 0.2s ease-in'
    setTimeout(() => overlay.remove(), 200)
  }

  // Add animations
  const style = document.createElement('style')
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-50px) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `
  document.head.appendChild(style)

  // Assemble
  modal.appendChild(messageEl)
  modal.appendChild(button)
  overlay.appendChild(modal)
  document.body.appendChild(overlay)

  console.log('[CUSTOM ALERT]', message)
}
