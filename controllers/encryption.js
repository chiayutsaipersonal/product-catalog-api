const crypto = require('crypto')

module.exports = {
  saltGen,
  sha512,
}

/**
 * generate a salt string of length
 * @param {*} length
 */
function saltGen (length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
}

/**
 * encrypt a password with supplied salt.  returns an object containing the salt and hashed password
 * @param {*} password
 * @param {*} salt
 */
function sha512 (password, salt) {
  let hash = crypto.createHmac('sha512', salt)
  hash.update(password)
  let value = hash.digest('hex')
  return {
    salt: salt,
    hashedPassword: value,
  }
}
