const express = require('express');
const router = express.Router();
const NotificationsController = require('../controllers/NotificationsController');


router.get('/notifications/unread', NotificationsController.getUnreadNotifications);
router.post('/notifications/mark-read', NotificationsController.markNotificationsAsRead);

module.exports = router;
