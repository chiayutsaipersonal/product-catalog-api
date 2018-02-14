/* load npm modules */
const express = require('express')
const http = require('http')
const Promise = require('bluebird')

/* load controller modules */
const logging = require('./controllers/logging')
const viewEngine = require('./controllers/viewEngine')
const database = require('./controllers/database')

/* load routing modules */
const preRouting = require('./controllers/preRouting')
const assetRouter = require('./routing/assetRouter')
const apiRouter = require('./routing/apiRouter')
const clientRouter = require('./routing/clientRouter')
const postRouting = require('./controllers/postRouting')

/* load configurations */
logging.warning('Loading server configurations...')
const appConfig = require('./config/app')

/* initialize Express framework */
logging.warning('Initialize Express.js framework')
const app = express()
app.set('port', appConfig.port)
app.set('trust proxy', true) // for use with proxy servers
const server = http.createServer(app)

/* startup sequence */
logging.warning('Register server [pre-startup] initialization sequence')
const preStartupInitSequence = [
  database.init(), // database
  viewEngine(app), // handlebars view engine
  logging.init(app), // morgan
  preRouting.init(app), // app-wide global middlewares
  assetRouter.init(app), // static assets
  apiRouter.init(app), // api specific routing
  clientRouter.init(app), // index.html
  postRouting.init(app), // app-wide global middlewares
]
logging.warning('Execute server initialization sequence')
Promise
  .each(preStartupInitSequence, initMessage => {
    logging.warning(initMessage)
  })
  .then(() => {
    logging.warning('Starting server')
    server.listen(appConfig.port)
    server.on('listening', () => {
      let addr = server.address()
      let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port
      logging.warning(`Server started in [${process.env.NODE_ENV}] mode and listening on ` + bind)
    })
    server.on('error', error => {
      if (error.syscall !== 'listen') throw error
      switch (error.code) {
        case 'EACCES':
          logging.error(`${appConfig.port} requires elevated privileges`)
          process.exit(1)
        case 'EADDRINUSE':
          logging.error(`${appConfig.port} is already in use`)
          process.exit(1)
        default: throw error
      }
    })
    return Promise.resolve()
  })
  .then(() => {
    logging.warning('Register server [post-startup] execution sequence')
    const postStartupExecSequence = []
    if (postStartupExecSequence.length === 0) {
      return Promise.resolve()
    } else {
      return Promise.each(postStartupExecSequence, execMessage => {
        logging.warning(execMessage)
        return Promise.resolve()
      }).catch(error => {
        logging.error(error, 'Post-startup initialization failure')
        return Promise.reject(error)
      })
    }
  })
  .then(() => {
    logging.warning('System initialization completed')
    return Promise.resolve()
  })
  .then(() => {
    return Promise.resolve()
  })
  .catch(error => {
    logging.error(error, 'Server initialization failure...')
    process.exit(1)
  })

// event listeners to capture unhandled events and issues
process.on('unhandledRejection', (error, promise) => {
  logging.error(error, '發現未處理的 Promise Rejection')
  return logging.warning(promise)
})
process.on('rejectionHandled', promise => {
  return logging.warning('Rejection handled !!!')
})
process.on('uncaughtException', error => {
  return logging.error(error, '發生未預期 exception !!!')
})

module.exports = server
