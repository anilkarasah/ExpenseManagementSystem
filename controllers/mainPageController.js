const User = require('../models/userModel');
const Expense = require('../models/expenseModel');
const Summary = require('../models/summaryModel');
const Card = require('../models/cardModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getMainPage = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('name email');
  user.depopulate();

  const summaryID = req.user.currentSummary._id;
  const summary = await Summary.findById(summaryID)
    .select('month expenseList')
    .populate({
      path: 'expenseList',
      options: {
        sort: { spentAt: -1 },
        limit: 3
      }
    });

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      summary
    }
  });
});
