const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const Product = require('./models/Product'); // Ensure this model exists

const app = express();
connectDB();

app.use(cors({ origin: 'https://facelook-pro-njx2.vercel.app' }));
app.use(express.json());

// 1. THE HEALTH CHECK (Test this first!)
app.get('/api/health', (req, res) => {
  res.json({ message: 'FACÉLOOK Backend Engine is running perfectly! 🚀' });
});

// 2. THE PRODUCT ROUTE
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));