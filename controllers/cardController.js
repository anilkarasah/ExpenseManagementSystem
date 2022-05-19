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

exports.getCardsOfUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user.cards) {
    return next(
      new AppError('Kullanıcıya kayıtlı hiçbir kart bulunamadı.', 404)
    );
  }

  res.status(200).json({
    status: 'success',
    results: user.cards.length,
    data: {
      cards: user.cards
    }
  });
});

exports.newCard = catchAsync(async (req, res, next) => {
  const user = req.user;
  const card = await Card.create(req.body);

  user.cards.push(card);
  await user.save();

  res.status(201).json({
    status: 'success',
    data: {
      card
    }
  });
});
