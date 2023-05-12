const mongoose = require('mongoose');

const discountItemSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  img_url: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

const DiscountItem = mongoose.model('DiscountItem', discountItemSchema);

module.exports = DiscountItem;
