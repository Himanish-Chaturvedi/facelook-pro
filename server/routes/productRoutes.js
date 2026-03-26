const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// This route MUST be '/' because 'api/products' is already added in index.js
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products); // MUST return an array []
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;