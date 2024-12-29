const Friends = require('../../models/friendsModel');

const sendRequest = async (req, res) => {
    const { sender, receiver } = req.params;
    const { status } = req.body;

    try {
        // Check if a request already exists between the sender and receiver
        const existingRequest = await Friends.findOne({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender },
            ],
        });

        if (existingRequest) {
            // Prevent new request if an existing one is already in progress
            if (existingRequest.status === 'pending') {
                return res.status(409).send({ message: 'Friend request already pending.' });
            }
            if (existingRequest.status === 'accepted') {
                return res.status(409).send({ message: 'Users are already friends.' });
            }
        }

        // Create a new friend request
        const friendRequest = new Friends({ sender, receiver, status: 'pending' });
        await friendRequest.save();

        res.status(200).send({ message: 'Friend request sent successfully.' });
    } catch (error) {
        console.error('Error in sendRequest controller:', error);
        res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = { sendRequest };
