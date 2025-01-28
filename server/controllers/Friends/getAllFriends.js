// const Friend = require('../models/FriendsModel'); 
// const mongoose = require('mongoose');


// exports.getAllFriendRequests = async (req, res) => {
//     try {
//         const { userId } = req.params; 
//         const friendRequests = await FriendRequest.find({
//             $or: [{ sender: userId }, { receiver: userId }],
//         }).populate('sender receiver');

//         res.status(200).json(friendRequests);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };