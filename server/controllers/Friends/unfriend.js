// const Friend = require('../models/FriendsModel'); 
// exports.unfriend = async (req, res) => {
//     try {
//         const { userId, friendId } = req.params; 

//         const friendRequest = await FriendRequest.findOne({
//             $or: [
//                 { sender: userId, receiver: friendId, status: 'accepted' },
//                 { sender: friendId, receiver: userId, status: 'accepted' }
//             ]
//         });

//         if (!friendRequest) {
//             return res.status(404).json({ message: 'Friendship not found or not accepted' });
//         }

//         await FriendRequest.findByIdAndDelete(friendRequest._id);

//         res.status(200).json({
//             message: 'Friendship removed successfully',
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };
