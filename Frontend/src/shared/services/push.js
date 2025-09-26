const publicVapidKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI2BN4EMgaewOiGzwwzjfsjd1H3amYBdG98RXYaI2eSK6RgksEKmbzQcUk'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export async function initPushNotifications() {
  try {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      await navigator.serviceWorker.register('/sw.js')
      // console.log('Service worker registered successfully')
    }
  } catch (error) {
    console.log('Push notifications not available:', error.message)
  }
}
