// Error handling middleware
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (
    error.name === 'SequelizeDatabaseError' ||
    error.name === 'TypeError' ||
    error.name === 'SequelizeValidationError' ||
    error.name === 'SequelizeUniqueConstraintError'
  ) {
    res.status(400).end()
  } else if (error.name === 'ReferenceError') {
    res.status(404).end()
  } else if (
    error.name === 'AuthorizationError' ||
    error.name === 'JsonWebTokenError'
  ) {
    res.status(401).json('Invalid token')
  } else {
    console.log('Unknown error: ' + error.name)
    res.status(500).end()
  }
}

module.exports = errorHandler
