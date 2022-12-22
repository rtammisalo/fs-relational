require('dotenv').config()

const DATABASE_URL = process.env.DATABASE_URL || undefined

module.exports = {
  DATABASE_URL,
}
