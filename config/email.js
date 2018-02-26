const nodemailer = require('nodemailer')

const config = {
  pop3: {
    host: process.env.POP3_HOST,
    port: process.env.POP3_PORT,
    secure: true,
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
  gmail: {
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.ADMIN_EMAIL,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      accessToken: process.env.GMAIL_ACCESS_TOKEN,
    },
  },
}

module.exports = transportName => {
  return nodemailer.createTransport(config[transportName])
}
