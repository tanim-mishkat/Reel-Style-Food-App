const subscriptionModel = require('../models/subscription.model.js')

async function subscribe(req, res) {
    try {
        const { subscription } = req.body
        const userId = req.user._id

        await subscriptionModel.findOneAndUpdate(
            { userId },
            { 
                userId,
                endpoint: subscription.endpoint,
                keys: subscription.keys
            },
            { upsert: true }
        )

        res.status(200).json({ message: 'Subscription saved' })
    } catch (error) {
        res.status(500).json({ message: 'Failed to save subscription' })
    }
}

module.exports = { subscribe }