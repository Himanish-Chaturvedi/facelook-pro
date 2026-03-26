import { useState, useContext, createContext, useReducer, useEffect } from "react";

// LUXURY THEME
const T = {
  bg: '#FDF8F4', nude: '#F5EDE5', nudeMid: '#EDE0D8', nudeDark: '#D9C8BC',
  card: '#FFFFFF', rose: '#B76E79', roseDark: '#8B4A52', td: '#3A2020',
  tm: '#7A5050', tl: '#B09090', border: 'rgba(183,110,121,0.18)',
  shadow: '0 12px 40px rgba(183,110,121,0.12)',
};

const CATS = ['All','Lips','Eyes','Face','Nails'];
const Ctx = createContext();
const init = { page: 'home', cart: [], products: [], loading: true, drawer: false, toast: null };

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

// COMPONENTS
const PCard = ({ p }) => {
  const {dispatch:d} = useContext(Ctx);
  return (
    <div className="p-card">
      <div className="p-img"><img src={p.image || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400'} alt={p.name} /></div>
      <div className="p-txt">
        <div className="p-name">{p.name}</div>
        <div className="p-price">₹{p.price}</div>
        <button className="p-add" onClick={()=> { d({type:'CART_ADD', p}); d({type:'TOAST', msg: 'Added to Bag!'}); }}>+</button>
      </div>
    </div>
  );
};

const Home = () => {
  const {state:s, dispatch:d} = useContext(Ctx);
  return (
    <div className="fade-in">
      <div className="promo">✦ THE ROYAL COLLECTION 2026: 30% OFF | CODE: QUEEN30 ✦</div>
      <div className="hero">
        <div className="hero-content">
          <h1>FACÉLOOK</h1>
          <p>Luxury cosmetics for the modern queen.</p>
          <button className="luxe-btn" onClick={()=>d({type:'GO', page:'shop'})}>SHOP NOW</button>
        </div>
        <div className="hero-img">💄</div>
      </div>
      <div className="section">
        <div className="section-head"><h2>Trending</h2><span onClick={()=>d({type:'GO', page:'shop'})} style={{cursor:'pointer'}}>View All →</span></div>
        <div className="carousel">{s.products.slice(0,6).map(p => <PCard key={p._id} p={p} />)}</div>
      </div>
    </div>
  );
};

const Shop = () => {
  const {state:s} = useContext(Ctx);
  const [cat, setCat] = useState('All');
  const filtered = s.products.filter(p => cat === 'All' || p.category === cat);
  return (
    <div className="shop-layout fade-in">
      <aside className="sidebar">
        <h3>Boutique</h3>
        {CATS.map(c => <div key={c} onClick={()=>setCat(c)} className={`side-item ${cat === c ? 'active' : ''}`}>{c}</div>)}
      </aside>
      <main className="grid">{filtered.length > 0 ? filtered.map(p => <PCard key={p._id} p={p} />) : <div className="p-100">No products found.</div>}</main>
    </div>
  );
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, init);

  useEffect(() => {
    fetch('https://facelook-pro-njx2.onrender.com/api/products')
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

  const views = { home: <Home/>, shop: <Shop/>, cart: <div className="p-100">Bag Empty.</div>, login: <div className="p-100">Login coming soon...</div> };

  return (
    <Ctx.Provider value={{state, dispatch}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital@0;1&family=Jost:wght@300;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Jost', sans-serif; background: ${T.bg}; overflow-x: hidden; }
        nav { display: flex; justify-content: space-between; align-items: center; padding: 25px; background: rgba(245, 237, 229, 0.85); backdrop-filter: blur(15px); position: sticky; top: 0; z-index: 1000; border-bottom: 1px solid ${T.border}; }
        .logo { font-family: 'Bebas Neue'; font-size: 38px; letter-spacing: 6px; color: ${T.rose}; cursor: pointer; }
        .drawer { position: fixed; top: 0; left: ${state.drawer ? '0' : '-350px'}; width: 320px; height: 100%; background: ${T.card}; z-index: 1100; transition: 0.5s ease; padding: 80px 40px; box-shadow: 20px 0 50px rgba(0,0,0,0.1); }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 1050; display: ${state.drawer ? 'block' : 'none'}; }
        .hero { min-height: 80vh; display: flex; align-items: center; padding: 60px; text-align: center; flex-direction: column; background: linear-gradient(135deg, ${T.nudeMid}, #fff); }
        .hero h1 { font-family: 'Bebas Neue'; font-size: 100px; color: ${T.roseDark}; }
        @media (min-width: 1024px) { .hero { flex-direction: row; text-align: left; padding: 0 100px; } }
        .luxe-btn { background: ${T.rose}; color: #fff; border: none; padding: 20px 50px; font-family: 'Bebas Neue'; letter-spacing: 3px; cursor: pointer; border-radius: 60px; margin-top: 20px; }
        .carousel { display: flex; overflow-x: auto; gap: 30px; padding: 40px 20px; scrollbar-width: none; }
        .p-card { min-width: 250px; background: ${T.card}; border-radius: 30px; overflow: hidden; box-shadow: ${T.shadow}; position: relative; transition: 0.3s; }
        .p-img img { width: 100%; height: 280px; object-fit: cover; }
        .p-txt { padding: 20px; }
        .p-add { position: absolute; right: 20px; bottom: 20px; width: 40px; height: 40px; border-radius: 50%; border: none; background: ${T.rose}; color: #fff; font-size: 24px; cursor: pointer; }
        .shop-layout { display: flex; padding: 40px; gap: 60px; max-width: 1440px; margin: 0 auto; }
        .sidebar { width: 200px; display: none; }
        @media (min-width: 1024px) { .sidebar { display: block; } }
        .side-item { padding: 15px; cursor: pointer; border-radius: 12px; }
        .side-item.active { background: ${T.rose}; color: #fff; }
        .grid { flex: 1; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 30px; }
        .toast { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: ${T.roseDark}; color: #fff; padding: 12px 30px; border-radius: 50px; z-index: 2000; box-shadow: 0 5px 20px rgba(0,0,0,0.2); }
        .fade-in { animation: fadeIn 0.8s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {state.toast && <div className="toast">✓ {state.toast}</div>}
      <div className="overlay" onClick={()=>dispatch({type:'TGL_DRAWER'})}></div>
      <div className="drawer">
        <h2 className="logo" style={{marginBottom: 60}}>FACÉLOOK</h2>
        {['home', 'shop', 'cart', 'login'].map(p => (
          <div key={p} onClick={()=>dispatch({type:'GO', page: p})} style={{padding: '20px 0', borderBottom: `1px solid ${T.border}`, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 3, fontWeight: 700}}>
            {p}
          </div>
        ))}
      </div>

      <nav>
        <div onClick={()=>dispatch({type:'TGL_DRAWER'})} style={{cursor: 'pointer', fontSize: 32}}>☰</div>
        <div className="logo" onClick={()=>dispatch({type:'GO', page: 'home'})}>FACÉLOOK</div>
        <div style={{fontSize: 32, cursor: 'pointer'}} onClick={()=>dispatch({type:'GO', page: 'cart'})}>👜</div>
      </nav>

      {state.loading ? <div className="p-100">CURATING LUXURY... 💄</div> : (views[state.page] || <Home/>)}
    </Ctx.Provider>
  );
}