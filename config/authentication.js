require('dotenv').config()

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  enforced: true,
  passwordLength: {
    min: 8,
    max: 20,
  },
  googleOAuth2: {
    callbackURL: '/authentication/google/redirect',
    clientID: process.env.GOOGLE_OAUTH2_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH2_CLIENT_SECRET,
  },
}
