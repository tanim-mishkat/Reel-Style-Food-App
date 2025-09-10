const express = require('express')
const authController = require('../controllers/auth.controller.js')
const authMiddleware = require('../middleware/auth.middleware.js')
const multer = require('multer')

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
})

// Middleware to handle optional file upload
const optionalUpload = (req, res, next) => {
    upload.single('profileImg')(req, res, (err) => {
        if (err && err.code !== 'LIMIT_UNEXPECTED_FILE') {
            return next(err);
        }
        next();
    });
}

const router = express.Router()


//user auth API

router.post('/user/register', authController.registerUser)
router.post('/user/login', authController.loginUser)
router.get('/user/logout', authController.logoutUser)
router.get('/user/profile', authMiddleware.authUserMiddleware, authController.getUserProfile)
router.patch('/user/profile', authMiddleware.authUserMiddleware, authController.updateUserProfile)


// food partner auth API

router.post('/foodpartner/register', optionalUpload, authController.registerFoodPartner)
router.post('/foodpartner/login', authController.loginFoodPartner)
router.get('/foodpartner/logout', authController.logoutFoodPartner)

module.exports = router