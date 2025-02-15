const Post = require('../models/postModel'); 
const mongoose = require('mongoose');
const { User } = require('../models/userModel');

exports.createPost = async (req, res) => {
  const { description, postedBy } = req.body;

  if (!description || !postedBy) {
    return res.status(400).send({ message: 'Description and postedBy are required.' });
  }

  try {
    const newPost = new Post({
      description,
      postedBy, 
    });

    await newPost.save();

    res.status(201).send({ message: 'Post created successfully!', post: newPost });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};



exports.getUserPosts = async (req, res) => {
    let { userId } = req.params;
    try {
      const posts = await Post.find({ postedBy: userId })
        .populate('postedBy')
        .sort({ createdAt: -1 })
        .exec();

  
    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: 'No posts found for this user.' });
    }
  
    res.status(200).json(posts);
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' });
  }
  };


  //get all likes from a post

  // get all comments from a post

  
  //get friends and currentuser post
  exports.getHomePosts = async (req, res) => {
    try {
        const userId = req.params.userId;  

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const friendsIds = user.friends; 

        const posts = await Post.find({ 
                $or: [
                    { postedBy: userId },  
                    { postedBy: { $in: friendsIds } }  
                ]
            })
            .populate('postedBy')  
            .sort({ createdAt: -1 })  
            .exec();

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: "No posts found." });
        }

        return res.status(200).json(posts);  
    } catch (error) {
        console.error("Error fetching home posts:", error);
        return res.status(500).json({ error: "An error occurred while fetching posts." });
    }
};
