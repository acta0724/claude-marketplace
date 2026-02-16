const jwt = require('jsonwebtoken');
const { jwtSecret } = require('./config');

function generateToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
  };

  return jwt.sign(payload, jwtSecret, {
    expiresIn: '24h',
  });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
