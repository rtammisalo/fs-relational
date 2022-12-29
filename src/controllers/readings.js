const express = require('express')
const { Reading, UserReading } = require('../models')
const { tokenExtractor, AuthorizationError } = require('../middleware')
const router = express.Router()

// POST, add a new reading
router.post('/', tokenExtractor, async (req, res) => {
  if (req.decodedToken.id !== req.body.userId) {
    throw new AuthorizationError(`Unauthorized addition to user's reading list`)
  }

  const reading = Reading.build({
    ...req.body,
    read: false,
  })
  await reading.save()

  res.json(reading)
})

module.exports = router
