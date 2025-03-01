const express = require('express');
const router = express.Router();
const NotificationsController = require('../controllers/NotificationsController');


router.get('/:userId/unread', NotificationsController.getUnreadNotifications);
router.post('/:userId/mark-read', NotificationsController.markNotificationsAsRead);

module.exports = router;
