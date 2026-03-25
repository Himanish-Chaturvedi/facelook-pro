import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const total = cart.reduce((t, i) => t + (i.price * i.quantity), 0);

  if (cart.length === 0) return <div style={{textAlign:'center', padding:'100px'}}><h2>Your bag is empty</h2><Link to="/products">Shop All</Link></div>;

  return (
    <div style={{ padding: '60px', display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
      <div style={{ flex: '1 1 600px' }}>
        {cart.map(item => (
          <div key={item.id} style={{ display:'flex', alignItems:'center', gap:'20px', padding:'20px', background:'white', marginBottom:'20px', borderRadius:'15px' }}>
            <div style={{fontSize:'40px'}}>{item.icon}</div>
            <div style={{flex:1}}>
              <h4>{item.name}</h4>
              <p>{item.shade}</p>
              <button onClick={() => updateQuantity(item.id, -1)}>-</button>
              <span style={{margin:'0 15px'}}>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, 1)}>+</button>
              <button onClick={() => removeFromCart(item.id)} style={{color:'red', marginLeft:'20px', border:'none', background:'none', cursor:'pointer'}}>Remove</button>
            </div>
            <p style={{fontWeight:'bold'}}>₹{item.price * item.quantity}</p>
          </div>
        ))}
      </div>
      <div style={{ flex: '1 1 300px', padding:'30px', background:'white', borderRadius:'15px', height:'fit-content' }}>
        <h3>Total: ₹{total}</h3>
        <Link to="/checkout"><button className="btn-primary" style={{width:'100%', marginTop:'20px'}}>Checkout</button></Link>
      </div>
    </div>
  );
};
export default Cart;