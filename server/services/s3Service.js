require('dotenv').config();
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// Use memory storage (stores file in RAM)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create an S3 client with your AWS credentials and region
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = { upload, s3, PutObjectCommand };
