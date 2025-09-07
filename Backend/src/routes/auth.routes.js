const express = require('express')
const authController = require('../controllers/auth.controller.js')
const authMiddleware = require('../middleware/auth.middleware.js')

const router = express.Router()


//user auth API

router.post('/user/register', authController.registerUser)
router.post('/user/login', authController.loginUser)
router.get('/user/logout', authController.logoutUser)
router.get('/user/profile', authMiddleware.authUserMiddleware, authController.getUserProfile)
router.patch('/user/profile', authMiddleware.authUserMiddleware, authController.updateUserProfile)


// food partner auth API

router.post('/foodpartner/register', authController.registerFoodPartner)
router.post('/foodpartner/login', authController.loginFoodPartner)
router.get('/foodpartner/logout', authController.logoutFoodPartner)

module.exports = router