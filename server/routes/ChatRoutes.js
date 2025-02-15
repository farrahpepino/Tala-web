const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/ChatController');

router.post('/send', ChatController.sendMessage);
router.get('/:chatId', ChatController.getMessages);
router.get('/chatId/:currentUserId/:otherUserId', ChatController.getChatId);
router.get('/chatList/:currentUserId', ChatController.getChatList);

module.exports = router;
