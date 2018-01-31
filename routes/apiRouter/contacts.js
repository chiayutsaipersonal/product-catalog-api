const contactApiHandlers = require('../api/contacts')

const apiRouterV1 = require('./index').apiRouterV1

apiRouterV1.param('contactId', contactApiHandlers.autoFindTarget)
apiRouterV1.route('/login').post(...contactApiHandlers.login)
