import { useState, useContext, createContext, useReducer, useEffect } from "react";

// ═══════════════════════════════════════════
// THEME & CONSTANTS (Your Luxury Palette)
// ═══════════════════════════════════════════
const T = {
  bg: '#FDF8F4', nude: '#F5EDE5', nudeMid: '#EDE0D8', nudeDark: '#D9C8BC',
  card: '#FFFFFF', rose: '#B76E79', roseDark: '#8B4A52', td: '#3A2020',
  tm: '#7A5050', tl: '#B09090', border: 'rgba(183,110,121,0.18)',
  shadow: '0 12px 40px rgba(183,110,121,0.12)',
};

const CATS = ['All','Lips','Eyes','Face','Nails'];
const Ctx = createContext();

// ═══════════════════════════════════════════
// ENGINE: DRAWER-BASED REDUCER
// ═══════════════════════════════════════════
const init = { 
  page: 'home', 
  currentCat: 'All', // NEW: Category state is now global
  cart: JSON.parse(localStorage.getItem('facelook_cart')) || [], 
  products: [], 
  loading: true, 
  navOpen: false, 
  cartOpen: false, 
  authOpen: false,
  toast: null 
};

function reducer(s, a) {
  switch(a.type) {
    case 'SET_PRODUCTS': return { ...s, products: a.payload, loading: false };
    case 'GO': return { ...s, page: a.page, currentCat: 'All', navOpen: false, cartOpen: false, authOpen: false };
    
    // NEW: Handles navigating specifically to a category from the dropdown
    case 'SET_CAT': return { ...s, page: 'shop', currentCat: a.cat, navOpen: false, cartOpen: false, authOpen: false };

    // Drawer Controls
    case 'TOGGLE_NAV': return { ...s, navOpen: !s.navOpen, cartOpen: false, authOpen: false };
    case 'TOGGLE_CART': return { ...s, cartOpen: !s.cartOpen, navOpen: false, authOpen: false };
    case 'TOGGLE_AUTH': return { ...s, authOpen: !s.authOpen, navOpen: false, cartOpen: false };
    case 'CLOSE_ALL': return { ...s, navOpen: false, cartOpen: false, authOpen: false };

    // Cart Logic
    case 'CART_ADD': {
      const ex = s.cart.find(i=>i._id===a.p._id);
      const newCart = ex ? s.cart.map(i=>i._id===a.p._id?{...i,qty:i.qty+1}:i) : [...s.cart,{...a.p,qty:1}];
      localStorage.setItem('facelook_cart', JSON.stringify(newCart));
      return { ...s, cart: newCart, cartOpen: true }; 
    }
    case 'CART_QTY': {
      const newCart = s.cart.map(i=>i._id===a.id ? {...i, qty: Math.max(1, a.qty)} : i);
      localStorage.setItem('facelook_cart', JSON.stringify(newCart));
      return { ...s, cart: newCart };
    }
    case 'CART_RM': {
      const newCart = s.cart.filter(i=>i._id!==a.id);
      localStorage.setItem('facelook_cart', JSON.stringify(newCart));
      return { ...s, cart: newCart };
    }
    case 'TOAST': return { ...s, toast: a.msg };
    case 'TOAST_CLR': return { ...s, toast: null };
    default: return s;
  }
}

// ═══════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════

const Marquee = () => (
  <div className="marquee-container">
    <div className="marquee-content">
      <span>✦ 100% VEGAN & CRUELTY FREE ✦ FREE SHIPPING ON ORDERS OVER ₹999 ✦ LUXURY REDEFINED ✦</span>
      <span>✦ 100% VEGAN & CRUELTY FREE ✦ FREE SHIPPING ON ORDERS OVER ₹999 ✦ LUXURY REDEFINED ✦</span>
    </div>
  </div>
);

const PCard = ({ p }) => {
  const {dispatch:d} = useContext(Ctx);
  return (
    <div className="p-card group">
      <div className="p-img">
        <img src={p.image || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400'} alt={p.name} />
        <div className="quick-add">
          <button className="luxe-btn-small" onClick={(e)=> { e.stopPropagation(); d({type:'CART_ADD', p}); }}>ADD TO BAG - ₹{p.price}</button>
        </div>
      </div>
      <div className="p-txt">
        <div className="p-name">{p.name}</div>
        <div className="p-price">₹{p.price}</div>
      </div>
    </div>
  );
};

const HeroCarousel = () => {
  const {dispatch:d} = useContext(Ctx);
  const slides = [
    "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=1600",
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1600"
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="hero-slider">
      {slides.map((img, i) => (
        <div key={i} className={`hero-slide ${i === current ? 'active' : ''}`} style={{backgroundImage: `url(${img})`}}>
          <div className="hero-overlay">
            <h1>{i === 0 ? "THE VELVET MATTE" : "RADIANT GLOW"}</h1>
            <p>Formulated for the modern queen.</p>
            <button className="luxe-btn" onClick={()=>d({type:'GO', page:'shop'})}>SHOP THE DROP</button>
          </div>
        </div>
      ))}
      <div className="slide-dots">
        {slides.map((_, i) => <div key={i} className={`dot ${i === current ? 'active' : ''}`} onClick={()=>setCurrent(i)} />)}
      </div>
    </div>
  );
};

const Home = () => {
  const {state:s, dispatch:d} = useContext(Ctx);
  return (
    <div className="fade-in">
      <HeroCarousel />
      <div className="section" style={{padding: '80px 5%'}}>
        <div className="section-head">
          <h2>Trending Now</h2>
          <span onClick={()=>d({type:'GO', page:'shop'})} className="view-all">View All Products →</span>
        </div>
        <div className="carousel">
          {s.products.slice(0, 5).map(p => <PCard key={p._id} p={p} />)}
        </div>
      </div>
    </div>
  );
};

const Shop = () => {
  const {state:s, dispatch:d} = useContext(Ctx);
  const [search, setSearch] = useState('');
  
  // NEW: Filtering logic now uses the global state 'currentCat'
  const filtered = s.products.filter(p => 
    (s.currentCat === 'All' || p.category === s.currentCat) && 
    (p.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="shop-layout fade-in">
      <div className="shop-header">
        <h2>{s.currentCat === 'All' ? 'All Products' : s.currentCat}</h2>
        <div className="cat-pills">
          {CATS.map(c => <button key={c} onClick={()=>d({type:'SET_CAT', cat: c})} className={`cat-pill ${s.currentCat === c ? 'active' : ''}`}>{c}</button>)}
        </div>
      </div>
      <div style={{maxWidth: '400px', margin: '0 auto 40px'}}>
        <input type="text" placeholder="Search collection..." className="luxe-input" onChange={(e)=>setSearch(e.target.value)} />
      </div>
      <main className="grid">
        {filtered.length > 0 ? filtered.map(p => <PCard key={p._id} p={p} />) : <div className="p-100">No products found.</div>}
      </main>
    </div>
  );
};

// ═══════════════════════════════════════════
// MARS-STYLE SIDE DRAWERS
// ═══════════════════════════════════════════

const CartDrawer = () => {
  const {state:s, dispatch:d} = useContext(Ctx);
  const total = s.cart.reduce((a,i)=>a+i.price*i.qty,0);

  return (
    <div className={`side-drawer right ${s.cartOpen ? 'open' : ''}`}>
      <div className="drawer-head">
        <h3>YOUR BAG ({s.cart.reduce((a,i)=>a+i.qty,0)})</h3>
        <button className="close-btn" onClick={()=>d({type:'CLOSE_ALL'})}>✕</button>
      </div>
      <div className="drawer-body">
        {s.cart.length === 0 ? <p className="empty-msg">Your bag is empty.</p> : 
          s.cart.map(item => (
            <div key={item._id} className="cart-item">
              <img src={item.image || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=100'} alt={item.name} />
              <div className="cart-info">
                <h4>{item.name}</h4>
                <p>₹{item.price}</p>
                <div className="qty-ctrl">
                  <button onClick={()=>d({type:'CART_QTY', id:item._id, qty:item.qty-1})}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={()=>d({type:'CART_QTY', id:item._id, qty:item.qty+1})}>+</button>
                </div>
              </div>
              <button className="rm-btn" onClick={()=>d({type:'CART_RM', id:item._id})}>✕</button>
            </div>
          ))
        }
      </div>
      {s.cart.length > 0 && (
        <div className="drawer-foot">
          <div className="totals"><span>Subtotal:</span><span>₹{total}</span></div>
          <p className="shipping-msg">Taxes and shipping calculated at checkout.</p>
          <button className="luxe-btn-full" onClick={()=>alert('Processing Secure Checkout...')}>CHECKOUT • ₹{total}</button>
        </div>
      )}
    </div>
  );
};

const AuthDrawer = () => {
  const {state:s, dispatch:d} = useContext(Ctx);
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={`side-drawer right ${s.authOpen ? 'open' : ''}`}>
      <div className="drawer-head">
        <h3>{isLogin ? 'ACCOUNT LOGIN' : 'CREATE ACCOUNT'}</h3>
        <button className="close-btn" onClick={()=>d({type:'CLOSE_ALL'})}>✕</button>
      </div>
      <div className="drawer-body" style={{paddingTop: '40px'}}>
        <input type="email" placeholder="Email" className="luxe-input" />
        {!isLogin && <input type="text" placeholder="First Name" className="luxe-input" />}
        <input type="password" placeholder="Password" className="luxe-input" />
        <button className="luxe-btn-full" style={{marginTop: '20px'}} onClick={() => { d({type: 'TOAST', msg: 'Welcome back!'}); d({type:'CLOSE_ALL'}); }}>
          {isLogin ? 'SIGN IN' : 'REGISTER'}
        </button>
        <p className="auth-switch" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Create an account" : "Already have an account? Log in"}
        </p>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════

export default function App() {
  const [state, dispatch] = useReducer(reducer, init);

  useEffect(() => {
    fetch('https://facelook-pro.onrender.com/api/products')
      .then(res => res.json())
      .then(data => dispatch({ type: 'SET_PRODUCTS', payload: Array.isArray(data) ? data : [] }))
      .catch(() => dispatch({ type: 'SET_PRODUCTS', payload: [] }));
  }, []);

  useEffect(() => {
    if (state.toast) {
      const t = setTimeout(() => dispatch({type: 'TOAST_CLR'}), 2000);
      return () => clearTimeout(t);
    }
  }, [state.toast]);

  return (
    <Ctx.Provider value={{state, dispatch}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital@0;1&family=Jost:wght@300;400;500;700&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Jost', sans-serif; background: ${T.bg}; overflow-x: hidden; color: ${T.td}; }
        button { font-family: 'Jost', sans-serif; }

        /* MARQUEE */
        .marquee-container { background: ${T.td}; color: ${T.nude}; padding: 8px 0; overflow: hidden; white-space: nowrap; font-size: 12px; letter-spacing: 2px; }
        .marquee-content { display: inline-block; animation: scroll 20s linear infinite; }
        .marquee-content span { padding-right: 50px; }
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        /* NAVIGATION & HOVER DROPDOWN */
        nav { display: flex; justify-content: space-between; align-items: center; padding: 0 5%; background: rgba(253, 248, 244, 0.95); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 1000; border-bottom: 1px solid ${T.border}; transition: 0.3s; height: 75px; }
        .nav-left, .nav-right { display: flex; gap: 20px; align-items: center; width: 35%; height: 100%; }
        .nav-right { justify-content: flex-end; }
        .nav-links { display: none; gap: 30px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; font-size: 14px; align-items: center; height: 100%; }
        .nav-links > span { cursor: pointer; transition: 0.3s; display: flex; align-items: center; height: 100%; }
        .nav-links > span:hover { color: ${T.rose}; }
        @media(min-width: 768px) { .nav-links { display: flex; } .burger { display: none; } }
        
        /* NEW: Hover Menu CSS */
        .dropdown-wrap { position: relative; display: flex; align-items: center; height: 100%; cursor: pointer; }
        .dropdown-trigger { display: flex; align-items: center; transition: 0.3s; }
        .dropdown-wrap:hover .dropdown-trigger { color: ${T.rose}; }
        .dropdown-menu { position: absolute; top: 100%; left: -20px; background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(15px); min-width: 220px; box-shadow: 0 15px 40px rgba(0,0,0,0.08); border: 1px solid ${T.border}; opacity: 0; visibility: hidden; transform: translateY(15px); transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); z-index: 2000; padding: 15px 0; border-radius: 0 0 15px 15px; }
        .dropdown-wrap:hover .dropdown-menu { opacity: 1; visibility: visible; transform: translateY(0); }
        .drop-item { padding: 12px 30px; transition: 0.3s; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 2px; color: ${T.td}; display: block; }
        .drop-item:hover { background: ${T.nude}; color: ${T.roseDark}; padding-left: 35px; }

        .logo { font-family: 'Bebas Neue'; font-size: 42px; letter-spacing: 6px; color: ${T.td}; cursor: pointer; text-align: center; width: 30%; }
        .icon-btn { background: none; border: none; font-size: 22px; cursor: pointer; color: ${T.td}; position: relative; }
        .badge { position: absolute; top: -5px; right: -8px; background: ${T.rose}; color: #fff; font-size: 10px; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }

        /* HERO CAROUSEL */
        .hero-slider { height: 80vh; position: relative; overflow: hidden; }
        .hero-slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 1s ease-in-out; }
        .hero-slide.active { opacity: 1; }
        .hero-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.3); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: #fff; }
        .hero-overlay h1 { font-family: 'Bebas Neue'; font-size: 8vw; letter-spacing: 10px; margin-bottom: 10px; text-shadow: 0 4px 20px rgba(0,0,0,0.4); }
        .hero-overlay p { font-size: 20px; font-style: italic; font-family: 'Playfair Display'; margin-bottom: 30px; }
        .slide-dots { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; }
        .dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.5); cursor: pointer; transition: 0.3s; }
        .dot.active { background: #fff; transform: scale(1.3); }

        /* PRODUCT CARDS */
        .section-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; border-bottom: 1px solid ${T.border}; padding-bottom: 15px; }
        .section-head h2 { font-family: 'Bebas Neue'; font-size: 32px; letter-spacing: 2px; }
        .view-all { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; font-weight: 500; transition: 0.3s; }
        .view-all:hover { color: ${T.rose}; }

        .carousel { display: flex; overflow-x: auto; gap: 30px; padding-bottom: 20px; scrollbar-width: none; }
        .carousel::-webkit-scrollbar { display: none; }
        .carousel .p-card { min-width: 280px; width: 280px; flex-shrink: 0; }

        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 40px; }

        .p-card { background: transparent; cursor: pointer; }
        .p-img { height: 320px; background: ${T.nude}; position: relative; overflow: hidden; border-radius: 10px; margin-bottom: 15px; }
        .p-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s ease; }
        .p-card:hover .p-img img { transform: scale(1.08); }
        
        .quick-add { position: absolute; bottom: -60px; left: 0; width: 100%; padding: 10px; transition: bottom 0.3s ease; display: flex; justify-content: center; }
        .p-card:hover .quick-add { bottom: 0; }
        .luxe-btn-small { width: 100%; background: rgba(255,255,255,0.9); color: ${T.td}; border: none; padding: 12px; font-weight: 700; font-size: 12px; letter-spacing: 1px; cursor: pointer; transition: 0.3s; }
        .luxe-btn-small:hover { background: ${T.td}; color: #fff; }

        .p-txt { text-align: center; }
        .p-name { font-weight: 500; font-size: 15px; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px; }
        .p-price { color: ${T.tm}; font-weight: 400; font-size: 16px; }

        /* SHOP PAGE */
        .shop-header { text-align: center; padding: 60px 0 40px; }
        .shop-header h2 { font-family: 'Bebas Neue'; font-size: 48px; letter-spacing: 4px; margin-bottom: 20px; }
        .cat-pills { display: flex; justify-content: center; flex-wrap: wrap; gap: 15px; }
        .cat-pill { padding: 8px 20px; border: 1px solid ${T.nudeDark}; background: transparent; border-radius: 30px; cursor: pointer; transition: 0.3s; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
        .cat-pill.active, .cat-pill:hover { background: ${T.td}; color: #fff; border-color: ${T.td}; }
        .shop-layout { padding: 0 5% 80px; max-width: 1600px; margin: 0 auto; }

        /* BUTTONS & INPUTS */
        .luxe-btn { background: ${T.td}; color: #fff; border: 1px solid ${T.td}; padding: 15px 40px; font-family: 'Jost'; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; transition: 0.3s; font-weight: 500; font-size: 14px; }
        .luxe-btn:hover { background: transparent; color: ${T.td}; }
        .luxe-btn-full { width: 100%; background: ${T.td}; color: #fff; border: none; padding: 18px; font-weight: 700; font-size: 14px; letter-spacing: 2px; cursor: pointer; transition: 0.3s; }
        .luxe-btn-full:hover { background: ${T.tm}; }
        .luxe-input { width: 100%; padding: 15px; margin-bottom: 15px; border: 1px solid ${T.nudeDark}; background: transparent; font-family: 'Jost'; outline: none; border-radius: 8px; }
        .luxe-input:focus { border-color: ${T.td}; }

        /* SIDE DRAWERS */
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1500; opacity: 0; pointer-events: none; transition: 0.4s; }
        .overlay.show { opacity: 1; pointer-events: auto; }
        
        .side-drawer { position: fixed; top: 0; height: 100vh; background: ${T.bg}; z-index: 2000; transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); display: flex; flex-direction: column; box-shadow: -10px 0 40px rgba(0,0,0,0.1); }
        .side-drawer.left { left: 0; width: 320px; transform: translateX(-100%); }
        .side-drawer.right { right: 0; width: 400px; max-width: 100vw; transform: translateX(100%); }
        .side-drawer.open { transform: translateX(0); }

        .drawer-head { padding: 25px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid ${T.border}; }
        .drawer-head h3 { font-family: 'Bebas Neue'; font-size: 24px; letter-spacing: 2px; }
        .close-btn { background: none; border: none; font-size: 20px; cursor: pointer; color: ${T.td}; }
        
        .drawer-body { flex: 1; overflow-y: auto; padding: 25px; }
        .drawer-foot { padding: 25px; border-top: 1px solid ${T.border}; background: #fff; }
        
        .cart-item { display: flex; gap: 15px; margin-bottom: 25px; }
        .cart-item img { width: 90px; height: 110px; object-fit: cover; border-radius: 5px; }
        .cart-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
        .cart-info h4 { font-size: 14px; text-transform: uppercase; font-weight: 500; }
        .cart-info p { color: ${T.tm}; }
        .qty-ctrl { display: inline-flex; align-items: center; border: 1px solid ${T.nudeDark}; width: fit-content; }
        .qty-ctrl button { background: none; border: none; padding: 5px 12px; cursor: pointer; font-size: 16px; }
        .qty-ctrl span { padding: 0 10px; font-size: 14px; }
        .rm-btn { background: none; border: none; font-size: 12px; text-transform: uppercase; color: ${T.tl}; cursor: pointer; height: fit-content; text-decoration: underline; }

        .totals { display: flex; justify-content: space-between; font-size: 18px; font-weight: 700; margin-bottom: 10px; }
        .shipping-msg { font-size: 12px; color: ${T.tl}; margin-bottom: 20px; text-align: center; }
        .auth-switch { text-align: center; margin-top: 20px; font-size: 14px; text-decoration: underline; cursor: pointer; color: ${T.tm}; }

        .toast { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: ${T.td}; color: #fff; padding: 15px 40px; border-radius: 5px; z-index: 3000; font-weight: 500; letter-spacing: 1px; text-transform: uppercase; font-size: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        .fade-in { animation: fadeIn 0.8s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* GLOBAL OVERLAY */}
      <div className={`overlay ${state.navOpen || state.cartOpen || state.authOpen ? 'show' : ''}`} onClick={()=>dispatch({type:'CLOSE_ALL'})}></div>

      {/* LEFT NAVIGATION DRAWER (Mobile & Expanded Menu) */}
      <div className={`side-drawer left ${state.navOpen ? 'open' : ''}`}>
        <div className="drawer-head">
          <h3 style={{fontFamily: 'Bebas Neue'}}>MENU</h3>
          <button className="close-btn" onClick={()=>dispatch({type:'CLOSE_ALL'})}>✕</button>
        </div>
        <div className="drawer-body" style={{display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '18px', textTransform: 'uppercase', fontWeight: '500'}}>
          <span onClick={()=>dispatch({type:'GO', page:'home'})} style={{cursor:'pointer', borderBottom:`1px solid ${T.border}`, paddingBottom:'15px'}}>Home</span>
          <span onClick={()=>dispatch({type:'GO', page:'shop'})} style={{cursor:'pointer', borderBottom:`1px solid ${T.border}`, paddingBottom:'15px'}}>Shop All</span>
          
          <div style={{marginTop: '10px', fontSize: '12px', color: T.tm, letterSpacing: '2px', paddingBottom: '5px'}}>CATEGORIES</div>
          {CATS.map(c => (
            <span key={c} onClick={()=>dispatch({type:'SET_CAT', cat: c})} style={{cursor:'pointer', fontSize: '15px', color: state.currentCat === c ? T.rose : T.td, paddingLeft: '10px'}}>
              ↳ {c}
            </span>
          ))}
        </div>
      </div>

      {/* RIGHT DRAWERS */}
      <CartDrawer />
      <AuthDrawer />

      {state.toast && <div className="toast">{state.toast}</div>}

      {/* TOP HEADER MODULE */}
      <Marquee />
      <nav>
        <div className="nav-left">
          <button className="icon-btn burger" onClick={()=>dispatch({type:'TOGGLE_NAV'})}>☰</button>
          <div className="nav-links">
            <span onClick={()=>dispatch({type:'GO', page:'home'})}>Home</span>
            <span onClick={()=>dispatch({type:'GO', page:'shop'})}>Shop</span>
            
            {/* NEW: THE HOVER CATEGORY DROPDOWN */}
            <div className="dropdown-wrap">
              <span className="dropdown-trigger">Categories <span style={{fontSize: '10px', marginLeft: '4px'}}>▼</span></span>
              <div className="dropdown-menu">
                {CATS.map(c => (
                  <div key={c} className="drop-item" onClick={()=>dispatch({type:'SET_CAT', cat: c})}>
                    {c}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
        
        <div className="logo" onClick={()=>dispatch({type:'GO', page: 'home'})}>FACÉLOOK</div>
        
        <div className="nav-right">
          <button className="icon-btn" onClick={()=>dispatch({type:'TOGGLE_AUTH'})}>👤</button>
          <button className="icon-btn" onClick={()=>dispatch({type:'TOGGLE_CART'})}>
            👜 {state.cart.length > 0 && <span className="badge">{state.cart.reduce((a,i)=>a+i.qty,0)}</span>}
          </button>
        </div>
      </nav>

      {/* CONTENT ENGINE */}
      {state.loading ? <div className="p-100" style={{textAlign:'center', padding:'100px', fontSize:'20px'}}>CURATING LUXURY... 💄</div> : (state.page === 'home' ? <Home/> : <Shop/>)}
    </Ctx.Provider>
  );
}