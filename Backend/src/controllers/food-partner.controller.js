const foodPartnerModel = require('../models/foodpartner.model.js')
const foodModel = require('../models/food.model.js')
const likeModel = require('../models/likes.model.js')
const saveModel = require('../models/save.model.js')

async function getFoodPartnerById(req, res) {
    const { id } = req.params

    const foodPartner = await foodPartnerModel.findById(id)
    if (!foodPartner) {
        return res.status(404).json({ message: 'Food partner not found' })
    }
    const foodItemsByFoodPartner = await foodModel.find({ foodPartner: id })
    res.status(200).json({
        message: 'Food partner found successfully',
        foodPartner: {
            ...foodPartner.toObject(),
            foodItems: foodItemsByFoodPartner
        }
    })
}

async function getFoodPartnerBySlug(req, res) {
    const { slug } = req.params

    const foodPartner = await foodPartnerModel.findOne({ slug })
    if (!foodPartner) {
        return res.status(404).json({ message: 'Food partner not found' })
    }
    const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartner._id })
    res.status(200).json({
        message: 'Food partner found successfully',
        foodPartner: {
            ...foodPartner.toObject(),
            foodItems: foodItemsByFoodPartner
        }
    })
}

async function getMyProfile(req, res) {
    const foodPartner = req.foodPartner
    const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartner._id })
    res.status(200).json({
        message: 'Profile fetched successfully',
        foodPartner: {
            ...foodPartner.toObject(),
            foodItems: foodItemsByFoodPartner
        }
    })
}

async function updateMyProfile(req, res) {
    const foodPartner = req.foodPartner
    const { fullName, contactName, phone, address } = req.body
    
    const updateData = {}
    if (fullName) updateData.fullName = fullName
    if (contactName) updateData.contactName = contactName
    if (phone) updateData.phone = phone
    if (address) updateData.address = address
    
    const updatedPartner = await foodPartnerModel.findByIdAndUpdate(
        foodPartner._id, 
        updateData, 
        { new: true }
    )
    
    res.status(200).json({
        message: 'Profile updated successfully',
        foodPartner: updatedPartner
    })
}

async function getFoodPartnerVideos(req, res) {
    const { id } = req.params
    const user = req.user
    
    const foodItems = await foodModel.find({ foodPartner: id })
    
    let foodItemsWithStatus
    
    if (user) {
        const userLikes = await likeModel.find({ 
            user: user._id, 
            food: { $in: foodItems.map(item => item._id) } 
        }).select('food')
        const userSaves = await saveModel.find({ 
            user: user._id, 
            food: { $in: foodItems.map(item => item._id) } 
        }).select('food')
        
        const likedFoodIds = userLikes.map(like => like.food.toString())
        const savedFoodIds = userSaves.map(save => save.food.toString())
        
        foodItemsWithStatus = foodItems.map(item => ({
            ...item.toObject(),
            isLiked: likedFoodIds.includes(item._id.toString()),
            isSaved: savedFoodIds.includes(item._id.toString())
        }))
    } else {
        foodItemsWithStatus = foodItems.map(item => ({
            ...item.toObject(),
            isLiked: false,
            isSaved: false
        }))
    }
    
    res.status(200).json({ message: 'Food partner videos fetched successfully', foodItems: foodItemsWithStatus })
}

module.exports = { getFoodPartnerById, getFoodPartnerBySlug, getMyProfile, updateMyProfile, getFoodPartnerVideos }