const FriendRequest = require('../models/FriendRequest'); // Import the FriendRequest model
const mongoose = require('mongoose');

// Get the status of a specific friend request
exports.getStatus = async (req, res) => {
    try {
        const { friendRequestId } = req.params; 

        const friendRequest = await FriendRequest.findById(friendRequestId);

        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found' });
        }

        res.status(200).json({
            message: 'Friend request status fetched successfully',
            status: friendRequest.status,
            statusChangedAt: friendRequest.statusChangedAt,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
