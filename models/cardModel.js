const mongoose = require('mongoose');
const validator = require('validator');

function maskCardNumber(cardNumber) {
    return '**** **** **** ' + cardNumber.slice(cardNumber.length - 4, cardNumber.length);
}

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
            validator: number => validator.isCreditCard(number),
            message: 'Girdiğiniz kart numarası geçerli değil.'
        },
        // get: cc => '**** **** **** ' + cc.slice(cc.length - 4, cc.length)
        // get: maskCardNumber
    },
    expireDate: {
        type: Date,
        required: [true, 'Kartın son kullanım tarihi zorunludur.'],
        validate: {
            validator: function(expDate) {
                return validator.isDate(expDate, {
                    format: 'MM/YY',
                    // strictMode: true,
                    delimeters: '/'
                });
            },
            message: 'Son kullanım tarihini AA/YY formatında giriniz.'
        }
    },
    cvv: {
        type: Number,
        required: [true, 'Kartın CVV numarası zorunludur.'],
        validate: {
            validator: function(cvv) {
                return `${cvv}`.length === 3;
            },
            message: 'CVV numarası 3 haneden oluşmalıdır.'
        },
        // get: () => '***'
    },
    cardType: {
        type: String,
        enum: ['Credit Card', 'Bank Card'],
        default: 'Credit Card'
    },
    limit: Number
});

// 2) PRE MIDDLEWARE

cardSchema.pre(/^find/, function(next) {
    
    console.log(this.cardNumber);
    // this.cardNumber = maskCardNumber(this.cardNumber);
    
    next();
})

// 3) EXPORT

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
