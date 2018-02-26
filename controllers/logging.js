const chalk = require('chalk')
const morgan = require('morgan')

module.exports = {
  console: messageToConsole,
  warning: warningToConsole,
  error: errorToConsole,
  init, // only for registering morgan package
}

function init (app) {
  let testMode = process.env.NODE_ENV === 'test'
  let devMode = process.env.NODE_ENV === 'development'
  if (!testMode) {
    app.use(
      morgan(!devMode ? 'short' : 'dev', {
        skip: (req, res) => res.statusCode < 400,
        stream: process.stderr,
      })
    )
    app.use(
      morgan(!devMode ? 'short' : 'dev', {
        skip: (req, res) => res.statusCode >= 400,
        stream: process.stdout,
      })
    )
    return Promise.resolve('Console logging activated')
  } else {
    return Promise.resolve('Console logging is inactive while testing')
  }
}

function messageToConsole (message) {
  return Object.prototype.toString.call(message) === '[object String]'
    ? console.log(message)
    : console.dir(message, { depth: null, colors: false })
}

function warningToConsole (warningMessage) {
  return Object.prototype.toString.call(warningMessage) === '[object String]'
    ? console.log(`${chalk.yellow.bold(warningMessage)}`)
    : console.dir(warningMessage, { depth: null, colors: true })
}

function errorToConsole (error, customMessage = null) {
  if (customMessage) {
    console.error(
      `${chalk.bgRed.bold(error.name)} - ${chalk.red.bold(customMessage)}`
    )
  } else {
    console.error(`${chalk.bgRed.bold(error.name)}`)
  }
  warningToConsole(error.origin)
  warningToConsole(error.message)
  warningToConsole(error.stack)
}
