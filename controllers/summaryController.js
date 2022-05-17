const Summary = require('../models/summaryModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.listSummaries = catchAsync(async (req, res, next) => {
  const summaries = await Summary.find().populate({
    path: 'expenseList',
    select: 'expenseType card amount spentAt'
  });

  if (!summaries) {
    return next(new AppError('Hiçbir kullanıcı özeti bulunamadı.', 404));
  }

  res.status(200).json({
    status: 'success',
    results: summaries.length,
    data: {
      summaries
    }
  });
});

exports.listSummariesOfUser = catchAsync(async (req, res, next) => {
  const summaries = await Summary.find({ user: req.params.id }).populate({
    path: 'expenseList',
    select: 'expenseType card amount spentAt'
  });

  if (!summaries) {
    return next(
      new AppError('Bu kullanıcıya kayıtlı hiçbir özete ulaşılamadı.', 404)
    );
  }

  res.status(200).json({
    status: 'success',
    results: summaries.length,
    data: {
      summaries
    }
  });
});
