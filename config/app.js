const sensitiveInfo = require('./sensitiveInfo')

module.exports = {
  nodeEnv: process.env.NODE_ENV,
  devMode: process.env.NODE_ENV === 'development',
  testMode: process.env.NODE_ENV === 'test',
  stagingMode: process.env.NODE_ENV === 'staging',
  prodMode: process.env.NODE_ENV === 'production',
  port: normalizePort(process.env.PORT || '9004'),
  reference: sensitiveInfo.APP_REFERENCE,
  timezone: 'Asia/Taipei',
  title: sensitiveInfo.APP_TITLE,
  default: {
    adminName: sensitiveInfo.ADMIN_NAME,
    adminEmail: sensitiveInfo.ADMIN_EMAIL,
    adminPassword: sensitiveInfo.ADMIN_APP_PASSWORD,
  },
  clientWebpackConfig: null, // absolute path to webpack.conf
}

function normalizePort (val) {
  var port = parseInt(val, 10)
  if (isNaN(port)) { return val }
  if (port >= 0) { return port }
  return false
}
