const express = require('express')
const followController = require('../controllers/follow.controller.js')
const authMiddleware = require('../middleware/auth.middleware.js')

const router = express.Router()

router.post('/partner',
    authMiddleware.authUserMiddleware,
    followController.followPartner
)

router.get('/partners',
    authMiddleware.authUserMiddleware,
    followController.getFollowedPartners
)

router.get('/feed',
    authMiddleware.authUserMiddleware,
    followController.getFollowedFeed
)

router.get('/followers',
    authMiddleware.authFoodPartnerMiddleware,
    followController.getPartnerFollowers
)

module.exports = router