const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); 

// @route   GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}); 
    res.json(products); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error while fetching products' });
  }
});

module.exports = router;