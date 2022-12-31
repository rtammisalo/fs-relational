const Blog = require('./blog')
const User = require('./user')
const Reading = require('./reading')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)

User.hasOne(Session)
Session.belongsTo(User)

User.belongsToMany(Blog, { through: Reading, as: 'readings' })
Blog.belongsToMany(User, { through: Reading, as: 'users_reading' })

Blog.hasMany(Reading, { onDelete: 'cascade', hooks: true })

module.exports = {
  Blog,
  User,
  Reading,
  Session,
}
