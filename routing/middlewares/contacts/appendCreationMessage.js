module.exports = appendCreationMessage

/**
 * append contect record creation message to the pending json response object (req.resJson)
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function appendCreationMessage (req, res, next) {
  let credentials = req.contact
  if (!credentials.hashedPassword) {
    req.resJson.message = `Contact record for '${
      credentials.email
    }' without login privilege is created`
  } else if (!credentials.company) {
    req.resJson.message = `Independent contact record for '${
      credentials.email
    }' is created. Privilege is supplied for 24 hours`
  } else {
    let status = credentials.admin
      ? 'admin'
      : credentials.company.host ? 'staff' : 'user'
    req.resJson.message = `${status} account '${
      credentials.email
    }' registered successfully. Privilege is supplied for 24 hours`
  }
  return next()
}
