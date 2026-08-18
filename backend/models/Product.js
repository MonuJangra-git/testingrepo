const mongoose = require('mongoose');

const CATEGORIES = ['Electronics', 'Clothing', 'Home', 'Books', 'Sports', 'Toys'];

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  imageUrl: {
    type: String,
    required: [true, 'Product image URL is required']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: {
      values: CATEGORIES,
      message: 'Category must be one of: ' + CATEGORIES.join(', ')
    }
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  stock: {
    type: Number,
    default: 100
  },
  seller: {
    type: String,
    default: 'RetailMart Official Store'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Text index to support fast search on name and description
ProductSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', ProductSchema);
module.exports.CATEGORIES = CATEGORIES;
