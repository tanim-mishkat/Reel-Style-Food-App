self.addEventListener('push', event => {
  const data = event.data.json()
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/default_image.jpeg'
    }).then(() => {
      // Notify all clients about the notification
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'NOTIFICATION_RECEIVED', data })
        })
      })
    })
  )
})