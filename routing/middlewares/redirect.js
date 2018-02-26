module.exports = redirect

function redirect (req, res, next) {
  return 'resRedirect' in req || res.statusCode === 404
    ? res.status(res.statusCode || 301).redirect(req.resRedirect)
    : next()
}
