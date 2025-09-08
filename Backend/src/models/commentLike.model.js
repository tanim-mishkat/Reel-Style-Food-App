const mongoose = require('mongoose')

const commentLikeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment',
        required: true
    }
}, { timestamps: true })

commentLikeSchema.index({ user: 1, comment: 1 }, { unique: true })

const commentLikeModel = mongoose.model('commentLike', commentLikeSchema)
module.exports = commentLikeModel
