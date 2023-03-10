const router = require('express').Router()
const { User, Blog } = require('../models')
const { Op } = require('sequelize')
const { sessionChecker } = require('../middleware')
const { AuthorizationError } = require('../utils/errors')

// GET, return list of all users
router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  })
  res.json(users)
})

// POST, add user
router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  res.json(user)
})

// GET, return an individual user
router.get('/:id', async (req, res, next) => {
  let read = {
    [Op.in]: [true, false],
  }

  if (req.query.read === 'true' || req.query.read === 'false') {
    read = req.query.read
  }

  const user = await User.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: Blog,
        attributes: { exclude: ['userId'] },
      },
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId'] },
        through: {
          as: 'readinglists',
          where: { read },
          attributes: ['id', 'read'],
        },
      },
    ],
  })

  if (user) {
    res.json(user)
  } else {
    next(new ReferenceError(`User with id ${req.params.id} not found.`))
  }
})

// PUT, update username of user
router.put('/:username', sessionChecker, async (req, res, next) => {
  const username = req.params.username
  const new_username = req.body.username

  if (username !== req.user.username) {
    throw new AuthorizationError('unauthorized username change')
  }

  req.user.username = new_username
  await req.user.save()

  res.status(200).json({
    old_username: username,
    new_username,
  })
})

module.exports = router
