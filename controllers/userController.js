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
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!user)
    return next(new AppError('Bu ID\'ye sahip kullanıcı bulunamadı.', 404));
    
  res.status(200).json({
    message: 'success',
    data: {
      user
    }
  })
});
