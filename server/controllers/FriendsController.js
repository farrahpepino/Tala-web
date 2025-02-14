const mongoose = require('mongoose');
const {User} = require('../models/userModel')

//request friends

exports.sendFriendRequest = async(req, res)=>{
try{
    
    const {senderId, receiverId} = req.body;

    if(!senderId || !receiverId){
        return res.status(400).json({message: "SenderId and ReceiverId are required."})
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
        return res.status(404).json({ message: "Receiver not found." });
    }

    const alreadyRequested = receiver.friendRequests.some(
        (request) => {
            request.senderId.toString() === senderId
        }
    )

    if(alreadyRequested){
        return res.status(400).json({message: "Request already sent. "})
    }

    await User.UpdateOne(
    {_id: receiverId},
    {
        $push:{
            friendRequests:{
                senderId,
                status: 'pending',
                createdAt: new Date(), 
            }
        }
    });
    
    return res.status(200).json({message: "Friend request sent successfully!"})

}catch (error){
    console.error("Error sending friend request:", error);
    return res.status(500).json({ message: "Server error." });
}
}


exports.acceptFriendRequest = async(req, res) => {

    try{

        const {senderId, receiverId} = req.body;

        if(!senderId || !receiverId){
            return res.status(400).json({message: "SenderId and ReceiverId are required."})
        }        

        await User.updateOne(
            {_id : receiverId},
            {
                $pull:{
                    friendRequests:{
                        senderId,
                    }
                }
            },
            {
                $push:{
                friends: {
                    _id: senderId,
                    createdAt: new Date()
                }
                }
            }
        )


        await User.updateOne(
            {_id: senderId},
            {
               $push: {
                friends: {
                    _id: receiverId,
                    createdAt: new Date()
                }
               } 
            }
        )

    }catch(error){
        console.error("Error accepting friend request:", error)
        return res.status(500).json({message: "Internal server error."})
    }
}


exports.declineFriendRequest = async(req, res) => {

    try{

        const {senderId, receiverId} = req.body;

        if(!senderId || !receiverId){
            return res.status(400).json({message: "SenderId and ReceiverId are required."})
        }        

        await User.updateOne(
            {_id : receiverId},
            {
                $pull:{
                    friendRequests:{
                        senderId,
                    }
                }
            }
        )

        return res.status(200).json({message: "Friend request accepted."})
    }catch(error){
        console.error("Error declining friend request:", error)
        return res.status(500).json({message: "Internal server error."})
    }
}


//GET ALL FRIENDS
exports.getAllFriends =  async(req, res) => {
    try{
        const {userId} = req.body

        if (!userId){
            return res.status(400).json({message: "UserId is required. "})
        }

        const user = await User.findById(userId).populate("friends");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (!user.friends || user.friends.length === 0) {
            return res.status(200).json({ message: "This user has no friends.", friends: [] });
        }

        return res.status(200).json({ friends: user.friends });
    }
    catch(error){
        console.error("Error checking friend status:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}


exports.getFriendStatus = async(req, res) => {

    try{
    const {currentUserId, otherUserId} = req.body

    if(!currentUserId || !otherUserId){
        return res.status(400).json({message: "CurrentUserId and OtherUserId are required."})
    }

    const currentUser = await User.findById(currentUserId);
    const otherUser = await User.findById(otherUserId);

    if (!currentUser || !otherUser) {
        return res.status(404).json({ message: "User not found." });
    }


    if (currentUser.friends.some(friend => friend._id.toString === otherUserId)){
        return res.status(200).json({ status: "friends" });
    }

    if (otherUser.friendRequests.some(request => request.senderId.toString() === currentUserId)) {
        return res.status(200).json({ status: "pending" }); 
    }

    if (currentUser.friendRequests.some(request => request.senderId.toString() === otherUserId)) {
        return res.status(200).json({ status: "pending" }); 
    }

    return res.status(200).json({ status: "none" });


}
    catch(error){
        console.error("Error checking friend status:", error);
        return res.status(500).json({ message: "Internal server error." });
    }

}


exports.unfriend = async (req, res) => {
    const {currentUserId, otherUserId} = req.body


    if(!currentUserId || !otherUserId){
        return res.status(400).json({message: "CurrentUserId and OtherUserId are required."})
    }

    const currentUser = await User.findById(currentUserId);
    const otherUser = await User.findById(otherUserId);

    if (!currentUser || !otherUser) {
        return res.status(404).json({ message: "User not found." });
    }
  
    await User.updateOne(
        {_id: currentUserId},
        {
        $pull : {
            friends:{
                _id: otherUserId
            }
        }
    }
    );
    await User.updateOne(
        {_id: otherUserId},
        {
        $pull : {
            friends:{
                _id: currentUserId
            }
        }
    }
    );
}