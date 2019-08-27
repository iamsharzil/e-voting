const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  option: {
    type: String
  },
  votes: {
    type: Number,
    default: 0
  }
});

const pollSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    questions: {
      type: String
    },
    options: [optionSchema],
    voted: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

pollSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'username'
  });
  next();
});

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
