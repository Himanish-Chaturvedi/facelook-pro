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
// CONTEXT + ENGINE
// ═══════════════════════════════════════════
const Ctx = createContext();
const init = { 
  page: 'home', 
  cart: [], 
  wish: [], 
  products: [], 
  loading: true,
  drawer: false 
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
    default: return s;
  }
}

// ═══════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════

const PCard = ({ p }) => {
  const {dispatch:d} = useContext(Ctx);
  return (
    <div className="p-card" onClick={()=>d({type:'GO', page:'shop'})}>
      <div className="p-img">
        {p.image ? <img src={p.image} alt={p.name} /> : <span>💄</span>}
      </div>
      <div className="p-txt">
        <div className="p-name">{p.name}</div>
        <div className="p-price">₹{p.price}</div>
        <button className="p-add" onClick={(e)=>{e.stopPropagation(); d({type:'CART_ADD', p})}}>+</button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// PAGES
// ═══════════════════════════════════════════

const Home = () => {
  const {state:s, dispatch:d} = useContext(Ctx);
  return (
    <div className="fade-in">
      {/* SALE BANNER */}
      <div className="sale-banner">
        ✦ LIMITED TIME: 30% OFF ON ALL LIPSTICKS | CODE: QUEEN30 ✦
      </div>

      {/* HERO SECTION */}
      <div className="hero">
        <div className="hero-content">
          <div className="hero-tag">EST. 2026 | PREMIUM</div>
          <h1>FACÉLOOK</h1>
          <p>Beauty that rules hearts. Formulated for the modern queen.</p>
          <button className="hero-btn" onClick={()=>d({type:'GO', page:'shop'})}>SHOP NOW</button>
        </div>
      </div>

      {/* PRODUCT CAROUSEL */}
      <div className="section">
        <div className="section-head">
          <h2>Trending Now</h2>
          <span onClick={()=>d({type:'GO', page:'shop'})}>View All</span>
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
  return (
    <div className="shop-wrap fade-in">
      <aside className="sidebar">
        <h3>Categories</h3>
        {CATS.map(c => <div key={c} className="cat-link">{c}</div>)}
      </aside>
      <div className="grid">
        {s.products.map(p => <PCard key={p._id} p={p} />)}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════

export default function App() {
  const [state, dispatch] = useReducer(reducer, init);

  useEffect(() => {
    fetch('https://facelook-pro.onrender.com/api/products')
      .then(res => res.json())
      .then(data => dispatch({ type: 'SET_PRODUCTS', payload: data }))
      .catch(() => dispatch({ type: 'SET_PRODUCTS', payload: [] }));
  }, []);

  const views = { home: <Home/>, shop: <Shop/>, cart: <div className="p-50">Cart coming soon...</div> };

  return (
    <Ctx.Provider value={{state, dispatch}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital@0;1&family=Jost:wght@300;500;700&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Jost', sans-serif; background: ${T.bg}; color: ${T.td}; }
        
        /* DRAWER */
        .drawer { position: fixed; top: 0; left: ${state.drawer ? '0' : '-300px'}; width: 280px; height: 100%; background: ${T.card}; z-index: 1000; transition: 0.4s; padding: 40px 20px; box-shadow: 10px 0 30px rgba(0,0,0,0.1); }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 999; display: ${state.drawer ? 'block' : 'none'}; }

        /* NAVBAR */
        nav { display: flex; justify-content: space-between; align-items: center; padding: 20px; background: ${T.nudeMid}; position: sticky; top: 0; z-index: 100; }
        .logo { font-family: 'Bebas Neue'; font-size: 32px; letter-spacing: 4px; color: ${T.rose}; cursor: pointer; }

        /* HERO & BANNER */
        .sale-banner { background: ${T.roseDark}; color: #fff; text-align: center; padding: 10px; font-size: 10px; letter-spacing: 2px; }
        .hero { min-height: 70vh; display: flex; align-items: center; padding: 40px; background: linear-gradient(to right, ${T.nudeMid}, transparent); }
        .hero h1 { font-family: 'Bebas Neue'; font-size: 80px; color: ${T.roseDark}; }
        .hero-btn { background: ${T.rose}; color: #fff; border: none; padding: 15px 40px; font-family: 'Bebas Neue'; letter-spacing: 2px; cursor: pointer; margin-top: 20px; border-radius: 50px; }

        /* CAROUSEL */
        .carousel { display: flex; overflow-x: auto; gap: 20px; padding: 20px; scrollbar-width: none; }
        .section { padding: 40px 0; }
        .section-head { display: flex; justify-content: space-between; align-items: center; padding: 0 20px; }
        .section-head h2 { font-family: 'Playfair Display'; font-style: italic; }

        /* CARDS */
        .p-card { min-width: 200px; background: ${T.card}; border-radius: 20px; overflow: hidden; box-shadow: ${T.shadow}; cursor: pointer; transition: 0.3s; }
        .p-card:hover { transform: translateY(-10px); }
        .p-img { height: 180px; background: ${T.nude}; display: flex; align-items: center; justify-content: center; font-size: 40px; }
        .p-img img { width: 80%; height: 80%; object-fit: contain; }
        .p-txt { padding: 15px; position: relative; }
        .p-name { font-weight: 700; font-size: 14px; }
        .p-price { color: ${T.roseDark}; font-weight: 700; margin-top: 5px; }
        .p-add { position: absolute; right: 15px; bottom: 15px; width: 30px; height: 30px; border-radius: 50%; border: none; background: ${T.rose}; color: #fff; cursor: pointer; }

        /* SHOP LAYOUT */
        .shop-wrap { display: flex; gap: 40px; padding: 40px; max-width: 1400px; margin: 0 auto; }
        .sidebar { width: 200px; display: none; }
        @media (min-width: 1024px) { .sidebar { display: block; } }
        .grid { flex: 1; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }

        /* UTILS */
        .fade-in { animation: fadeIn 0.8s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .p-50 { padding: 100px; text-align: center; }
      `}</style>

      <div className="overlay" onClick={()=>dispatch({type:'TGL_DRAWER'})}></div>
      <div className="drawer">
        <h2 className="logo" style={{marginBottom: 40}}>FACÉLOOK</h2>
        {['home', 'shop', 'cart'].map(p => (
          <div key={p} onClick={()=>dispatch({type:'GO', page: p})} style={{padding: '15px 0', borderBottom: `1px solid ${T.border}`, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 2, fontSize: 13}}>
            {p}
          </div>
        ))}
      </div>

      <div style={{maxWidth: 1400, margin: '0 auto'}}>
        <nav>
          <div onClick={()=>dispatch({type:'TGL_DRAWER'})} style={{cursor: 'pointer', fontSize: 24}}>☰</div>
          <div className="logo" onClick={()=>dispatch({type:'GO', page: 'home'})}>FACÉLOOK</div>
          <div style={{fontSize: 24, cursor: 'pointer'}} onClick={()=>dispatch({type:'GO', page: 'cart'})}>🛒</div>
        </nav>

        {state.loading ? (
          <div className="p-50">CURATING LUXURY... 💄</div>
        ) : (
          views[state.page] || <Home/>
        )}
      </div>
    </Ctx.Provider>
  );
}