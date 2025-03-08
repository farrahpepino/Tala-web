require('dotenv').config();
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController'); 


router.get('/search', UserController.searchUsers);
router.patch('/profile/:userId', UserController.updateProfile);
router.get('/:userId', UserController.getUserData);
router.delete('/:userId/delete-account', UserController.deleteAccount);
router.get('/get-presigned-url/:userId', UserController.getPresignedUrl);
router.patch('/upload-pfp/:userId', UserController.uploadProfilePicture);
module.exports = router;
