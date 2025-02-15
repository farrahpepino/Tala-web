const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController')

router.post('/createPost', PostController.createPost)
router.get('/:userId/posts', PostController.getUserPosts);

module.exports = router;
