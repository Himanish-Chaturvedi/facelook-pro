import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Home = () => {
  const [featured, setFeatured] = useState([]);

  // Fetch only 4 best sellers for the home page
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setFeatured(data.slice(0, 4)));
  }, []);

  return (
    <div className="home-wrapper">
      
      {/* 1. HERO CAROUSEL */}
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="main-carousel"
      >
        <SwiperSlide>
          <div className="hero-slide slide-1">
            <div className="hero-content">
              <span>NEW COLLECTION</span>
              <h1>The Queen of Mattes</h1>
              <Link to="/products" className="btn-outline">Shop Now</Link>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="hero-slide slide-2">
            <div className="hero-content">
              <span>LIMITED EDITION</span>
              <h1>Glow Like a Goddess</h1>
              <Link to="/products" className="btn-outline">Explore Glow</Link>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      {/* 2. TRENDING CATEGORIES */}
      <section className="home-sec">
        <h2 className="sec-title-main">Shop By Category</h2>
        <div className="cat-grid">
          {['Lips', 'Eyes', 'Face', 'Skincare'].map(cat => (
            <div key={cat} className="cat-card">
              <div className="cat-circle">{cat === 'Lips' ? '💋' : cat === 'Eyes' ? '👁️' : '✨'}</div>
              <p>{cat}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (SNEAK PEEK) */}
      <section className="home-sec bg-nude">
        <div className="sec-header-flex">
          <h2 className="sec-title-main">Best Sellers</h2>
          <Link to="/products" className="view-all">View All →</Link>
        </div>
        
        <div className="featured-grid">
          {featured.map(p => (
            <div className="mini-card" key={p._id}>
              <div className="mini-img">{p.icon}</div>
              <h4>{p.name}</h4>
              <p>₹{p.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BRAND STORY */}
      <section className="brand-story">
        <div className="story-box">
          <h2>Beauty Without Compromise</h2>
          <p>Cruelty-free. Vegan. Designed for the bold. FACÉLOOK is more than makeup; it's your daily armor.</p>
        </div>
      </section>

    </div>
  );
};

export default Home;