const slugify = require('slugify');
const User = require('../models/userModel');
const Card = require('../models/cardModel');
const Summary = require('../models/summaryModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('name email');

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users }
  });
});

exports.getUserPage = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate('cards');
  const summaries = await Summary.find({user: req.params.id}).select('-user').populate('expenseList');

  res.status(200).json({
    status: 'success',
    data: {
      user,
      summaries
    }
  })
})

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password)
    return next(
      new AppError(
        'Parolanızı güncellemek için lütfen /updatePassword adresini kullanın.',
        400
      )
    );

  if (req.body.role) {
    return next(
      new AppError(
        'Rolünüzü güncellemek için lütfen /grantRole adresini kullanın.',
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, 'name', 'email');

  if (req.body.securityQuestion) {
    if (!req.body.questionAnswer) {
      return next(
        new AppError('Lütfen yeni güvenlik sorusunun cevabını giriniz.', 400)
      );
    }

    filteredBody.securityQuestion = req.body.securityQuestion;

    const answer = slugify(req.body.questionAnswer, { lower: true });
    filteredBody.questionAnswer = answer;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});
