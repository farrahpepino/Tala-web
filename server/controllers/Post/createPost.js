const Post = require('../../models/postModel'); 
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
