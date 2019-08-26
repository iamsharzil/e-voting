const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');

module.exports = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(new AppError('Failed to authenticate token', 400));

      req.decoded = decoded;
      next();
    });
  } else {
    return next(new AppError('No token provided', 400));
  }
};
