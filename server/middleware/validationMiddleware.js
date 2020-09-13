/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const validateFormatIp = async function (req, res, next) {
  const re = new RegExp('^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$')
  let pass = false
  if (req.method === 'GET') {
    if (re.test(req.query.ip)) {
      pass = true
    }
  } else if (req.method === 'POST') {
    if (re.test(req.body.ip)) {
      pass = true
    }
  }
  if (!pass) {
    const err = new Error('Ip wrong format')
    err.status = 400
    return next(err)
  } else {
    return next()
  }
}

module.exports = validateFormatIp
