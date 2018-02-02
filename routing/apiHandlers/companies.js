module.exports = {
  parseCompanyData,
}

// parse company information from request body
// stores the temp info in req.contactData
function parseCompanyData (req, res, next) {
  let requestBody = req.body
  if ('companyId' in requestBody) {
    // use the detected company id instead
    req.companyData = { id: requestBody.companyId.toUpperCase() }
  } else {
    req.companyData = {
      countryId: requestBody.countryId || undefined,
      // user name is filled in if client app does not submit a company title
      title: requestBody.title || requestBody.name,
      address: requestBody.address || undefined,
      telephone: requestBody.telephone || undefined,
      fax: requestBody.fax || undefined,
      website: requestBody.website || undefined,
      // host: false, // req.body.host value is ignored
    }
    for (let key in req.companyData) {
      if (req.companyData[key] === undefined) delete req.companyData[key]
    }
  }
  return next()
}
