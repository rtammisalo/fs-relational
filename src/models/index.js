const Blog = require('./blog')
const User = require('./user')

Blog.belongsTo(User)
User.sync()
Blog.sync()

module.exports = {
  Blog,
  User,
}
