const followModel = require('../models/follow.model.js');
const foodModel = require('../models/food.model.js');
const { emitTo, emitFollowerCount } = require('../socket/index.js'); // 🔔 NEW

async function followPartner(req, res, next) {
    try {
        const { partnerId } = req.body;
        const userId = req.user._id;

        const existingFollow = await followModel.findOne({ user: userId, partner: partnerId });
        if (existingFollow) {
            await followModel.deleteOne({ user: userId, partner: partnerId });

            // NEW: emit authoritative latest count after UNFOLLOW
            const count = await followModel.countDocuments({ partner: partnerId });
            emitFollowerCount(partnerId, count);

            return res.status(200).json({ message: 'Partner unfollowed', following: false });
        }

        // race-safe create
        try {
            await followModel.create({ user: userId, partner: partnerId });
        } catch (e) {
            // In case of race producing E11000, we treat as already-following then fall through.
            if (e?.code !== 11000) throw e;
        }

        // NEW: emit authoritative latest count after FOLLOW
        const count = await followModel.countDocuments({ partner: partnerId });
        emitFollowerCount(partnerId, count);

        // (optional) keep your realtime notification to the partner
        await emitTo({
            toRole: 'partner',
            toId: partnerId,
            type: 'follow:created',
            payload: { userId }
        });

        res.status(201).json({ message: 'Partner followed', following: true });
    } catch (error) {
        next(error);
    }
}

async function getFollowerCount(req, res, next) { 
    try {
        const { partnerId } = req.params;
        const count = await followModel.countDocuments({ partner: partnerId });
        res.status(200).json({ count });
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
    getFollowerCount,     
    getFollowedPartners,
    getFollowedFeed,
    getPartnerFollowers
};
