const express = require('express')
const orderController = require('../controllers/order.controller.js')
const authMiddleware = require('../middleware/auth.middleware.js')

const router = express.Router()

router.post('/',
    authMiddleware.authUserMiddleware,
    orderController.createOrder
)

router.get('/:id',
    authMiddleware.authUserMiddleware,
    orderController.getOrderById
)

router.get('/partner/orders',
    authMiddleware.authFoodPartnerMiddleware,
    orderController.getPartnerOrders
)

module.exports = router