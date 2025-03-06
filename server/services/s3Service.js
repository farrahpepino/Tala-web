const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');
const {promisify} = require("util")
require("dotenv").config();

const randomBytes = promisify(crypto.randomBytes)

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const allowedMimeTypes = ['image/jpeg', 'image/heic', 'image/png'];

exports.generateUploadURL = async () => {
  const rawBytes = await randomBytes(16);
  const imageName = rawBytes.toString("hex");


  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${imageName}`,
    Expires: 60,
    ContentType: allowedMimeTypes, 
  };

  const command = new PutObjectCommand(params);
  return await getSignedUrl(s3, command, { expiresIn: 60 });
};
