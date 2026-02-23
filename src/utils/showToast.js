// Custom Toast without React - SIMPLE VERSION
export function showToast(message, type = 'success') {
  console.log('🔔 showToast called:', message, type)
  
  // Remove existing toast
  const old = document.getElementById('my-toast')
  if (old) old.remove()

  // Create toast
  const toast = document.createElement('div')
  toast.id = 'my-toast'
  toast.innerHTML = message
  
  const bg = type === 'error' ? '#ff0055' : '#00d4ff'
  
  toast.setAttribute('style', `
    position: fixed !important;
    top: 30px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    background: ${bg} !important;
    color: #0a0e27 !important;
    padding: 20px 40px !important;
    border-radius: 12px !important;
    font-weight: bold !important;
    font-size: 18px !important;
    z-index: 2147483647 !important;
    box-shadow: 0 10px 30px rgba(0,0,0,0.8) !important;
    min-width: 350px !important;
    text-align: center !important;
    border: 4px solid ${type === 'error' ? '#ff3377' : '#0099cc'} !important;
    font-family: Arial, sans-serif !important;
  `)
  
  document.body.appendChild(toast)
  console.log('🔔 Toast element:', toast)
  console.log('🔔 Toast in DOM:', document.getElementById('my-toast'))
  
  // Auto remove
  setTimeout(() => {
    if (toast && toast.parentNode) {
      toast.remove()
      console.log('🔔 Toast removed')
    }
  }, 2000)
}

