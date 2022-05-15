const User = require('../models/userModel');
const Summary = require('../models/summaryModel');
const Expense = require('../models/expenseModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.listAllExpenses = catchAsync(async (req, res, next) => {
  const expenses = await Expense.find();
  if (!expenses) {
    return next(new AppError('Hiçbir harcama bulunamadı.', 404));
  }

  res.status(200).json({
    status: 'success',
    results: expenses.length,
    data: {
      expenses
    }
  });
});

exports.listExpensesOfUser = catchAsync(async (req, res, next) => {
  const summary = await Summary.find({ user: req.user });

  const expenses = await Expense.find({ summary });
  if (!expenses) {
    return next(new AppError('Hiçbir harcama bulunamadı.', 404));
  }

  res.status(200).json({
    status: 'success',
    results: expenses.length,
    data: { expenses }
  });
});

exports.newExpense = catchAsync(async (req, res, next) => {
  const body = { ...req.body };
  const summary = await Summary.findById(req.user.currentSummary);

  if (!body.card) {
    body.isCash = true;
  }

  const expense = await Expense.create(body);

  summary.expenseList.push(expense._id);
  await summary.save();

  res.status(200).json({
    status: 'success',
    data: { expense }
  });
});
