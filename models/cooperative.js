const mongoose = require('mongoose');

const cooperativeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Cooperative name is required'],
      trim: true,
      unique: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    location: {
      type: String,
      trim: true,
    },

    // Members are linked users
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    // Cooperative administrators (subset of members)
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    // Optional field for cooperative type or category
    category: {
      type: String,
      enum: ['agriculture', 'finance', 'housing', 'education', 'other'],
      default: 'other',
    },
  },
  { timestamps: true }
);

// Automatically set createdAt and updatedAt timestamps
// handled automatically by { timestamps: true }

// Remove Mongoose version key in JSON
cooperativeSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Cooperative', cooperativeSchema);
