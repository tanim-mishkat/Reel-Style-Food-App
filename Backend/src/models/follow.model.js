const mongoose = require('mongoose')

const followSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'foodPartner',
        required: true
    }
}, { timestamps: true })

followSchema.index({ user: 1, partner: 1 }, { unique: true })

const followModel = mongoose.model('follow', followSchema)
module.exports = followModel