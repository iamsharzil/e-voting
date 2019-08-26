const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  options: {
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
    voted: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
