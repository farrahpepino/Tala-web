require('dotenv').config();
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController'); 
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');


const multer = require('multer');
const multerS3 = require('multer-s3');

const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

const s3 = new S3Client({
    region: process.env.AWS_REGION,  
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  
  const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_BUCKET_NAME,
      acl: 'public-read', 
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        const userId = req.params.userId;
        const fileName = `${userId}/${Date.now()}-${file.originalname}`;
        cb(null, fileName);
      },
    }),
  });

router.get('/search', UserController.searchUsers);
router.patch('/profile/:userId', UserController.updateProfile);
router.get('/:userId', UserController.getUserData);
router.delete('/:userId/delete-account', UserController.deleteAccount);
router.post('/add-pfp/:userId', upload.single('file'), UserController.uploadProfilePicture);
module.exports = router;
