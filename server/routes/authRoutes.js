const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/Auth/loginUser');
const { registerUser } = require('../controllers/Auth/registerUser');

router.post('/login', loginUser);
router.post('/register', registerUser);

module.exports = router;
