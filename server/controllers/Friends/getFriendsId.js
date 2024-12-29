const Friends = require('../../models/friendsModel');


const getFriendsId = async (req, res) => {
    console.log('heyyyyy')
    try {
        const { senderId, receiverId } = req.params;

        const friendship = await Friends.findOne({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId },
            ],
        });

        if (!friendship) {
            return res.status(200).send({ friendsId: null, message: 'No Friendship Exists' });
        }
        res.status(200).send({ friendsId: friendship._id });
    } catch (error) {
        console.error('Error fetching friendsId:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

module.exports = { getFriendsId };
