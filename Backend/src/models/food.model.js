const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    video: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    foodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'foodPartner'
    },
    likesCount: {
        type: Number,
        default: 0
    },
    savedCount: {
        type: Number,
        default: 0
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    price: {
        type: Number
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
    }

},
    { timestamps: true }
)

const foodModel = mongoose.model('food', foodSchema)
module.exports = foodModel