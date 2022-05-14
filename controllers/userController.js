const User = require('../models/userModel');
const Card = require('../models/cardModel');
const Summary = require('../models/summaryModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('-__v');

  res.status(200).json({
    status: 'success',
    data: { users }
  });
});

// SUMMARY RELATED CONTROLLERS

exports.listSummaries = catchAsync(async (req, res, next) => {
  const summaries = await Summary.find();

  if (!summaries) {
    return next(new AppError('Hiçbir kullanıcı özeti bulunamadı.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      summaries
    }
  });
});

exports.listSummariesOfUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new AppError('Bu email adresine kayıtlı kullanıcı bulunamadı.', 404)
    );
  }

  const summaries = await Summary.find({ user }).select('-__v -user');
  if (!summaries) {
    return next(
      new AppError('Bu kullanıcıya kayıtlı hiçbir özete ulaşılamadı.', 404)
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      summaries
    }
  });
});
