const router = require('express').Router()
const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  res.json(user)
})

router.get('/:id', async (req, res, next) => {
  const user = await User.findOne({
    where: { id: req.params.id },
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  })

  if (user) {
    res.json(user)
  } else {
    next(new ReferenceError(`User with id ${req.params.id} not found.`))
  }
})

router.put('/:username', async (req, res, next) => {
  const username = req.params.username
  const new_username = req.body.username

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
