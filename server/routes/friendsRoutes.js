const express = require('express');
const router = express.Router();

const { getRequests } = require('../controllers/Friends/getRequests');
const { sendRequest } = require('../controllers/Friends/sendRequest');
const { acceptRequest } = require('../controllers/Friends/acceptRequest');
const { declineRequest } = require('../controllers/Friends/declineRequest');

router.get('/getRequests/:senderId/:receiverId', getRequests);
router.post('/sendRequest', sendRequest);
router.post('/accept/:senderId/:receiverId', acceptRequest);
router.post('/decline/:senderId/:receiverId', declineRequest);

module.exports = router;