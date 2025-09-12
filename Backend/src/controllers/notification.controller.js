const Notification = require('../models/notification.model.js');

async function getUserNotifications(req, res) {
    const userId = req.user._id;
    const notifications = await Notification
        .find({ to: userId, toRole: 'user' })
        .sort({ createdAt: -1 });
    res.status(200).json({ notifications });
}

async function getPartnerNotifications(req, res) {
    const partnerId = req.foodPartner._id;
    const notifications = await Notification
        .find({ to: partnerId, toRole: 'partner' })
        .sort({ createdAt: -1 });
    res.status(200).json({ notifications });
}

async function markUserRead(req, res) {
    const userId = req.user._id;
    const { id } = req.params;
    await Notification.findOneAndUpdate({ _id: id, to: userId, toRole: 'user' }, { readAt: new Date() });
    res.status(200).json({ ok: true });
}

async function markPartnerRead(req, res) {
    const partnerId = req.foodPartner._id;
    const { id } = req.params;
    await Notification.findOneAndUpdate({ _id: id, to: partnerId, toRole: 'partner' }, { readAt: new Date() });
    res.status(200).json({ ok: true });
}

module.exports = {
    getUserNotifications,
    getPartnerNotifications,
    markUserRead,
    markPartnerRead
};
