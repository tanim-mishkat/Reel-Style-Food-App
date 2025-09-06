const foodModel = require('../models/food.model.js')
const likeModel = require('../models/likes.model.js')
const saveModel = require('../models/save.model.js')
const commentModel = require('../models/comment.model.js')
const storageService = require('../services/storage.service.js')
const { v4: uuid } = require('uuid')

async function createFood(req, res) {
    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())

    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        video: fileUploadResult.url,
        foodPartner: req.foodPartner._id
    })

    res.status(201).json({ message: 'Food item created successfully', food: foodItem })
}

async function getFoodItems(req, res) {
    const foodItems = await foodModel.find({})
    const user = req.user
    
    // Get user's likes and saves
    const userLikes = await likeModel.find({ user: user._id }).select('food')
    const userSaves = await saveModel.find({ user: user._id }).select('food')
    
    const likedFoodIds = userLikes.map(like => like.food.toString())
    const savedFoodIds = userSaves.map(save => save.food.toString())
    
    // Add user status to each food item
    const foodItemsWithStatus = foodItems.map(item => ({
        ...item.toObject(),
        isLiked: likedFoodIds.includes(item._id.toString()),
        isSaved: savedFoodIds.includes(item._id.toString())
    }))
    
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
    const savedItems = await saveModel.find({ user: user._id }).populate('food')
    const savedFoodItems = savedItems.map(item => item.food)
    res.status(200).json({ message: 'Saved food items fetched successfully', savedFoodItems })
}

async function addComment(req, res) {
    const { foodId, text } = req.body
    const user = req.user
    
    const comment = await commentModel.create({
        user: user._id,
        food: foodId,
        text
    })
    
    const populatedComment = await commentModel.findById(comment._id).populate('user', 'fullName')
    res.status(201).json({ message: 'Comment added successfully', comment: populatedComment })
}

async function getComments(req, res) {
    const { foodId } = req.params
    const comments = await commentModel.find({ food: foodId }).populate('user', 'fullName').sort({ createdAt: -1 })
    res.status(200).json({ message: 'Comments fetched successfully', comments })
}

module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSavedFoodItems,
    addComment,
    getComments
}

