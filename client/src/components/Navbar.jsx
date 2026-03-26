import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 

const Navbar = () => {
  const { cartCount } = useCart(); 
  const navigate = useNavigate(); // Used to redirect the user after searching
  
  // State to control the Search Bar
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // The Search Engine trigger
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Sends the user to the Shop page with their search term in the URL
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false); // Auto-close the bar
      setSearchQuery(''); // Clear the text
    } else {
      // If it's empty and they click search, just close it
      setIsSearchOpen(false);
    }
  };

  return (
    <nav>
      <div className="nav-container">
        <div className="hamburger">☰</div>
        
        {/* LOGO SECTION */}
        <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img 
            src="/facelook.png" 
            alt="FACÉLOOK Logo" 
            style={{ height: '40px', objectFit: 'contain', cursor: 'pointer' }}
          />
        </Link>
        
        {/* NEW MENU LINKS */}
        <div className="nav-menu">
          <Link to="/">Home</Link>
          <Link to="/products">Shop All</Link>
          <Link to="/about">About Us</Link>
          <Link to="/support">Support</Link>
        </div>
        
        <div className="nav-icons" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          
          {/* FUNCTIONAL SEARCH WIDGET */}
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
                  border: '1px solid #D9C8BC', // Matches your nudeDark theme
                  marginRight: '10px',
                  outline: 'none',
                  fontFamily: 'Jost, sans-serif'
                }}
              />
            )}
            <button 
              type={isSearchOpen ? "submit" : "button"} 
              onClick={() => !isSearchOpen && setIsSearchOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}
            >
              🔍
            </button>
          </form>

          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>🤍</button>
          
          <Link to="/cart" style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', textDecoration: 'none' }}>
            <span style={{ fontSize: '20px', color: 'var(--text-mid)' }}>🛒</span>
            <span className="cart-badge">{cartCount}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;