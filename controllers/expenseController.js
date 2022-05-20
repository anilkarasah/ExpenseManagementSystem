const User = require('../models/userModel');
const Summary = require('../models/summaryModel');
const Expense = require('../models/expenseModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const checkIfCardExists = (user, cardID) => {
  let flag = false;

  const userCardList = user.depopulate('cards').cards;
  if (!userCardList) {
    return flag;
  }

  userCardList.map((el) => {
    if (el.toString() === cardID) {
      flag = true;
    }
  });

  return flag;
};

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

exports.newExpensePage = catchAsync(async (req, res, next) => {
  const cards = (
    await User.findById(req.user._id).populate({
      path: 'cards',
      select: 'cardNumber'
    })
  ).cards;

  res.status(200).json({
    status: 'success',
    data: {
      cards
    }
  });
});

exports.newExpense = catchAsync(async (req, res, next) => {
  const summary = await Summary.findById(req.user.currentSummary);

  if (req.body.amount <= 0) {
    return next(new AppError("Harcama miktarı 0TL'den fazla olmalıdır.", 400));
  }

  if (!req.body.card) {
    // Expense is spent by cash
    req.body.isCash = true;
  } else if (!checkIfCardExists(req.user, req.body.card)) {
    // Expense is spent by a card
    return next(
      new AppError(
        'Üzerinize kayıtlı olmayan bir kart ile harcama yapamazsınız.',
        404
      )
    );
  }

  const expense = await Expense.create(req.body);

  summary.expenseList.push(expense._id);
  await summary.save();

  res.status(200).json({
    status: 'success',
    data: { expense }
  });
});
