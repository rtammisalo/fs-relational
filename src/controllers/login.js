const jwt = require('jsonwebtoken')
const router = require('express').Router()
const { SECRET } = require('../utils/config')
const { User, Session } = require('../models/')
const { AuthorizationError } = require('../utils/errors')

// POST, login a user
router.post('/', async (request, response) => {
  const username = request.body.username
  const password = request.body.password

  const user = await User.findOne({
    where: {
      username: username,
    },
    include: [
      {
        model: Session,
        attributes: { exclude: ['userId'] },
      },
    ],
  })

  const passwordCorrect = password === 'secret'

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  if (user.disabled) {
    throw new AuthorizationError('user disabled')
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  let token
  if (user.session) {
    // User already had an ongoing session, send the old token.
    token = user.session.token
  } else {
    token = jwt.sign(userForToken, SECRET)

    // Create a new session.
    await Session.create({ token, userId: user.id })
  }

  response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = router
