const contactRouter = require('express').Router()

const appendCreationMessage = require('routing/middlewares/contacts/appendCreationMessage')
const appendLoginMessage = require('routing/middlewares/contacts/appendLoginMessage')
const createIndependentContact = require('routing/middlewares/contacts/createIndependentContact')
const destroyContact = require('routing/middlewares/contacts/destroyContact')
const generateToken = require('routing/middlewares/contacts/generateToken')
const getContactCredentialsByEmail = require('routing/middlewares/contacts/getContactCredentialsByEmail')
const getContactDetailsById = require('routing/middlewares/contacts/getContactDetailsById')
const getContactId = require('routing/middlewares/contacts/getContactId')
const getContactsWithDetails = require('routing/middlewares/contacts/getContactsWithDetails')
const parseContactDataFromRequest = require('routing/middlewares/contacts/parseContactDataFromRequest')
const parseEditableContactData = require('routing/middlewares/contacts/parseEditableContactData')
const updateContact = require('routing/middlewares/contacts/updateContact')

const noLoginPrivilege = require('routing/middlewares/contacts/denyAccess/noLoginPrivilege')
const passwordNotSubmitted = require('routing/middlewares/contacts/denyAccess/passwordNotSubmitted')
const wrongPassword = require('routing/middlewares/contacts/denyAccess/wrongPassword')
const wrongPasswordFormat = require('routing/middlewares/contacts/denyAccess/wrongPasswordFormat')

const formDataOnly = require('routing/middlewares/multer').formDataOnly
const routingTest = require('routing/middlewares/routingTest')

const validateAdminsAndSpecificUsers = require('controllers/authentication/index')
  .authentication.adminsAndSpecificUsers
const validateSpecificUsers = require('controllers/authentication/index')
  .authentication.specificUsers
const validateStaffOrAbove = require('controllers/authentication/index')
  .authentication.staffOrAbove
const validateStaffOrAboveAndSpecificUsers = require('controllers/authentication/index')
  .authentication.staffOrAboveAndSpecificUsers

// applying for a jwt by submitting account credentials in order to interact with the APIs
contactRouter
  .route('/login')
  .post(
    formDataOnly,
    passwordNotSubmitted,
    wrongPasswordFormat,
    getContactCredentialsByEmail({ failIfNotFound: true }),
    noLoginPrivilege,
    wrongPassword,
    generateToken,
    appendLoginMessage
  )

contactRouter
  .route('/contacts')
  .get(
    // get contact records
    validateStaffOrAbove,
    getContactsWithDetails,
    (req, res, next) => {
      req.resJson = { data: req.contacts }
      return next()
    }
  )
  .post(
    // register an independent contact
    formDataOnly,
    wrongPasswordFormat,
    getContactCredentialsByEmail({ failIfFound: true }),
    parseContactDataFromRequest,
    createIndependentContact,
    getContactCredentialsByEmail({ failIfNotFound: true }),
    generateToken,
    appendCreationMessage
  )

contactRouter
  .route('/contacts/:contactId')
  // get a contact record by id
  .get(
    validateStaffOrAboveAndSpecificUsers,
    getContactId({
      property: 'params',
      failIfNotFound: true,
      failIfUndeclared: true,
    }),
    getContactDetailsById(),
    (req, res, next) => {
      req.resJson = { data: req.contact }
      return next()
    }
  )
  .put(
    // update a contact
    validateSpecificUsers,
    getContactId({
      property: 'params',
      failIfNotFound: true,
      failIfUndeclared: true,
    }),
    formDataOnly,
    wrongPasswordFormat,
    parseEditableContactData,
    updateContact,
    getContactDetailsById(),
    getContactCredentialsByEmail({
      property: 'contact',
      failIfNotFound: true,
      failIfUndeclared: true,
    }),
    generateToken,
    appendLoginMessage
  )
  // delete a contact record by id
  .delete(
    validateAdminsAndSpecificUsers,
    getContactId({
      property: 'params',
      failIfNotFound: true,
      failIfUndeclared: true,
    }),
    destroyContact
  )

contactRouter.route('/contacts/:contactId/purchaseOrders').post(routingTest) // insert new purchase order for a contact

module.exports = contactRouter
