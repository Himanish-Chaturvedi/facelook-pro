import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 

// IMPORTING PREMIUM ICONS
import { FiSearch, FiHeart, FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { cartCount } = useCart(); 
  const navigate = useNavigate();
  
  // States for interactive elements
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search execution logic
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
    <nav style={{ position: 'relative', background: '#FDF8F4', borderBottom: '1px solid #D9C8BC' }}>
      <div className="nav-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%' }}>
        
        {/* 1. FUNCTIONAL HAMBURGER ICON */}
        <div 
          className="hamburger" 
          style={{ cursor: 'pointer', zIndex: 1001 }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FiX size={28} color="#3A2020" /> : <FiMenu size={28} color="#3A2020" />}
        </div>
        
        {/* LOGO SECTION */}
        <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img 
            src="/facelook.png" 
            alt="FACÉLOOK Logo" 
            style={{ height: '40px', objectFit: 'contain', cursor: 'pointer' }}
          />
        </Link>
        
        {/* DESKTOP MENU LINKS */}
        <div className="nav-menu" style={{ display: 'flex', gap: '30px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#3A2020', fontWeight: '500', textTransform: 'uppercase' }}>Home</Link>
          <Link to="/products" style={{ textDecoration: 'none', color: '#3A2020', fontWeight: '500', textTransform: 'uppercase' }}>Shop All</Link>
          <Link to="/about" style={{ textDecoration: 'none', color: '#3A2020', fontWeight: '500', textTransform: 'uppercase' }}>About Us</Link>
          <Link to="/support" style={{ textDecoration: 'none', color: '#3A2020', fontWeight: '500', textTransform: 'uppercase' }}>Support</Link>
        </div>
        
        {/* ICONS SECTION */}
        <div className="nav-icons" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          
          {/* 2. FUNCTIONAL SEARCH WIDGET */}
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            {isSearchOpen && (
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                style={{
                  padding: '8px 15px',
                  borderRadius: '20px',
                  border: '1px solid #D9C8BC', 
                  outline: 'none',
                  fontFamily: 'Jost, sans-serif',
                  width: '200px',
                  position: 'absolute',
                  right: '35px', // Floats to the left of the magnifying glass
                  background: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
              />
            )}
            <button 
              type={isSearchOpen ? "submit" : "button"} 
              onClick={() => !isSearchOpen && setIsSearchOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
            >
              <FiSearch size={24} color="#3A2020" />
            </button>
          </form>

          {/* 3. FUNCTIONAL HEART / WISHLIST */}
          <Link to="/wishlist" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <FiHeart size={24} color="#3A2020" />
          </Link>
          
          {/* 4. FUNCTIONAL CART */}
          <Link to="/cart" style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <FiShoppingCart size={24} color="#3A2020" />
            {cartCount > 0 && (
              <span className="cart-badge" style={{ position: 'absolute', top: '-8px', right: '-10px', background: '#B76E79', color: '#fff', fontSize: '11px', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU (Reveals when Hamburger is clicked) */}
      {isMobileMenuOpen && (
        <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: '#FDF8F4', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', borderBottom: '1px solid #D9C8BC', zIndex: 1000, boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#3A2020', fontWeight: '500', textTransform: 'uppercase' }}>Home</Link>
          <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#3A2020', fontWeight: '500', textTransform: 'uppercase' }}>Shop All</Link>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#3A2020', fontWeight: '500', textTransform: 'uppercase' }}>About Us</Link>
          <Link to="/support" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#3A2020', fontWeight: '500', textTransform: 'uppercase' }}>Support</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;