const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    to: { type: mongoose.Schema.Types.ObjectId, required: true }, // receiver id
    toRole: { type: String, enum: ['user', 'partner', 'admin'], required: true },
    type: {
        type: String,
        enum: ['order:created', 'order:statusUpdated', 'review:created', 'follow:created'],
        required: true
    },
    payload: { type: Object, default: {} },
    deliveredAt: Date,
    readAt: Date
}, { timestamps: true });

module.exports = mongoose.model('notification', notificationSchema);
