const bodyParser = require('body-parser')
// const cookieParser = require('cookie-parser')
const cors = require('cors')

module.exports = {
  init: app => {
    app.use(cors())
    // app.use(cookieParser())
    app.use(bodyParser.json())
    // app.use(bodyParser.json({ limit: '5mb' }))
    app.use(bodyParser.urlencoded({ extended: false }))
    // app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }))

    return Promise.resolve('Global pre-routing middlewares registered')
  },
}
