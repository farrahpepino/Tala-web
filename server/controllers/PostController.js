const Post = require('../models/postModel'); 
const mongoose = require('mongoose');

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
    console.error('Error saving post:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};



exports.getUserPosts = async (req, res) => {
    let { userId } = req.params;
    let posts;
    try {
      const posts = await Post.find({ postedBy: userId })
      .populate({
        path: 'postedBy',
        select: 'firstName lastName profile.profilePicture',
      })
      .sort({ createdAt: -1 })
      .exec();
  
    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: 'No posts found for this user.' });
    }
  
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
  };