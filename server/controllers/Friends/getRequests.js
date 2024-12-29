const Friends = require('../../models/friendsModel'); 
const { User } = require('../../models/userModel');

const getRequests = async (req, res) => {
    const { senderId, receiverId } = req.body;

    try {
        const user = await User.findById(receiverId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const requests = user.friendRequests;
        res.status(200).send(requests);
    } catch (error) {
        console.error('Error fetching friend requests:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

module.exports = {getRequests};
