const mongoose = require('mongoose'); 
const { User } = require('../models/userModel');
const Chat = require('../models/ChatModel');
const Post = require('../models/postModel'); 
require("dotenv").config();
const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");


const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read", // Make uploaded images public
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `profile-photos/${Date.now()}-${file.originalname}`);
    },
  }),
})

exports.getUserData = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).send({ message: 'No userId provided.' });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send({ message: 'Invalid userId format.' });
  }

  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const userData = await User.findOne({ _id: userObjectId }).lean();

    if (!userData) {
      return res.status(404).send({ message: 'User not found.' });
    }

    res.status(200).json(userData);
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

exports.addProfilePhoto = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Save S3 URL to user profile
    user.profile.profilePicture = req.file.location;
    await user.save();

    res.status(200).json({
      message: "Profile photo uploaded successfully!",
      profilePicture: req.file.location, // S3 URL
    });
  } catch (error) {
    console.error("Error uploading profile photo:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};;


exports.getProfilePhoto = async (req, res) => {
  try {
      const { userId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: "User not found." });
      }

      if (!user.profile.profilePicture) {
          return res.status(404).json({ message: "Profile photo not set." });
      }

      res.status(200).json({ profilePicture: user.profile.profilePicture });
  } catch (error) {
      console.error("Error fetching profile photo:", error);
      res.status(500).json({ message: "Internal server error." });
  }
};
