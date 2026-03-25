const express = require('express');
const router = express.Router();
const crypto = require('crypto'); 

// @route   POST /api/payment/process
router.post('/process', async (req, res) => {
  try {
    const { cart, customerInfo } = req.body;

    // Calculate the total price
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Generate a fake bank transaction ID
    const mockTransactionId = 'txn_' + crypto.randomBytes(8).toString('hex');

    // Simulate a 2-second bank delay
    setTimeout(() => {
      res.json({ 
        success: true, 
        message: 'Payment verified successfully',
        transactionId: mockTransactionId,
        amountPaid: totalPrice
      });
    }, 2000);

  } catch (error) {
    console.error("Mock Payment Error:", error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

module.exports = router;