const express = require('express');
const router = express.Router();
const {sendMessage, getMessages, getChatId} = require('../controllers/ChatController')

router.post('/send', sendMessage);
router.get('/', getMessages);
router.get('chatId', getChatId);
