const express = require('express');
const router = express.Router();
const { createPost } = require('../controllers/Post/createPost')
const {getUserPosts} = require('../controllers/Post/getUserPosts')
router.post('/createPost', createPost)
router.get('/user/:userId/posts', getUserPosts);

module.exports = router;
