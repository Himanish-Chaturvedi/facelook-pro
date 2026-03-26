import { useState, useContext, createContext, useReducer, useEffect } from "react";

// ═══════════════════════════════════════════
// THEME & CONSTANTS
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
// ENGINE: REDUCER (Updated with Persistence)
// ═══════════════════════════════════════════
const init = { 
  page: 'home', 
  cart: JSON.parse(localStorage.getItem('facelook_cart')) || [], 
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
      const newCart = ex ? s.cart.map(i=>i._id===a.p._id?{...i,qty:i.qty+1}:i) : [...s.cart,{...a.p,qty:1}];
      localStorage.setItem('facelook_cart', JSON.stringify(newCart));
      return { ...s, cart: newCart };
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
// COMPONENTS
// ═══════════════════════════════════════════

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
  const [search, setSearch] = useState('');
  
  const filtered = s.products.filter(p => 
    (cat === 'All' || p.category === cat) && 
    (p.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="shop-layout fade-in">
      <aside className="sidebar">
        <h3>Boutique</h3>
        <input type="text" placeholder="Search..." className="search-bar" onChange={(e)=>setSearch(e.target.value)} />
        {CATS.map(c => <div key={c} onClick={()=>setCat(c)} className={`side-item ${cat === c ? 'active' : ''}`}>{c}</div>)}
      </aside>
      <main className="grid">
        {filtered.length > 0 ? filtered.map(p => <PCard key={p._id} p={p} />) : <div className="p-100">No products found.</div>}
      </main>
    </div>
  );
};

const Cart = () => {
  const {state:s, dispatch:d} = useContext(Ctx);
  const total = s.cart.reduce((a,i)=>a+i.price*i.qty,0);

  if(s.cart.length===0) return <div className="p-100">Your Bag is Empty. 💄</div>;

  return (
    <div className="cart-page fade-in">
      <h2>Shopping Bag</h2>
      <div className="cart-list">
        {s.cart.map(item => (
          <div key={item._id} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="cart-details">
              <h4>{item.name}</h4>
              <p>₹{item.price}</p>
            </div>
            <div className="qty-ctrl">
              <button onClick={()=>d({type:'CART_QTY', id:item._id, qty:item.qty-1})}>-</button>
              <span>{item.qty}</span>
              <button onClick={()=>d({type:'CART_QTY', id:item._id, qty:item.qty+1})}>+</button>
            </div>
            <button className="rm-btn" onClick={()=>d({type:'CART_RM', id:item._id})}>✕</button>
          </div>
        ))}
      </div>
      <div className="cart-footer">
        <h3>Total: ₹{total}</h3>
        <button className="luxe-btn" style={{width:'100%'}} onClick={()=>alert('Redirecting to Payment Gateway...')}>CHECKOUT</button>
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

  const views = { home: <Home/>, shop: <Shop/>, cart: <Cart/>, login: <div className="p-100">Account Coming Soon...</div> };

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

        .luxe-btn { background: ${T.rose}; color: #fff; border: none; padding: 18px 45px; font-family: 'Bebas Neue'; letter-spacing: 3px; cursor: pointer; border-radius: 60px; margin-top: 20px; transition: 0.3s; }
        .luxe-btn:hover { background: ${T.roseDark}; transform: translateY(-3px); }
        
        .grid { flex: 1; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 30px; }
        .p-card { background: ${T.card}; border-radius: 30px; overflow: hidden; box-shadow: ${T.shadow}; position: relative; transition: 0.3s; }
        .p-img img { width: 100%; height: 280px; object-fit: cover; }
        .p-add { position: absolute; right: 20px; bottom: 20px; width: 40px; height: 40px; border-radius: 50%; border: none; background: ${T.rose}; color: #fff; font-size: 24px; cursor: pointer; }

        .search-bar { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid ${T.nudeDark}; margin-bottom: 20px; font-family: 'Jost'; }
        
        .cart-page { max-width: 800px; margin: 40px auto; padding: 20px; }
        .cart-item { display: flex; align-items: center; background: #fff; padding: 15px; border-radius: 20px; margin-bottom: 15px; box-shadow: ${T.shadow}; gap: 20px; }
        .cart-item img { width: 80px; height: 80px; border-radius: 10px; object-fit: cover; }
        .qty-ctrl { display: flex; align-items: center; gap: 15px; background: ${T.bg}; padding: 5px 15px; border-radius: 50px; }
        .qty-ctrl button { background: none; border: none; font-size: 20px; cursor: pointer; }
        .rm-btn { background: none; border: none; color: ${T.tl}; cursor: pointer; font-size: 18px; }

        .toast { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: ${T.roseDark}; color: #fff; padding: 12px 30px; border-radius: 50px; z-index: 2000; animation: slideUp 0.3s ease; }
        @keyframes slideUp { from { bottom: -50px; opacity: 0; } to { bottom: 30px; opacity: 1; } }
        .fade-in { animation: fadeIn 0.8s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {state.toast && <div className="toast">✓ {state.toast}</div>}
      <div className="overlay" onClick={()=>dispatch({type:'TGL_DRAWER'})}></div>
      <div className="drawer">
        <h2 className="logo" style={{marginBottom: 60}}>FACÉLOOK</h2>
        {['home', 'shop', 'cart'].map(p => (
          <div key={p} onClick={()=>dispatch({type:'GO', page: p})} style={{padding: '20px 0', borderBottom: `1px solid ${T.border}`, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 3, fontWeight: 700}}>
            {p}
          </div>
        ))}
      </div>

      <nav>
        <div onClick={()=>dispatch({type:'TGL_DRAWER'})} style={{cursor: 'pointer', fontSize: 32}}>☰</div>
        <div className="logo" onClick={()=>dispatch({type:'GO', page: 'home'})}>FACÉLOOK</div>
        <div style={{fontSize: 32, cursor: 'pointer', position: 'relative'}} onClick={()=>dispatch({type:'GO', page: 'cart'})}>
          👜 {state.cart.length > 0 && <span style={{position:'absolute', top:-5, right:-10, background:T.rose, color:'#fff', fontSize:14, borderRadius:'50%', padding:'2px 8px'}}>{state.cart.reduce((a,i)=>a+i.qty,0)}</span>}
        </div>
      </nav>

      {state.loading ? <div className="p-100">CURATING LUXURY... 💄</div> : (views[state.page] || <Home/>)}
    </Ctx.Provider>
  );
}