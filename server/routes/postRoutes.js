const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController')

router.post('/createPost', PostController.createPost)
router.get('/:userId/posts', PostController.getUserPosts);
router.get('/:userId/all-posts', PostController.getHomePosts);
router.delete('/:userId/:postId/delete', PostController.deletePost);
 
router.post('/:userId/:postId/new-comment', PostController.createComment);
router.get('/:postId/comments', PostController.getComments);
router.delete('/:userId/:postId/:commentId/delete', PostController.deleteComment);
router.post('/:postId/like', PostController.createLike);
router.post('/:postId/unlike', PostController.deleteLike);
router.get('/:postId/likes', PostController.getLikes);
router.get('/:userId/:postId', PostController.getPost);

module.exports = router;

