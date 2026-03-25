import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '40px', color: 'var(--text-dark)' }}>No items to checkout</h2>
        <button onClick={() => navigate('/products')} className="btn-primary" style={{ marginTop: '20px' }}>Return to Shop</button>
      </div>
    );
  }

  const handlePayment = async (e) => {
    e.preventDefault(); 
    setIsProcessing(true);
    
    try {
      // 1. Send data to our custom mock backend
      const response = await fetch('http://localhost:5000/api/payment/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: cart, customerInfo: 'Guest' }),
      });

      const data = await response.json();

      if (data.success) {
        // 2. If the mock bank says yes, send them to the success page!
        navigate('/success');
      } else {
        alert("Payment failed. Please try again.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Network error. Is your backend running?");
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px', minHeight: '70vh' }}>
      <div className="sec-header" style={{ padding: '0', marginBottom: '40px' }}>
        <span className="sec-title">Secure Checkout</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '60px', alignItems: 'flex-start' }}>
        
        <div style={{ flex: '1 1 500px', background: 'var(--white)', padding: '40px', borderRadius: '24px', boxShadow: '0 8px 32px var(--shadow)' }}>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: 'var(--text-dark)', marginBottom: '24px' }}>Shipping Details</h3>
          
          <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <input required type="text" placeholder="First Name" style={inputStyle} />
              <input required type="text" placeholder="Last Name" style={inputStyle} />
            </div>
            <input required type="email" placeholder="Email Address" style={inputStyle} />
            <input required type="text" placeholder="Full Address" style={inputStyle} />
            <div style={{ display: 'flex', gap: '20px' }}>
              <input required type="text" placeholder="City" style={inputStyle} />
              <input required type="text" placeholder="Postal Code" style={inputStyle} />
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isProcessing}
              style={{ width: '100%', marginTop: '30px', padding: '20px', fontSize: '20px', opacity: isProcessing ? 0.7 : 1 }}
            >
              {isProcessing ? 'Processing Payment...' : `Pay ₹${totalPrice} Securely`}
            </button>
          </form>
        </div>

        <div style={{ flex: '1 1 350px', background: 'var(--nude-light)', padding: '40px', borderRadius: '24px', border: '1px solid var(--nude-dark)' }}>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: 'var(--text-dark)', marginBottom: '24px' }}>In Your Bag</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            {cart.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: 'var(--white)', width: '50px', height: '50px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{item.icon}</div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '15px' }}>{item.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-mid)' }}>Qty: {item.quantity}</div>
                  </div>
                </div>
                <div style={{ fontWeight: '600' }}>₹{item.price * item.quantity}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '2px solid var(--nude-dark)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', color: 'var(--rose-dark)' }}>
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

const inputStyle = {
  flex: 1,
  padding: '16px 20px',
  border: '2px solid var(--nude-dark)',
  borderRadius: '12px',
  fontFamily: "'Jost', sans-serif",
  fontSize: '15px',
  color: 'var(--text-dark)',
  outline: 'none',
  width: '100%'
};

export default Checkout;