const formatLinkHeader = require('format-link-header')
const path = require('path')

const logging = require('../../controllers/logging')

const cannedMessage = {
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
    req.resJson.message = cannedMessage[res.statusCode.toString()]
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
      : cannedMessage[res.statusCode.toString()],
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
