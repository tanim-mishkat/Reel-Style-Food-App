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

module.exports = router