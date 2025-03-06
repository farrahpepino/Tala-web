const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');
require('dotenv').config();

// Initialize S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Generate a signed URL for file upload
async function generateUploadURL() {
  const generateRandomBytes = crypto.randomBytes(16).toString('hex');
  const imageName = generateRandomBytes;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/${imageName}`,
    Expires: 60, // URL expiration in seconds
    ContentType: 'image/jpeg',
  };

  // Generate a signed URL
  const command = new PutObjectCommand(params);
  const uploadURL = await getSignedUrl(s3, command, { expiresIn: 60 });
  return uploadURL;
}

module.exports = { s3, generateUploadURL };
