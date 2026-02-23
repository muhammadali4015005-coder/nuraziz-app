import { useEffect } from 'react'
import './SimpleToast.css'

export default function SimpleToast({ message, type, onClose }) {
  console.log('SIMPLE TOAST RENDERED:', { message, type })
  
  useEffect(() => {
    console.log('SIMPLE TOAST MOUNTED')
    const timer = setTimeout(() => {
      console.log('SIMPLE TOAST CLOSING')
      onClose()
    }, 8000) // 8 soniya - uzun message uchun
    
    return () => {
      console.log('SIMPLE TOAST UNMOUNTED')
      clearTimeout(timer)
    }
  }, [onClose])

  return (
    <div className={`simple-toast ${type}`}>
      {message}
    </div>
  )
}
