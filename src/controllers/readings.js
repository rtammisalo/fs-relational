const express = require('express')
const { Reading } = require('../models')
const { sessionChecker } = require('../middleware')
const { AuthorizationError } = require('../utils/errors')
const router = express.Router()

const checkUserPrivilege = (token, resourceUserId) => {
  if (token.id !== resourceUserId) {
    throw new AuthorizationError(`Unauthorized user access`)
  }
}

// POST, add a new reading
router.post('/', sessionChecker, async (req, res) => {
  checkUserPrivilege(req.decodedToken, req.body.userId)

  const reading = Reading.build({
    ...req.body,
    read: false,
  })
  await reading.save()

  res.json(reading)
})

// PUT, change read status
router.put('/:id', sessionChecker, async (req, res) => {
  const reading = await Reading.findByPk(req.params.id)

  if (!reading) {
    throw new ReferenceError('no such reading listing')
  }

  checkUserPrivilege(req.decodedToken, reading.userId)

  reading.read = req.body.read
  await reading.save()

  res.json(reading)
})

module.exports = router
