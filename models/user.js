const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Only required for local users
    password: {
      type: String,
      minlength: 8,
      select: false, // hides password field by default when querying
    },

    // Authentication provider
    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },

    googleId: {
      type: String,
      unique: false, // allow multiple accounts if needed
    },

    // User role (for stretch features like admin access)
    role: {
      type: String,
      enum: ['member', 'admin'],
      default: 'member',
    },

    // Link user to cooperative (for membership tracking)
    cooperative: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cooperative',
    },
  },
  { timestamps: true }
);

// 🔒 Hash password before save (only for local users)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.provider !== 'local') return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔑 Compare password for local login
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (this.provider !== 'local') return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🧹 Hide sensitive fields when converting to JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
