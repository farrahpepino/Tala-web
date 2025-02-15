const express = require('express');
const router = express.Router();
const AuthConttoller = require('../controllers/AuthConttoller');

router.post('/login', AuthConttoller.loginUser);
router.post('/register', AuthConttoller.registerUser);

module.exports = router;
