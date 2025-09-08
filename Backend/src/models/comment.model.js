const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'food',
        required: true
    },
    text: {
        type: String,
        required: true
    }
    ,
    // parent comment id for threaded replies (null for top-level comments)
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment',
        default: null
    },
    // cached counts for quick display
    likesCount: {
        type: Number,
        default: 0
    },
    repliesCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const commentModel = mongoose.model('comment', commentSchema)
module.exports = commentModel