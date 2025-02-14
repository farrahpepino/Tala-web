const express = require('express');
const router = express.Router();
const {sendFriendRequest, acceptFriendRequest, declineFriendRequest, unfriend, getAllFriends, getFriendStatus} = require('../controllers/FriendsController')

router.post('/send', sendFriendRequest);
router.post('/accept', acceptFriendRequest);
router.post('/decline', declineFriendRequest);
router.post('/unfriend', unfriend);
router.get('/', getAllFriends);
router.get('/status', getFriendStatus);

