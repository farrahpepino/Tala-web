
const express = require('express');
const router = express.Router();
require("dotenv").config();

const UserController = require('../controllers/UserController'); 
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const multer  = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

router.get('/search', UserController.searchUsers);
router.patch('/profile/:userId', UserController.updateProfile);
router.get('/:userId', UserController.getUserData);
router.delete('/:userId/delete-account', UserController.deleteAccount);
router.post('/add-pfp/:userId', upload.single('file'), async (req, res) => {
  const { userId } = req.params; 
  const file = req.file;

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.name,
      Body: file.buffer
    });
    await s3.send(command);
    
    // const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    // const user = await User.findByIdAndUpdate(
    //   userId,
    //   { $set: { 'profile.profilePicture': fileUrl } },
    //   { new: true }
    // );

    // if (!user) {
    //   return res.status(404).send({ message: 'User not found' });
    // }

    res.status(200).json({
      message: 'Profile picture uploaded successfully',
      // fileUrl,
      // profilePicture: user.profile.profilePicture,
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).send({ message: 'Error uploading profile picture' });
  }
});
module.exports = router;
