const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  summary: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Summary',
    required: [
      true,
      'Harcamanın, herhangi bir aylık özete bağlı olması zorunludur.'
    ]
  },
  card: {
    type: mongoose.SchemaTypes.ObjectID,
    ref: 'Card'
  },
  expenseType: {
    type: mongoose.SchemaTypes.ObjectID,
    ref: 'ExpenseType'
  },
  amount: {
    type: Number,
    required: [true, 'Harcamanın miktarı girilmek zorundadır.']
  },
  spentAt: {
    type: Date,
    default: Date.now()
  }
});
