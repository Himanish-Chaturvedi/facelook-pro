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
// CONTEXT + REDUCER ENGINE
// ═══════════════════════════════════════════
const Ctx = createContext();
const init = { page: 'home', cart: [], products: [], loading: true, drawer: false, toast: null, user: null };

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
    case 'LOGIN': return { ...s, user: a.user, page: 'home' };
    case 'LOGOUT': return { ...s, user: null };
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
  return (
    <div className="p-card" onClick={()=>d({type:'GO', page:'shop'})}>
      <div className="p-img">
        <img src={p.image || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400'} alt={p.name} />
        <div className="p-overlay">Quick View</div>
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
// PAGE VIEWS
// ═══════════════════════════════════════════

const Home = () => {
  const {state:s, dispatch:d} = useContext(Ctx);
  return (
    <div className="fade-in">
      <div className="promo-strip">✦ THE ROYAL COLLECTION 2026: 30% OFF | CODE: QUEEN30 ✦</div>
      <div className="hero-split">
        <div className="hero-text">
          <div className="tag">UNVEIL YOUR GLOW</div>
          <h1>FACÉLOOK</h1>
          <p>Where high-performance AI meets artisan cosmetics. Created for the modern college pioneer.</p>
          <div style={{display:'flex', gap:15}}>
             <button className="luxe-btn" onClick={()=>d({type:'GO', page:'shop'})}>SHOP NOW</button>
             <button className="luxe-btn-sec" onClick={()=>d({type:'GO', page:'shop'})}>EXPLORE</button>
          </div>
        </div>
        <div className="hero-graphic">💄</div>
      </div>

      <div className="carousel-section">
        <div className="section-title">
          <h2>Trending Collection</h2>
          <span onClick={()=>d({type:'GO', page:'shop'})}>View All →</span>
        </div>
        <div className="carousel-track">
          {s.products.map(p => <PCard key={p._id} p={p} />)}
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  const {dispatch:d} = useContext(Ctx);
  const [form, setForm] = useState({email: '', pass: ''});
  return (
    <div className="login-wrap fade-in">
      <div className="login-box">
        <h2>Welcome Back</h2>
        <p>Sign in to your FACÉLOOK account</p>
        <input type="email" placeholder="Email Address" onChange={e => setForm({...form, email: e.target.value})} />
        <input type="password" placeholder="Password" onChange={e => setForm({...form, pass: e.target.value})} />
        <button className="luxe-btn" style={{width:'100%', marginTop:20}} onClick={()=>d({type:'LOGIN', user: {name: form.email}})}>SIGN IN</button>
        <div className="login-footer">Don't have an account? <span>Sign Up</span></div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// ROOT APP (RESPONSIVE & FLAWLESS)
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
    shop: <div className="p-100">Browse Our Catalog...</div>,
    cart: <div className="p-100">Your Luxury Bag is Empty.</div>,
    login: <Login/>
  };

  return (
    <Ctx.Provider value={{state, dispatch}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital@0;1&family=Jost:wght@300;500;700&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Jost', sans-serif; background: ${T.bg}; color: ${T.td}; overflow-x: hidden; }

        /* NAVBAR & DRAWER */
        nav { display: flex; justify-content: space-between; align-items: center; padding: 25px; background: rgba(253, 248, 244, 0.85); backdrop-filter: blur(15px); position: sticky; top: 0; z-index: 1000; border-bottom: 1px solid ${T.border}; }
        .logo { font-family: 'Bebas Neue'; font-size: 38px; letter-spacing: 6px; color: ${T.rose}; cursor: pointer; transition: 0.4s; }
        .logo:hover { letter-spacing: 12px; }
        
        .drawer { position: fixed; top: 0; left: ${state.drawer ? '0' : '-350px'}; width: 320px; height: 100%; background: ${T.card}; z-index: 1100; transition: 0.6s cubic-bezier(0.16, 1, 0.3, 1); padding: 80px 40px; box-shadow: 20px 0 50px rgba(0,0,0,0.1); }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 1050; display: ${state.drawer ? 'block' : 'none'}; backdrop-filter: blur(5px); }

        /* HERO SECTION */
        .promo-strip { background: ${T.roseDark}; color: #fff; text-align: center; padding: 12px; font-size: 10px; letter-spacing: 4px; font-weight: 700; }
        .hero-split { min-height: 85vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; text-align: center; background: linear-gradient(135deg, ${T.nudeMid}, #fff); position: relative; }
        .hero-text h1 { font-family: 'Bebas Neue'; font-size: clamp(80px, 15vw, 160px); color: ${T.roseDark}; line-height: 0.85; margin-bottom: 25px; }
        .hero-graphic { font-size: 200px; filter: drop-shadow(0 30px 60px rgba(183,110,121,0.3)); animation: float 6s ease-in-out infinite; display: none; }
        
        @media (min-width: 1024px) {
            .hero-split { flex-direction: row; text-align: left; padding: 0 120px; gap: 80px; }
            .hero-text { flex: 1.5; }
            .hero-graphic { flex: 1; display: block; }
        }

        /* PREMIUM BUTTONS */
        .luxe-btn { background: ${T.rose}; color: #fff; border: none; padding: 22px 55px; font-family: 'Bebas Neue'; letter-spacing: 3px; cursor: pointer; border-radius: 60px; transition: 0.4s; box-shadow: 0 15px 35px rgba(183,110,121,0.35); }
        .luxe-btn:hover { transform: scale(1.05) translateY(-5px); background: ${T.roseDark}; }
        .luxe-btn-sec { background: transparent; border: 2px solid ${T.rose}; color: ${T.roseDark}; padding: 20px 50px; font-family: 'Bebas Neue'; letter-spacing: 3px; border-radius: 60px; cursor: pointer; transition: 0.4s; }

        /* CAROUSEL */
        .carousel-track { display: flex; overflow-x: auto; gap: 35px; padding: 50px 30px; scrollbar-width: none; }
        .section-title { display: flex; justify-content: space-between; align-items: center; padding: 0 50px; }
        .section-title h2 { font-family: 'Playfair Display'; font-style: italic; font-size: 36px; color: ${T.td}; }

        /* PRODUCT CARDS */
        .p-card { min-width: 280px; background: ${T.card}; border-radius: 35px; overflow: hidden; box-shadow: ${T.shadow}; cursor: pointer; transition: 0.5s; position: relative; }
        .p-card:hover { transform: translateY(-20px); box-shadow: 0 30px 60px rgba(183,110,121,0.2); }
        .p-img { height: 320px; background: ${T.nude}; position: relative; overflow: hidden; }
        .p-img img { width: 100%; height: 100%; object-fit: cover; transition: 0.8s; }
        .p-card:hover .p-img img { transform: scale(1.2); filter: brightness(0.7); }
        .p-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #fff; font-family: 'Bebas Neue'; letter-spacing: 3px; opacity: 0; transition: 0.4s; font-size: 20px; }
        .p-card:hover .p-overlay { opacity: 1; }
        
        .p-txt { padding: 30px; position: relative; }
        .p-name { font-weight: 700; font-size: 18px; color: ${T.td}; }
        .p-price { color: ${T.roseDark}; font-weight: 700; font-size: 24px; margin-top: 10px; }
        .p-add { position: absolute; right: 30px; bottom: 30px; width: 45px; height: 45px; border-radius: 50%; border: none; background: ${T.rose}; color: #fff; font-size: 28px; cursor: pointer; transition: 0.3s; }

        /* LOGIN */
        .login-wrap { min-height: 80vh; display: flex; align-items: center; justify-content: center; background: ${T.bg}; }
        .login-box { background: ${T.card}; padding: 60px; border-radius: 40px; box-shadow: ${T.shadow}; width: 100%; maxWidth: 500px; text-align: center; }
        .login-box h2 { font-family: 'Playfair Display'; font-style: italic; font-size: 32px; margin-bottom: 10px; }
        .login-box input { width: 100%; padding: 18px 25px; margin-bottom: 15px; border-radius: 15px; border: 1.5px solid ${T.nudeDark}; outline: none; font-family: inherit; }

        /* ANIMATIONS */
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
        .fade-in { animation: fadeIn 1s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .p-100 { padding: 150px; text-align: center; font-style: italic; color: ${T.tl}; font-size: 22px; }
      `}</style>

      <div className="overlay" onClick={()=>dispatch({type:'TGL_DRAWER'})}></div>
      <div className="drawer">
        <h2 className="logo" style={{marginBottom: 60}}>FACÉLOOK</h2>
        {['home', 'shop', 'cart', 'login'].map(p => (
          <div key={p} onClick={()=>dispatch({type:'GO', page: p})} style={{padding: '22px 0', borderBottom: `1px solid ${T.border}`, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 4, fontSize: 15, fontWeight: 700, transition: '0.3s'}} onMouseEnter={e => e.target.style.paddingLeft = '15px'} onMouseLeave={e => e.target.style.paddingLeft = '0'}>
            {p}
          </div>
        ))}
        {state.user && <button className="luxe-btn" style={{marginTop:40}} onClick={()=>dispatch({type:'LOGOUT'})}>LOGOUT</button>}
      </div>

      <div style={{maxWidth: 1600, margin: '0 auto'}}>
        <nav>
          <div onClick={()=>dispatch({type:'TGL_DRAWER'})} style={{cursor: 'pointer', fontSize: 32}}>☰</div>
          <div className="logo" onClick={()=>dispatch({type:'GO', page: 'home'})}>FACÉLOOK</div>
          <div style={{fontSize: 32, cursor: 'pointer', position: 'relative'}} onClick={()=>dispatch({type:'GO', page: 'cart'})}>
             👜 {state.cart.length > 0 && <span style={{position:'absolute', top:-5, right:-10, background:T.rose, color:'#fff', fontSize:12, padding:'2px 8px', borderRadius:'50%'}}>{state.cart.length}</span>}
          </div>
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