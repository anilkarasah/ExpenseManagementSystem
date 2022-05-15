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
    validate: [validator.isEmail, 'Lütfen geçerli bir email adresi giriniz.']
  },
  password: {
    type: String,
    required: [true, 'Parola girmek zorunludur.'],
    minlength: [8, 'Parola en az 8 karakterden oluşmalıdır.'],
    select: false
  },
  passwordChangedAt: Date,
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
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  currentSummary: {
    type: mongoose.SchemaTypes.ObjectID,
    ref: 'Summary'
  }
});

// 2) PRE MIDDLEWARE

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'cards',
    select: 'ownerName cardNumber expiryDate cardType'
  });

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Password hashing with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

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

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimeStamp < changedTimeStamp;
  }

  return false;
};

// 4) EXPORT

const User = mongoose.model('User', userSchema);

module.exports = User;
