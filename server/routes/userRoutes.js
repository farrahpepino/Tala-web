const express = require('express');
const router = express.Router();
const multer = require('multer');
const UserController = require('../controllers/UserController'); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

// Initialize multer with storage configuration
const upload = multer({ storage: storage });

// Define the routes
router.get('/search', UserController.searchUsers);
router.patch('/profile/:userId', UserController.updateProfile);
router.get('/:userId', UserController.getUserData);
router.delete('/:userId/delete-account', UserController.deleteAccount);
router.post('/:userId/add-profile-photo', upload.single('profilePhoto'), UserController.addProfilePhoto);
router.get('/:userId/profile-photo', UserController.getProfilePhoto);

module.exports = router;
