const jwt = require('jsonwebtoken')
const router = require('express').Router()
const { User } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll()
  res.json(users)
})

router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  res.json(user)
})

router.get('/:id', async (req, res, next) => {
  const user = await User.findByPk(req.params.id)

  if (user) {
    res.json(user)
  } else {
    next(new ReferenceError(`User with id ${req.params.id} not found.`))
  }
})

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

class AuthorizationError {
  static name = 'AuthorizationError'
  constructor(message) {
    this.message = message
  }
}

router.put('/:username', async (req, res, next) => {
  const username = req.params.username
  const new_username = req.body.username
  const token = getTokenFrom(req)

  if (!jwt.verify(token, process.env.SECRET)) {
    next(new AuthorizationError('invalid token'))
    return
  }

  const user = await User.findOne({
    where: {
      username: username,
    },
  })

  if (!user) {
    next(new ReferenceError(`Username ${username} not found.`))
    return
  }

  user.username = new_username
  await user.save()
  res.json(user)
})

module.exports = router
