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
        foodPartner: req.foodPartner._id,
        price: req.body.price,
        prepTime: req.body.prepTime ? JSON.parse(req.body.prepTime) : undefined,
        isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable === 'true' : true,
        photoUrl: req.body.photoUrl,
        tags: req.body.tags ? JSON.parse(req.body.tags) : undefined
    })

    res.status(201).json({ message: 'Food item created successfully', food: foodItem })
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

async function getFoodItems(req, res) {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
    
    const foodItems = await foodModel.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit)
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
    updateFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSavedFoodItems,
    addComment,
    getComments
}

