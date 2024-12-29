const User = require('../../models/userModel');
const mongoose = require('mongoose');
const Friends = require('../../models/friendsModel');

const getStatus = async (req, res) => {
    try {
        const { friendsId } = req.params;

        const newFriendsId = friendsId.replace(/[^\w\d]/g, ''); 

        const friendship = await Friends.findById(friendsId);

        if (!friendship) {
            return res.status(200).send({ status: 'NF', message: 'Not Friends' });
        }

        const senderId = friendship.sender.toString();
        const receiverId = friendship.receiver.toString();

        if (friendship.status === 'pending') {
            return res.status(200).send({
                status:  'pending' 
                ,
                sender: friendship.sender,
            });
        }

        if (friendship.status === 'accepted') {
            return res.status(200).send({ status: 'accepted', message: 'Friends' });
        }

        res.status(200).send({ status: friendship.status,  message: 'Friendship Status' });
    } catch (error) {
        console.error('Error fetching friendship status:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};
module.exports = { getStatus };