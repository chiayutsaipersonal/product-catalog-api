const formatLinkHeader = require('format-link-header')
const jwt = require('jsonwebtoken')
const path = require('path')

const logging = require('../../controllers/logging')

const contactQueries = require('../../models/queries/contacts')

const ENFORCE_VALIDATION = require('../../config/authentication').enforced
const PASS_PHRASE = require('../../config/authentication').jwtSecret
const CANNED_MESSAGES = {
  200: '200 OK',
  201: '201 Created',
  202: '202 Accepted',
  204: '204 No Content',
  400: '400 Bad Request',
  401: '401 Unauthorized',
  403: '403 Forbidden',
  404: '404 Not Found',
  500: '500 Internal Server Error',
  501: '501 Not Implemented',
  503: '503 Service Unavailable',
  505: '505 Permission Denied',
}

module.exports = {
  error,
  file,
  image,
  json,
  localHostOnly,
  notImplemented,
  pagination,
  redirect,
  routingTest,
  template,
  validateJwt,
}

/*
sends a json response
set res.status and add req.resJson object to activate this middleware
example:
res.status(200)
req.resJson = {
  data: data, // (optional)
  message: message // (optional)
}
*/
function json (req, res, next) {
  if (!('resJson' in req)) return next()
  req.resJson.method = req.method.toLowerCase()
  req.resJson.endpoint = req.originalUrl
  req.resJson.statusCode = res.statusCode
  if (!('message' in req.resJson)) {
    req.resJson.message = CANNED_MESSAGES[res.statusCode.toString()]
  }
  if ('linkHeader' in req) {
    Object.assign(req.resJson, {
      pagination: {
        totalRecords: req.linkHeader.last.per_page * req.linkHeader.last.page,
        totalPages: req.linkHeader.last.page,
        perPage: req.linkHeader.last.per_page,
        currentPage: req.linkHeader.self.page,
        first: req.linkHeader.first.url,
        prev: req.linkHeader.prev === undefined ? undefined : req.linkHeader.prev.url,
        self: req.linkHeader.self.url,
        next: req.linkHeader.next === undefined ? undefined : req.linkHeader.next.url,
        last: req.linkHeader.last.url,
      },
    })
  }
  return res
    .status(res.statusCode || 200)
    .type('application/json;charset=utf-8')
    .json(req.resJson)
    .end()
}

/*
sends a file response
set res.status and a req.resFile object
example:
res.status(200)
req.resFile = {
  mimeType: 'image/jpeg',
  filePath: path.resolve('./somePath/example.jpg') // absolute path
}
*/
function file (req, res, next) {
  if (!('resFile' in req)) return next()
  return res
    .status(res.statusCode || 200)
    .type(req.resFile.mimeType)
    .attachment()
    .sendFile(path.resolve(req.resFile.filePath))
}

/*
sends an image
set res.status and a req.resImage object
example:
res.status(200)
req.resFile = {
  mimeType: 'image/jpeg',
  data: new Buffer('./someImage.jpg')
}
*/
function image (req, res, next) {
  if (!('resImage' in req)) return next()
  return res
    .status(res.statusCode || 200)
    .type(req.resImage.mimeType)
    .send(req.resImage.data)
    .end()
}

// router specific global api error handler
function error (error, req, res, next) {
  logging.error(error, 'Global API error handler invoked')
  if (error.status) res.status(error.status)
  res.status(res.statusCode >= 400 ? res.statusCode : 500)
  let resJson = {
    method: req.method.toLowerCase(),
    endpoint: req.originalUrl,
    message: 'customMessage' in error
      ? error.customMessage
      : CANNED_MESSAGES[res.statusCode.toString()],
  }
  if (process.env.NODE_ENV !== 'production') {
    resJson.error = {
      code: error.code,
      name: error.name,
      message: error.message,
      stack: error.stack,
    }
  } else {
    resJson.error = {
      name: error.name,
      message: error.message,
    }
  }
  delete error.customMessage
  return res
    .type('application/json;charset=utf-8')
    .json(resJson)
}

function localHostOnly (req, res, next) {
  if ((req.hostname === 'localhost') && (req.ip === '127.0.0.1')) {
    let error = new Error('Accessible only from localhost')
    error.status = 401
    return next(error)
  } else {
    return next()
  }
}

function notImplemented (req, res, next) {
  let error = new Error('Not implemented')
  error.status = 501
  return next(error)
}

function pagination (getRecordCountFn) {
  return async (req, res, next) => {
    let query = req.query

    // check if require url parameters are set
    if (!('per_page' in query) || !('page' in query)) return next()

    // get total record count of dataset
    let recordCount = await getRecordCountFn()

    if (recordCount === 0) return next()

    // determine per_page value
    let perPage = parseInt(query.per_page) > recordCount
      ? recordCount
      : parseInt(query.per_page) < 1
        ? 1
        : parseInt(query.per_page)

    // calculate last page
    let lastPage = Math.ceil(recordCount / perPage)

    // determin current page
    let currentPage = parseInt(query.page) > lastPage
      ? lastPage
      : parseInt(query.page) < 1
        ? 1
        : parseInt(query.page)

    let baseStructure = {
      page: null,
      per_page: null,
      url: req.originalUrl,
    }

    let linkHeader = {}

    linkHeader.self = Object.assign({ rel: 'self' }, baseStructure)
    linkHeader.self.page = currentPage
    linkHeader.self.per_page = perPage
    linkHeader.self.url += `?per_page=${perPage}&page=${currentPage}`

    linkHeader.first = Object.assign({ rel: 'first' }, baseStructure)
    linkHeader.first.page = 1
    linkHeader.first.per_page = perPage
    linkHeader.first.url += `?per_page=${perPage}&page=1`

    linkHeader.last = Object.assign({ rel: 'last' }, baseStructure)
    linkHeader.last.page = lastPage
    linkHeader.last.per_page = perPage
    linkHeader.last.url += `?per_page=${perPage}&page=${lastPage}`

    if (currentPage > 1) {
      linkHeader.prev = Object.assign({ rel: 'prev' }, baseStructure)
      linkHeader.prev.page = currentPage - 1
      linkHeader.prev.per_page = perPage
      linkHeader.prev.url += `?per_page=${perPage}&page=${currentPage - 1}`
    }

    if (currentPage < lastPage) {
      linkHeader.next = Object.assign({ rel: 'next' }, baseStructure)
      linkHeader.next.page = currentPage + 1
      linkHeader.next.per_page = perPage
      linkHeader.next.url += `?per_page=${perPage}&page=${currentPage + 1}`
    }

    // place additional url query properties back into the generated url's
    ['first', 'prev', 'self', 'next', 'last'].forEach(linkHeaderProp => {
      if (linkHeaderProp in linkHeader) {
        for (let urlQueryProp in query) {
          if ((urlQueryProp !== 'page') && (urlQueryProp !== 'per_page')) {
            linkHeader[linkHeaderProp].url += `&${urlQueryProp}`
            if (query[urlQueryProp]) linkHeader[linkHeaderProp].url += `=${query[urlQueryProp]}`
          }
        }
      }
    })

    req.linkHeader = linkHeader

    if (!('queryOptions' in req)) req.queryOptions = {}
    req.queryOptions.limit = perPage
    req.queryOptions.offset = perPage * (currentPage - 1)

    // put link header into the res object
    res.set('Link', formatLinkHeader(req.linkHeader))
    return next()
  }
}

function routingTest (req, res, next) {
  req.resJson = { message: `${req.originalUrl} test successful` }
  return next()
}

function redirect (req, res, next) {
  if (('resRedirect' in req) || (res.statusCode === 404)) {
    return res
      .status(res.statusCode || 301)
      .redirect(req.resRedirect)
      .end()
  } else {
    return next()
  }
}

/*
sends the specified template
set res.status and add a req.resTemplate object to activate this middleware
example:
res.status(404)
req.resTemplate = {
  view: 'notFound', // name of the template file
  data: { // (optional) data that will be passed to the template engine
    a: 'fake data'
    b: 'fake data'
    etc: ...
  }
}
*/
function template (req, res, next) {
  if (!('resTemplate' in req)) return next()
  return res
    .status(res.statusCode || 200)
    .type('text/html;charset=utf-8')
    .render(req.resTemplate.view, req.resTemplate.data || {})
}

/*
middleware to validate jwt in the incoming requests
for v1 routes
restrictionLevel is an object
{ // parameters are all optional, defaults to general account comparison by email only
  none: true/false, // skips validation entirely, used on routes that's openly accessable to public (other restrictions will be ignored)
  admin: true/false, // account found by email lookup must has true as admin field value (staff and user restrictions will be ignored)
  staff: true/false, // accounts registered under hosting companies
  user: true/false // matches token payload id to account id found by query email, also need to match req.params.contactId
}
*/
function validateJwt ({ none = false, admin = false, staff = false, user = false } = {}) {
  return (req, res, next) => {
    // skip validation according to settings
    if (!ENFORCE_VALIDATION) {
      logging.warning('SYSTEM IS CONFIGURED TO SKIP ALL TOKEN VALIDATION !!!')
      return next()
    }

    // skip validation if specified by the server code
    if (none) return next()

    // check if token exists in the request header
    let accessToken = req.get('x-access-token')
    if (!accessToken) {
      let error = new Error('Missing Token')
      error.status = 401
      return next(error)
    }

    // decode token and verify against restriction settings
    return jwt.verify(accessToken, PASS_PHRASE, (error, decodedToken) => {
      if (error) { // token cannot be decoded
        error.status = 401
        return next(error)
      }

      // token decoded, search contact list for account that at least matches in email
      return contactQueries.getCredentialByEmail()
        .then(contact => {
          // token carries an email that's not registered in the contact records
          if (!contact) {
            let error = new Error('Cannot validate the provided credentials')
            error.status = 401
            next(error)
            return Promise.resolve()
          }

          // determine and set user privilege level
          let privilege = req.userPrivilege = contact.admin ? 3 : contact.company.host ? 2 : 1
          req.registeredUser = contact

          // matching account has admin privilege, allow access immediately
          if (privilege === 3) {
            next()
            return Promise.resolve()
          }

          // if admin privilege is required
          if (admin && (privilege < 3)) {
            let error = new Error('Only admin accounts are authorized')
            error.status = 403
            next(error)
            return Promise.resolve()
          }

          // only staff is allowed
          if (staff && !user && (privilege < 2)) {
            let error = new Error('Only hosting company\'s staff accounts are authorizded')
            error.status = 403
            next(error)
            return Promise.resolve()
          }

          // if only user is allowed
          if (user && !staff) {
            // prevent staff account accessing private user features
            if (privilege === 2) {
              let error = new Error('Private user features are not accessible to staff accounts')
              error.status = 403
              next(error)
              return Promise.resolve()
            }
            // check user account
            if (privilege === 1) {
              // parse contactId from either req.params or req.body
              let parsedContactId = 'contactId' in req.params
                ? req.params.contactId.toUpperCase()
                : 'contactId' in req.body
                  ? req.body.contactId.toUpperCase()
                  : null

              // contactId parsed from payload does not match request designated contactId
              if (decodedToken.id !== parsedContactId) {
                let error = new Error('Attempt to access other user\'s information')
                error.status = 403
                next(error)
                return Promise.resolve()
              }

              // token payload contactId does not match the account id
              if (decodedToken.id !== contact.id) {
                let error = new Error('Token tempering detected')
                error.status = 401
                next(error)
                return Promise.resolve()
              }

              // make sure the user is a client account
              if ((contact.companyId !== null) && (contact.company.host !== false)) {
                let error = new Error('Only client account is allowed access')
                error.status = 401
                next(error)
                return Promise.resolve()
              }
            }
          }
          // all restriction had been applied or only general privilege is required
          next()
          return Promise.resolve()
        })
        .catch(error => next(error))
    })
  }
}
