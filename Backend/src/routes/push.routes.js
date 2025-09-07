const express = require('express')
const pushController = require('../controllers/push.controller.js')
const authMiddleware = require('../middleware/auth.middleware.js')

const router = express.Router()

router.post('/subscribe',
    authMiddleware.authUserMiddleware,
    pushController.subscribe
)

module.exports = router