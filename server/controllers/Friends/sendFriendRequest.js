// const Friend = require('../models/FriendsModel'); 
// const mongoose = require('mongoose');

// exports.sendFriendRequest = async (req, res) => {
//     try {
//         const { senderId, receiverId } = req.body; // Get senderId and receiverId from the request body

//         if (senderId === receiverId) {
//             return res.status(400).json({ message: 'You cannot send a friend request to yourself' });
//         }

//         const existingRequest = await FriendRequest.findOne({
//             $or: [
//                 { sender: senderId, receiver: receiverId },
//                 { sender: receiverId, receiver: senderId }
//             ]
//         });

//         if (existingRequest) {
//             return res.status(400).json({ message: 'Friend request already exists' });
//         }

//         const newFriendRequest = new FriendRequest({
//             sender: senderId,
//             receiver: receiverId,
//             status: 'pending',
//         });

//         await newFriendRequest.save();

//         res.status(201).json({
//             message: 'Friend request sent successfully',
//             friendRequest: newFriendRequest,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };
