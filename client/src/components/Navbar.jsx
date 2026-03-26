import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 

const Navbar = () => {
  const { cartCount } = useCart(); 
  const navigate = useNavigate();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false); 
      setSearchQuery(''); 
    } else {
      setIsSearchOpen(false);
    }
  };

  return (
    <nav>
      <div className="nav-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%' }}>
        <div className="hamburger" style={{ cursor: 'pointer', fontSize: '24px' }}>☰</div>
        
        {/* LOGO SECTION */}
        <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img 
            src="/facelook.png" 
            alt="FACÉLOOK Logo" 
            style={{ height: '40px', objectFit: 'contain', cursor: 'pointer' }}
          />
        </Link>
        
        {/* MENU LINKS */}
        <div className="nav-menu" style={{ display: 'flex', gap: '30px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#3A2020', fontWeight: '500', textTransform: 'uppercase' }}>Home</Link>
          <Link to="/products" style={{ textDecoration: 'none', color: '#3A2020', fontWeight: '500', textTransform: 'uppercase' }}>Shop All</Link>
          <Link to="/about" style={{ textDecoration: 'none', color: '#3A2020', fontWeight: '500', textTransform: 'uppercase' }}>About Us</Link>
          <Link to="/support" style={{ textDecoration: 'none', color: '#3A2020', fontWeight: '500', textTransform: 'uppercase' }}>Support</Link>
        </div>
        
        {/* ICONS SECTION */}
        <div className="nav-icons" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          
          {/* BULLETPROOF SVG SEARCH WIDGET */}
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
            {isSearchOpen && (
              <input 
                type="text" 
                placeholder="Search collection..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                style={{
                  padding: '8px 15px',
                  borderRadius: '20px',
                  border: '1px solid #D9C8BC', 
                  marginRight: '10px',
                  outline: 'none',
                  fontFamily: 'Jost, sans-serif',
                  width: '200px'
                }}
              />
            )}
            <button 
              type={isSearchOpen ? "submit" : "button"} 
              onClick={() => !isSearchOpen && setIsSearchOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
            >
              {/* Premium SVG Search Icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3A2020" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>

          {/* Premium SVG Heart Icon */}
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3A2020" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          
          {/* Premium SVG Cart Icon */}
          <Link to="/cart" style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3A2020" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span className="cart-badge" style={{ position: 'absolute', top: '-8px', right: '-10px', background: '#B76E79', color: '#fff', fontSize: '11px', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cartCount}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;