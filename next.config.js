const nextConfig = {
    /* config options here */
    env: {
            AWS_BUCKET : process.env.AWS_BUCKET,
            AWS_REGION : process.env.AWS_REGION,
            AWS_ACCESS_KEY : process.env.AWS_ACCESS_KEY,
            AWS_SECRET_KEY : process.env.AWS_SECRET_KEY,
            AWS_LOGO_PATH : process.env.AWS_LOGO_PATH,
            API_AUTH: process.env.API_AUTH,
            API_TOKEN: process.env.API_TOKEN,
            localHost: process.env.localHost,
            AWS_EC2: process.env.AWS_EC2,
            host: process.env.localHost,
            SECRET_KEY: process.env.SECRET_KEY
      },
    poweredByHeader: false,
  }
  
  module.exports = nextConfig