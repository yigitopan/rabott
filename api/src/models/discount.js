const mongoose = require('mongoose');
const discountItemSchema = require('./discountSchema');

const discountSchema = new mongoose.Schema({
  supermarket: {
    type: String,
    required: true
  },
  header: {
    type: String,
    required: true
  },
  period: {
    type: String,
    required: true
  },
  discountItems: [discountItemSchema]
});

const Discount = mongoose.model('Discount', discountSchema);

module.exports = Discount;
