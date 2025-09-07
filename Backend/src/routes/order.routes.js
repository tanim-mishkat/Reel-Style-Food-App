const express = require('express')
const orderController = require('../controllers/order.controller.js')
const authMiddleware = require('../middleware/auth.middleware.js')

const router = express.Router()

router.post('/',
    authMiddleware.authUserMiddleware,
    orderController.createOrder
)

router.get('/user',
    authMiddleware.authUserMiddleware,
    orderController.getUserOrders
)

router.get('/:id',
    authMiddleware.authUserMiddleware,
    orderController.getOrderById
)

router.get('/partner/orders',
    authMiddleware.authFoodPartnerMiddleware,
    orderController.getPartnerOrders
)

router.patch('/:id/status',
    authMiddleware.authFoodPartnerMiddleware,
    orderController.updateOrderStatus
)

router.patch('/batch/status',
    authMiddleware.authFoodPartnerMiddleware,
    orderController.batchUpdateOrderStatus
)

module.exports = router