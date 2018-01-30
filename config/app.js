module.exports = {
  devMode: process.env.NODE_ENV === 'development',
  testMode: process.env.NODE_ENV === 'test',
  prodMode: process.env.NODE_ENV === 'production',
  port: normalizePort(process.env.PORT || '9004'),
  reference: 'gentryWay',
  title: '仲群維企業有限公司',
  default: {
    adminEmail: 'chiayu.tsai.personal@gmail.com',
    adminPassword: '00000000',
  },
}

function normalizePort (val) {
  var port = parseInt(val, 10)
  if (isNaN(port)) { return val }
  if (port >= 0) { return port }
  return false
}
