module.exports = appendLoginMessage

/**
 * append a login message to the pending json response object (req.resJson)
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function appendLoginMessage (req, res, next) {
  let credentials = req.contact
  let status = credentials.admin
    ? 'admin'
    : !credentials.company
      ? 'independent'
      : credentials.company.host ? 'staff' : 'user'
  req.resJson.message =
    status === 'independent'
      ? 'Independant account login, privilege is supplied for 24 hours'
      : `account token with ${status} privilege is supplied for 24 hours`
  return next()
}
