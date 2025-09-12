const express = require('express');
const authMiddleware = require('../middleware/auth.middleware.js');
const notificationController = require('../controllers/notification.controller.js');

const router = express.Router();

router.get('/user',
    authMiddleware.authUserMiddleware,
    notificationController.getUserNotifications
);

router.get('/partner',
    authMiddleware.authFoodPartnerMiddleware,
    notificationController.getPartnerNotifications
);

router.patch('/user/:id/read',
    authMiddleware.authUserMiddleware,
    notificationController.markUserRead
);

router.patch('/partner/:id/read',
    authMiddleware.authFoodPartnerMiddleware,
    notificationController.markPartnerRead
);

module.exports = router;
