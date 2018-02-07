const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const appConfig = require('../config/app')

const logging = require('../controllers/logging')

module.exports = app => {
  if (appConfig.stagingMode || appConfig.prodMode) return Promise.resolve('Skipping Webpack HMR initialization in production mode')
  logging.warning('Setup Webpack HMR')
  let webpackCompiler = null
  return require(appConfig.clientWebpackConfig)
    .then(webpackConfig => {
      webpackConfig.entry.app.push('webpack-hot-middleware/client?reload=true')
      webpackCompiler = webpack(webpackConfig)
      app.use(webpackDevMiddleware(webpackCompiler, {
        logLevel: 'warn',
        publicPath: webpackConfig.output.publicPath,
        stats: { colors: true },
      }))
      app.use(webpackHotMiddleware(webpackCompiler))
      return Promise.resolve(`Webpack HMR activated in ${appConfig.nodeEnv} mode`)
    })
}
