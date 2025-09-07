const express = require('express')
const foodController = require('../controllers/food.controller.js')
const authMiddleware = require('../middleware/auth.middleware.js')
const optionalAuthMiddleware = require('../middleware/optional-auth.middleware.js')

const multer = require('multer')

const upload = multer({
    storage: multer.memoryStorage()
})

const router = express.Router()

router.post('/',
    authMiddleware.authFoodPartnerMiddleware,
    upload.single('video'),
    foodController.createFood
)

router.patch('/:id',
    authMiddleware.authFoodPartnerMiddleware,
    foodController.updateFood
)

router.get('/',
    optionalAuthMiddleware.optionalAuthUserMiddleware,
    foodController.getFoodItems
)

router.post('/like',
    authMiddleware.authUserMiddleware,
    foodController.likeFood
)

router.post('/save',
    authMiddleware.authUserMiddleware,
    foodController.saveFood
)

router.get('/saved',
    authMiddleware.authUserMiddleware,
    foodController.getSavedFoodItems
)

router.post('/comment',
    authMiddleware.authUserMiddleware,
    foodController.addComment
)

router.get('/:foodId/comments',
    authMiddleware.authUserMiddleware,
    foodController.getComments
)

module.exports = router