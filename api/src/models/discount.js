import { Schema, model } from 'mongoose';

const discountSchema = new Schema({
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
  discountItems: [{
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
        }
  }]
});


const Discount = model('Discount', discountSchema);

module.exports = Discount;
