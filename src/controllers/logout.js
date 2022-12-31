const router = require('express').Router()
const { sessionChecker } = require('../middleware')

// DELETE, logout a user
router.delete('/', sessionChecker, async (req, res) => {
  await req.user.session.destroy()
  res.status(200).send('User logged out')
})

module.exports = router
