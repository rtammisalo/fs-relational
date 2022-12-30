const express = require('express')
const { Reading, UserReading } = require('../models')
const { tokenExtractor, AuthorizationError } = require('../middleware')
const router = express.Router()

const checkUserPrivilege = (token, resourceUserId) => {
  if (token.id !== resourceUserId) {
    throw new AuthorizationError(`Unauthorized user access`)
  }
}

// POST, add a new reading
router.post('/', tokenExtractor, async (req, res) => {
  checkUserPrivilege(req.decodedToken, req.body.userId)

  const reading = Reading.build({
    ...req.body,
    read: false,
  })
  await reading.save()

  res.json(reading)
})

// PUT, change read status
router.put('/:id', tokenExtractor, async (req, res) => {
  const reading = await Reading.findByPk(req.params.id)

  checkUserPrivilege(req.decodedToken, reading.userId)

  reading.read = req.body.read
  await reading.save()

  res.json(reading)
})

module.exports = router
