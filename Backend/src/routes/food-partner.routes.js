const express = require('express')
const foodPartnerController = require('../controllers/food-partner.controller.js')
const authMiddleware = require('../middleware/auth.middleware.js')
const optionalAuthMiddleware = require('../middleware/optional-auth.middleware.js')

const router = express.Router()

router.get('/me',
    authMiddleware.authFoodPartnerMiddleware,
    foodPartnerController.getMyProfile
)

router.patch('/me',
    authMiddleware.authFoodPartnerMiddleware,
    foodPartnerController.updateMyProfile
)

router.get('/restaurant/:slug',
    foodPartnerController.getFoodPartnerBySlug
)

// specific videos route must come before the generic '/:id' to avoid
// interpreting path segments like 'dashboard' as an ObjectId
router.get('/:id/videos',
    optionalAuthMiddleware.optionalAuthUserMiddleware,
    foodPartnerController.getFoodPartnerVideos
)

router.get('/:id',
    foodPartnerController.getFoodPartnerById
)

module.exports = router