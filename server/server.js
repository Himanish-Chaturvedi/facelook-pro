const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// 1. DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ FACÉLOOK DB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// 2. CORS (Must match your Vercel URL)
app.use(cors({ origin: 'https://facelook-pro-njx2.vercel.app' }));
app.use(express.json());

// 3. THE ROUTES
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: "FACÉLOOK Engine is LIVE 🚀" });
});

app.get('/api/products', async (req, res) => {
  try {
    // This fetches directly from your 'products' collection
    const products = await mongoose.connection.db.collection('products').find({}).toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));