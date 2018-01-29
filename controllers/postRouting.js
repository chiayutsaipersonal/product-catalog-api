const appErrorHandler = require('../middlewares/appErrorHandler')

module.exports = {
  init: app => {
    app.use(appErrorHandler)
    return Promise.resolve('Global post-routing middlewares registered')
  },
}
