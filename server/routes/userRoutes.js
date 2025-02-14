const express = require('express');
const router = express.Router();
const { getUserData, searchUsers, updateProfile } = require('../controllers/UserController');

router.get('/search', searchUsers)
router.patch('/profile/:userId', updateProfile);
router.get('/:userId', getUserData)



module.exports = router;
