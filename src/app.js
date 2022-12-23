const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./routes/blogs')

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)

// Error handling middleware
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (
    error.name === 'SequelizeDatabaseError' ||
    error.name === 'TypeError' ||
    error.name === 'SequelizeValidationError'
  ) {
    res.status(400).end()
  } else if (error.name === 'ReferenceError') {
    res.status(404).end()
  } else {
    res.status(500).end()
  }
}

app.use(errorHandler)

module.exports = app
