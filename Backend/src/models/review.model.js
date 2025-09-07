const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'foodPartner',
        required: true
    },
    stars: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
}, { timestamps: true })

const reviewModel = mongoose.model('review', reviewSchema)
module.exports = reviewModel