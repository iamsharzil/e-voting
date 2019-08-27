const jwt = require('jsonwebtoken');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const User = require('../models/userModel');

const signInToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signInToken(user._id);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.registerUser = catchAsync(async (req, res, next) => {
  const { username } = req.body;

  const user = await User.findOne({ username });

  if (user)
    return next(new AppError('User already exists with that email', 400));

  const newUser = await User.create(req.body);

  createSendToken(newUser, 201, req, res);
});

exports.loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password)
    return next(
      new AppError('Please provide your username and password!', 400)
    );

  const user = await User.findOne({ username }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, req, res);
};
