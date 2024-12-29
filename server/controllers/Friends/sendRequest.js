const { User } = require('../../models/userModel');
const Friends = require('../../models/friendsModel'); 

const sendRequest = async (req, res) => {
    try {
        const { sender, receiver, status } = req.body;

        const user = await User.findById(receiver);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const existingRequest = await Friends.findOne({
            sender: sender,
            receiver: receiver,
            status: status
        });

        if (existingRequest) {
            return res.status(400).send({ message: 'Friend request already sent' });
        }

        const friendRequest = new Friends({
            sender: sender,
            receiver: receiver,
            status: status
        });

        await friendRequest.save();
        res.status(200).send({ message: 'Friend request sent successfully' });

    } catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

module.exports = {sendRequest};
