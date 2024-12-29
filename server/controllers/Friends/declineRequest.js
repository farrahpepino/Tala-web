const { User, validate } = require('../../models/userModel');

const declineRequest = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;
        const user = await User.findById(receiverId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        user.friendRequests.pull(senderId);
        await user.save();

        res.status(200).send({ message: 'Friend request declined successfully' });  
    } catch (error) {
        console.error('Error declining friend request:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }