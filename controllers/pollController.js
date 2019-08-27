const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const User = require('../models/userModel');
const Poll = require('../models/pollModel');

exports.getAllPolls = catchAsync(async (req, res, next) => {
  const polls = await Poll.find();

  res.status(200).json({
    status: 'success',
    results: polls.length,
    data: {
      polls
    }
  });
});

exports.createPoll = catchAsync(async (req, res, next) => {
  const { question, answers } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  const newPoll = await Poll.create({
    question,
    user,
    answers: answers.map(answer => ({
      answer,
      votes: 0
    }))
  });

  user.polls.push(newPoll.id);
  await user.save();

  res.status(201).json({
    status: 'success',
    data: {
      ...newPoll._doc,
      user: user.id
    }
  });
});

exports.usersPoll = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('polls');

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.getPoll = catchAsync(async (req, res, next) => {
  const poll = await Poll.findById(req.params.id);

  if (!poll) {
    return next(new AppError('No poll found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { poll }
  });
});

exports.deletePoll = catchAsync(async (req, res, next) => {
  const poll = await Poll.findById(req.params.id);

  if (!poll) return next(new AppError('No poll found with that ID', 404));

  if (poll.user.id != req.user.id) {
    return next(new AppError('Unathorized user', 401));
  }

  await poll.remove();

  res.status(202).json({
    status: 'success',
    msg: 'Poll removed successfully'
  });
});

exports.votePoll = catchAsync(async (req, res, next) => {
  const { answer } = req.body;

  if (!answer) return next(new AppError('Please provide an answer', 400));

  const user = await User.findById(req.user.id);

  const poll = await Poll.findById(req.params.id);

  user.polls = await user.polls.filter(poll => poll.toString() === req.params.id);

  if (!poll) return next(new AppError('No poll found with that ID', 404));

  const vote = poll.answers.map(ans =>
    ans.answer === answer
      ? {
          _id: ans._id,
          answer: ans.answer,
          votes: ans.votes + 1
        }
      : ans
  );

  if (poll.voted.filter(user => user.toString() === req.user.id).length >= 1) {
    return next(new AppError('Already voted', 400));
  }

  poll.voted.push(req.user.id);
  poll.answers = vote;

  await poll.save();
  await user.save()

  res.status(200).json({
    status: 'success',
    data: { poll }
  });
});
