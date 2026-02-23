// Sodda Notifikatsiya Utility
// NotificationManager ga asoslangan

import { NotificationManager } from '../components/Notification'

export const notify = {
  // Muvaffaqiyat
  success: (title, message = '', duration = 2500) => {
    NotificationManager.success(title, message, duration)
  },

  // Xato
  error: (title, message = '', duration = 2500) => {
    NotificationManager.error(title, message, duration)
  },

  // Ogohlantirish
  warning: (title, message = '', duration = 2500) => {
    NotificationManager.warning(title, message, duration)
  },

  // Ma'lumot
  info: (title, message = '', duration = 2500) => {
    NotificationManager.info(title, message, duration)
  },

  // Custom
  custom: (type, title, message = '', duration = 2500, buttons = []) => {
    NotificationManager.show({ type, title, message, duration, buttons })
  }
}

// Qo'shimcha yordamchilar
export const notifyShort = {
  success: (title) => notify.success(title, '', 1500),
  error: (title) => notify.error(title, '', 2000),
  warning: (title) => notify.warning(title, '', 1800),
  info: (title) => notify.info(title, '', 1500)
}
