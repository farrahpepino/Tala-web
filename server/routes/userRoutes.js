const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.get('/search', UserController.searchUsers)
router.patch('/profile/:userId', UserController.updateProfile);
router.get('/:userId', UserController.getUserData)



module.exports = router;
