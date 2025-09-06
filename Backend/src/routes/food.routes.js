const express = require('express')
const foodController = require('../controllers/food.controller.js')
const authMiddleware = require('../middleware/auth.middleware.js')

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

router.get('/',
    authMiddleware.authUserMiddleware,
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

module.exports = router