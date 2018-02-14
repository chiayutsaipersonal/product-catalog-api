const nodemailer = require('nodemailer')

const sensitiveInfo = require('./sensitiveInfo')

const useTransport = 'gmail'

const config = {
  pop3: {
    host: sensitiveInfo.POP3_HOST,
    port: sensitiveInfo.POP3_PORT,
    secure: true,
    auth: {
      user: sensitiveInfo.ADMIN_EMAIL,
      pass: sensitiveInfo.POP3_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
  gmail: {
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: sensitiveInfo.ADMIN_EMAIL,
      clientId: sensitiveInfo.GMAIL_CLIENT_ID,
      clientSecret: sensitiveInfo.GMAIL_CLIENT_SECRET,
      refreshToken: sensitiveInfo.GMAIL_REFRESH_TOKEN,
      accessToken: sensitiveInfo.GMAIL_ACCESS_TOKEN,
    },
  },
}

module.exports = nodemailer.createTransport(config[useTransport])
