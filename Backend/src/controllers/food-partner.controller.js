const foodPartnerModel = require('../models/foodpartner.model.js')
const foodModel = require('../models/food.model.js')

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

async function getFoodPartnerVideos(req, res) {
    const { id } = req.params
    const user = req.user
    
    const foodItems = await foodModel.find({ foodPartner: id })
    
    // Get user's likes and saves for these videos
    const userLikes = await require('../models/likes.model.js').find({ 
        user: user._id, 
        food: { $in: foodItems.map(item => item._id) } 
    }).select('food')
    const userSaves = await require('../models/save.model.js').find({ 
        user: user._id, 
        food: { $in: foodItems.map(item => item._id) } 
    }).select('food')
    
    const likedFoodIds = userLikes.map(like => like.food.toString())
    const savedFoodIds = userSaves.map(save => save.food.toString())
    
    const foodItemsWithStatus = foodItems.map(item => ({
        ...item.toObject(),
        isLiked: likedFoodIds.includes(item._id.toString()),
        isSaved: savedFoodIds.includes(item._id.toString())
    }))
    
    res.status(200).json({ message: 'Food partner videos fetched successfully', foodItems: foodItemsWithStatus })
}

module.exports = { getFoodPartnerById, getFoodPartnerVideos }