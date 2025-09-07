const express = require('express')
const reviewController = require('../controllers/review.controller.js')
const authMiddleware = require('../middleware/auth.middleware.js')

const router = express.Router()

router.post('/',
    authMiddleware.authUserMiddleware,
    reviewController.createReview
)

router.get('/partner/:id',
    reviewController.getPartnerReviews
)

module.exports = router