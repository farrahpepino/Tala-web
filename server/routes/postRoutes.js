const express = require('express');
const router = express.Router();
const { createPost, getUserPosts } = require('../controllers/PostController')

router.post('/createPost', createPost)
router.get('/user/:userId/posts', getUserPosts);

module.exports = router;
