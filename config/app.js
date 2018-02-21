require('dotenv').config()

const nodeEnv = process.env.NODE_ENV || 'production'
const reference = 'gentryWay'

module.exports = {
  nodeEnv,
  devMode: nodeEnv === 'development',
  testMode: nodeEnv === 'test',
  stageMode: nodeEnv === 'stage',
  prodMode: nodeEnv === 'production',
  port: normalizePort(process.env.PORT || 9004),
  reference,
  timezone: 'Asia/Taipei',
  title: '仲群維企業有限公司',
  admin: {
    name: process.env.ADMIN_NAME || 'Administrator',
    email: process.env.ADMIN_EMAIL || `admin@${reference}.com.tw`,
    password: process.env.ADMIN_APP_PASSWORD || '00000000',
  },
}

function normalizePort (val) {
  var port = parseInt(val, 10)
  if (isNaN(port)) {
    return val
  }
  if (port >= 0) {
    return port
  }
  return false
}
