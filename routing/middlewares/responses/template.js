module.exports = templateResponse

/**
 * render a template when presence of req.resTemplate is detected
 * example:
 * res.status(404)
 * req.resTemplate = {
 *   view: 'notFound', // view to be rendered
 *   data: { // data that will be passed to the template engine (optional)
 *   a: 'fake data',
 *   b: 'fake data',
 *   etc: ...,
 * }
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function templateResponse (req, res, next) {
  let resObj = req.resTemplate
  return !('resTemplate' in req)
    ? next()
    : res
      .status(res.statusCode || 200)
      .type('text/html;charset=utf-8')
      .render(resObj.view, resObj.data || {})
}
