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
// ENGINE: REDUCER
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
       <div className="hero" style={{minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0.2)), url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600')`, backgroundSize: 'cover', backgroundPosition: 'center', textAlign: 'center', color: '#fff'}}>
        <div style={{background: 'rgba(58, 32, 32, 0.6)', padding: '40px', borderRadius: '20px', backdropFilter: 'blur(10px)'}}>
          <h1 style={{fontFamily: 'Bebas Neue', fontSize: '80px', letterSpacing: '10px'}}>FACÉLOOK</h1>
          <p style={{fontSize: '20px', letterSpacing: '2px', marginBottom: '20px'}}>LUXURY DEFINED. RADIANCE REVEALED.</p>
          <button className="luxe-btn" onClick={()=>d({type:'GO', page:'shop'})}>EXPLORE COLLECTION</button>
        </div>
      </div>
      <div className="section" style={{padding: '60px 20px'}}>
        <div className="section-head" style={{display:'flex', justifyContent:'space-between', alignItems:'center', maxWidth:'1200px', margin:'0 auto', marginBottom: '30px'}}>
          <h2 style={{fontFamily:'Playfair Display', fontSize:'32px'}}>Trending Now</h2>
          <span onClick={()=>d({type:'GO', page:'shop'})} style={{cursor:'pointer', color:T.rose, fontWeight:'bold'}}>View All →</span>
        </div>
        <div className="carousel" style={{maxWidth:'1200px', margin:'0 auto'}}>
          {s.products.slice(0, 4).map(p => <PCard key={p._id} p={p} />)}
        </div>
      </div>
    </div>
  );
};

const Shop = () => {
  const {state:s} = useContext(Ctx);
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');
  const filtered = s.products.filter(p => (cat === 'All' || p.category === cat) && (p.name.toLowerCase().includes(search.toLowerCase())));

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
      <h2 style={{fontFamily: 'Playfair Display', marginBottom: '30px'}}>Shopping Bag</h2>
      <div className="cart-list">
        {s.cart.map(item => (
          <div key={item._id} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="cart-details" style={{flex: 1}}>
              <h4>{item.name}</h4>
              <p style={{color: T.roseDark, fontWeight: 'bold'}}>₹{item.price}</p>
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
      <div className="cart-footer" style={{marginTop: '40px', borderTop: `1px solid ${T.border}`, paddingTop: '20px'}}>
        <div style={{display:'flex', justifyContent:'space-between', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px'}}>
          <span>Total:</span><span>₹{total}</span>
        </div>
        <button className="luxe-btn" style={{width:'100%'}} onClick={()=>alert('Redirecting to Payment Gateway...')}>PROCEED TO CHECKOUT</button>
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

        /* NAV STYLING */
        nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 5%; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(15px); position: sticky; top: 0; z-index: 1000; border-bottom: 1px solid ${T.border}; }
        .logo { font-family: 'Bebas Neue'; font-size: 38px; letter-spacing: 6px; color: ${T.rose}; cursor: pointer; }

        /* DRAWER FIX: Now Fixed and Hidden by Default */
        .drawer { position: fixed; top: 0; left: ${state.drawer ? '0' : '-100%'}; width: 320px; height: 100vh; background: ${T.card}; z-index: 2000; transition: 0.5s cubic-bezier(0.4, 0, 0.2, 1); padding: 80px 40px; box-shadow: 10px 0 50px rgba(0,0,0,0.1); }
        .overlay { position: fixed; inset: 0; background: rgba(58, 32, 32, 0.4); backdrop-filter: blur(4px); z-index: 1500; display: ${state.drawer ? 'block' : 'none'}; }

        /* GRID & CAROUSEL FIXES */
        .carousel { display: flex; overflow-x: auto; gap: 20px; padding: 20px; scrollbar-width: none; }
        .carousel::-webkit-scrollbar { display: none; }
        .carousel .p-card { min-width: 280px; flex-shrink: 0; }

        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 30px; padding-bottom: 50px; }

        .p-card { background: ${T.card}; border-radius: 30px; overflow: hidden; box-shadow: ${T.shadow}; position: relative; transition: 0.3s; height: 100%; }
        .p-card:hover { transform: translateY(-10px); }
        .p-img { height: 250px; width: 100%; background: ${T.nude}; overflow: hidden; }
        .p-img img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
        .p-card:hover .p-img img { transform: scale(1.1); }
        .p-txt { padding: 20px; }
        .p-name { font-weight: 700; color: ${T.td}; margin-bottom: 5px; }
        .p-price { color: ${T.rose}; font-weight: bold; }
        .p-add { position: absolute; right: 20px; bottom: 20px; width: 45px; height: 45px; border-radius: 50%; border: none; background: ${T.rose}; color: #fff; font-size: 24px; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 15px rgba(183,110,121,0.3); }
        .p-add:hover { background: ${T.roseDark}; transform: rotate(90deg); }

        .luxe-btn { background: ${T.rose}; color: #fff; border: none; padding: 18px 45px; font-family: 'Bebas Neue'; letter-spacing: 3px; cursor: pointer; border-radius: 60px; transition: 0.3s; }
        .luxe-btn:hover { background: ${T.roseDark}; letter-spacing: 5px; }

        .shop-layout { display: flex; padding: 40px 5%; gap: 40px; max-width: 1400px; margin: 0 auto; }
        .sidebar { width: 250px; display: none; }
        @media (min-width: 1024px) { .sidebar { display: block; } }
        .side-item { padding: 15px; cursor: pointer; border-radius: 12px; transition: 0.3s; margin-bottom: 5px; font-weight: 500; }
        .side-item:hover { background: ${T.nude}; }
        .side-item.active { background: ${T.rose}; color: #fff; }
        .search-bar { width: 100%; padding: 15px; border-radius: 15px; border: 1px solid ${T.nudeDark}; margin-bottom: 30px; font-family: 'Jost'; }

        .toast { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: ${T.roseDark}; color: #fff; padding: 15px 40px; border-radius: 50px; z-index: 3000; box-shadow: 0 10px 30px rgba(0,0,0,0.2); font-weight: 500; letter-spacing: 1px; }
        .fade-in { animation: fadeIn 0.8s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .p-100 { padding: 150px 20px; text-align: center; font-style: italic; color: ${T.tl}; font-size: 20px; }
      `}</style>

      {/* OVERLAYS AT THE BOTTOM */}
      <div className={`overlay ${state.drawer ? 'show' : ''}`} onClick={()=>dispatch({type:'TGL_DRAWER'})}></div>
      <div className="drawer">
        <h2 className="logo" style={{marginBottom: 60}} onClick={()=>dispatch({type:'GO', page:'home'})}>FACÉLOOK</h2>
        {['home', 'shop', 'cart'].map(p => (
          <div key={p} onClick={()=>dispatch({type:'GO', page: p})} style={{padding: '20px 0', borderBottom: `1px solid ${T.border}`, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 3, fontWeight: 700, color: state.page === p ? T.rose : T.td}}>
            {p}
          </div>
        ))}
      </div>

      {state.toast && <div className="toast">✓ {state.toast}</div>}

      {/* MAIN NAV */}
      <nav>
        <div onClick={()=>dispatch({type:'TGL_DRAWER'})} style={{cursor: 'pointer', fontSize: 32}}>☰</div>
        <div className="logo" onClick={()=>dispatch({type:'GO', page: 'home'})}>FACÉLOOK</div>
        <div style={{fontSize: 32, cursor: 'pointer', position: 'relative'}} onClick={()=>dispatch({type:'GO', page: 'cart'})}>
          👜 {state.cart.length > 0 && <span style={{position:'absolute', top:-5, right:-10, background:T.rose, color:'#fff', fontSize:14, borderRadius:'50%', padding:'2px 8px', fontWeight:'bold'}}>{state.cart.reduce((a,i)=>a+i.qty,0)}</span>}
        </div>
      </nav>

      {/* CONTENT ENGINE */}
      {state.loading ? <div className="p-100">CURATING LUXURY... 💄</div> : (views[state.page] || <Home/>)}
    </Ctx.Provider>
  );
}