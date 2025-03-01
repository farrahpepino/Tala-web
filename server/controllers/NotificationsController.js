const { User } = require('../models/userModel');

exports.getUnreadNotifications = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: "UserId is required." });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const unreadNotifications = user.notifications.filter(notification => !notification.isRead);
        return res.status(200).json({ notifications: unreadNotifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({ message: "Server error." });
    }
};

exports.markNotificationsAsRead = async (req, res) => {
    const { userId, notificationIds } = req.body;

    if (!userId || !notificationIds || notificationIds.length === 0) {
        return res.status(400).json({ message: "UserId and NotificationIds are required." });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user.notifications.forEach(notification => {
            if (notificationIds.includes(notification._id.toString())) {
                notification.isRead = true;
            }
        });

        await user.save();
        return res.status(200).json({ message: "Notifications marked as read." });
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

