module.exports = (error, info) => {
  if (error || info) {
    let custErr = error || new Error(info)
    custErr.statusCode = !error ? 400 : !error.status ? 400 : error.status
    return custErr
  } else {
    return null
  }
}
