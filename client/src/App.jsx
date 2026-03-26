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
  roseLight: '#D4A5A5',
  roseDark:  '#8B4A52',
  roseMuted: '#C8909A',
  palePink:  '#FFF0F2',
  td:        '#3A2020',
  tm:        '#7A5050',
  tl:        '#B09090',
  border:    'rgba(183,110,121,0.18)',
  shadow:    '0 2px 14px rgba(183,110,121,0.11)',
  shadowHov: '0 8px 30px rgba(183,110,121,0.22)',
};

const CATS = ['All','Lips','Eyes','Face','Nails'];

// ═══════════════════════════════════════════
// CONTEXT + STATE MANAGEMENT
// ═══════════════════════════════════════════
const Ctx = createContext();
const init = { 
  page: 'home', 
  data: null, 
  cart: [], 
  wish: [], 
  toast: null,
  products: [], 
  loading: true 
};

function reducer(s, a) {
  switch(a.type) {
    case 'SET_PRODUCTS': return { ...s, products: a.payload, loading: false };
    case 'GO':    return { ...s, page:a.page, data:a.data||null };
    case 'CART_ADD': {
      const ex = s.cart.find(i=>i._id===a.p._id);
      return { ...s, cart: ex ? s.cart.map(i=>i._id===a.p._id?{...i,qty:i.qty+1}:i) : [...s.cart,{...a.p,qty:1}] };
    }
    case 'CART_RM':  return { ...s, cart: s.cart.filter(i=>i._id!==a.id) };
    case 'CART_QTY': return { ...s, cart: s.cart.map(i=>i._id===a.id?{...i,qty:Math.max(1,a.qty)}:i) };
    case 'CART_CLR': return { ...s, cart:[] };
    case 'WISH_TGL': {
      const has = s.wish.find(i=>i._id===a.p._id);
      return { ...s, wish: has ? s.wish.filter(i=>i._id!==a.p._id) : [...s.wish,a.p] };
    }
    case 'TOAST':  return { ...s, toast:a.msg };
    case 'TOAST_CLR': return { ...s, toast:null };
    default: return s;
  }
}

// ═══════════════════════════════════════════
// REUSABLE UI COMPONENTS
// ═══════════════════════════════════════════
const Stars = ({ n }) => <span style={{color:T.rose,fontSize:11}}>{'★'.repeat(Math.floor(n || 5))}{'☆'.repeat(5-Math.floor(n || 5))}</span>;

const Btn = ({ children, onClick, v='primary', full, style={}, disabled }) => {
  const base = { border:'none', borderRadius:50, cursor:disabled?'not-allowed':'pointer', fontFamily:"'Bebas Neue',cursive", letterSpacing:2, fontSize:15, padding:'14px 30px', transition:'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', opacity:disabled?.6:1, width:full?'100%':undefined, ...style };
  const vs = {
    primary:   { background:T.rose, color:'#fff', boxShadow:`0 4px 18px rgba(183,110,121,.35)` },
    secondary: { background:'transparent', color:T.roseDark, border:`1.5px solid ${T.rose}` },
    ghost:     { background:T.nude, color:T.roseDark, border:`1px solid ${T.nudeDark}` },
  };
  return <button className="btn-scale" style={{...base,...vs[v]}} onClick={onClick} disabled={disabled}>{children}</button>;
};

const Toast = ({ msg }) => {
  const {dispatch} = useContext(Ctx);
  useEffect(()=>{ const t=setTimeout(()=>dispatch({type:'TOAST_CLR'}),2400); return()=>clearTimeout(t); },[msg]);
  return (
    <div className="toast-anim" style={{position:'fixed',bottom:100,left:'50%',transform:'translateX(-50%)',background:T.roseDark,color:'#fff',padding:'12px 28px',borderRadius:50,fontSize:13,fontWeight:600,zIndex:9999,boxShadow:'0 10px 40px rgba(0,0,0,0.2)'}}>
      ✓ {msg}
    </div>
  );
};

// ═══════════════════════════════════════════
// PRODUCT CARD
// ═══════════════════════════════════════════
const PCard = ({ p }) => {
  const {state:s,dispatch:d} = useContext(Ctx);
  const inW = s.wish.find(i=>i._id===p._id);
  const [hov,setHov] = useState(false);

  return (
    <div onClick={()=>d({type:'GO',page:'product',data:p})}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:24,overflow:'hidden',cursor:'pointer',
        boxShadow:hov?T.shadowHov:T.shadow,transition:'all .4s ease',transform:hov?'translateY(-10px)':'none'}}>
      <div style={{height:240,background:`linear-gradient(135deg,${T.nude},${T.nudeMid})`,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>
        {p.image ? <img src={p.image} alt={p.name} style={{width:'85%',height:'85%',objectFit:'contain', transition:'transform 0.6s ease', transform: hov ? 'scale(1.1)' : 'scale(1)'}} /> : <span style={{fontSize:70}}>💄</span>}
        <span onClick={e=>{e.stopPropagation();d({type:'WISH_TGL',p});d({type:'TOAST',msg:inW?'Removed from wishlist':'Saved to wishlist ♥'});}}
          style={{position:'absolute',top:15,right:15,fontSize:24,cursor:'pointer',color:inW?T.rose:T.nudeDark,transition:'0.3s'}}>
          {inW?'♥':'♡'}
        </span>
      </div>
      <div style={{padding:'18px'}}>
        <Stars n={p.rating}/>
        <div style={{fontSize:16,color:T.td,fontWeight:700,margin:'6px 0 2px',lineHeight:1.3}}>{p.name}</div>
        <div style={{fontSize:11,color:T.tl,fontStyle:'italic',marginBottom:14}}>{p.category} • {p.shade || 'Essential'}</div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{fontSize:20,color:T.roseDark,fontWeight:800}}>₹{p.price}</span>
          <button onClick={e=>{e.stopPropagation();d({type:'CART_ADD',p});d({type:'TOAST',msg:`${p.name} added to cart`});}}
            className="cart-btn-plus">+</button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// MAIN LAYOUTS
// ═══════════════════════════════════════════
const Navbar = () => {
  const {dispatch:d} = useContext(Ctx);
  return (
    <nav style={{background:'rgba(253, 248, 244, 0.85)', backdropFilter:'blur(12px)', display:'flex',alignItems:'center',justifyContent:'center',padding:'24px',borderBottom:`1px solid ${T.border}`,position:'sticky',top:0,zIndex:100}}>
      <span onClick={()=>d({type:'GO',page:'home'})} className="logo-text">FACÉLOOK</span>
    </nav>
  );
};

const Home = () => {
  const {state:s, dispatch:d} = useContext(Ctx);
  return (
    <div style={{background:T.bg}}>
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-tag">✦ LÉ LUXE COLLECTION 2026</div>
          <h1 className="hero-title">QUEEN OF MATTES</h1>
          <p className="hero-subtitle">High-performance pigments meets soulful luxury. Experience beauty that rules hearts.</p>
          <div style={{display:'flex', gap:15, justifyContent:'inherit'}}>
            <Btn onClick={()=>d({type:'GO',page:'shop'})}>Shop All</Btn>
            <Btn v="secondary" onClick={()=>d({type:'GO',page:'shop'})}>New Arrivals</Btn>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-blur"></div>
          <span className="hero-emoji">💄</span>
        </div>
      </div>

      <div style={{padding:'80px 20px'}}>
         <h2 style={{fontFamily:"'Playfair Display',serif",textAlign:'center',fontSize:38, fontStyle:'italic',marginBottom:50,color:T.td}}>Featured Collection</h2>
         <div className="product-grid">
            {s.products.slice(0,8).map(p=><PCard key={p._id} p={p}/>)}
         </div>
      </div>
    </div>
  );
};

const Shop = () => {
  const {state:s} = useContext(Ctx);
  const [search,setSearch] = useState('');
  const [cat,setCat] = useState('All');

  const list = s.products
    .filter(p=>cat==='All'||p.category===cat)
    .filter(p=>p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="shop-layout">
      <aside className="sidebar-desktop">
        <h3 style={{fontFamily:"'Playfair Display',serif", fontStyle:'italic', marginBottom:30, fontSize:28}}>Boutique</h3>
        <div style={{marginBottom:40}}>
            <p className="side-label">Filter by Category</p>
            {CATS.map(c=>(
              <div key={c} onClick={()=>setCat(c)} style={{background:cat===c?T.rose:'transparent', color:cat===c?'#fff':T.tm}} className="side-item">
                {c}
              </div>
            ))}
        </div>
      </aside>

      <main className="shop-main">
        <div className="search-wrap">
          <span style={{marginRight:18, fontSize:20}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search for lipsticks, palettes, serums..."
            style={{width:'100%',background:'none',border:'none',outline:'none',fontSize:18, color:T.td}}/>
        </div>
        
        <div className="mobile-scroller">
            {CATS.map(c=>(
                <button key={c} onClick={()=>setCat(c)} style={{background:cat===c?T.rose:T.card,color:cat===c?'#fff':T.td,border:`1px solid ${cat===c?T.rose:T.nudeDark}`}} className="mob-cat-btn">{c}</button>
            ))}
        </div>

        <div className="product-grid">
          {list.length > 0 ? list.map(p=><PCard key={p._id} p={p}/>) : <div style={{padding:100, textAlign:'center', color:T.tl}}>No products found...</div>}
        </div>
      </main>
    </div>
  );
};

// ═══════════════════════════════════════════
// ROOT APP COMPONENT
// ═══════════════════════════════════════════
export default function App() {
  const [state,dispatch] = useReducer(reducer,init);

  useEffect(() => {
    fetch('https://facelook-pro.onrender.com/api/products')
      .then(res => res.json())
      .then(data => dispatch({ type: 'SET_PRODUCTS', payload: data }))
      .catch(err => console.error("Database connection error:", err));
  }, []);

  const pages = { 
    home: <Home/>, 
    shop: <Shop/>, 
    cart: <div style={{padding:100,textAlign:'center'}}>Shopping Bag Coming Soon! 🛍️</div>, 
    wish: <div style={{padding:100,textAlign:'center'}}>Your Favorites List Coming Soon! ♥</div> 
  };

  return (
    <Ctx.Provider value={{state,dispatch}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Jost:wght@300;400;500;600&display=swap');
        
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Jost',sans-serif;background:#FDF8F4; color:#3A2020; scroll-behavior: smooth;}

        /* ANIMATIONS */
        @keyframes fadeInUp { from { opacity: 0; transform: translate(-50%, 40px); } to { opacity: 1; transform: translate(-50%, 0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }

        /* RESPONSIVE GRID */
        .product-grid { display: grid; gap: 20px; grid-template-columns: repeat(2, 1fr); }
        @media (min-width: 768px) { .product-grid { grid-template-columns: repeat(3, 1fr); gap: 30px; } }
        @media (min-width: 1200px) { .product-grid { grid-template-columns: repeat(4, 1fr); gap: 40px; } }

        /* HERO LAYOUT */
        .hero-section { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 85vh; padding: 40px; text-align: center; overflow: hidden; }
        .hero-title { font-family:"'Bebas Neue',cursive"; font-size: 80px; line-height: 0.9; color: #8B4A52; margin-bottom: 20px; }
        .hero-tag { display: inline-block; background: rgba(183,110,121,0.1); padding: 8px 20px; borderRadius: 30px; color: #B76E79; fontSize: 11px; letterSpacing: 3px; fontWeight: 700; marginBottom: 25px; }
        .hero-emoji { font-size: 150px; filter: drop-shadow(0 30px 50px rgba(183,110,121,0.4)); animation: float 5s ease-in-out infinite; }

        @media (min-width: 1024px) {
            .hero-section { flex-direction: row; text-align: left; padding: 0 100px; gap: 50px; }
            .hero-content { flex: 1.2; }
            .hero-visual { flex: 1; display: flex; justify-content: center; position: relative; }
            .hero-title { font-size: 140px; }
            .visual-blur { position: absolute; width: 500px; height: 500px; background: #D4A5A5; opacity: 0.15; filter: blur(100px); border-radius: 50%; z-index: -1; }
        }

        /* SHOP LAYOUT */
        .shop-layout { display: flex; padding: 40px; gap: 60px; max-width: 1440px; margin: 0 auto; animation: fadeIn 1s ease; }
        .sidebar-desktop { width: 280px; display: none; }
        .shop-main { flex: 1; }
        .side-label { font-size: 11px; letter-spacing: 2px; color: #B09090; text-transform: uppercase; font-weight: 800; margin-bottom: 20px; }
        .side-item { padding: 14px 20px; border-radius: 16px; cursor: pointer; margin-bottom: 8px; font-weight: 600; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .side-item:hover { transform: translateX(10px); background: rgba(183,110,121,0.08); color: #B76E79; }
        
        @media (min-width: 1024px) { .sidebar-desktop { display: block; } }

        /* UI ELEMENTS */
        .search-wrap { background: #fff; padding: 18px 30px; border-radius: 60px; margin-bottom: 40px; box-shadow: 0 4px 20px rgba(183,110,121,0.08); display: flex; align-items: center; border: 1px solid rgba(183,110,121,0.1); }
        .logo-text { font-family: 'Bebas Neue', cursive; font-size: 42px; letter-spacing: 6px; color: #B76E79; cursor: pointer; transition: 0.4s; }
        .logo-text:hover { letter-spacing: 12px; color: #8B4A52; }
        .btn-scale:hover { transform: scale(1.06) translateY(-2px); filter: brightness(1.05); }
        .cart-btn-plus { width:40px; height:40px; background:#B76E79; color:#fff; border:none; borderRadius:50%; fontSize:28px; cursor:pointer; display:flex; alignItems:center; justifyContent:center; transition:0.3s; }
        .cart-btn-plus:hover { transform: rotate(90deg) scale(1.1); background: #8B4A52; }
        .mobile-scroller { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 25px; margin-bottom: 10px; }
        @media (min-width: 1024px) { .mobile-scroller { display: none; } }
        .mob-cat-btn { padding: 10px 22px; border-radius: 40px; font-weight: 600; font-size: 13px; white-space: nowrap; cursor: pointer; transition: 0.3s; }
        .toast-anim { animation: fadeInUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}</style>
      
      <div style={{ maxWidth: 1440, margin: '0 auto', background: '#FDF8F4', minHeight: '100vh' }}>
        <Navbar/>
        
        {state.loading ? (
            <div style={{textAlign:'center', padding:200, color:T.rose}}>
                <div style={{fontSize:80, animation:'float 3s infinite'}}>✨</div>
                <p style={{marginTop:30, fontWeight:700, letterSpacing:4, fontSize:14, textTransform:'uppercase'}}>Curating Your Luxury Experience...</p>
            </div>
        ) : (
            <div style={{ paddingBottom: '120px' }}>
              {pages[state.page] || <Home/>}
            </div>
        )}

        {/* FLOATING BOTTOM BAR */}
        <div style={{position:'fixed',bottom:20,left:'50%',transform:'translateX(-50%)',width:'90%',maxWidth:600,background:'rgba(255, 255, 255, 0.9)', backdropFilter:'blur(15px)', borderRadius: '40px', border:`1px solid ${T.border}`,display:'flex',zIndex:80,boxShadow:'0 15px 40px rgba(0,0,0,0.1)'}}>
          {[ ['🏠','Home','home'], ['🛍️','Shop','shop'], ['♡','Wish','wish'], ['🛒','Bag','cart'] ].map(([ic,lb,pg])=>(
            <button key={pg} onClick={()=>dispatch({type:'GO',page:pg})} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4,padding:'18px 0',background:'none',border:'none',cursor:'pointer',color:state.page===pg?T.rose:T.tl, transition:'0.3s'}}>
              <span style={{fontSize:state.page===pg?28:24, transition:'0.3s'}}>{ic}</span>
              <span style={{fontSize:9,fontWeight:state.page===pg?900:500, textTransform:'uppercase', letterSpacing:1.5}}>{lb}</span>
              {pg === 'cart' && state.cart.length > 0 && <span style={{position:'absolute', top:12, right:'30%', background:T.rose, color:'#fff', fontSize:10, minWidth:18, height:18, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900}}>{state.cart.length}</span>}
            </button>
          ))}
        </div>

        {state.toast&&<Toast msg={state.toast}/>}
      </div>
    </Ctx.Provider>
  );
}