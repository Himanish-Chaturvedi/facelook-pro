const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// 1. DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// 2. THE CORS HANDSHAKE (No trailing slash)
app.use(cors({ 
  origin: 'https://facelook-pro.vercel.app',
  credentials: true 
}));
app.use(express.json());

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