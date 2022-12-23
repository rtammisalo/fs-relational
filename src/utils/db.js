const config = require('./config')
const { Sequelize } = require('sequelize')

if (!config.DATABASE_URL) {
  console.log('Cannot connect to database, no URL given.')
  process.exit(1)
}

const sequelize = new Sequelize(config.DATABASE_URL)

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }
