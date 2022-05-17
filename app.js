const express = require('express');
const morgan = require('morgan');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
app.use(express.json());

app.use(hpp());
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const mainPageRouter = require('./routes/mainPageRouter');
const userRouter = require('./routes/userRouter');
const cardRouter = require('./routes/cardRouter');
const summaryRouter = require('./routes/summaryRouter');
const expenseRouter = require('./routes/expenseRouter');

app.use('/api/main', mainPageRouter);
app.use('/api/users', userRouter);
app.use('/api/cards', cardRouter);
app.use('/api/summaries', summaryRouter);
app.use('/api/expenses', expenseRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
