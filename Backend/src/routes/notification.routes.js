const express = require('express')
const notificationController = require('../controllers/notification.controller.js')
const authMiddleware = require('../middleware/auth.middleware.js')

const router = express.Router()

router.get('/user',
    authMiddleware.authUserMiddleware,
    notificationController.getUserNotifications
)

router.get('/partner',
    authMiddleware.authFoodPartnerMiddleware,
    notificationController.getPartnerNotifications
)

module.exports = router