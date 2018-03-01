const db = require('controllers/database/index').db()
const genCustErr = require('controllers/index').genCustErr
const getFuncName = require('controllers/index').getFuncName

const findById = require('models/queries/index').findById

module.exports = getCompanyDetailsById

/**
 * get detailed company record by id stored in req.companyId
 * @param {*} param0
 */
function getCompanyDetailsById ({ failIfNotFound = true } = {}) {
  return (req, res, next) => {
    let companyId = req.companyId
    let custErr = {
      origin: `${__filename}.${getFuncName(getCompanyDetailsById)}`,
      statusCode: 500,
      title: 'Unregistered company',
      message: `Company does not exist (id: ${companyId})`,
    }
    let model = db.Company.scope({ method: ['detailed'] })
    return findById({ model, id: companyId })
      .then(detailedCompany => {
        if (!detailedCompany && failIfNotFound) {
          return Promise.reject(genCustErr(custErr))
        }
        req.company = detailedCompany
        next()
        return Promise.resolve()
      })
      .catch(error => {
        error.statusCode = custErr.statusCode
        error.origin = custErr.origin
        return next(error)
      })
  }
}
