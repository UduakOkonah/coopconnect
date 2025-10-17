// utils/jwt.js
const jwt = require("jsonwebtoken");

const signToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    name: user.name || user.displayName || "User",
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

module.exports = { signToken };
