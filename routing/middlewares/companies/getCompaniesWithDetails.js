const db = require('controllers/database/index').db()
const getFuncName = require('controllers/index').getFuncName

const findAll = require('models/queries/index').findAll

module.exports = getCompaniesWithDetails

/**
 * get detailed contact record by id stored in req.contactId
 * @param {*} param0
 */
function getCompaniesWithDetails (criteria = {}) {
  return (req, res, next) => {
    let model = db.Companies.scope({ method: ['detailed'] })
    return findAll({ model, criteria })
      .then(detailedCompanies => {
        req.companies = detailedCompanies
        next()
        return Promise.resolve()
      })
      .catch(error => {
        error.statusCode = 500
        error.origin = `${__filename}.${getFuncName(getCompaniesWithDetails)}`
        return next(error)
      })
  }
}
