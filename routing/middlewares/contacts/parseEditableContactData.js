const genCustErr = require('controllers/index').genCustErr
const getFuncName = require('controllers/index').getFuncName

const editableFields = ['email', 'name', 'mobile', 'password']

module.exports = parseEditableContactData

/**
 * parse req.body and retrieve only fields that are qualified to be edited
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function parseEditableContactData (req, res, next) {
  req.contact = {}
  Object.keys(req.body)
    // extract a list of props in req.body that matches to the items in the editableFields list
    .filter(reqBodyProp => {
      return editableFields.indexOf(reqBodyProp) !== -1
    })
    // for each valid prop, grab its value in req.body and place in req.contact
    .forEach(field => (req.contact[field] = req.body[field]))
  if (Object.keys(req.contact).length === 0) {
    return next(
      genCustErr({
        origin: `${__filename}.${getFuncName(parseEditableContactData)}`,
        statusCode: 400,
        title: 'Bad submission',
        message: 'No data submitted are qualified for update',
      })
    )
  }
  return next()
}
