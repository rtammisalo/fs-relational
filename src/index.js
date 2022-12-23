const express = require('express')
const cors = require('cors')
const app = express()

const { PORT } = require('./utils/config')
const { connectToDatabase } = require('./utils/db')

const blogsRouter = require('./routes/blogs')

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
