const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const { errorHandler } = require('./middleware')

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)

app.use(errorHandler)

module.exports = app
