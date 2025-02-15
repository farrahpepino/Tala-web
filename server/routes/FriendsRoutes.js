const express = require('express');
const router = express.Router();
const FriendsController = require('../controllers/FriendsController')

router.post('/send', FriendsController.sendFriendRequest);
router.post('/accept', FriendsController.acceptFriendRequest);
router.post('/decline', FriendsController.declineFriendRequest);
router.post('/unfriend', FriendsController.unfriend);
router.get('/', FriendsController.getAllFriends);
router.get('/status', FriendsController.getFriendStatus);

module.exports = router;
