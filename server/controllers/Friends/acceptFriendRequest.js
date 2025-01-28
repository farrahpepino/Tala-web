// const Friend = require('../models/FriendsModel'); 
// const mongoose = require('mongoose');

// exports.acceptFriendRequest = async (req, res) => {
//     try {
//         const { friendRequestId } = req.params;

//         const friendRequest = await FriendRequest.findById(friendRequestId);

//         if (!friendRequest) {
//             return res.status(404).json({ message: 'Friend request not found' });
//         }

//         if (friendRequest.status !== 'pending') {
//             return res.status(400).json({ message: 'Friend request is no longer pending' });
//         }

//         await friendRequest.updateStatus('accepted');

//         res.status(200).json({
//             message: 'Friend request accepted successfully',
//             friendRequest,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };