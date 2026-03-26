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
// SHARED UI COMPONENTS
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
// PRODUCT CARD
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
      <div style={{height:180,background:`linear-gradient(135deg,${T.nude},${T.nudeMid})`,display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
        {p.image ? <img src={p.image} alt={p.name} style={{width:'85%',height:'85%',objectFit:'contain'}} /> : <span style={{fontSize:60}}>💄</span>}
        <span onClick={e=>{e.stopPropagation();d({type:'WISH_TGL',p});d({type:'TOAST',msg:inW?'Removed from wishlist':'Added to wishlist ♥'});}}
          style={{position:'absolute',top:8,right:10,fontSize:18,cursor:'pointer',color:inW?T.rose:T.nudeDark,transition:'color .2s'}}>
          {inW?'♥':'♡'}
        </span>
      </div>
      <div style={{padding:'12px'}}>
        <Stars n={p.rating}/>
        <div style={{fontSize:14,color:T.td,fontWeight:600,margin:'4px 0 2px',lineHeight:1.3}}>{p.name}</div>
        <div style={{fontSize:11,color:T.tl,fontStyle:'italic',marginBottom:10}}>{p.category}</div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{fontSize:16,color:T.roseDark,fontWeight:800}}>₹{p.price}</span>
          <button onClick={e=>{e.stopPropagation();d({type:'CART_ADD',p});d({type:'TOAST',msg:`${p.name} added to cart`});}}
            style={{width:32,height:32,background:T.rose,color:'#fff',border:'none',borderRadius:'50%',fontSize:22,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>+</button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// PAGES
// ═══════════════════════════════════════════
const Navbar = () => {
  const {dispatch:d} = useContext(Ctx);
  return (
    <nav style={{background:T.nudeMid,display:'flex',alignItems:'center',justifyContent:'center',padding:'15px',borderBottom:`1px solid ${T.border}`,position:'sticky',top:0,zIndex:100}}>
      <span onClick={()=>d({type:'GO',page:'home'})} style={{fontFamily:"'Bebas Neue',cursive",fontSize:32,letterSpacing:4,color:T.rose,cursor:'pointer'}}>FACÉLOOK</span>
    </nav>
  );
};

const Home = () => {
  const {state:s, dispatch:d} = useContext(Ctx);
  return (
    <div style={{background:T.bg}}>
      <div style={{minHeight:450,background:`linear-gradient(160deg,${T.nudeMid} 0%,${T.nude} 60%,#fff 100%)`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'60px 20px',textAlign:'center'}}>
        <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:90,lineHeight:.9,color:T.roseDark,letterSpacing:2,marginBottom:10}}>FACÉLOOK</div>
        <p style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:20,color:T.tm,marginBottom:30}}>Beauty that Rules Hearts</p>
        <Btn onClick={()=>d({type:'GO',page:'shop'})}>Shop the Collection</Btn>
      </div>
      <div style={{padding:'20px 0'}}>
         <h2 style={{fontFamily:"'Playfair Display',serif",textAlign:'center',fontStyle:'italic',marginBottom:20,color:T.td}}>Featured Picks</h2>
         <div className="product-grid">
            {s.products.slice(0,4).map(p=><PCard key={p._id} p={p}/>)}
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
    <div style={{minHeight:'100vh',background:T.bg}}>
      <div style={{background:T.nude,padding:'15px',borderBottom:`1px solid ${T.border}`}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search luxury products..."
          style={{width:'100%',background:T.card,border:`1.5px solid ${T.nudeDark}`,borderRadius:50,padding:'12px 20px',outline:'none',fontSize:15}}/>
      </div>
      <div style={{display:'flex',gap:10,padding:'15px',overflowX:'auto',background:T.nude}}>
        {CATS.map(c=>(
          <button key={c} onClick={()=>setCat(c)} style={{background:cat===c?T.rose:T.card,color:cat===c?'#fff':T.td,border:`1px solid ${cat===c?T.rose:T.nudeDark}`,borderRadius:50,padding:'8px 18px',fontSize:13,cursor:'pointer'}}>{c}</button>
        ))}
      </div>
      <div className="product-grid">
        {list.map(p=><PCard key={p._id} p={p}/>)}
      </div>
    </div>
  );
};

const Cart = () => {
  const {state:s,dispatch:d} = useContext(Ctx);
  const total = s.cart.reduce((a,i)=>a+i.price*i.qty,0);
  if(s.cart.length===0) return <div style={{textAlign:'center',padding:150,color:T.tl}}>Your cart is empty 🛍️</div>;
  return (
    <div style={{padding:20, maxWidth:600, margin:'0 auto'}}>
      <h2 style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',marginBottom:20}}>Your Cart</h2>
      {s.cart.map(item=>(
        <div key={item._id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',background:'#fff',padding:15,borderRadius:15,marginBottom:15,boxShadow:T.shadow}}>
          <div>
            <div style={{fontWeight:600}}>{item.name}</div>
            <div style={{fontSize:12,color:T.tl}}>Qty: {item.qty}</div>
          </div>
          <div style={{fontWeight:700,color:T.roseDark}}>₹{item.price * item.qty}</div>
          <button onClick={()=>d({type:'CART_RM',id:item._id})} style={{background:'none',border:'none',cursor:'pointer'}}>🗑️</button>
        </div>
      ))}
      <div style={{textAlign:'right',marginTop:30,borderTop:`1px solid ${T.border}`,paddingTop:20}}>
        <h3 style={{color:T.roseDark}}>Total: ₹{total}</h3>
        <Btn style={{marginTop:20}} full>Proceed to Checkout</Btn>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// ROOT APP (RESPONSIVE)
// ═══════════════════════════════════════════
export default function App() {
  const [state,dispatch] = useReducer(reducer,init);

  useEffect(() => {
    fetch('https://facelook-pro.onrender.com/api/products')
      .then(res => res.json())
      .then(data => dispatch({ type: 'SET_PRODUCTS', payload: data }))
      .catch(err => console.error("API Error:", err));
  }, []);

  const pages = { home:<Home/>, shop:<Shop/>, cart:<Cart/>, wish:<div style={{padding:50,textAlign:'center'}}>Wishlist Coming Soon! ♥</div> };

  return (
    <Ctx.Provider value={{state,dispatch}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Jost:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Jost',sans-serif;background:#FDF8F4;}
        
        /* RESPONSIVE GRID LOGIC */
        .product-grid {
          display: grid;
          gap: 15px;
          padding: 20px;
          grid-template-columns: repeat(2, 1fr); /* 2 cols mobile */
        }
        @media (min-width: 768px) {
          .product-grid { grid-template-columns: repeat(3, 1fr); gap: 25px; } /* 3 cols tablet */
        }
        @media (min-width: 1024px) {
          .product-grid { grid-template-columns: repeat(4, 1fr); gap: 30px; } /* 4 cols desktop */
        }
      `}</style>
      
      <div style={{ maxWidth: 1200, margin: '0 auto', background: '#FDF8F4', minHeight: '100vh', position: 'relative' }}>
        <Navbar/>
        
        {state.loading ? (
            <div style={{textAlign:'center', padding:150, color:T.rose, fontSize:18}}>Preparing your beauty experience... 💄</div>
        ) : (
            <div style={{ paddingBottom: '100px' }}>
              {pages[state.page] || <Home/>}
            </div>
        )}

        {/* BOTTOM NAV (Centered & Fixed) */}
        <div style={{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:1200,background:T.nudeMid,borderTop:`1px solid ${T.border}`,display:'flex',zIndex:80,boxShadow:'0 -5px 20px rgba(0,0,0,0.05)'}}>
          {[ ['🏠','Home','home'], ['🛍️','Shop','shop'], ['♡','Wish','wish'], ['🛒','Cart','cart'] ].map(([ic,lb,pg])=>(
            <button key={pg} onClick={()=>dispatch({type:'GO',page:pg})} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4,padding:'12px 0',background:'none',border:'none',cursor:'pointer',color:state.page===pg?T.rose:T.tl}}>
              <span style={{fontSize:22}}>{ic}</span>
              <span style={{fontSize:10,fontWeight:state.page===pg?700:400}}>{lb}</span>
            </button>
          ))}
        </div>

        {state.toast&&<Toast msg={state.toast}/>}
      </div>
    </Ctx.Provider>
  );
}