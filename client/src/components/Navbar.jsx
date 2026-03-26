import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 

// IMPORTING PREMIUM ICONS (Feather Icons pack)
import { FiSearch, FiHeart, FiShoppingCart, FiMenu } from 'react-icons/fi';

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
        
        {/* HAMBURGER ICON */}
        <div className="hamburger" style={{ cursor: 'pointer' }}>
          <FiMenu size={28} color="#3A2020" />
        </div>
        
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
          
          {/* SEARCH WIDGET */}
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
              {/* REACT-ICONS SEARCH */}
              <FiSearch size={24} color="#3A2020" />
            </button>
          </form>

          {/* REACT-ICONS HEART */}
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
            <FiHeart size={24} color="#3A2020" />
          </button>
          
          {/* REACT-ICONS CART */}
          <Link to="/cart" style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <FiShoppingCart size={24} color="#3A2020" />
            
            {/* CART BADGE */}
            {cartCount > 0 && (
              <span className="cart-badge" style={{ position: 'absolute', top: '-8px', right: '-10px', background: '#B76E79', color: '#fff', fontSize: '11px', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;