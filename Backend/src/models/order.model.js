const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
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
    items: [{
        foodId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'menu'
        },
        name: {
            type: String,
            required: true
        },
        qty: {
            type: Number,
            required: true
        },
        unitPrice: {
            type: Number,
            required: true
        }
    }],
    fulfillment: {
        type: {
            type: String,
            enum: ['delivery', 'pickup'],
            required: true
        },
        address: {
            type: String
        }
    },
    payment: {
        kind: {
            type: String,
            default: 'dummy'
        },
        status: {
            type: String,
            default: 'completed'
        }
    },
    status: {
        type: String,
        default: 'PLACED'
    },
    timeline: [{
        at: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            required: true
        },
        note: {
            type: String
        }
    }]
}, { timestamps: true })

const orderModel = mongoose.model('order', orderSchema)
module.exports = orderModel