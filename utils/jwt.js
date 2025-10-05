const jwt = require('jsonwebtoken');

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });
}

module.exports = { signToken };
