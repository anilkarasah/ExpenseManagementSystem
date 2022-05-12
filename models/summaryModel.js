const mongoose = require('mongoose');

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

function getMonthName() {
  const now = new Date().getMonth();
  return monthNames[now];
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
    default: Date.now()
  }
});

const Summary = mongoose.model('Summary', summarySchema);

module.exports = Summary;
