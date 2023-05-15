import { Schema, model } from 'mongoose';

const discountSchema = new Schema({
  supermarket: {
    type: String,
    required: true
  },
  period: {
    type: String,
    required: true
  },
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
    type: String,
    required: true
  },
  posted: {
    type: Boolean,
    required:true,
    default: false
  }
});


const Discount = model('Discount', discountSchema);

module.exports = Discount;
