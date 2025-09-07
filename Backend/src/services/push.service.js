const webpush = require('web-push')

webpush.setVapidDetails(
    'mailto:test@example.com',
    'BEl62iUYgUivxIkv69yViEuiBIa40HI2BN4EMgaewOiGzwwzjfsjd1H3amYBdG98RXYaI2eSK6RgksEKmbzQcUk',
    'UGcjVlJ6h0nTA1H2cKaFXF_3kqiMU3N9QKqigyhM8_s'
)

async function sendNotification(subscription, payload) {
    try {
        await webpush.sendNotification(subscription, JSON.stringify(payload))
    } catch (error) {
        console.error('Push notification failed:', error)
    }
}

module.exports = { sendNotification }