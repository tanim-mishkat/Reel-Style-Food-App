const express = require('express')
const menuController = require('../controllers/menu.controller.js')
const authMiddleware = require('../middleware/auth.middleware.js')

const router = express.Router()

router.post('/',
    authMiddleware.authFoodPartnerMiddleware,
    menuController.createMenuItem
)

router.get('/me',
    authMiddleware.authFoodPartnerMiddleware,
    menuController.getMyMenuItems
)

router.get('/:id',
    menuController.getMenuItems
)

router.patch('/:id',
    authMiddleware.authFoodPartnerMiddleware,
    menuController.updateMenuItem
)

router.delete('/:id',
    authMiddleware.authFoodPartnerMiddleware,
    menuController.deleteMenuItem
)

module.exports = router