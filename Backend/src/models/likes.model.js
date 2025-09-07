const mongoose = require('mongoose')


const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'food',
        required: true
    }
},
    { timestamps: true }
)

likeSchema.index({ user: 1, food: 1 }, { unique: true })

const likeModel = mongoose.model('like', likeSchema)
module.exports = likeModel