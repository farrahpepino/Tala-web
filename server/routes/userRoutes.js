const express = require('express');
const router = express.Router();
const searchUsers = require('../controllers/User/searchUsers')
const updateProfile = require ('../controllers/User/updateProfile')
const getUserData = require('../controllers/User/getUserData')
router.get('/search', searchUsers)
router.patch('/profile/:userId', updateProfile);
router.get('/:userId', getUserData)



module.exports = router;
