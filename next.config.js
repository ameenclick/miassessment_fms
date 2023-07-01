require('dotenv').config();
const nextConfig = {
    /* config options here */
    env: {
            AWS_BUCKET : process.env.S3_BUCKET,
            AWS_REGION : process.env.S3_REGION,
            AWS_ACCESS_KEY : process.env.S3_ACCESS_KEY,
            AWS_SECRET_KEY : process.env.S3_SECRET_KEY,
            AWS_LOGO_PATH : process.env.LOGO_PATH,
            API_AUTH: process.env.API_AUTH,
            API_TOKEN: process.env.API_TOKEN,
            localHost: process.env.localHost,
            host: process.env.API_HOST,
            //host: process.env.localHost,
            SECRET_KEY: process.env.SECRET_KEY
      },
    poweredByHeader: false,
  }
  
  module.exports = nextConfig