
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController'); 

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.get('/search', UserController.searchUsers);
router.patch('/profile/:userId', UserController.updateProfile);
router.get('/:userId', UserController.getUserData);
router.delete('/:userId/delete-account', UserController.deleteAccount);
router.post('/add-pfp/:userId', upload.single('file'), UserController.uploadProfilePicture);
module.exports = router;
