const express = require('express')
const foodPartnerController = require('../controllers/food-partner.controller.js')
const authMiddleware = require('../middleware/auth.middleware.js')

const router = express.Router()

router.get('/:id',
    authMiddleware.authUserMiddleware,
    foodPartnerController.getFoodPartnerById
)

router.get('/:id/videos',
    authMiddleware.authUserMiddleware,
    foodPartnerController.getFoodPartnerVideos
)

module.exports = router