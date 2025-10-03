import { useCallback } from 'react'

export function useNotifications() {
  const setupNotifications = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('Notification' in window)) {
      alert('Your browser doesn\'t support notifications')
      return false
    }

    try {
      await navigator.serviceWorker.register('/sw.js')
      const permission = await Notification.requestPermission()

      if (permission === 'granted') {
        console.log('Reminders ready!')
        return true
      } else {
        alert('Please allow notifications to use reminders')
        return false
      }
    } catch (error) {
      console.error('Notification setup failed:', error)
      return false
    }
  }, [])

  return { setupNotifications }
}