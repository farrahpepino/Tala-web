
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController'); 
const { upload } = require('../services/s3Service'); // Adjust path as needed
// Define the routes
router.get('/search', UserController.searchUsers);
router.patch('/profile/:userId', UserController.updateProfile);
router.get('/:userId', UserController.getUserData);
router.delete('/:userId/delete-account', UserController.deleteAccount);
router.post('/update-profile-picture/:userId', upload.single('file'),  UserController.uploadProfilePicture);
module.exports = router;
