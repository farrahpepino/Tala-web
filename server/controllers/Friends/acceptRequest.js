const { User, validate } = require('../../models/userModel');

const acceptRequest = async (req, res) => {
    try {
        const {senderId, receiverId} = req.params;
        const user = await User.findOne({ _id: receiverId });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        user.friends.push(senderId);
        user.friendRequests.pull(senderId);
        await user.save();

        res.status(200).send({ message: 'Friend request accepted successfully' });
    } catch (error) {
        console.error('Error accepting friend request:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

module.exports = acceptRequest;