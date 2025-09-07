const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model.js')

async function optionalAuthUserMiddleware(req, res, next) {
    const token = req.cookies.user_token

    if (!token) {
        req.user = null
        return next()
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded.role === 'user') {
            const user = await userModel.findById(decoded.id)
            req.user = user
        } else {
            req.user = null
        }
    } catch (error) {
        req.user = null
    }
    
    next()
}

module.exports = {
    optionalAuthUserMiddleware
}