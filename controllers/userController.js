const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('-__v');

  res.status(200).json({
    status: 'success',
    data: { users }
  });
});

exports.assignCard = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user)
    return next(new AppError("Bu ID'ye sahip kullanıcı bulunamadı.", 404));

  console.log(user.cards);
  console.log(req.body.card);

  user.cards.map((card) => {
    if (card === req.body.card)
      return next(new AppError('Bu kart zaten bu kullanıcıya kayıtlı.', 406));
  });

  user.cards.push(req.body.card);

  const updatedUser = await User.findByIdAndUpdate(req.params.id, user, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    message: 'success',
    data: {
      user: updatedUser
    }
  });
});
