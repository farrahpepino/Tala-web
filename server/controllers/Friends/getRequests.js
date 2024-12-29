const { User, validate } = require('../../models/userModel');

const getRequests = async (req, res) => {
    const {senderId, receiverId} = req.params;
    const user = await User.findById(receiverId);
    if (!user) {
        return res.status(404).send({ message: 'User not found' });
    }

    const requests = user.friendRequests;
    res.status(200).send(requests);
}

module.exports = { getRequests };