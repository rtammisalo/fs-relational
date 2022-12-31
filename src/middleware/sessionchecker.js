const jwt = require('jsonwebtoken')
const { User, Session } = require('../models')
const { SECRET } = require('../utils/config')
const { AuthorizationError } = require('../utils/errors')

const extractToken = (req) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
  } else {
    throw new AuthorizationError('token missing')
  }
}

// Checks if the user session is valid.
const sessionChecker = async (req, res, next) => {
  extractToken(req)

  const user = await User.findOne({
    where: {
      id: req.decodedToken.id,
    },
    include: [
      {
        model: Session,
        attributes: { exclude: ['userId'] },
      },
    ],
  })

  if (!user) {
    throw new ReferenceError('no user associated with the token')
  }

  if (user.disabled) {
    if (user.session) {
      await user.session.destroy()
    }
    throw new AuthorizationError('user disabled')
  }

  if (!user.session) {
    throw new AuthorizationError('no valid session')
  }

  req.user = user

  next()
}

module.exports = sessionChecker
