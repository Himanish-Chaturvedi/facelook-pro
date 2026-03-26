const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();


// 1. DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

  
const allowedOrigins = [
  'https://facelook-pro.vercel.app',
  'https://facelook-pro-njx2.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy block'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// 3. THE ROUTES (Defined exactly as the frontend expects)
app.get('/', (req, res) => {
  res.send("<h1>FACÉLOOK API IS ONLINE 💄</h1>");
});

app.get('/api/health', (req, res) => {
  res.json({ message: "Engine is healthy!" });
});

// THIS IS THE CRITICAL ROUTE
app.get('/api/products', async (req, res) => {
  try {
    // This looks directly into your 'products' collection
    const products = await mongoose.connection.db.collection('products').find({}).toArray();
    console.log("Found products:", products.length);
    res.status(200).json(products); 
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json([]); 
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on port ${PORT}`);
});