require("dotenv").config();
const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');

const storage =  multer.memoryStorage();
const upload= multer({storage});

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});



module.exports = { upload, s3 };
