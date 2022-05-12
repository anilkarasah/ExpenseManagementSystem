const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');

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
      validator: function (el) {
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
  ],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  securityQuestion: {
    type: String,
    required: [true, 'Lütfen güvenlik sorusu giriniz.'],
    validator: {
      validate: function (el) {
        return validator.isAlpha(el.securityQuestion, 'tr-TR', ' ');
      },
      message:
        'Güvenlik sorusu sadece harflerden(A-Z) ve rakamlardan(0-9) oluşmalıdır.'
    }
  },
  questionAnswer: {
    type: String,
    required: [true, 'Lütfen güvenlik sorusunun cevabını giriniz.']
  }
});

// 2) PRE MIDDLEWARE

userSchema.pre('find', function (next) {
  this.populate({
    path: 'cards',
    select: 'ownerName cardNumber expiryDate cardType -_id'
  });

  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Password hashing with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', function (next) {
  this.questionAnswer = slugify(this.questionAnswer, { lower: true });

  next();
});

// 3) METHODS

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// 4) EXPORT

const User = mongoose.model('User', userSchema);

module.exports = User;
