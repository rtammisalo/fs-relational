const config = require('../utils/config')
const { Sequelize } = require('sequelize')

if (!config.DATABASE_URL) {
  console.log('Cannot connect to database, no URL given.')
  process.exit(1)
}

const sequelize = new Sequelize(config.DATABASE_URL)

module.exports = sequelize
