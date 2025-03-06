
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController'); 

// Define the routes
router.get('/search', UserController.searchUsers);
router.patch('/profile/:userId', UserController.updateProfile);
router.get('/:userId', UserController.getUserData);
router.delete('/:userId/delete-account', UserController.deleteAccount);
router.post('/update-profile-picture/:userId', UserController.uploadProfilePicture);
module.exports = router;
