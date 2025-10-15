// utils/jwt.js
const jwt = require("jsonwebtoken");

const signUser = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    name: user.displayName || user.username || "Google User",
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

module.exports = { signUser };
