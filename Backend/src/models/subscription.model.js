const mongoose = require('mongoose')

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    endpoint: {
        type: String,
        required: true
    },
    keys: {
        p256dh: String,
        auth: String
    }
}, { timestamps: true })

const subscriptionModel = mongoose.model('subscription', subscriptionSchema)
module.exports = subscriptionModel