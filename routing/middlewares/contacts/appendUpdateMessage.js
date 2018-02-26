module.exports = appendUpdateMessage

/**
 * append a login message to the pending json response object (req.resJson)
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function appendUpdateMessage (req, res, next) {
  let credentials = req.contact
  let status = credentials.admin
    ? 'admin'
    : !credentials.company
      ? 'independent'
      : credentials.company.host ? 'staff' : 'user'
  req.resJson.message =
    status === 'independent'
      ? 'Independant account updated and logged in, privilege is supplied for 24 hours'
      : `account updated and token with ${status} privilege is supplied for 24 hours`
  return next()
}
