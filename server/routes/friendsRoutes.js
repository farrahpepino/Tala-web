const express = require('express');
const router = express.Router();

const { sendRequest } = require('../controllers/Friends/sendRequest');
const { acceptRequest } = require('../controllers/Friends/acceptRequest');
const { declineRequest } = require('../controllers/Friends/declineRequest');
const { getStatus } = require('../controllers/Friends/getStatus')
const {getFriendsId} = require('../controllers/Friends/getFriendsId')
router.get('/friend-status/:friendsId', getStatus);
router.post('/sendRequest/:sender/:receiver', sendRequest);
router.post('/accept', acceptRequest);
router.post('/decline', declineRequest);
router.get('/getFriendsId/:senderId/:receiverId', getFriendsId);
module.exports = router;