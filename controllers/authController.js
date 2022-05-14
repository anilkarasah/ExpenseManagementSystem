const jwt = require('jsonwebtoken');
const slugify = require('slugify');
const catchAsync = require('../utils/catchAsync');
const { promisify } = require('util');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Summary = require('../models/summaryModel');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user }
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization
    // req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization;
    // token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('Giriş yapmadınız. Lütfen önce giriş yapın.', 401)
    );
  }

  // Token verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError('Bu kullanıcı artık geçerli değil.', 401));
  }

  // Check if user changed password after the token was generated
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'Kullanıcı yakın zamanda parolasını güncellemiş. Lütfen tekrar giriş yapın.',
        401
      )
    );
  }

  // GRANTS USER TO ACCESS PROTECTED ROUTE
  req.user = freshUser;
  console.log(req.user);
  next();
});

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    securityQuestion: req.body.securityQuestion,
    questionAnswer: req.body.questionAnswer
  });

  const userSummary = await Summary.create({
    user: newUser._id,
    isCurrent: true
  });

  res.status(201).json({
    status: 'success',
    data: { user: newUser, summary: userSummary }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email & password exists
  if (!email || !password)
    return next(
      new AppError('Lütfen email ve parolayı eksiksiz giriniz.', 400)
    );

  // 2) Check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Email veya parola hatalı.', 401));

  // 3) If everything is OK, send token to client
  createSendToken(user, 200, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new AppError('Bu email adresine kayıtlı kullanıcı bulunamadı.', 404)
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      email: user.email,
      question: user.securityQuestion
    }
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  // Check if user exists
  if (!user) {
    return next(
      new AppError('Bu email adresine kayıtlı kullanıcı bulunamadı.', 404)
    );
  }

  // Check if user replied the security question correctly
  const slug = slugify(req.body.answer, { lower: true });
  if (user.questionAnswer !== slug) {
    return next(
      new AppError(
        'Güvenlik sorusunun cevabı yanlış. Lütfen tekrar deneyiniz.',
        401
      )
    );
  }

  // Update user's password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('Mevcut şifre hatalı girildi.', 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  createSendToken(user, 200, res);
});
