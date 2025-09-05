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

module.exports = { getFoodPartnerById }