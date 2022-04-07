// const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.test = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'test successful',
    data: null
  });
};
