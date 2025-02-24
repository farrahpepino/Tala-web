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

exports.deletePost = async (req, res) =>{
  let {userId, postId} = req.params;
  console.log(postId, userId);

  try{
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    if (post.postedBy.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this post." });
    }

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ error: "An error occurred while deleting the post." });
  }

}

exports.getPost = async(req,res) => {
  let {userId, postId} = req.params;
  try {
    const post = await Post.findById(postId)
      .populate('postedBy')
      .sort({ createdAt: -1 })
      .exec();


  if (!post || post.length === 0) {
    return res.status(404).json({ message: 'No post with this postId.' });
  }

  res.status(200).json(post);
} catch (error) {
  console.error(error)
  res.status(500).json({ message: 'Internal Server Error' });
}
}
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


exports.createComment = async (req, res) => {
  const { userId, postId } = req.params; 

  const {content} =req.body

  if (!postId || !content || !userId) {
    return res.status(400).json({ message: 'PostId, content, and userId are required.' });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    post.comments.push({
      commentBy: userId,
      content,
    });

    await post.save();

    res.status(201).json({ message: 'Comment created successfully!', comment: post.comments[post.comments.length - 1] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteComment = async (req, res) => {
  const { postId, commentId, userId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    if (comment.commentBy.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this comment.' });
    }

    comment.remove();

    await post.save();

    return res.status(200).json({ message: 'Comment deleted successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getComments = async (req, res) => {
  const { postId } = req.params;
  console.log(postId);
  try {
    const post = await Post.findById(postId).populate('comments.commentBy');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    res.status(200).json(post.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.createLike = async (req, res) => {
  const { userId } = req.body;
  const {postId} = req.params;
  if (!postId || !userId) {
    return res.status(400).json({ message: 'PostId and userId are required.' });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const alreadyLiked = post.likes.some(like => like.likedBy.toString() === userId);
    if (alreadyLiked) {
      return res.status(400).json({ message: 'You have already liked this post.' });
    }

    post.likes.push({
      likedBy: userId,
    });

    await post.save();

    res.status(201).json({ message: 'Post liked successfully!', like: post.likes[post.likes.length - 1] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteLike = async (req, res) => {
  const { userId } = req.body;
  const {postId} = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const likeIndex = post.likes.findIndex(like => like.likedBy.toString() === userId);
    if (likeIndex === -1) {
      return res.status(404).json({ message: 'Like not found.' });
    }

    post.likes.splice(likeIndex, 1);

    await post.save();

    return res.status(200).json({ message: 'Like removed successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.getLikes = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId).populate('likes.likedBy');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    res.status(200).json(post.likes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
