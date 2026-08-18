const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');

const router = express.Router();

// GET /api/products?search=&category=
// Public route. Supports optional case-insensitive search on name/description
// and an exact category filter. Returns all products when no params given.
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    const query = {};

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { description: regex }];
    }

    if (category && category.trim()) {
      query.category = category.trim();
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    return res.json({ count: products.length, products });
  } catch (err) {
    console.error('Get products error:', err);
    return res.status(500).json({ error: 'Something went wrong fetching products.' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid product ID.' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    return res.json({ product });
  } catch (err) {
    console.error('Get product error:', err);
    return res.status(500).json({ error: 'Something went wrong fetching the product.' });
  }
});

module.exports = router;
