const User = require('../models/userModel');
const Expense = require('../models/expenseModel');
const Summary = require('../models/summaryModel');
const Card = require('../models/cardModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const expenseTypes = [
  'food-drink',
  'entertainment',
  'subscription',
  'shopping',
  'health',
  'other'
];

const expenseIndex = (type) => expenseTypes.findIndex((el) => el === type);

exports.mainPage = catchAsync(async (req, res, next) => {
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

  const expenses = Object.values(
    (
      await Summary.findById(req.user.currentSummary._id).populate(
        'expenseList'
      )
    ).expenseList
  );
  let totalSpentArray = new Array(6);
  let totalSpent = 0;
  for (let index = 0; index < totalSpentArray.length; index++) {
    totalSpentArray[index] = 0;
  }
  expenses.map((el) => {
    const index = expenseIndex(el.expenseType);
    totalSpentArray[index] += el.amount;
    totalSpent += el.amount;
  });

  let spentObj = {};
  for (let index = 0; index < totalSpentArray.length; index++) {
    let obj;
    if (totalSpentArray[index] === 0) {
      obj = undefined;
    } else {
      obj = {
        spent: totalSpentArray[index],
        percentage: (totalSpentArray[index] * 100) / totalSpent
      };
    }
    spentObj[expenseTypes[index]] = obj;
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      summary,
      spentData: spentObj
    }
  });
});

exports.expensePage = catchAsync(async (req, res, next) => {
  const summaries = await Summary.find({ user: req.user._id }).populate({
    path: 'expenseList',
    options: {
      sort: { spentAt: -1 }
    }
  });

  res.status(200).json({
    status: 'success',
    data: {
      summaries
    }
  });
});

exports.subsPage = catchAsync(async (req, res, next) => {
  const expenses = (
    await Summary.findById(req.user.currentSummary).populate({
      path: 'expenseList',
      match: { expenseType: 'subscription' },
      select: '-__v'
    })
  ).expenseList;

  res.status(200).json({
    status: 'success',
    data: {
      subsciptions: expenses
    }
  });
});
