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

exports.deleteCard = catchAsync(async (req, res, next) => {
  await Card.deleteOne({_id: req.params.id});
  const user = await User.findById(req.user._id);
  const userCards = user.cards;

  let i = 0;
  while (i < userCards.length && userCards[i]._id.toString() !== req.params.id)
    i++;
  
  if (i == userCards.length) {
    return next(
      new AppError('Silinecek hiçbir kart bulunamadı.', 404)
    );
  }

  userCards[i] = null;
  await user.save();

  res.status(204).json({
    status: 'success',
    data: null
  })
})
