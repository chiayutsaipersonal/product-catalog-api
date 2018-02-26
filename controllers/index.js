module.exports = {
  genCustErr: ({
    statusCode = 400,
    origin = 'Unknown Origin',
    title = 'Unspecified Error',
    message = 'Error details have not been specified',
  }) => {
    let custErr = new Error(title)
    custErr.name = title
    custErr.origin = origin
    custErr.status = statusCode
    custErr.message = message
    return custErr
  },
  getFuncName: funcHandle => {
    return funcHandle
      .toString()
      .split(' ')[1]
      .split('(')[0]
      .concat('()')
  },
  getFileExtension: fileName => fileName.split('.')[1],
}
