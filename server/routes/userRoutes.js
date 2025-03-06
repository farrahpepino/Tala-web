
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController'); 
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

router.get('/search', UserController.searchUsers);
router.patch('/profile/:userId', UserController.updateProfile);
router.get('/:userId', UserController.getUserData);
router.delete('/:userId/delete-account', UserController.deleteAccount);
router.post('/add-pfp/:userId', upload.single('pfp'), UserController.uploadProfilePicture);
module.exports = router;
