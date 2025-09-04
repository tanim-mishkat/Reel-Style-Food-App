const foodPartnerModel = require('../models/foodpartner.model.js')
const jwt = require('jsonwebtoken')

async function authFoodPartnerMiddleware(req, res, next) {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: "Unauthorized Access" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const foodPartner = await foodPartnerModel.findById(decoded.id)
        if (!foodPartner) {
            return res.status(401).json({ message: "Food partner not found" })
        }
        req.foodPartner = foodPartner
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({ message: "Invalid Token" })
    }
}

module.exports = {
    authFoodPartnerMiddleware
}