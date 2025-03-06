const mongoose = require('mongoose'); 
const { User } = require('../models/userModel');
const Chat = require('../models/ChatModel');
const Post = require('../models/postModel'); 
const {s3, PutObjectCommand} = require('../services/s3Service') 
require("dotenv").config();

exports.uploadProfilePicture = async (req, res) => {
  const { userId } = req.params;
  const file = req.file;

  if (!userId || !file) {
    return res.status(400).send({ message: 'User ID and file are required.' });
  }

  const fileKey = `users/${userId}/profilepictures/${Date.now()}-${file.originalname}`;

  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };

  try {
    const command = new PutObjectCommand(s3Params);
    await s3.send(command);
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { 'profile.profilePicture': fileUrl } },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile picture uploaded successfully',
      fileUrl,
      profilePicture: user.profile.profilePicture,
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).send({ message: 'Error uploading profile picture' });
  }
};


exports.getUserData = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).send({ message: 'No userId provided.' });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send({ message: 'Invalid userId format.' });
  }

  try {
    const user = await User.findOne({ _id: userId }).lean();
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

   

    res.status(200).json(user);
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};


exports.searchUsers = async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).send({ message: 'Query is required' });
    }

    try {
        const users = await User.find({
            $or: [
                {
                    $and: [
                        { firstName: { $regex: query, $options: 'i' } },
                        { lastName: { $regex: query, $options: 'i' } }
                    ]
                },
                { firstName: { $regex: query, $options: 'i' } },
                { lastName: { $regex: query, $options: 'i' } }
            ]
        });
        
        
        res.status(200).send(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

exports.updateProfile = async (req, res) => {
  

  const { userId } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: req.body }, 
      { new: true } 
    );

    if (!updatedUser) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User updated:', updatedUser);
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteAccount = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send({ message: 'Invalid userId format.' });
  }

  try {
    await Post.deleteMany({ postedBy: userId });
    await Post.updateMany(
      { 'comments.commentBy': userId }, 
      { $pull: { comments: { commentBy: userId } } } // Remove all comments by the user
    );
    await Post.updateMany(
      { 'likes.likedBy': userId }, 
      { $pull: { likes: { likedBy: userId } } } // Remove all likes by the user
    );
    await User.updateMany(
      { 'friends.userId': userId }, // Find all users where the userId exists in their friends array
      { $pull: { friends: { userId: userId } } } // Remove the userId from the friends array
    );
    await Chat.deleteMany({
      participants: { $in: [userId] }
    });
        
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).send({ message: 'User not found.' });
    }

    res.status(200).send({ message: 'Account and associated data deleted successfully.' });
  } catch (error) {
    console.error('Error deleting account and associated data:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};


