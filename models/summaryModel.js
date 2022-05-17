const mongoose = require('mongoose');

const monthNames = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık'
];

function getMonthName() {
  const thisMonth = new Date().getMonth();
  return monthNames[thisMonth];
}

const summarySchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectID,
    ref: 'User',
    required: true
  },
  month: {
    type: String,
    enum: monthNames,
    default: getMonthName
  },
  startsAt: {
    type: Date,
    default: Date.now
  },
  expenseList: [
    {
      type: mongoose.SchemaTypes.ObjectID,
      ref: 'Expense'
    }
  ]
});

// PRE MIDDLEWARES

// summarySchema.pre([/^find/, 'populate'], function (next) {
//   this.populate({
//     path: 'expenseList',
//     select: 'expenseType card amount spentAt'
//   });

//   next();
// });

const Summary = mongoose.model('Summary', summarySchema);

module.exports = Summary;
