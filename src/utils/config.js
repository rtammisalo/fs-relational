require('dotenv').config()

const DATABASE_URL = process.env.DATABASE_URL || undefined
const PORT = process.env.PORT || 3000
const SECRET = process.env.SECRET || undefined

module.exports = {
  DATABASE_URL,
  PORT,
  SECRET,
}
