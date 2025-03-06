
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController'); 

// Define the routes
router.post('/s3URL', UserController.addProfilePhoto)
router.get('/search', UserController.searchUsers);
router.patch('/profile/:userId', UserController.updateProfile);
router.get('/:userId', UserController.getUserData);
router.delete('/:userId/delete-account', UserController.deleteAccount);
module.exports = router;
