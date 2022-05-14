const Card = require('../models/cardModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllCards = catchAsync(async (req, res, next) => {
  const cards = await Card.find();

  if (!cards) {
    return next(new AppError('Hiçbir kart bulunamadı.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      cards
    }
  });
});

exports.createCard = catchAsync(async (req, res, next) => {
  const newCard = await Card.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      card: newCard
    }
  });
});

exports.assignCard = catchAsync(async (req, res, next) => {
  console.log(req.user);
  // const user = await User.findById(req.user.id);
  const user = req.user;

  const card = await Card.findById(req.body.card);
  if (!card) return next(new AppError('Kart bulunamadı.', 404));

  // Check if user already has the card
  user.cards.map((el) => {
    if (el._id.toString() === req.body.card) {
      return next(new AppError('Bu kart zaten bu kullanıcıya kayıtlı.', 406));
    }
  });

  user.cards.push(card._id);

  const updatedUser = await User.findByIdAndUpdate(user._id, user, {
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

exports.listCardsOfUser = catchAsync(async (req, res, next) => {
  const user = User.findById(req.params.id);
  if (!user) {
    return next(new AppError('Kullanıcı bulunamadı.', 404));
  }

  const cards = Card.find({ user });
  if (!cards) {
    return next(
      new AppError('Bu kullanıcıya ait hiçbir kart bulunamadı.', 404)
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      cards
    }
  });
});
