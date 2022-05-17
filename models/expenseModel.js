const mongoose = require('mongoose');

// SCHEMA DECLARATION

const expenseSchema = new mongoose.Schema({
  isCash: {
    type: Boolean,
    default: false
  },
  card: {
    type: mongoose.SchemaTypes.ObjectID,
    ref: 'Card'
  },
  expenseType: {
    type: String,
    enum: [
      'food-drink',
      'entertainment',
      'subscription',
      'shopping',
      'health',
      'other'
    ],
    default: 'other'
  },
  amount: {
    type: Number,
    required: [true, 'Harcamanın miktarı girilmek zorundadır.']
  },
  spentAt: {
    type: Date,
    default: Date.now
  }
});

// PRE MIDDLEWARE

// EXPORT

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
