const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/ChatController');

router.post('/send', ChatController.sendMessage);
router.get('/:chatId', ChatController.getMessages);
router.get('/chatId', ChatController.getChatId);
router.get('/chatList', chatController.getChatList);

module.exports = router;
