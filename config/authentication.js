const sensitiveInfo = require('./sensitiveInfo')

module.exports = {
  jwtSecret: sensitiveInfo.JWT_SECRET,
  enforced: true,
}
