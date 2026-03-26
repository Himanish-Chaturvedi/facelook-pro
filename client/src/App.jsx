import { useState, useContext, createContext, useReducer, useEffect } from "react";

// ═══════════════════════════════════════════
// THEME — Nude + Rose Gold Luxury
// ═══════════════════════════════════════════
const T = {
  bg:        '#FDF8F4',
  nude:      '#F5EDE5',
  nudeMid:   '#EDE0D8',
  nudeDark:  '#D9C8BC',
  card:      '#FFFFFF',
  rose:      '#B76E79',
  roseLight: '#D4A5A5',
  roseDark:  '#8B4A52',
  roseMuted: '#C8909A',
  td:        '#3A2020',
  tm:        '#7A5050',
  tl:        '#B09090',
  border:    'rgba(183,110,121,0.18)',
  shadow:    '0 4px 20px rgba(183,110,121,0.12)',
};

const CATS = ['All','Lips','Eyes','Face','Nails'];

// ═══════════════════════════════════════════
// CONTEXT + REDUCER ENGINE
// ═══════════════════════════════════════════
const Ctx = createContext();
const init = { 
  page: 'home', 
  cart: [], 
  wish: [], 
  products: [], 
  loading: true,
  drawer: false,
  toast: null
};

function reducer(s, a) {
  switch(a.type) {
    case 'SET_PRODUCTS': return { ...s, products: a.payload, loading: false };
    case 'GO':    return { ...s, page: a.page, drawer: false };
    case 'TGL_DRAWER': return { ...s, drawer: !s.drawer };
    case 'CART_ADD': {
      const ex = s.cart.find(i=>i._id===a.p._id);
      return { ...s, cart: ex ? s.cart.map(i=>i._id===a.p._id?{...i,qty:i.qty+1}:i) : [...s.cart,{...a.p,qty:1}] };
    }
    case 'CART_RM': return { ...s, cart: s.cart.filter(i=>i._id!==a.id) };
    case 'TOAST': return { ...s, toast: a.msg };
    case 'TOAST_CLR': return { ...s, toast: null };
    default: return s;
  }
}

// ═══════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════

const PCard = ({ p }) => {
  const {dispatch:d} = useContext(Ctx);
  const fallbacks = {
    Lips: 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?w=400&q=80',
    Eyes: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80',
    Face: 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?w=400&q=80',
    Default: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80'
  };

  return (
    <div className="p-card" onClick={()=>d({type:'GO', page:'shop'})}>
      <div className="p-img">
        <img src={p.image || fallbacks[p.category] || fallbacks.Default} alt={p.name} />
        {p.tag && <div className="p-tag">{p.tag}</div>}
      </div>
      <div className="p-txt">
        <div className="p-name">{p.name}</div>
        <div className="p-shade">{p.shade || p.category}</div>
        <div className="p-price">₹{p.price}</div>
        <button className="p-add" onClick={(e)=>{
            e.stopPropagation(); 
            d({type:'CART_ADD', p});
            d({type:'TOAST', msg: `${p.name} added!`});
        }}>+</button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// PAGE VIEWS
// ═══════════════════════════════════════════

const Home = () => {
  const {state:s, dispatch:d} = useContext(Ctx);
  return (
    <div className="fade-in">
      <div className="sale-banner">✦ THE ROYAL SALE: FLAT 30% OFF | USE CODE: QUEEN30 ✦</div>
      
      <div className="hero">
        <div className="hero-content">
          <div className="hero-tag">EST. 2026 | LUXE BEAUTY</div>
          <h1>FACÉLOOK</h1>
          <p>The science of skincare meets the art of color. Discover your signature shade.</p>
          <button className="hero-btn" onClick={()=>d({type:'GO', page:'shop'})}>EXPLORE SHOP</button>
        </div>
        <div className="hero-visual">💄</div>
      </div>

      <div className="section">
        <div className="section-head">
          <h2>Trending Collection</h2>
          <span onClick={()=>d({type:'GO', page:'shop'})}>See All →</span>
        </div>
        <div className="carousel">
          {s.products.map(p => <PCard key={p._id} p={p} />)}
        </div>
      </div>
    </div>
  );
};

const Shop = () => {
  const {state:s} = useContext(Ctx);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');

  const filtered = s.products.filter(p => 
    (cat === 'All' || p.category === cat) && 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="shop-wrap fade-in">
      <aside className="sidebar">
        <h3>Categories</h3>
        {CATS.map(c => (
          <div key={c} className={`cat-link ${cat === c ? 'active' : ''}`} onClick={()=>setCat(c)}>{c}</div>
        ))}
      </aside>
      <div className="shop-main">
        <div className="search-bar">
          <input placeholder="Search products..." onChange={(e)=>setSearch(e.target.value)} />
        </div>
        <div className="grid">
          {filtered.map(p => <PCard key={p._id} p={p} />)}
        </div>
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
      .then(data => dispatch({ type: 'SET_PRODUCTS', payload: data }))
      .catch(() => dispatch({ type: 'SET_PRODUCTS', payload: [] }));
  }, []);

  useEffect(() => {
    if (state.toast) {
      const timer = setTimeout(() => dispatch({ type: 'TOAST_CLR' }), 2000);
      return () => clearTimeout(timer);
    }
  }, [state.toast]);

  const views = { home: <Home/>, shop: <Shop/>, cart: <div className="p-100">Cart coming soon...</div> };

  return (
    <Ctx.Provider value={{state, dispatch}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital@0;1&family=Jost:wght@300;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Jost', sans-serif; background: ${T.bg}; overflow-x: hidden; }
        
        /* NAVIGATION & DRAWER */
        nav { display: flex; justify-content: space-between; align-items: center; padding: 20px; background: ${T.nudeMid}; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .logo { font-family: 'Bebas Neue'; font-size: 32px; letter-spacing: 4px; color: ${T.rose}; cursor: pointer; }
        .drawer { position: fixed; top: 0; left: ${state.drawer ? '0' : '-320px'}; width: 300px; height: 100%; background: ${T.card}; z-index: 1001; transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1); padding: 50px 30px; }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 1000; display: ${state.drawer ? 'block' : 'none'}; }

        /* HERO */
        .sale-banner { background: ${T.roseDark}; color: #fff; text-align: center; padding: 12px; font-size: 10px; letter-spacing: 3px; font-weight: 700; }
        .hero { min-height: 80vh; display: flex; align-items: center; padding: 60px; position: relative; overflow: hidden; }
        .hero-content { flex: 1; z-index: 2; }
        .hero h1 { font-family: 'Bebas Neue'; font-size: clamp(60px, 10vw, 120px); color: ${T.roseDark}; line-height: 0.9; }
        .hero-visual { flex: 1; font-size: 200px; text-align: center; opacity: 0.2; position: absolute; right: 0; }
        @media (min-width: 1024px) { .hero-visual { position: relative; opacity: 1; } }
        .hero-btn { background: ${T.rose}; color: #fff; border: none; padding: 18px 45px; font-family: 'Bebas Neue'; letter-spacing: 2px; cursor: pointer; margin-top: 30px; border-radius: 50px; transition: 0.3s; }
        .hero-btn:hover { transform: scale(1.05); background: ${T.roseDark}; }

        /* CAROUSEL */
        .carousel { display: flex; overflow-x: auto; gap: 25px; padding: 30px 20px; scrollbar-width: none; }
        .section-head { display: flex; justify-content: space-between; align-items: center; padding: 0 40px; }
        .section-head h2 { font-family: 'Playfair Display'; font-style: italic; font-size: 28px; }

        /* CARDS */
        .p-card { min-width: 240px; background: ${T.card}; border-radius: 25px; overflow: hidden; box-shadow: ${T.shadow}; cursor: pointer; transition: 0.4s; }
        .p-card:hover { transform: translateY(-12px); box-shadow: 0 15px 35px rgba(183,110,121,0.2); }
        .p-img { height: 250px; position: relative; overflow: hidden; background: ${T.nude}; }
        .p-img img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
        .p-card:hover .p-img img { transform: scale(1.1); }
        .p-txt { padding: 20px; position: relative; }
        .p-name { font-weight: 700; color: ${T.td}; }
        .p-price { font-weight: 700; color: ${T.roseDark}; font-size: 18px; margin-top: 8px; }
        .p-add { position: absolute; right: 20px; bottom: 20px; width: 35px; height: 35px; border-radius: 50%; border: none; background: ${T.rose}; color: #fff; font-size: 20px; cursor: pointer; }

        /* SHOP LAYOUT */
        .shop-wrap { display: flex; gap: 50px; padding: 50px; max-width: 1440px; margin: 0 auto; }
        .sidebar { width: 250px; display: none; }
        @media (min-width: 1024px) { .sidebar { display: block; } }
        .cat-link { padding: 15px; cursor: pointer; border-radius: 12px; transition: 0.3s; font-weight: 500; }
        .cat-link.active { background: ${T.rose}; color: #fff; }
        .grid { flex: 1; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 30px; }
        .search-bar input { width: 100%; padding: 15px 25px; border-radius: 50px; border: 1.5px solid ${T.nudeDark}; outline: none; margin-bottom: 40px; }

        /* TOAST */
        .toast { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: ${T.roseDark}; color: #fff; padding: 12px 30px; border-radius: 50px; z-index: 2000; box-shadow: 0 5px 20px rgba(0,0,0,0.2); }
        
        .fade-in { animation: fadeIn 0.6s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .p-100 { padding: 150px; text-align: center; font-style: italic; color: ${T.tl}; }
      `}</style>

      {state.toast && <div className="toast">✓ {state.toast}</div>}
      <div className="overlay" onClick={()=>dispatch({type:'TGL_DRAWER'})}></div>
      <div className="drawer">
        <h2 className="logo" style={{marginBottom: 40}}>FACÉLOOK</h2>
        {['home', 'shop', 'cart'].map(p => (
          <div key={p} className="cat-link" onClick={()=>dispatch({type:'GO', page: p})} style={{textTransform: 'uppercase', letterSpacing: 2}}>
            {p}
          </div>
        ))}
      </div>

      <nav>
        <div onClick={()=>dispatch({type:'TGL_DRAWER'})} style={{cursor: 'pointer', fontSize: 24}}>☰</div>
        <div className="logo" onClick={()=>dispatch({type:'GO', page: 'home'})}>FACÉLOOK</div>
        <div style={{fontSize: 24, cursor: 'pointer'}} onClick={()=>dispatch({type:'GO', page: 'cart'})}>🛒</div>
      </nav>

      {state.loading ? (
        <div className="p-100">CURATING YOUR BEAUTY EXPERIENCE... 💄</div>
      ) : (
        views[state.page] || <Home/>
      )}
    </Ctx.Provider>
  );
}