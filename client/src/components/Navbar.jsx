import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // <-- Import the hook

const Navbar = () => {
  const { cartCount } = useCart(); // <-- Get the cart count from the Brain

  return (
    <nav>
  <div className="nav-container">
    <div className="hamburger">☰</div>
    
    {/* 👑 UPDATED LOGO SECTION */}
    <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
      <img 
        src="D:\\Facelook-Project\\facelook.png" /* ⬅️ PUT YOUR LOGO FILE NAME OR URL HERE */
        alt="FACÉLOOK Logo" 
        style={{ height: '40px', objectFit: 'contain', cursor: 'pointer' }}
      />
    </Link>
    
    <div className="nav-menu">
      <Link to="/">Home</Link>
      <Link to="/products">Shop All</Link>
      <Link to="/about">About</Link>
    </div>
    
    <div className="nav-icons">
      <button>🔍</button>
      <button>🤍</button>
      <Link to="/cart" style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', textDecoration: 'none' }}>
        <span style={{ fontSize: '20px', color: 'var(--text-mid)' }}>🛒</span>
        {/* Display the actual cart count here */}
        <span className="cart-badge">{cartCount}</span>
      </Link>
    </div>
  </div>
</nav>
  );
};

export default Navbar;