import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const Products = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://www.google.com/search?q=https://facelook-pro-1.onrender.com/api/products')
      .then(res => res.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.shade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div style={{textAlign:'center', padding:'100px'}}>Loading...</div>;

  return (
    <div style={{ padding: '40px 20px' }}>
      <input 
        type="text" placeholder="Search shades..." 
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ display:'block', margin:'0 auto 40px', padding:'12px 25px', borderRadius:'25px', border:'1px solid #ddd', width:'100%', maxWidth:'400px' }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
        {filtered.map(p => (
          <div className="product-card" key={p._id}>
            <div className="product-img">{p.icon}</div>
            <div className="product-info">
              <div className="product-name">{p.name}</div>
              <div className="product-shade">{p.shade}</div>
              <div className="product-row">
                <span className="product-price">₹{p.price}</span>
                <button className="add-btn" onClick={() => addToCart({...p, id: p._id})}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Products;