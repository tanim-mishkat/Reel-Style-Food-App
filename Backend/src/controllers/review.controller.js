const reviewModel = require('../models/review.model.js');
const orderModel = require('../models/order.model.js');
const { emitTo } = require('../socket/index.js');

async function createReview(req, res) {
    const { orderId, stars } = req.body;
    const userId = req.user._id;

    const order = await orderModel.findOne({ _id: orderId, userId, status: 'COMPLETED' });
    if (!order) {
        return res.status(400).json({ message: 'Order not found or not completed' });
    }

    const existingReview = await reviewModel.findOne({ orderId, userId });
    if (existingReview) {
        return res.status(400).json({ message: 'Review already exists for this order' });
    }

    const review = await reviewModel.create({
        orderId,
        userId,
        restaurantId: order.restaurantId,
        stars
    });

    // console.log(`New review created: User ${userId} rated Order ${orderId} with ${stars} stars`);

    // Realtime: notify partner
    await emitTo({
        toRole: 'partner',
        toId: order.restaurantId,
        type: 'review:created',
        payload: { reviewId: review._id, orderId, stars, userId }
    });

    res.status(201).json({ message: 'Review created successfully', review });
}

async function getPartnerReviews(req, res) {
    const { id } = req.params;
    const reviews = await reviewModel.find({ restaurantId: id });
    const averageStars = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length : 0;
    res.status(200).json({ averageStars: averageStars.toFixed(1), totalReviews: reviews.length });
}

module.exports = { createReview, getPartnerReviews };
