class AuthorizationError {
  name = 'AuthorizationError'
  constructor(message) {
    this.message = message
  }
}

module.exports = { AuthorizationError }
