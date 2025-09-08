const express = require('express')
const foodController = require('../controllers/food.controller.js')
const authMiddleware = require('../middleware/auth.middleware.js')
const optionalAuthMiddleware = require('../middleware/optional-auth.middleware.js')

const multer = require('multer')

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only video files are allowed'), false);
        }
    }
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

router.delete('/:id',
    authMiddleware.authFoodPartnerMiddleware,
    foodController.deleteFood
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

router.delete('/comment/:commentId',
    authMiddleware.authUserMiddleware,
    foodController.deleteComment
)

module.exports = router