const mongoose = require('mongoose')

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    prepTime: {
        min: {
            type: Number
        },
        max: {
            type: Number
        }
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    photoUrl: {
        type: String
    },
    tags: {
        veg: {
            type: Boolean
        },
        halal: {
            type: Boolean
        },
        spicy: {
            type: Boolean
        }
    },
    foodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'foodPartner',
        required: true
    }
}, { timestamps: true })

const menuModel = mongoose.model('menu', menuSchema)
module.exports = menuModel