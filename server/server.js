const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); 

dotenv.config();
connectDB();

const app = express();

// ═══════════════════════════════════════════
// THE CORS HANDSHAKE (No trailing slash)
// ═══════════════════════════════════════════
app.use(cors({
  origin: 'https://facelook-pro-njx2.vercel.app', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes); 

// Health Check for Debugging
app.get('/api/health', (req, res) => {
  res.json({ message: 'FACÉLOOK Backend Engine is running perfectly! 🚀' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});