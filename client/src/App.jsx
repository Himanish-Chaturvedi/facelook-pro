import { useState, useContext, createContext, useReducer, useEffect } from "react";

// ═══════════════════════════════════════════
// THEME — Nude + Rose Gold Luxury Palette
// ═══════════════════════════════════════════
const T = {
  bg:        '#FDF8F4',
  nude:      '#F5EDE5',
  nudeMid:   '#EDE0D8',
  nudeDark:  '#D9C8BC',
  card:      '#FFFFFF',
  rose:      '#B76E79',
  roseDark:  '#8B4A52',
  td:        '#3A2020',
  tm:        '#7A5050',
  tl:        '#B09090',
  border:    'rgba(183,110,121,0.18)',
  shadow:    '0 12px 40px rgba(183,110,121,0.12)',
};

const CATS = ['All','Lips','Eyes','Face','Nails'];

// ═══════════════════════════════════════════
// CONTEXT + REDUCER (The "Brain")
// ═══════════════════════════════════════════
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

// ═══════════════════════════════════════════
// SHARED PREMIUM COMPONENTS
// ═══════════════════════════════════════════

const PCard = ({ p }) => {
  const {dispatch:d} = useContext(Ctx);
  return (
    <div className="p-card" onClick={()=>d({type:'GO', page:'shop'})}>
      <div className="p-img">
        <img src={p.image || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400'} alt={p.name} />
        <div className="p-overlay">View Details</div>
      </div>
      <div className="p-txt">
        <div className="p-name">{p.name}</div>
        <div className="p-price">₹{p.price}</div>
        <button className="p-add" onClick={(e)=>{e.stopPropagation(); d({type:'CART_ADD', p}); d({type:'TOAST', msg: 'Added to Bag!'})}}>+</button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// MAIN PAGE VIEWS
// ═══════════════════════════════════════════

const Home = () => {
  const {state:s, dispatch:d} = useContext(Ctx);
  return (
    <div className="fade-in">
      <div className="promo-strip">✦ LIMITED EDITION: QUEEN OF MATTES 2026 ✦</div>
      <div className="hero-split">
        <div className="hero-text">
          <div className="tag">ROYALTY IN EVERY SHADE</div>
          <h1>FACÉLOOK</h1>
          <p>Luxury skincare-infused cosmetics for the modern pioneer.</p>
          <button className="luxe-btn" onClick={()=>d({type:'GO', page:'shop'})}>EXPLORE COLLECTION</button>
        </div>
        <div className="hero-graphic">💄</div>
      </div>

      <div className="carousel-section">
        <div className="section-title">
          <h2>Trending Now</h2>
          <span onClick={()=>d({type:'GO', page:'shop'})}>See All</span>
        </div>
        <div className="carousel-track">
          {s.products.map(p => <PCard key={p._id} p={p} />)}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// THE ROOT APP (RESPONSIVE & ANIMATED)
// ═══════════════════════════════════════════

export default function App() {
  const [state, dispatch] = useReducer(reducer, init);

  useEffect(() => {
    fetch('https://facelook-pro-njx2.onrender.com/api/products')
      .then(res => res.json())
      .then(data => dispatch({ type: 'SET_PRODUCTS', payload: data }))
      .catch(() => dispatch({ type: 'SET_PRODUCTS', payload: [] }));
  }, []);

  const views = { 
    home: <Home/>, 
    shop: <div className="p-100">Shop Under Maintenance...</div>,
    cart: <div className="p-100">Your Bag is Empty.</div> 
  };

  return (
    <Ctx.Provider value={{state, dispatch}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital@0;1&family=Jost:wght@300;500;700&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Jost', sans-serif; background: ${T.bg}; color: ${T.td}; overflow-x: hidden; }

        /* NAVBAR & DRAWER */
        nav { display: flex; justify-content: space-between; align-items: center; padding: 25px; background: rgba(245, 237, 229, 0.8); backdrop-filter: blur(15px); position: sticky; top: 0; z-index: 1000; border-bottom: 1px solid ${T.border}; }
        .logo { font-family: 'Bebas Neue'; font-size: 36px; letter-spacing: 5px; color: ${T.rose}; cursor: pointer; transition: 0.4s; }
        .logo:hover { letter-spacing: 10px; color: ${T.roseDark}; }
        
        .drawer { position: fixed; top: 0; left: ${state.drawer ? '0' : '-320px'}; width: 300px; height: 100%; background: ${T.card}; z-index: 1100; transition: 0.5s cubic-bezier(0.16, 1, 0.3, 1); padding: 60px 40px; box-shadow: 20px 0 50px rgba(0,0,0,0.1); }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 1050; display: ${state.drawer ? 'block' : 'none'}; backdrop-filter: blur(4px); }

        /* HERO SECTION */
        .promo-strip { background: ${T.roseDark}; color: #fff; text-align: center; padding: 12px; font-size: 10px; letter-spacing: 3px; font-weight: 700; }
        .hero-split { min-height: 85vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; text-align: center; background: linear-gradient(135deg, ${T.nudeMid}, #fff); }
        .hero-text h1 { font-family: 'Bebas Neue'; font-size: clamp(80px, 15vw, 150px); color: ${T.roseDark}; line-height: 0.85; margin-bottom: 20px; }
        .hero-graphic { font-size: 180px; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.1)); animation: float 6s ease-in-out infinite; }
        
        @media (min-width: 1024px) {
            .hero-split { flex-direction: row; text-align: left; padding: 0 100px; gap: 50px; }
            .hero-text { flex: 1.5; }
            .hero-graphic { flex: 1; display: block; }
        }

        /* PREMIUM BUTTONS */
        .luxe-btn { background: ${T.rose}; color: #fff; border: none; padding: 20px 50px; font-family: 'Bebas Neue'; letter-spacing: 3px; cursor: pointer; border-radius: 60px; transition: 0.4s; box-shadow: 0 10px 30px rgba(183,110,121,0.3); }
        .luxe-btn:hover { transform: scale(1.05) translateY(-5px); background: ${T.roseDark}; }

        /* CAROUSEL */
        .carousel-track { display: flex; overflow-x: auto; gap: 30px; padding: 40px 25px; scrollbar-width: none; -ms-overflow-style: none; }
        .carousel-track::-webkit-scrollbar { display: none; }
        .section-title { display: flex; justify-content: space-between; align-items: center; padding: 0 40px; }
        .section-title h2 { font-family: 'Playfair Display'; font-style: italic; font-size: 32px; }

        /* PRODUCT CARDS */
        .p-card { min-width: 260px; background: ${T.card}; border-radius: 30px; overflow: hidden; box-shadow: ${T.shadow}; cursor: pointer; transition: 0.5s cubic-bezier(0.16, 1, 0.3, 1); position: relative; }
        .p-card:hover { transform: translateY(-15px); }
        .p-img { height: 280px; background: ${T.nude}; position: relative; overflow: hidden; }
        .p-img img { width: 100%; height: 100%; object-fit: cover; transition: 0.6s; }
        .p-card:hover .p-img img { transform: scale(1.15); filter: brightness(0.8); }
        .p-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #fff; font-family: 'Bebas Neue'; letter-spacing: 2px; opacity: 0; transition: 0.4s; }
        .p-card:hover .p-overlay { opacity: 1; }
        
        .p-txt { padding: 25px; position: relative; }
        .p-name { font-weight: 700; font-size: 16px; color: ${T.td}; }
        .p-price { color: ${T.roseDark}; font-weight: 700; font-size: 20px; margin-top: 10px; }
        .p-add { position: absolute; right: 25px; bottom: 25px; width: 40px; height: 40px; border-radius: 50%; border: none; background: ${T.rose}; color: #fff; font-size: 24px; cursor: pointer; transition: 0.3s; }
        .p-add:hover { transform: rotate(90deg) scale(1.2); }

        /* ANIMATIONS */
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .fade-in { animation: fadeIn 1s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .p-100 { padding: 150px; text-align: center; font-style: italic; color: ${T.tl}; }
      `}</style>

      {/* DRAWER NAV */}
      <div className="overlay" onClick={()=>dispatch({type:'TGL_DRAWER'})}></div>
      <div className="drawer">
        <h2 className="logo" style={{marginBottom: 50}}>FACÉLOOK</h2>
        {['home', 'shop', 'cart', 'login'].map(p => (
          <div key={p} onClick={()=>dispatch({type:'GO', page: p})} style={{padding: '20px 0', borderBottom: `1px solid ${T.border}`, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 3, fontSize: 14, fontWeight: 500}}>
            {p}
          </div>
        ))}
      </div>

      <div style={{maxWidth: 1600, margin: '0 auto'}}>
        <nav>
          <div onClick={()=>dispatch({type:'TGL_DRAWER'})} style={{cursor: 'pointer', fontSize: 28}}>☰</div>
          <div className="logo" onClick={()=>dispatch({type:'GO', page: 'home'})}>FACÉLOOK</div>
          <div style={{fontSize: 28, cursor: 'pointer'}} onClick={()=>dispatch({type:'GO', page: 'cart'})}>👜</div>
        </nav>

        {state.loading ? (
          <div className="p-100">CURATING YOUR LUXURY EXPERIENCE... 💄</div>
        ) : (
          views[state.page] || <Home/>
        )}
      </div>
    </Ctx.Provider>
  );
}