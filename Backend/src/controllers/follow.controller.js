const followModel = require('../models/follow.model.js');
const foodModel = require('../models/food.model.js');
const { emitTo } = require('../socket/index.js');

async function followPartner(req, res, next) {
    try {
        const { partnerId } = req.body;
        const userId = req.user._id;

        const existingFollow = await followModel.findOne({ user: userId, partner: partnerId });
        if (existingFollow) {
            await followModel.deleteOne({ user: userId, partner: partnerId });
            return res.status(200).json({ message: 'Partner unfollowed', following: false });
        }

        const follow = await followModel.create({ user: userId, partner: partnerId });

        // 🔔 Realtime: notify partner
        await emitTo({
            toRole: 'partner',
            toId: partnerId,
            type: 'follow:created',
            payload: { userId }
        });

        res.status(201).json({ message: 'Partner followed', following: true, followId: follow._id });
    } catch (error) {
        next(error);
    }
}

async function getFollowedPartners(req, res, next) {
    try {
        const userId = req.user._id;
        const follows = await followModel.find({ user: userId }).populate('partner', 'fullName');
        res.status(200).json({ partners: follows });
    } catch (error) {
        next(error);
    }
}

async function getFollowedFeed(req, res, next) {
    try {
        const userId = req.user._id;
        const follows = await followModel.find({ user: userId }).select('partner');
        const partnerIds = follows.map(f => f.partner);

        const foodItems = await foodModel.find({ foodPartner: { $in: partnerIds } })
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({ foodItems });
    } catch (error) {
        next(error);
    }
}

async function getPartnerFollowers(req, res, next) {
    try {
        const partnerId = req.foodPartner._id;
        const followers = await followModel.find({ partner: partnerId }).populate('user', 'fullName');
        res.status(200).json({ followers });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    followPartner,
    getFollowedPartners,
    getFollowedFeed,
    getPartnerFollowers
};
