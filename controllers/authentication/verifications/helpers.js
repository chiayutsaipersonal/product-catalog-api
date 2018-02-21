module.exports = {
  checkJwtError: (error, info) => {
    if (error || info) {
      let customError = error || new Error(info)
      customError.status = !error ? 400 : !error.status ? 400 : error.status
      return customError
    } else {
      return null
    }
  },
  generateCustomError: (
    statusCode = 400,
    title = 'Unspecified Error',
    message = 'Error details have not been specified'
  ) => {
    let customError = new Error(title)
    customError.status = statusCode
    customError.message = message
    return customError
  },
}
