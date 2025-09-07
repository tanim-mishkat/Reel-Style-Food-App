async function getUserNotifications(req, res) {
    const userId = req.user._id.toString();
    const notifications = global.userNotifications || [];
    const userNotifications = notifications.filter(n => n.userId.toString() === userId);
    res.status(200).json({ notifications: userNotifications });
}

async function getPartnerNotifications(req, res) {
    const partnerId = req.foodPartner._id.toString();
    const notifications = global.partnerNotifications || [];
    const partnerNotifications = notifications.filter(n => n.partnerId.toString() === partnerId);
    res.status(200).json({ notifications: partnerNotifications });
}

module.exports = {
    getUserNotifications,
    getPartnerNotifications
}