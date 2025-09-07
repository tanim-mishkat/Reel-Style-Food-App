const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model.js')

async function optionalAuthUserMiddleware(req, res, next) {
    const token = req.cookies.token

    if (!token) {
        req.user = null
        return next()
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.id)
        req.user = user
    } catch (error) {
        req.user = null
    }
    
    next()
}

module.exports = {
    optionalAuthUserMiddleware
}