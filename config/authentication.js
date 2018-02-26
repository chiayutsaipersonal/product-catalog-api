require('dotenv').config()

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  enforced: true,
  passwordLength: {
    min: 8,
    max: 20,
  },
}
