import { useState, useContext, createContext, useReducer, useEffect } from "react";

// ═══════════════════════════════════════════
// THEME — Nude + Rose Gold
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
// CONTEXT + REDUCER
// ═══════════════════════════════════════════
const Ctx = createContext();
const init = { 
  page: 'home', 
  data: null, 
  cart: [], 
  wish: [], 
  user: null, 
  toast: null,
  products: [], // Storage for API data
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
    case 'LOGIN':  return { ...s, user:a.user };
    case 'LOGOUT': return { ...s, user:null };
    case 'TOAST':  return { ...s, toast:a.msg };
    case 'TOAST_CLR': return { ...s, toast:null };
    default: return s;
  }
}

// ═══════════════════════════════════════════
// SHARED UI
// ═══════════════════════════════════════════
const Stars = ({ n }) => <span style={{color:T.rose,fontSize:11}}>{'★'.repeat(Math.floor(n || 5))}{'☆'.repeat(5-Math.floor(n || 5))}</span>;

const Btn = ({ children, onClick, v='primary', full, style={}, disabled }) => {
  const base = { border:'none', borderRadius:50, cursor:disabled?'not-allowed':'pointer', fontFamily:"'Bebas Neue',cursive", letterSpacing:2, fontSize:15, padding:'12px 26px', transition:'all .2s', opacity:disabled?.6:1, width:full?'100%':undefined, ...style };
  const vs = {
    primary:   { background:T.rose, color:'#fff', boxShadow:`0 4px 18px rgba(183,110,121,.35)` },
    secondary: { background:'transparent', color:T.roseDark, border:`1.5px solid ${T.rose}` },
    ghost:     { background:T.nude, color:T.roseDark, border:`1px solid ${T.nudeDark}` },
  };
  return <button style={{...base,...vs[v]}} onClick={onClick} disabled={disabled}>{children}</button>;
};

const Tag = ({ children, bg=T.rose }) => (
  <span style={{background:bg,color:'#fff',fontSize:8,fontWeight:700,padding:'3px 8px',borderRadius:20,letterSpacing:1,textTransform:'uppercase'}}>{children}</span>
);

const Toast = ({ msg }) => {
  const {dispatch} = useContext(Ctx);
  useEffect(()=>{ const t=setTimeout(()=>dispatch({type:'TOAST_CLR'}),2400); return()=>clearTimeout(t); },[msg]);
  return (
    <div style={{position:'fixed',bottom:76,left:'50%',transform:'translateX(-50%)',background:T.roseDark,color:'#fff',padding:'11px 22px',borderRadius:50,fontSize:13,fontWeight:600,zIndex:9999,boxShadow:'0 4px 20px rgba(0,0,0,.18)',whiteSpace:'nowrap'}}>
      ✓ {msg}
    </div>
  );
};

// ═══════════════════════════════════════════
// PRODUCT CARD (Updated for API Images)
// ═══════════════════════════════════════════
const PCard = ({ p }) => {
  const {state:s,dispatch:d} = useContext(Ctx);
  const inW = s.wish.find(i=>i._id===p._id);
  const [hov,setHov] = useState(false);

  return (
    <div onClick={()=>d({type:'GO',page:'product',data:p})}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:18,overflow:'hidden',cursor:'pointer',
        boxShadow:hov?T.shadowHov:T.shadow,transition:'all .25s',transform:hov?'translateY(-4px)':'none'}}>
      <div style={{height:138,background:`linear-gradient(135deg,${T.nude},${T.nudeMid})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:54,position:'relative'}}>
        {p.image ? <img src={p.image} alt={p.name} style={{width:'80%',height:'80%',objectFit:'contain'}} /> : p.emoji || '💄'}
        {p.tag&&<span style={{position:'absolute',top:8,left:8}}><Tag>{p.tag}</Tag></span>}
        <span onClick={e=>{e.stopPropagation();d({type:'WISH_TGL',p});d({type:'TOAST',msg:inW?'Removed from wishlist':'Added to wishlist ♥'});}}
          style={{position:'absolute',top:8,right:10,fontSize:18,cursor:'pointer',color:inW?T.rose:T.nudeDark,transition:'color .2s'}}>
          {inW?'♥':'♡'}
        </span>
      </div>
      <div style={{padding:'10px 12px 13px'}}>
        <Stars n={p.rating}/>
        <div style={{fontSize:13,color:T.td,fontWeight:600,margin:'3px 0 2px',lineHeight:1.3}}>{p.name}</div>
        <div style={{fontSize:10,color:T.tl,fontStyle:'italic',marginBottom:8}}>{p.shade || p.category}</div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <span style={{fontSize:15,color:T.roseDark,fontWeight:800}}>₹{p.price}</span>
          </div>
          <button onClick={e=>{e.stopPropagation();d({type:'CART_ADD',p});d({type:'TOAST',msg:`${p.name} added to cart`});}}
            style={{width:28,height:28,background:T.rose,color:'#fff',border:'none',borderRadius:'50%',fontSize:19,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'background .2s'}}
            onMouseEnter={e=>e.currentTarget.style.background=T.roseDark}
            onMouseLeave={e=>e.currentTarget.style.background=T.rose}>+</button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════
const Navbar = () => {
  const {state:s,dispatch:d} = useContext(Ctx);
  const [menu,setMenu] = useState(false);
  const cartN = s.cart.reduce((a,i)=>a+i.qty,0);
  const go = (page)=>{ d({type:'GO',page}); setMenu(false); };

  return (
    <>
      <div style={{background:`linear-gradient(90deg,${T.rose},${T.roseMuted},${T.roseLight},${T.rose})`,backgroundSize:'300% 100%',color:'#fff',textAlign:'center',padding:'8px',fontSize:10,letterSpacing:2.5,fontWeight:700,textTransform:'uppercase'}}>
        ✦ FACÉLOOK Live — Free Shipping on ₹599+ ✦
      </div>
      <nav style={{background:T.nudeMid,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'13px 18px',borderBottom:`1px solid ${T.border}`,position:'sticky',top:0,zIndex:100,boxShadow:T.shadow}}>
        <button onClick={()=>setMenu(true)} style={{background:'none',border:'none',cursor:'pointer',fontSize:20,color:T.tm}}>☰</button>
        <span onClick={()=>go('home')} style={{fontFamily:"'Bebas Neue',cursive",fontSize:26,letterSpacing:3,color:T.rose,cursor:'pointer'}}>FACÉLOOK</span>
        <div style={{display:'flex',gap:14,alignItems:'center'}}>
          <button onClick={()=>go('wish')} style={{background:'none',border:'none',cursor:'pointer',fontSize:19,color:T.tm,position:'relative'}}>
            ♡{s.wish.length>0&&<span style={{position:'absolute',top:-5,right:-5,background:T.rose,color:'#fff',fontSize:8,width:14,height:14,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>{s.wish.length}</span>}
          </button>
          <button onClick={()=>go('cart')} style={{background:'none',border:'none',cursor:'pointer',fontSize:19,color:T.tm,position:'relative'}}>
            🛒{cartN>0&&<span style={{position:'absolute',top:-5,right:-5,background:T.rose,color:'#fff',fontSize:8,width:14,height:14,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>{cartN}</span>}
          </button>
        </div>
      </nav>

      {menu&&(
        <div onClick={()=>setMenu(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.35)',zIndex:200}}>
          <div onClick={e=>e.stopPropagation()} style={{position:'absolute',top:0,left:0,bottom:0,width:270,background:T.bg,padding:24,overflowY:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:28}}>
              <span style={{fontFamily:"'Bebas Neue',cursive",fontSize:22,color:T.rose}}>FACÉLOOK</span>
              <button onClick={()=>setMenu(false)} style={{background:'none',border:'none',cursor:'pointer',fontSize:20,color:T.tm}}>✕</button>
            </div>
            {[['🏠','Home','home'],['🛍️','Shop All','shop'],['♡','Wishlist','wish'],['🛒','Cart','cart']].map(([ic,lb,pg])=>(
              <div key={pg} onClick={()=>go(pg)} style={{padding:'13px 0',borderBottom:`1px solid ${T.border}`,cursor:'pointer',color:T.td,fontSize:14,fontWeight:500,display:'flex',alignItems:'center',gap:10}}>
                <span>{ic}</span>{lb}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

// ═══════════════════════════════════════════
// HOME
// ═══════════════════════════════════════════
const Home = () => {
  const {state:s, dispatch:d} = useContext(Ctx);
  return (
    <div style={{background:T.bg}}>
      {/* Hero */}
      <div style={{minHeight:400,position:'relative',overflow:'hidden',background:`linear-gradient(160deg,${T.nudeMid} 0%,${T.nude} 60%,#fff 100%)`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'52px 28px 44px',textAlign:'center'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(183,110,121,.1)',border:'1px solid rgba(183,110,121,.25)',borderRadius:30,padding:'5px 14px',fontSize:10,letterSpacing:2.5,color:T.rose,textTransform:'uppercase',fontWeight:600,marginBottom:16}}>✦ Official Store</div>
        <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:86,lineHeight:.88,color:T.roseDark,letterSpacing:2,marginBottom:2}}>FACÉLOOK</div>
        <p style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:18,color:T.tm,margin:'14px 0 28px'}}>Beauty that Rules Hearts</p>
        <Btn onClick={()=>d({type:'GO',page:'shop'})}>Explore Products</Btn>
      </div>

      {/* Featured from API */}
      <Section title="Our Collection" link="Shop All" onLink={()=>d({type:'GO',page:'shop'})}>
        <div style={{display:'flex',gap:12,padding:'4px 16px 20px',overflowX:'auto'}}>
          {s.products.slice(0,6).map(p=><div key={p._id} style={{width:148,flexShrink:0}}><PCard p={p}/></div>)}
        </div>
      </Section>
    </div>
  );
};

const Section = ({title,link,onLink,children})=>(
  <div>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 18px 12px'}}>
      <span style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:T.td,fontStyle:'italic'}}>{title}</span>
      {link&&<span onClick={onLink} style={{fontSize:11,letterSpacing:1.5,textTransform:'uppercase',color:T.rose,cursor:'pointer',fontWeight:600,borderBottom:`1px solid ${T.roseLight}`}}>{link} →</span>}
    </div>
    {children}
  </div>
);

// ═══════════════════════════════════════════
// SHOP
// ═══════════════════════════════════════════
const Shop = () => {
  const {state:s} = useContext(Ctx);
  const [search,setSearch] = useState('');
  const [cat,setCat] = useState('All');

  const list = s.products
    .filter(p=>cat==='All'||p.category===cat)
    .filter(p=>p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{background:T.bg,minHeight:'100vh',paddingBottom:80}}>
      <div style={{background:T.nude,padding:'12px 16px',borderBottom:`1px solid ${T.border}`}}>
        <div style={{background:T.card,border:`1.5px solid ${T.nudeDark}`,borderRadius:50,display:'flex',alignItems:'center',gap:10,padding:'10px 18px'}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products…"
            style={{background:'none',border:'none',outline:'none',color:T.td,fontFamily:'inherit',fontSize:14,width:'100%'}}/>
        </div>
      </div>

      <div style={{display:'flex',gap:8,padding:'12px 16px',overflowX:'auto',background:T.nude}}>
        {CATS.map(c=>(
          <button key={c} onClick={()=>setCat(c)} style={{background:cat===c?T.rose:T.card,color:cat===c?'#fff':T.td,border:`1px solid ${cat===c?T.rose:T.nudeDark}`,borderRadius:50,padding:'7px 16px',fontSize:12}}>{c}</button>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,padding:'20px 16px'}}>{list.map(p=><PCard key={p._id} p={p}/>)}</div>
    </div>
  );
};

// ═══════════════════════════════════════════
// CART & OTHERS (Simplified for Live Testing)
// ═══════════════════════════════════════════
const Cart = () => {
  const {state:s,dispatch:d} = useContext(Ctx);
  const sub = s.cart.reduce((a,i)=>a+i.price*i.qty,0);
  if(s.cart.length===0) return <div style={{textAlign:'center',padding:100}}>Cart is empty</div>;
  return (
    <div style={{padding:20}}>
      {s.cart.map(item=>(
        <div key={item._id} style={{display:'flex',justifyContent:'space-between',marginBottom:10,background:'#fff',padding:10,borderRadius:10}}>
          <span>{item.name} (x{item.qty})</span>
          <span>₹{item.price * item.qty}</span>
        </div>
      ))}
      <h3 style={{textAlign:'right'}}>Total: ₹{sub}</h3>
    </div>
  );
};

// ═══════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════
export default function App() {
  const [state,dispatch] = useReducer(reducer,init);

  useEffect(() => {
    fetch('https://facelook-pro.onrender.com/api/products')
      .then(res => res.json())
      .then(data => dispatch({ type: 'SET_PRODUCTS', payload: data }))
      .catch(err => console.error("API Error:", err));
  }, []);

  const pages = { home:<Home/>, shop:<Shop/>, cart:<Cart/>, wish:<Wishlist/> };

  return (
    <Ctx.Provider value={{state,dispatch}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Jost:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Jost',sans-serif;background:#FDF8F4;}
      `}</style>
      <div style={{maxWidth:480,margin:'0 auto',background:'#FDF8F4',minHeight:'100vh'}}>
        <Navbar/>
        {state.loading ? (
            <div style={{textAlign:'center',padding:100,color:T.rose}}>Waking up the server... 💄</div>
        ) : (
            pages[state.page] || <Home/>
        )}
        <BottomNav/>
        {state.toast&&<Toast msg={state.toast}/>}
      </div>
    </Ctx.Provider>
  );
}

// ═══════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════
const Wishlist = () => {
    const {state:s} = useContext(Ctx);
    return <div style={{padding:20}}>{s.wish.length === 0 ? "No favorites yet ♥" : "Your Favorites"}</div>
};

const BottomNav = () => {
  const {state:s,dispatch:d} = useContext(Ctx);
  const cartN = s.cart.reduce((a,i)=>a+i.qty,0);
  const tabs = [['🏠','Home','home'],['🛍️','Shop','shop'],['♡','Wishlist','wish'],['🛒','Cart','cart']];
  return (
    <div style={{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:480,background:T.nudeMid,borderTop:`1px solid ${T.border}`,display:'flex',zIndex:80}}>
      {tabs.map(([ic,lb,pg])=>(
        <button key={pg} onClick={()=>d({type:'GO',page:pg})} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3,padding:'10px 0',background:'none',border:'none',cursor:'pointer',color:s.page===pg?T.rose:T.tl}}>
          <span style={{fontSize:20}}>{ic}</span>
          <span style={{fontSize:9}}>{lb}</span>
        </button>
      ))}
    </div>
  );
};