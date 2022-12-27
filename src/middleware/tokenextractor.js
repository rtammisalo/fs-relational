const jwt = require('jsonwebtoken')
const { SECRET } = require('../utils/config')

class AuthorizationError {
  name = 'AuthorizationError'
  constructor(message) {
    this.message = message
  }
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
  } else {
    next(new AuthorizationError('token missing'))
    return
  }
  next()
}

module.exports = { AuthorizationError, tokenExtractor }
