const Friends = require('../../models/friendsModel'); 
const { User } = require('../../models/userModel');

const acceptRequest = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;

        const receiver = await User.findById(receiverId);
        const sender = await User.findById(senderId);

        if (!receiver || !sender) {
            return res.status(404).send({ message: 'One of the users not found' });
        }

        const friendRequest = await Friends.findOne({
            sender: senderId,
            receiver: receiverId,
            status: 'pending'
        });

        if (!friendRequest) {
            return res.status(404).send({ message: 'Friend request not found or already processed' });
        }

        friendRequest.status = 'accepted';
        await friendRequest.save();

        receiver.friendRequests.pull(senderId);
        receiver.friends.push(senderId);
        sender.friends.push(receiverId);

        await receiver.save();
        await sender.save();

        res.status(200).send({ message: 'Friend request accepted successfully' });
    } catch (error) {
        console.error('Error accepting friend request:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

module.exports = {acceptRequest};
