const foodModel = require('../models/food.model.js')
const likeModel = require('../models/likes.model.js')
const saveModel = require('../models/save.model.js')
const commentModel = require('../models/comment.model.js')
const commentLikeModel = require('../models/commentLike.model.js')
const subscriptionModel = require('../models/subscription.model.js')
const pushService = require('../services/push.service.js')
const storageService = require('../services/storage.service.js')
const { v4: uuid } = require('uuid')

async function createFood(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Video file is required' });
        }

        const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())

        const foodItem = await foodModel.create({
            name: req.body.name,
            description: req.body.description,
            video: fileUploadResult.url,
            foodPartner: req.foodPartner._id,
            price: req.body.price,
            prepTime: req.body.prepTime ? JSON.parse(req.body.prepTime) : undefined,
            isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable === 'true' : true,
            photoUrl: req.body.photoUrl,
            tags: req.body.tags ? JSON.parse(req.body.tags) : undefined
        })

        res.status(201).json({ message: 'Food item created successfully', food: foodItem })
    } catch (error) {
        next(error);
    }
}

async function updateFood(req, res) {
    const { id } = req.params
    const foodPartner = req.foodPartner

    const foodItem = await foodModel.findOne({ _id: id, foodPartner: foodPartner._id })
    if (!foodItem) {
        return res.status(404).json({ message: 'Food item not found or unauthorized' })
    }

    const updateData = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        prepTime: req.body.prepTime ? JSON.parse(req.body.prepTime) : undefined,
        isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable === 'true' : undefined,
        photoUrl: req.body.photoUrl,
        tags: req.body.tags ? JSON.parse(req.body.tags) : undefined
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key])

    const updatedFood = await foodModel.findByIdAndUpdate(id, updateData, { new: true })
    res.status(200).json({ message: 'Food item updated successfully', food: updatedFood })
}

async function deleteFood(req, res) {
    const { id } = req.params
    const foodPartner = req.foodPartner

    const foodItem = await foodModel.findOne({ _id: id, foodPartner: foodPartner._id })
    if (!foodItem) {
        return res.status(404).json({ message: 'Food item not found or unauthorized' })
    }

    await foodModel.findByIdAndDelete(id)
    res.status(200).json({ message: 'Food item deleted successfully' })
}

async function getFoodItems(req, res) {
    const page = parseInt(req.query.page) || 1
    const limit = Math.min(parseInt(req.query.limit) || 12, 20)
    const skip = (page - 1) * limit

    const foodItems = await foodModel.find({}).populate('foodPartner').sort({ createdAt: -1 }).skip(skip).limit(limit)
    const user = req.user

    let foodItemsWithStatus

    if (user) {
        // Get user's likes and saves
        const userLikes = await likeModel.find({ user: user._id }).select('food')
        const userSaves = await saveModel.find({ user: user._id }).select('food')


        const likedFoodIds = userLikes.map(like => like.food.toString())
        const savedFoodIds = userSaves.map(save => save.food.toString())

        // Add user status to each food item
        foodItemsWithStatus = foodItems.map(item => ({
            ...item.toObject(),
            isLiked: likedFoodIds.includes(item._id.toString()),
            isSaved: savedFoodIds.includes(item._id.toString())
        }))
    } else {
        // For unauthenticated users, set isLiked and isSaved to false
        foodItemsWithStatus = foodItems.map(item => ({
            ...item.toObject(),
            isLiked: false,
            isSaved: false
        }))
    }

    res.status(200).json({ message: 'Food Items fetched successfully', foodItems: foodItemsWithStatus })
}

async function likeFood(req, res) {
    const { foodId } = req.body
    const user = req.user

    const isAlreadyLiked = await likeModel.findOne({
        food: foodId,
        user: user._id
    })

    if (isAlreadyLiked) {
        await likeModel.deleteOne({
            food: foodId,
            user: user._id
        })
        await foodModel.findOneAndUpdate({ _id: foodId }, { $inc: { likesCount: -1 } })
        await foodModel.findOneAndUpdate({ _id: foodId, likesCount: { $lt: 0 } }, { $set: { likesCount: 0 } })
        return res.status(200).json({ message: 'Food unliked successfully', liked: false })
    }

    await foodModel.findOneAndUpdate({ _id: foodId }, { $inc: { likesCount: 1 } })
    await likeModel.create({
        food: foodId,
        user: user._id
    })
    res.status(201).json({ message: 'Food liked successfully', liked: true })
}

async function saveFood(req, res) {
    const { foodId } = req.body
    const user = req.user

    const isAlreadySaved = await saveModel.findOne({
        food: foodId,
        user: user._id
    })

    if (isAlreadySaved) {
        await saveModel.deleteOne({
            food: foodId,
            user: user._id
        })
        await foodModel.findOneAndUpdate({ _id: foodId }, { $inc: { savedCount: -1 } })
        await foodModel.findOneAndUpdate({ _id: foodId, savedCount: { $lt: 0 } }, { $set: { savedCount: 0 } })
        return res.status(200).json({ message: 'Food unsaved successfully', saved: false })
    }

    await saveModel.create({
        food: foodId,
        user: user._id
    })
    await foodModel.findOneAndUpdate({ _id: foodId }, { $inc: { savedCount: 1 } })
    res.status(201).json({ message: 'Food saved successfully', saved: true })
}

async function getSavedFoodItems(req, res) {
    const user = req.user
    const savedItems = await saveModel.find({ user: user._id }).populate({
        path: 'food',
        populate: {
            path: 'foodPartner'
        }
    })
    const savedFoodItems = savedItems.map(item => item.food)
    res.status(200).json({ message: 'Saved food items fetched successfully', savedFoodItems })
}

async function addComment(req, res) {
    const { foodId, text, parent } = req.body
    const user = req.user
    const createData = {
        user: user._id,
        food: foodId,
        text
    }
    if (parent) createData.parent = parent

    const comment = await commentModel.create(createData)

    // increment commentsCount on the food item
    await foodModel.findByIdAndUpdate(foodId, { $inc: { commentsCount: 1 } })
    // if this is a reply, increment repliesCount on parent
    if (parent) {
        await commentModel.findByIdAndUpdate(parent, { $inc: { repliesCount: 1 } })
    }

    const populatedComment = await commentModel.findById(comment._id).populate('user', 'fullName')
    const updatedFood = await foodModel.findById(foodId).select('commentsCount')

    // If this comment is a reply, notify the parent comment user (if different)
    try {
        if (parent) {
            const parentComment = await commentModel.findById(parent).populate('user', '_id fullName')
            if (parentComment && parentComment.user && parentComment.user._id.toString() !== user._id.toString()) {
                // find subscription for parent user
                const sub = await subscriptionModel.findOne({ userId: parentComment.user._id })
                if (sub) {
                    const payload = {
                        title: 'You were tagged in a reply',
                        body: `${user.fullName || 'Someone'} replied: ${text.slice(0, 120)}`,
                        data: { foodId, commentId: comment._id }
                    }
                    await pushService.sendNotification({ endpoint: sub.endpoint, keys: sub.keys }, payload)
                }
            }
        }
    } catch (err) {
        // don't fail the request if notification fails
        console.error('Failed to notify on reply:', err.message || err)
    }

    res.status(201).json({ message: 'Comment added successfully', comment: populatedComment, commentsCount: updatedFood.commentsCount })
}

async function getComments(req, res) {
    const { foodId } = req.params
    // Fetch all comments for the food and build a threaded structure (top-level comments with replies array)
    const comments = await commentModel.find({ food: foodId }).populate('user', 'fullName').sort({ createdAt: 1 })

    const byId = {}
    comments.forEach(c => {
        byId[c._id] = { ...c.toObject(), replies: [] }
    })

    const roots = []
    comments.forEach(c => {
        if (c.parent) {
            const parent = byId[c.parent.toString()]
            if (parent) parent.replies.push(byId[c._id])
            else roots.push(byId[c._id])
        } else {
            roots.push(byId[c._id])
        }
    })

    // return roots ordered newest-first
    roots.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    res.status(200).json({ message: 'Comments fetched successfully', comments: roots })
}

async function deleteComment(req, res) {
    const { commentId } = req.params
    const user = req.user

    const comment = await commentModel.findById(commentId)
    if (!comment) {
        return res.status(404).json({ message: 'Comment not found' })
    }

    // Only the comment owner can delete their comment
    if (comment.user.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'Forbidden: cannot delete this comment' })
    }

    const foodId = comment.food

    // collect comment ids to delete (the comment and all its descendant replies)
    const toDelete = [comment._id.toString()]
    const stack = [comment._id.toString()]
    while (stack.length) {
        const cur = stack.pop()
        const children = await commentModel.find({ parent: cur }).select('_id')
        children.forEach(ch => {
            toDelete.push(ch._id.toString())
            stack.push(ch._id.toString())
        })
    }

    // delete likes tied to these comments
    await commentLikeModel.deleteMany({ comment: { $in: toDelete } })

    // delete comments
    await commentModel.deleteMany({ _id: { $in: toDelete } })

    // decrement counts accordingly
    const deleteCount = toDelete.length
    await foodModel.findByIdAndUpdate(foodId, { $inc: { commentsCount: -deleteCount } })
    await foodModel.findOneAndUpdate({ _id: foodId, commentsCount: { $lt: 0 } }, { $set: { commentsCount: 0 } })

    // if this comment had a parent, decrement the parent's repliesCount by 1
    if (comment.parent) {
        await commentModel.findByIdAndUpdate(comment.parent, { $inc: { repliesCount: -1 } })
        await commentModel.findOneAndUpdate({ _id: comment.parent, repliesCount: { $lt: 0 } }, { $set: { repliesCount: 0 } })
    }

    const updatedFood = await foodModel.findById(foodId).select('commentsCount')
    res.status(200).json({ message: 'Comment deleted successfully', commentsCount: updatedFood.commentsCount })
}

async function likeComment(req, res) {
    const { commentId } = req.body
    const user = req.user

    const existing = await commentLikeModel.findOne({ comment: commentId, user: user._id })
    if (existing) {
        await commentLikeModel.deleteOne({ _id: existing._id })
        await commentModel.findByIdAndUpdate(commentId, { $inc: { likesCount: -1 } })
        await commentModel.findOneAndUpdate({ _id: commentId, likesCount: { $lt: 0 } }, { $set: { likesCount: 0 } })
        return res.status(200).json({ message: 'Comment unliked', liked: false })
    }

    await commentLikeModel.create({ comment: commentId, user: user._id })
    await commentModel.findByIdAndUpdate(commentId, { $inc: { likesCount: 1 } })
    res.status(201).json({ message: 'Comment liked', liked: true })
}

module.exports = {
    createFood,
    updateFood,
    deleteFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSavedFoodItems,
    addComment,
    getComments,
    deleteComment,
    likeComment
}




