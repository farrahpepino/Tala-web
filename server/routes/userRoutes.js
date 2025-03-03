require('dotenv').config();

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController'); 
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multer.memoryStorage(), 
});

const uploadToS3 = async (file) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `profile-photos/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("File upload failed");
  }
};

// Define the routes
router.get('/search', UserController.searchUsers);
router.patch('/profile/:userId', UserController.updateProfile);
router.get('/:userId', UserController.getUserData);
router.delete('/:userId/delete-account', UserController.deleteAccount);
router.patch("/:userId/add-profile-photo", upload.single('profilePhoto'), UserController.addProfilePhoto); // Use upload.single here
router.get('/:userId/profile-photo', UserController.getProfilePhoto);

module.exports = router;
