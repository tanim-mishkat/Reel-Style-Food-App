const orderModel = require('../models/order.model.js');
const { emitTo } = require('../socket/index.js');

async function createOrder(req, res) {
    const { restaurantId, items, fulfillment } = req.body;
    const userId = req.user._id;

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
    });



    // 🔔 Realtime: notify partner
    await emitTo({
        toRole: 'partner',
        toId: restaurantId,
        type: 'order:created',
        payload: {
            orderId: order._id,
            userId,
            items,
            fulfillment,
            status: order.status,
            createdAt: order.createdAt
        }
    });

    res.status(201).json({ message: 'Order created successfully', order });
}

async function getOrderById(req, res) {
    const { id } = req.params;
    const userId = req.user._id;

    const order = await orderModel.findOne({ _id: id, userId });
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
        message: 'Order found',
        order: {
            _id: order._id,
            status: order.status,
            timeline: order.timeline,
            items: order.items,
            fulfillment: order.fulfillment,
            restaurantId: order.restaurantId,
            userId
        }
    });
}

async function getUserOrders(req, res) {
    const userId = req.user._id;
    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ orders });
}

async function getPartnerOrders(req, res) {
    const partnerId = req.foodPartner._id;
    const { status } = req.query;

    const filter = { restaurantId: partnerId };
    if (status) {
        filter.status = status;
    }

    const orders = await orderModel.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ orders });
}

async function updateOrderStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    const partnerId = req.foodPartner._id;

    const order = await orderModel.findOneAndUpdate(
        { _id: id, restaurantId: partnerId },
        {
            status,
            $push: { timeline: { at: new Date(), status, note: `Status updated to ${status}` } }
        },
        { new: true }
    );

    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }



    //  Realtime: notify user
    await emitTo({
        toRole: 'user',
        toId: order.userId,
        type: 'order:statusUpdated',
        payload: { orderId: order._id, status, at: new Date() }
    });

    res.status(200).json({ message: 'Order status updated', order });
}

async function batchUpdateOrderStatus(req, res) {
    const { orderIds, status } = req.body;
    const partnerId = req.foodPartner._id;

    const result = await orderModel.updateMany(
        { _id: { $in: orderIds }, restaurantId: partnerId },
        {
            status,
            $push: { timeline: { at: new Date(), status, note: `Batch updated to ${status}` } }
        }
    );

    res.status(200).json({ message: `${result.modifiedCount} orders updated`, modifiedCount: result.modifiedCount });
}

module.exports = {
    createOrder,
    getOrderById,
    getUserOrders,
    getPartnerOrders,
    updateOrderStatus,
    batchUpdateOrderStatus
};
