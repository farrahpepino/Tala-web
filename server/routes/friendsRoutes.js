const express = require('express');
const router = express.Router();

const { getRequests } = require('../controllers/Friends/getRequests');
const { sendRequest } = require('../controllers/Friends/sendRequest');
const { acceptRequest } = require('../controllers/Friends/acceptRequest');
const { declineRequest } = require('../controllers/Friends/declineRequest');

router.get('/getRequests/:senderId/:receiverId', getRequests);
router.post('/addRequest/:senderId/:receiverId', sendRequest);
router.post('/acceptRequest/:senderId/:receiverId', acceptRequest);
router.post('/declineRequest/:senderId/:receiverId', declineRequest);

module.exports = router;