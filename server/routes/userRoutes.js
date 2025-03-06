
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController'); 
const multer = require('multer');

const storage = multer.memoryStorage();

// Create a multer instance with the memory storage
const upload = multer({ storage });

console.log('upload:', upload);
console.log('typeof upload:', typeof upload); // Should output 'function'
console.log('upload.single:', upload.single);  
// Define the routes
router.get('/search', UserController.searchUsers);
router.patch('/profile/:userId', UserController.updateProfile);
router.get('/:userId', UserController.getUserData);
router.delete('/:userId/delete-account', UserController.deleteAccount);
router.post('/add-pfp/:userId',  UserController.uploadProfilePicture, upload.single('file'));
module.exports = router;
