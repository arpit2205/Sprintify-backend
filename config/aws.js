var { S3Client } = require("@aws-sdk/client-s3");

var s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ENV,
  },
});

module.exports = s3Client;
