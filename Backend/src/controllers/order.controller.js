const orderModel = require('../models/order.model.js')

async function createOrder(req, res) {
    const { restaurantId, items, fulfillment } = req.body
    const userId = req.user._id

    const order = await orderModel.create({
        userId,
        restaurantId,
        items,
        fulfillment,
        status: 'PLACED',
        timeline: [{
            at: new Date(),
            status: 'PLACED',
            note: 'Order placed successfully'
        }]
    })

    res.status(201).json({ message: 'Order created successfully', order })
}

async function getOrderById(req, res) {
    const { id } = req.params
    const userId = req.user._id

    const order = await orderModel.findOne({ _id: id, userId })
    if (!order) {
        return res.status(404).json({ message: 'Order not found' })
    }

    res.status(200).json({ 
        message: 'Order found', 
        order: {
            _id: order._id,
            status: order.status,
            timeline: order.timeline,
            items: order.items,
            fulfillment: order.fulfillment
        }
    })
}

async function getPartnerOrders(req, res) {
    const partnerId = req.user._id
    const { status } = req.query

    const filter = { restaurantId: partnerId }
    if (status) {
        filter.status = status
    }

    const orders = await orderModel.find(filter).sort({ createdAt: -1 })
    res.status(200).json({ orders })
}

module.exports = {
    createOrder,
    getOrderById,
    getPartnerOrders
}