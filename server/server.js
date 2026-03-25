const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); 

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

app.use(express.json());

// THESE TWO LINES ARE CRITICAL
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes); 

app.get('/api/health', (req, res) => {
  res.json({ message: 'FACÉLOOK Backend Engine is running perfectly! 🚀' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is locked and loaded on port ${PORT}`);
});