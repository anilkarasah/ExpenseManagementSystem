const Card = require('../models/cardModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllCards = catchAsync(async (req, res, next) => {
  const cards = await Card.find().select('-__v');

  // cards.forEach(function(el) {
  //     this.cardNumber = el.cardNumber;
  //     console.log(this);
  // });

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
