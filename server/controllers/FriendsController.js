const mongoose = require('mongoose');
const { User } = require('../models/userModel');

// Send Friend Request (Manual Approach)
exports.sendFriendRequest = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;

        if (!senderId || !receiverId) {
            return res.status(400).json({ message: "SenderId and ReceiverId are required." });
        }

        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: "Receiver not found." });
        }

        const alreadyRequested = receiver.friendRequests.some(
            request => request.senderId.toString() === senderId
        );

        if (alreadyRequested) {
            return res.status(400).json({ message: "Request already sent." });
        }

        // Manually add the friend request to receiver's friendRequests array
        receiver.friendRequests.push({
            senderId,
            status: 'pending',
            createdAt: new Date(),
        });

        // Save the updated receiver
        await receiver.save();

        const notification = {
            type: 'friend_request',
            senderId,
            message: `You have received a friend request from ${senderId}`,
        };

        receiver.notifications.push(notification);
        await receiver.save();

        return res.status(200).json({ message: "Friend request sent successfully!" });
    } catch (error) {
        console.error("Error sending friend request:", error);
        return res.status(500).json({ message: "Server error." });
    }
};


// Accept Friend Request (Manual Approach)
exports.acceptFriendRequest = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;

        if (!senderId || !receiverId) {
            return res.status(400).json({ message: "SenderId and ReceiverId are required." });
        }

        // Retrieve both users
        const receiver = await User.findById(receiverId);
        const sender = await User.findById(senderId);

        if (!receiver || !sender) {
            return res.status(404).json({ message: "User not found." });
        }

        // Remove the friend request from receiver's friendRequests
        receiver.friendRequests = receiver.friendRequests.filter(
            request => request.senderId.toString() !== senderId
        );

        // Add both users to each other's friends list
        receiver.friends.push({ _id: senderId, createdAt: new Date() });
        sender.friends.push({ _id: receiverId, createdAt: new Date() });

        // Save the updated users
        await receiver.save();
        await sender.save();

        const userReceiver = await User.findById(receiverId);
        const fullNameReceiver = `${userReceiver.firstName} ${userReceiver.lastName}`;
        const userSender = await User.findById(senderId);
        const fullNameSender = `${userSender.firstName} ${userSender.lastName}`;
    

        const notificationReceiver = {
            type: 'friend_request_accepted',
            senderId,
            message: `You are now friends with ${fullNameSender}`,
        };

        const notificationSender = {
            type: 'friend_request_accepted',
            senderId: receiverId,
            message: `Your friend request to ${fullNameReceiver} has been accepted.`,
        };

        receiver.notifications.push(notificationReceiver);
        sender.notifications.push(notificationSender);

        // Save the notifications
        await receiver.save();
        await sender.save();


        return res.status(200).json({ message: "Friend request accepted, both users are now friends." });
    } catch (error) {
        console.error("Error accepting friend request:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

exports.declineFriendRequest = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;

        if (!senderId || !receiverId) {
            return res.status(400).json({ message: "SenderId and ReceiverId are required." });
        }

        // Retrieve the receiver and sender
        const receiver = await User.findById(receiverId);
        const sender = await User.findById(senderId);

        if (!receiver) {
            return res.status(404).json({ message: "Receiver not found." });
        }

        if (!sender) {
            return res.status(404).json({ message: "Sender not found." });
        }

        // Debug: Log current state of friendRequests
        console.log("Receiver friend requests before decline:", receiver.friendRequests);
        console.log("Sender friend requests before decline:", sender.friendRequests);

        // Find the index of the friend request in receiver's friendRequests array
        const receiverRequestIndex = receiver.friendRequests.findIndex(
            request => request.senderId.toString() === senderId
        );

        if (receiverRequestIndex !== -1) {
            // If found, remove it
            receiver.friendRequests.splice(receiverRequestIndex, 1);
            console.log("Receiver's friend requests after removal:", receiver.friendRequests);
        } else {
            console.log("No matching request found in receiver's friend requests.");
        }

        // Find the index of the friend request in sender's friendRequests array
        const senderRequestIndex = sender.friendRequests.findIndex(
            request => request.receiverId.toString() === receiverId
        );

        if (senderRequestIndex !== -1) {
            // If found, remove it
            sender.friendRequests.splice(senderRequestIndex, 1);
            console.log("Sender's friend requests after removal:", sender.friendRequests);
        } else {
            console.log("No matching request found in sender's friend requests.");
        }

        // Save both updated users
        await receiver.save();
        await sender.save();

        return res.status(200).json({ message: "Friend request declined and removed from both sides." });
    } catch (error) {
        console.error("Error declining friend request:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};



// Get All Friends
exports.getAllFriends = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "UserId is required." });
        }

        const user = await User.findById(userId).populate("friends");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (!user.friends || user.friends.length === 0) {
            return res.status(200).json({ message: "This user has no friends.", friends: [] });
        }

        return res.status(200).json({ friends: user.friends });
    } catch (error) {
        console.error("Error checking friend status:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// Get Friend Status
exports.getFriendStatus = async (req, res) => {
    const { currentUserId, otherUserId } = req.query;

    if (!currentUserId || !otherUserId) {
        return res.status(400).json({ message: "CurrentUserId and OtherUserId are required." });
    }

    try {
        const currentUser = await User.findById(currentUserId);
        const otherUser = await User.findById(otherUserId);

        if (!currentUser || !otherUser) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if both users are friends
        if (currentUser.friends.some(friend => friend._id.toString() === otherUserId)) {
            return res.status(200).json({ status: "friends" });
        }

        // Check if there's a pending request from the current user to the other user
        const pendingRequestFromCurrent = otherUser.friendRequests.find(
            request => request.senderId.toString() === currentUserId
        );

        if (pendingRequestFromCurrent) {
            return res.status(200).json({
                status: "pending",
                senderId: pendingRequestFromCurrent.senderId.toString(),
            });
        }

        // Check if there's a pending request from the other user to the current user
        const pendingRequestFromOther = currentUser.friendRequests.find(
            request => request.senderId.toString() === otherUserId
        );

        if (pendingRequestFromOther) {
            return res.status(200).json({
                status: "pending",
                senderId: pendingRequestFromOther.senderId.toString(),
            });
        }

        return res.status(200).json({ status: "none" });
    } catch (error) {
        console.error("Error checking friend status:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// Unfriend (Manual Approach)
exports.unfriend = async (req, res) => {
    const { currentUserId, otherUserId } = req.body;

    if (!currentUserId || !otherUserId) {
        return res.status(400).json({ message: "CurrentUserId and OtherUserId are required." });
    }

    try {
        // Retrieve both users
        const currentUser = await User.findById(currentUserId);
        const otherUser = await User.findById(otherUserId);

        if (!currentUser || !otherUser) {
            return res.status(404).json({ message: "User not found." });
        }

        // Remove the other user from the current user's friends array
        currentUser.friends = currentUser.friends.filter(
            friend => friend._id.toString() !== otherUserId
        );

        // Remove the current user from the other user's friends array
        otherUser.friends = otherUser.friends.filter(
            friend => friend._id.toString() !== currentUserId
        );

        // Save both users
        await currentUser.save();
        await otherUser.save();

        return res.status(200).json({ message: "Unfriended successfully." });
    } catch (error) {
        console.error("Error unfriending:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
