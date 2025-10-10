const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },

    // Only required for local users
    password: { type: String },

    // For OAuth users (Google)
    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    googleId: { type: String },

  },
  { timestamps: true }
);

// Hash password before save (only if local provider)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.provider !== 'local') return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password for local login
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (this.provider !== 'local') return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
