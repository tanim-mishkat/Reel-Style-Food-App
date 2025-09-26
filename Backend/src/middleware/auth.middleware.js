const foodPartnerModel = require('../models/foodpartner.model.js')
const userModel = require('../models/user.model.js')
const jwt = require('jsonwebtoken')

async function authFoodPartnerMiddleware(req, res, next) {
    const token = req.cookies.partner_token

    if (!token) {
        return res.status(401).json({ message: "Unauthorized Access" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded.role !== 'partner') {
            return res.status(401).json({ message: "Invalid role" })
        }
        const foodPartner = await foodPartnerModel.findById(decoded.id)
        if (!foodPartner) {
            return res.status(401).json({ message: "Food partner not found" })
        }
        req.foodPartner = foodPartner
        next()
    } catch (error) {
        // console.log(error)
        return res.status(401).json({ message: "Invalid Token: "+error })
    }
}

async function authUserMiddleware(req, res, next) {
    const token = req.cookies.user_token

    if (!token) {
        return res.status(401).json({ message: "Unauthorized Access" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded.role !== 'user') {
            return res.status(401).json({ message: "Invalid role" })
        }
        const user = await userModel.findById(decoded.id)
        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }
        req.user = user
        next()
    } catch (error) {
        // console.log(error)
        return res.status(401).json({ message: "Invalid Token: "+error })
    }
}

module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware
}