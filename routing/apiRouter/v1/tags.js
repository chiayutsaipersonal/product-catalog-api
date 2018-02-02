const tagRouter = require('express').Router()

// middlewares
const notImplemented = require('../../middlewares').notImplemented
const routingTest = require('../../middlewares').routingTest

tagRouter.route('/tags')
  .get(routingTest) // get tag recordset
  .post(routingTest) // insert a tag record
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

tagRouter.route('/tags/:tagId')
  .get(notImplemented)
  .post(notImplemented)
  .put(notImplemented)
  .patch(routingTest) // patch tag record
  .delete(routingTest) // delete tag

tagRouter.route('/tagColors')
  .get(routingTest) // get a list of text name of tag colors
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

module.exports = tagRouter
