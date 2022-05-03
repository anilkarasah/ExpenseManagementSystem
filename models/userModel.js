const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// 1) SCHEMA DECLARATION

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'İsim girmek zorunludur.']
    },
    email: {
        type: String,
        unique: [true, 'Bu email başka bir kullanıcı tarafından kullanılıyor.'],
        required: [true, 'Email girmek zorunludur.'],
        validate: [validator.isEmail]
    },
    password: {
        type: String,
        required: [true, 'Parola girmek zorunludur.'],
        minlength: [8, 'Parola en az 8 karakterden oluşmalıdır.'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: true,
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'Girdiğiniz şifreler uyuşmuyor. Lütfen kontrol ediniz.'
        }
    },
    cards: [
        {
            type: mongoose.SchemaTypes.ObjectID,
            ref: 'Card'
        }
    ]
});

// 2) PRE MIDDLEWARE

userSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'cards',
        select: '-__v -_id'
    });
    
    next();
});

// 3) MIDDLEWARE

userSchema.pre('save', async function(next) {
    if (!this.isModified('password'))
        return next();
    
    // Password hashing with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    
    next();
});

// 4) EXPORT

const User = mongoose.model('User', userSchema);

module.exports = User;
