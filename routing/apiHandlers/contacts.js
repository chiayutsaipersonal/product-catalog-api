const jwt = require('jsonwebtoken')
const multer = require('multer')

const appConfig = require('../../config/app')
const authConfig = require('../../config/authentication')

const authentication = require('../../controllers/authentication').authentication()
const encryption = require('../../controllers/encryption')

const contactQueries = require('../../models/queries/contacts')

const parseCompanyData = require('./companies').parseCompanyData
const parseOrderDetailData = require('./orderDetails').parseOrderDetailData
const parsePurchaseOrderData = require('./purchaseOrders').parsePurchaseOrderData

module.exports = {
  // POST /login
  login: [
    multer().none(),
    validatePasswordFormat,
    accountDiscovery,
    rejectPasswordlessAccounts,
    checkPassword,
    provideToken,
    loginMessage,
  ],
  // POST /contacts
  // consider moving to 'POST /purchaseOrders'
  create: [
    multer().none(),
    validatePasswordFormat,
    parseCompanyData,
    parseContactData,
    parseOrderDetailData,
    parsePurchaseOrderData,
  ],
  activateAdminAuthentication,
  autoFindTarget,
  parseContactData,
}

// triggers validation for adminsOnly, if:
// request to create an admin account
// request to create a passwordless account
function activateAdminAuthentication (req, res, next) {
  let a = (('admin' in req.body) && (req.body.admin === 'true'))
  let b = !('password' in req.body)
  return a || b ? authentication.adminsOnly(req, res, next) : next()
}

// find target contact record indicated by the request route.param() with :contactId
function autoFindTarget (req, res, next, contactId) {
  let targetContactId = contactId.toUpperCase()
  return contactQueries.getDetailedInfoById(targetContactId)
    .then(targetContact => {
      req.targetContactId = targetContactId
      req.targetContact = targetContact
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// find account credential information using req.body.email
function accountDiscovery (req, res, next) {
  // find the account
  return contactQueries
    .getCredentialByEmail(req.body.email.toLowerCase())
    .then(contact => {
      if (!contact) { // account isn't found
        let error = new Error('Unauthorized')
        error.status = 401
        return next(error)
      }
      req.registeredUser = contact
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// verify submitted password with stored credentials
function checkPassword (req, res, next) {
  let registeredUser = req.registeredUser
  // hashing the submitted password
  let hashedPasswordToCheck = encryption.sha512(req.body.password, registeredUser.salt).hashedPassword
  // compare with the hashing stored in the account record
  if (hashedPasswordToCheck === registeredUser.hashedPassword) {
    return next() // hash checks out
  } else {
    // hash verification failed
    let error = new Error('Forbidden')
    error.status = 403
    return next(error)
  }
}

// create res message when '\login' end point is hit
function loginMessage (req, res, next) {
  let status = req.registeredUser.admin ? 'admin' : req.registeredUser.company.host ? 'staff' : 'user'
  req.resJson.message = appConfig.prodMode
    ? `account token with ${status} privilege is supplied for 24 hours`
    : {
      id: req.registeredUser.id,
      name: req.registeredUser.name,
      email: req.registeredUser.email,
      admin: req.registeredUser.admin,
    }
  return next()
}

// parsing contact data from request body
// stores the temp info in req.contactData
function parseContactData (req, res, next) {
  let requestBody = req.body
  let encryptedPassword = 'password' in requestBody
    ? encryption.sha512(requestBody.password, encryption.saltGen(16))
    : { hashedPassword: null, salt: null }
  req.contactData = {
    email: requestBody.email.toLowerCase(),
    name: requestBody.name,
    mobile: requestBody.mobile || undefined,
    hashedPassword: encryptedPassword.hashedPassword,
    salt: encryptedPassword.salt,
    admin: requestBody.admin || undefined,
  }
  for (let key in req.contactData) {
    if (req.contactData[key] === undefined) delete req.contactData[key]
  }
  return next()
}

// supply a self-signed token to authorized account user
function provideToken (req, res, next) {
  let registeredUser = req.registeredUser
  let token = registeredUser.hashedPassword
    ? jwt.sign({
      id: registeredUser.id,
      name: registeredUser.name,
      email: registeredUser.email,
      admin: registeredUser.admin,
    }, authConfig.jwtSecret, { expiresIn: '24h' })
    : undefined
  req.resJson = { data: token }
  return next()
}

// reject login attempt by contacts that did not setup password
function rejectPasswordlessAccounts (req, res, next) {
  let registeredUser = req.registeredUser
  if (!registeredUser.hashedPassword || !registeredUser.salt) {
    let error = new Error('This account does not have login privileges')
    error.status = 403
    return next(error)
  }
  return next()
}

// validate password format
function validatePasswordFormat (req, res, next) {
  // let request proceed without a 'password' prop in the req body
  // used when registering an user without password.
  // If password is required in the following route handlers, this will cause failure
  if (!('password' in req.body)) {
    return next()
  } else if ((req.body.password.length < 8) || (req.body.password.length > 20)) {
    let error = new Error('Illegal password length')
    error.message = 'Password should be 8 to 20 characters long'
    error.status = 400
    return next(error)
  }
  return next()
}