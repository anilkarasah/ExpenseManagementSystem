const mongoose = require('mongoose');
const validator = require('validator');

function maskCardNumber(cc) {
  return '**** **** **** ' + cc.slice(cc.length - 4, cc.length);
}

let expErrMessage;

// 1) SCHEMA DECLARATION

const cardSchema = new mongoose.Schema({
  ownerName: {
    type: String,
    required: [true, 'Kart sahibinin ismi zorunludur.']
  },
  cardNumber: {
    type: String,
    required: [true, 'Kart numarası zorunludur.'],
    length: [16, 'Kart numarası 16 haneden oluşmak zorundadır.'],
    validate: {
      validator: (number) => validator.isCreditCard(number),
      message: 'Girdiğiniz kart numarası geçerli değil.'
    },
    unique: true,
    get: maskCardNumber
  },
  expiryDate: {
    type: Date,
    required: [true, 'Kartın son kullanım tarihi zorunludur.'],
    validate: {
      validator: function (expDate) {
        return expDate > Date.now();
      },
      message: 'Kartın son kullanma tarihi geçtiği için kaydedilemedi.'
    }
  },
  cvv: {
    type: Number,
    required: [true, 'Kartın CVV numarası zorunludur.'],
    validate: {
      validator: function (cvv) {
        return `${cvv}`.length === 3;
      },
      message: 'CVV numarası 3 haneden oluşmalıdır.'
    }
  },
  cardType: {
    type: String,
    enum: ['Credit Card', 'Bank Card'],
    default: 'Credit Card'
  },
  limit: Number
});

// 2) PRE MIDDLEWARE

//

// 3) EXPORT

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
