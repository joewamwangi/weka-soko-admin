import React,{useState,useEffect,useCallback,useRef} from "react";

const API = (process.env.REACT_APP_API_URL || "https://weka-soko-backend.onrender.com").replace(/\/$/, "");

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#FFFFFF;--surf:#FFFFFF;--sh:#F7F7FA;--border:#E8E8EC;
  --a:#1428A0;--a2:#0F1F8A;--gold:#C49A00;--red:#C03030;--blue:#1428A0;
  --txt:#111111;--mut:#6B6B7B;--dim:#AEAEB2;
  --r:16px;--rs:10px;--fn:'Plus Jakarta Sans',system-ui,-apple-system,sans-serif;
  --shadow-contact:0 1px 2px rgba(0,0,0,0.08);
  --shadow-float:0 8px 24px rgba(20,40,160,0.06);
  --shadow-hover:0 16px 40px rgba(20,40,160,0.12);
}
body{background:#F4F6FB;color:var(--txt);font-family:var(--fn);font-size:14px;line-height:1.6;min-height:100vh;-webkit-font-smoothing:antialiased;}
::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-thumb{background:#CCCCCC;border-radius:4px;}

/* ── BUTTONS ── */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 20px;border-radius:var(--rs);font-size:13px;font-weight:700;cursor:pointer;border:none;transition:all .2s cubic-bezier(.4,0,.2,1);white-space:nowrap;font-family:var(--fn);letter-spacing:-.01em;}
.btn:disabled{opacity:.45;cursor:not-allowed;}
.btn:hover:not(:disabled){transform:translateY(-1px);}
.btn:active:not(:disabled){transform:scale(.97) translateY(1px);}
.bp{background:#1428A0;color:#fff;border:2px solid #1428A0;}.bp:hover:not(:disabled){background:#0F1F8A;border-color:#0F1F8A;box-shadow:0 4px 16px rgba(20,40,160,.32);}
.bs{background:transparent;color:var(--txt);border:1.5px solid var(--txt);}.bs:hover:not(:disabled){background:var(--txt);color:#fff;box-shadow:0 4px 12px rgba(0,0,0,.18);}
.br{background:transparent;color:var(--red);border:1px solid var(--red);}.br:hover:not(:disabled){background:var(--red);color:#fff;box-shadow:0 4px 12px rgba(192,48,48,.28);}
.by{background:transparent;color:var(--gold);border:1px solid var(--gold);}.by:hover:not(:disabled){background:var(--gold);color:#fff;}
.bb{background:rgba(20,40,160,.08);color:#1428A0;border:1px solid rgba(20,40,160,.2);}.bb:hover:not(:disabled){background:rgba(20,40,160,.15);}
.bgh{background:transparent;border:none;color:var(--mut);padding:8px 12px;font-size:13px;}.bgh:hover{color:var(--txt);background:rgba(0,0,0,.05);}
.sm{padding:6px 14px;font-size:12px;}

/* ── INPUTS ── */
.inp{width:100%;padding:11px 14px;background:#fff;border:1.5px solid #D9D9D9;border-radius:8px;color:var(--txt);font-family:var(--fn);font-size:13px;outline:none;transition:border-color .15s,box-shadow .15s;}
.inp:focus{border-color:#1428A0;box-shadow:0 0 0 4px rgba(20,40,160,.10);}
.inp::placeholder{color:#AEAEB2;}
select.inp{appearance:none;cursor:pointer;}
textarea.inp{resize:vertical;min-height:80px;}

/* ── LABELS ── */
.lbl{display:block;font-size:11px;font-weight:700;color:#6B6B7B;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}

/* ── CARDS & SURFACES ── */
.card{background:#fff;border:1px solid var(--border);border-radius:var(--r);padding:20px 22px;box-shadow:var(--shadow-contact);}
.badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:700;letter-spacing:.02em;}
.bg{background:rgba(20,40,160,.08);color:#1428A0;}
.bg2{background:rgba(22,163,74,.1);color:#15803d;}
.by2{background:rgba(196,154,0,.12);color:#8B6400;}
.br2{background:rgba(192,48,48,.1);color:var(--red);}
.bb2{background:rgba(91,155,213,.1);color:#1d6fa4;}
.bm{background:var(--sh);color:var(--mut);}
.spin{display:inline-block;width:16px;height:16px;border:2px solid #E5E5E5;border-top-color:#1428A0;border-radius:50%;animation:sp .7s linear infinite;}
@keyframes sp{to{transform:rotate(360deg)}}

/* ── SIDEBAR ── */
.sidebar{position:fixed;left:0;top:0;bottom:0;width:232px;background:#fff;border-right:1px solid var(--border);display:flex;flex-direction:column;z-index:50;box-shadow:var(--shadow-float);}
.sidebar-logo{padding:22px 20px 18px;border-bottom:1px solid var(--border);font-family:var(--fn);font-size:19px;font-weight:800;letter-spacing:-.03em;color:#111;}
.sidebar-logo span{color:#1428A0;}
.nav-item{display:flex;align-items:center;gap:10px;padding:10px 16px;margin:1px 8px;cursor:pointer;font-size:12.5px;font-weight:600;letter-spacing:-.01em;color:var(--mut);transition:all .15s;border-radius:8px;border-left:none;}
.nav-item:hover{color:#111;background:var(--sh);}
.nav-item.on{color:#1428A0;background:rgba(20,40,160,.07);font-weight:700;}
.nav-icon{width:16px;height:16px;flex-shrink:0;opacity:.7;}
.nav-item.on .nav-icon{opacity:1;}
.main{margin-left:232px;padding:32px 40px;min-height:100vh;}

/* ── PAGE HEADER ── */
.page-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;padding-bottom:18px;border-bottom:1px solid var(--border);}
.page-title{font-size:22px;font-weight:800;letter-spacing:-.03em;color:#111;}

/* ── STAT CARDS ── */
.stat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px;margin-bottom:28px;}
.stat-card{background:#fff;border:1px solid var(--border);border-radius:var(--r);padding:18px 20px;box-shadow:var(--shadow-contact);transition:box-shadow .2s,transform .2s;}
.stat-card:hover{box-shadow:var(--shadow-float);transform:translateY(-2px);}
.stat-val{font-size:26px;font-weight:800;letter-spacing:-.03em;line-height:1;}
.stat-lbl{font-size:10.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--mut);margin-top:6px;font-weight:600;}

/* ── TABLES ── */
.tw{background:#fff;border:1px solid var(--border);border-radius:var(--r);overflow:hidden;box-shadow:var(--shadow-contact);}
.ts{overflow-x:auto;}
table{width:100%;border-collapse:collapse;}
thead th{padding:11px 14px;text-align:left;font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--mut);border-bottom:1px solid var(--border);background:var(--sh);}
tbody tr{border-bottom:1px solid #F0F0F4;transition:background .1s;}
tbody tr:hover{background:#FAFAFE;}
tbody td{padding:12px 14px;font-size:13px;vertical-align:middle;}

/* ── LAYOUT UTILITIES ── */
.sb{display:flex;gap:10px;margin-bottom:16px;align-items:center;flex-wrap:wrap;}

/* ── MODALS ── */
.modal-ov{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(8px);}
.modal{background:#fff;border:1px solid var(--border);border-radius:var(--r);width:100%;max-width:540px;max-height:90vh;overflow-y:auto;animation:mu .2s cubic-bezier(.23,1,.32,1);box-shadow:0 24px 60px rgba(0,0,0,.14);}
.modal.lg{max-width:860px;}
@keyframes mu{from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
.mh{padding:20px 24px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:#fff;z-index:2;}
.mb{padding:22px 24px;}
.mf{padding:14px 24px 20px;border-top:1px solid var(--border);display:flex;gap:8px;justify-content:flex-end;}

/* ── TABS ── */
.tab-row{display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:20px;overflow-x:auto;}
.tab{padding:10px 18px;border-radius:0;font-size:12.5px;font-weight:600;cursor:pointer;color:var(--mut);white-space:nowrap;border-bottom:2px solid transparent;margin-bottom:-1px;background:transparent;transition:all .15s;}
.tab.on{color:#1428A0;border-bottom-color:#1428A0;font-weight:700;}

/* ── EMPTY STATE ── */
.empty{text-align:center;padding:56px 20px;color:var(--mut);}

/* ── AUTH ── */
.login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#F4F6FB;}
.login-box{background:#fff;border:1px solid var(--border);border-radius:var(--r);padding:40px 36px;width:100%;max-width:400px;box-shadow:var(--shadow-float);}
.alert-g{background:rgba(20,40,160,.04);border-left:3px solid #1428A0;border-radius:6px;padding:10px 14px;font-size:12.5px;color:#1428A0;margin-bottom:14px;}
.alert-r{background:rgba(192,48,48,.04);border-left:3px solid #C03030;border-radius:6px;padding:10px 14px;font-size:12.5px;color:#C03030;margin-bottom:14px;}

/* ── MOBILE TOPBAR + DRAWER ── */
.topbar{display:none;position:fixed;top:0;left:0;right:0;height:56px;background:#fff;border-bottom:1px solid var(--border);z-index:60;padding:0 16px;align-items:center;justify-content:space-between;box-shadow:0 2px 8px rgba(0,0,0,.05);}
.hamburger{background:none;border:none;cursor:pointer;padding:8px;display:flex;flex-direction:column;gap:5px;border-radius:8px;transition:background .15s;}
.hamburger:hover{background:var(--sh);}
.hamburger span{display:block;width:22px;height:2px;background:var(--txt);border-radius:2px;transition:all .2s;}
.drawer-ov{display:none;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:70;backdrop-filter:blur(4px);}
.drawer-ov.open{display:block;}
.drawer{position:fixed;left:0;top:0;bottom:0;width:min(268px,85vw);background:#fff;z-index:71;transform:translateX(-100%);transition:transform .28s cubic-bezier(.23,1,.32,1);display:flex;flex-direction:column;overflow-y:auto;box-shadow:4px 0 32px rgba(0,0,0,.12);}
.drawer.open{transform:translateX(0);}
.alert-badge{position:absolute;top:-4px;right:-4px;background:#C03030;color:#fff;border-radius:50%;width:18px;height:18px;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;}
/* Mobile modal slide-up animation (outside @media so it's always available) */
@keyframes mu-mob{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
/* Utility */
.hide-mobile{display:block;}

/* ── RESPONSIVE ── */
@media(max-width:768px){

  /* Layout */
  .sidebar{display:none;}
  .topbar{display:flex;}
  .main{margin-left:0;margin-top:56px;padding:14px 12px 40px;}
  .hide-mobile{display:none!important;}

  /* Page header — compact, no date on mobile */
  .page-header{flex-direction:row;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:16px;padding-bottom:12px;}
  .page-title{font-size:17px;letter-spacing:-.02em;}

  /* Stat grid — 2 tight columns */
  .stat-grid{grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:16px;}
  .stat-card{padding:12px 14px;}
  .stat-val{font-size:20px;}
  .stat-lbl{font-size:9px;margin-top:4px;}

  /* Tables — horizontal scroll, compact */
  .tw{border-radius:12px;}
  .ts{overflow-x:auto;-webkit-overflow-scrolling:touch;}
  thead th{padding:8px 10px;font-size:9.5px;white-space:nowrap;}
  tbody td{padding:9px 10px;font-size:12px;}

  /* Buttons */
  .btn{padding:9px 14px;font-size:12px;}
  .sm{padding:5px 9px;font-size:11px;}

  /* Inputs — 16px prevents iOS auto-zoom on focus */
  .inp{font-size:16px;padding:11px 13px;}

  /* Search/filter rows */
  .sb{gap:8px;}

  /* Cards */
  .card{padding:14px 15px;border-radius:12px;}

  /* Tabs — hide scrollbar, swipeable */
  .tab-row{overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;}
  .tab-row::-webkit-scrollbar{display:none;}
  .tab{padding:9px 14px;font-size:12px;}

  /* Modals — bottom sheet that slides up */
  .modal-ov{padding:0;align-items:flex-end;}
  .modal{
    max-width:100%!important;
    width:100%;
    border-radius:20px 20px 0 0;
    max-height:92dvh;
    max-height:92vh;
    border-left:none;border-right:none;border-bottom:none;
    animation:mu-mob .28s cubic-bezier(.23,1,.32,1);
  }
  .mh{padding:16px 18px 12px;}
  .mb{padding:16px 18px;}
  .mf{padding:12px 18px 28px;flex-wrap:wrap;}
  .mf .btn{flex:1;min-width:0;justify-content:center;}

  /* A drag handle pill for bottom sheets */
  .mh::before{content:'';display:block;width:36px;height:4px;background:var(--border);border-radius:2px;margin:0 auto 14px;}

  /* Login — full-width card on mobile */
  .login-wrap{align-items:flex-start;padding:0;}
  .login-box{border-radius:0;border-left:none;border-right:none;border-top:none;padding:36px 20px 40px;box-shadow:none;max-width:100%;}

  /* Badge */
  .badge{font-size:10px;padding:2px 8px;}

  /* Empty state */
  .empty{padding:40px 12px;}
}
`;


const fmtKES = n => "KSh " + Number(n || 0).toLocaleString("en-KE");
const ago = ts => { if (!ts) return "—"; const d = Date.now() - new Date(ts).getTime(); if (d < 3600000) return Math.floor(d/60000)+"m ago"; if (d < 86400000) return Math.floor(d/3600000)+"h ago"; return Math.floor(d/86400000)+"d ago"; };

async function req(path, opts={}, token) {
  const headers = {"Content-Type":"application/json",...(token?{Authorization:`Bearer ${token}`}:{}),...opts.headers};
  const res = await fetch(`${API}${path}`,{...opts,headers});
  const data = await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(data.error||"Request failed");
  return data;
}

function Spin(){return <span className="spin"/>;}
function FF({label,children}){return <div style={{marginBottom:13}}>{label&&<label className="lbl">{label}</label>}{children}</div>;}

// ── WEKA SOKO LOGO ────────────────────────────────────────────────────────────
function WsLogo({size=32,showText=true,light=false}){
  const blue=light?"#fff":"#1428A0";
  const gold="#C49A00";
  const w=size*(140/90),h=size;
  return <div style={{display:"flex",alignItems:"center",gap:showText?10:0,flexShrink:0}}>
    <svg width={w} height={h} viewBox="0 0 140 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* W — right peak meets the gold bar */}
      <path d="M8 22 L26 68 L44 22 L62 68 L80 22" stroke={blue} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"/>
      {/* S — interlocked, wrapping the W's right peak */}
      <path d="M130 24 C105 16 82 26 82 40 C82 55 120 53 120 68 C120 80 102 85 80 84" stroke={blue} strokeWidth="11" strokeLinecap="round" fill="none"/>
      {/* Gold bar — at the W/S intersection */}
      <line x1="78" y1="10" x2="78" y2="84" stroke={gold} strokeWidth="11" strokeLinecap="round"/>
    </svg>
    {showText&&<div style={{lineHeight:1.1}}>
      <div style={{fontSize:size*0.56,fontWeight:800,letterSpacing:"-.03em",color:light?"#fff":"#111",fontFamily:"var(--fn)"}}>
        Weka<span style={{color:"#1428A0"}}>Soko</span>
      </div>
      <div style={{fontSize:size*0.28,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:light?"rgba(255,255,255,.7)":"var(--mut)",fontFamily:"var(--fn)"}}>Admin</div>
    </div>}
  </div>;
}

// ── NOTIFICATION SOUND SYSTEM ────────────────────────────────────────────────
function useAdminSound(){
  const ctxRef=useRef(null);
  useEffect(()=>{
    const unlock=()=>{
      if(ctxRef.current)return;
      try{
        const AC=window.AudioContext||window.webkitAudioContext;
        if(!AC)return;
        const ctx=new AC();
        ctxRef.current=ctx;
        const buf=ctx.createBuffer(1,1,22050);
        const src=ctx.createBufferSource();
        src.buffer=buf;src.connect(ctx.destination);src.start(0);
      }catch(e){}
    };
    document.addEventListener('click',unlock,{once:true});
    document.addEventListener('touchstart',unlock,{once:true});
    return()=>{document.removeEventListener('click',unlock);document.removeEventListener('touchstart',unlock);};
  },[]);
  return useCallback((type='alert')=>{
    try{
      const AC=window.AudioContext||window.webkitAudioContext;
      if(!AC)return;
      const ctx=ctxRef.current||new AC();
      if(!ctxRef.current)ctxRef.current=ctx;
      if(ctx.state==='suspended')ctx.resume().catch(()=>{});
      const now=ctx.currentTime;
      // urgent: two-tone alert — new: gentle rising two-tone
      const tones=type==='urgent'?[880,659.25,880]:[659.25,783.99];
      tones.forEach((freq,i)=>{
        const osc=ctx.createOscillator();
        const gain=ctx.createGain();
        osc.connect(gain);gain.connect(ctx.destination);
        osc.type='sine';
        osc.frequency.setValueAtTime(freq,now+i*0.16);
        gain.gain.setValueAtTime(0,now+i*0.16);
        gain.gain.linearRampToValueAtTime(0.22,now+i*0.16+0.02);
        gain.gain.exponentialRampToValueAtTime(0.001,now+i*0.16+0.4);
        osc.start(now+i*0.16);
        osc.stop(now+i*0.16+0.45);
      });
    }catch(e){}
  },[]);
}

function Toast({msg,ok,onClose}){
  useEffect(()=>{const t=setTimeout(onClose,4500);return()=>clearTimeout(t);},[]);
  return <div style={{position:"fixed",bottom:24,right:24,zIndex:300,background:"#fff",border:`1px solid ${ok?"rgba(20,40,160,.2)":"rgba(192,48,48,.2)"}`,borderLeft:`4px solid ${ok?"#1428A0":"#C03030"}`,borderRadius:10,padding:"13px 18px",fontSize:13,fontFamily:"var(--fn)",display:"flex",gap:10,alignItems:"center",maxWidth:360,boxShadow:"0 8px 32px rgba(0,0,0,.12)"}}><div style={{width:8,height:8,borderRadius:"50%",background:ok?"#1428A0":"#C03030",flexShrink:0}}/><span style={{flex:1}}>{msg}</span><button className="btn bgh sm" style={{padding:"4px 8px"}} onClick={onClose}>✕</button></div>;
}

function Modal({title,onClose,children,footer,large}){
  return <div className="modal-ov" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className={`modal${large?" lg":""}`}>
      <div className="mh"><span style={{fontWeight:700,fontSize:16}}>{title}</span><button className="btn bgh sm" onClick={onClose}>✕</button></div>
      <div className="mb">{children}</div>
      {footer&&<div className="mf">{footer}</div>}
    </div>
  </div>;
}

function Login({onLogin}){
  const [email,setEmail]=useState("");const [pw,setPw]=useState("");const [loading,setLoading]=useState(false);const [err,setErr]=useState("");
  const submit=async()=>{
    if(!email||!pw){setErr("Enter email and password.");return;}
    setLoading(true);setErr("");
    try{
      const d=await req("/api/auth/admin-login",{method:"POST",body:JSON.stringify({email:email.trim(),password:pw})});
      onLogin(d.user,d.token);
    }catch(e){setErr(e.message);}finally{setLoading(false);}
  };
  return <div className="login-wrap">
    <div className="login-box">
      <div style={{textAlign:"center",marginBottom:28,paddingBottom:20,borderBottom:"1px solid var(--border)",display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
        <WsLogo size={36}/>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"var(--mut)"}}>Platform Administration</div>
      </div>
      <p style={{color:"var(--mut)",fontSize:13,marginBottom:20}}>Sign in to manage the platform.</p>
      {err&&<div className="alert-r">{err}</div>}
      <FF label="Email"><input className="inp" type="email" placeholder="admin@wekasoko.co.ke" value={email} onChange={e=>setEmail(e.target.value)}/></FF>
      <FF label="Password"><input className="inp" type="password" placeholder="••••••••" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/></FF>
      <button className="btn bp" style={{width:"100%",marginTop:8}} onClick={submit} disabled={loading}>{loading?<Spin/>:"Sign In →"}</button>
    </div>
  </div>;
}

function Overview({token}){
  const [s,setS]=useState(null);const [loading,setLoading]=useState(true);
  useEffect(()=>{
    const fetchStats=()=>req("/api/admin/stats",{},token).then(setS).catch(()=>{});
    fetchStats();
    setLoading(false);
    // Refresh stats every 20s
    const iv=setInterval(fetchStats,20000);
    return()=>clearInterval(iv);
  },[token]);
  if(loading)return <div style={{textAlign:"center",padding:60}}><Spin/></div>;
  if(!s)return <div className="empty">Could not load stats.</div>;
  const {listings:L,users:U,payments:P,violations:V,escrows:E,disputes:D,soldChannels:SC,requests:R}=s;
  return <>
    <div className="stat-grid">
      {[
        {l:"Total Users",v:U?.total||0,c:"#1D1D1D"},
        {l:"Sellers",v:U?.sellers||0,c:"#1428A0"},
        {l:"Buyers",v:U?.buyers||0,c:"#1428A0"},
        {l:"Active Listings",v:L?.active||0,c:"#1428A0"},
        {l:"Sold Items",v:L?.sold||0,c:"#8B6400"},
        {l:"Buyer Requests",v:R?.active||0,c:"#1428A0"},
        {l:"Unlock Revenue",v:fmtKES(P?.unlock_revenue),c:"#1428A0",sm:true},
        {l:"Escrow Volume",v:fmtKES(P?.escrow_volume),c:"#1428A0",sm:true},
        {l:"Active Escrows",v:E?.active||0,c:"#1428A0"},
        {l:"Open Disputes",v:D?.open||0,c:"#C03030"},
        {l:"Violations",v:V?.total||0,c:"#8B6400"},
        {l:"Suspended",v:U?.suspended||0,c:"#C03030"},
      ].map(x=>(
        <div key={x.l} className="stat-card"><div className="stat-val" style={{color:x.c,fontSize:x.sm?15:26}}>{x.v}</div><div className="stat-lbl">{x.l}</div></div>
      ))}
    </div>
    {SC&&parseInt(SC.total_sold)>0&&<div style={{background:"#fff",border:"1px solid var(--border)",borderRadius:"var(--r)",padding:"18px 20px",marginTop:16,boxShadow:"var(--shadow-contact)"}}>
      <div style={{fontWeight:700,fontSize:13,marginBottom:14,letterSpacing:"-.01em"}}>Sale Channel Breakdown</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
        {[
          {l:"Via Weka Soko",v:SC.sold_on_platform||0,c:"#1428A0"},
          {l:"Outside Platform",v:SC.sold_outside||0,c:"#8B6400"},
          {l:"Unknown",v:SC.sold_channel_unknown||0,c:"var(--mut)"},
        ].map(x=><div key={x.l} style={{background:"var(--sh)",borderRadius:"var(--rs)",padding:"14px 16px"}}>
          <div style={{fontSize:22,fontWeight:800,color:x.c,letterSpacing:"-.02em"}}>{x.v}</div>
          <div style={{fontSize:10,color:"var(--mut)",marginTop:4,textTransform:"uppercase",letterSpacing:".06em",fontWeight:600}}>{x.l}</div>
          <div style={{fontSize:10,color:"var(--dim)",marginTop:2}}>{parseInt(SC.total_sold)>0?Math.round((x.v/parseInt(SC.total_sold))*100):0}% of sold</div>
        </div>)}
      </div>
    </div>}
    <div style={{background:"rgba(20,40,160,.04)",border:"1px solid rgba(20,40,160,.15)",borderRadius:"var(--rs)",padding:"10px 14px",fontSize:12,color:"#1428A0",marginTop:12}}>Live data from Railway. Refresh to update.</div>
  </>;
}

// ── ADMIN LISTING DETAIL + EDIT MODAL ────────────────────────────────────────
function ListingDetailModal({listing:l,token,notify,onClose,onUpdated}){
  const [tab,setTab]=useState("view");
  const [saving,setSaving]=useState(false);
  const [f,setF]=useState({
    title:l.title||"",
    description:l.description||"",
    reason_for_sale:l.reason_for_sale||"",
    price:String(l.price||""),
    category:l.category||"",
    location:l.location||"",
    county:l.county||"",
    status:l.status||"active",
  });
  const sf=(k,v)=>setF(p=>({...p,[k]:v}));

  const photos=Array.isArray(l.photos)?l.photos.map(p=>typeof p==="string"?p:p?.url).filter(Boolean):[];
  const [mainPhoto,setMainPhoto]=useState(photos[0]||null);

  const save=async()=>{
    setSaving(true);
    try{
      const body={};
      if(f.title!==l.title)body.title=f.title;
      if(f.description!==l.description)body.description=f.description;
      if(f.reason_for_sale!==l.reason_for_sale)body.reason_for_sale=f.reason_for_sale;
      if(f.price!==String(l.price))body.price=parseFloat(f.price);
      if(f.category!==l.category)body.category=f.category;
      if(f.location!==l.location)body.location=f.location;
      if(f.county!==l.county)body.county=f.county;
      if(f.status!==l.status)body.status=f.status;
      if(!Object.keys(body).length){notify("No changes made.",false);return;}
      const updated=await req(`/api/admin/listings/${l.id}`,{method:"PATCH",body:JSON.stringify(body)},token);
      notify("Listing updated. Seller has been notified.",true);
      onUpdated({...l,...updated,...body});
      setTab("view");
    }catch(e){notify(e.message,false);}
    finally{setSaving(false);}
  };

  const freeUnlock=async()=>{
    try{
      await req(`/api/admin/listings/${l.id}/free-unlock`,{method:"POST"},token);
      notify("Listing unlocked — seller notified.",true);
      onUpdated({...l,is_unlocked:true});
    }catch(e){notify(e.message,false);}
  };

  return <Modal title={l.title} onClose={onClose} large footer={
    <div style={{display:"flex",gap:8,width:"100%",alignItems:"center"}}>
      {!l.is_unlocked&&<button className="btn bb sm" onClick={freeUnlock}>Free Unlock</button>}
      <div style={{flex:1}}/>
      {tab==="edit"&&<><button className="btn bs sm" onClick={()=>setTab("view")}>Cancel</button><button className="btn bp sm" onClick={save} disabled={saving}>{saving?<Spin/>:"Save Changes →"}</button></>}
      {tab==="view"&&<button className="btn by sm" onClick={()=>setTab("edit")}>Edit Listing</button>}
    </div>
  }>
    <div className="tab-row" style={{marginBottom:16}}>
      <div className={`tab${tab==="view"?" on":""}`} onClick={()=>setTab("view")}>View</div>
      <div className={`tab${tab==="edit"?" on":""}`} onClick={()=>setTab("edit")}>Edit</div>
    </div>

    {tab==="view"&&<>
      {/* Photos */}
      {photos.length>0&&<>
        <div style={{background:"var(--sh)",borderRadius:"var(--rs)",aspectRatio:"16/9",overflow:"hidden",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <img src={mainPhoto||photos[0]} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        </div>
        {photos.length>1&&<div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto"}}>
          {photos.map((p,i)=><img key={i} src={p} alt="" onClick={()=>setMainPhoto(p)}
            style={{width:64,height:50,objectFit:"cover",borderRadius:"var(--rs)",cursor:"pointer",opacity:mainPhoto===p?1:.45,border:mainPhoto===p?"2px solid var(--accent)":"2px solid transparent",flexShrink:0}}/>)}
        </div>}
      </>}
      {photos.length===0&&<div style={{background:"var(--sh)",borderRadius:"var(--rs)",height:120,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14}}><span style={{fontSize:11,color:"var(--dim)",fontWeight:600,textTransform:"uppercase",letterSpacing:".08em"}}>No Photos</span></div>}

      {/* Info grid */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        {[["Price",fmtKES(l.price)],["Category",l.category],["Status",l.status],["Location",l.location],["County",l.county||"—"],["Seller",l.seller_name],["Seller Email",l.seller_email],["Views",l.view_count||0]].map(([k,v])=><div key={k} style={{background:"var(--sh)",borderRadius:"var(--rs)",padding:"10px 12px"}}>
          <div className="lbl">{k}</div>
          <div style={{fontSize:13}}>{v||"—"}</div>
        </div>)}
      </div>

      {l.description&&<div style={{marginBottom:12}}>
        <div className="lbl">Description</div>
        <div style={{background:"var(--sh)",borderRadius:"var(--rs)",padding:"12px 14px",fontSize:13,lineHeight:1.75,color:"var(--mut)"}}>{l.description}</div>
      </div>}

      {l.reason_for_sale&&<div style={{marginBottom:12}}>
        <div className="lbl">Reason for Sale</div>
        <div style={{background:"var(--sh)",borderRadius:"var(--rs)",padding:"10px 12px",fontSize:13,color:"var(--mut)"}}>{l.reason_for_sale}</div>
      </div>}

      {l.is_unlocked&&<div style={{background:"rgba(20,40,160,.06)",border:"1px solid rgba(20,40,160,.2)",borderRadius:"var(--rs)",padding:"10px 14px",fontSize:12,color:"var(--a)"}}>
        Unlocked — seller can see buyer contact
      </div>}
      {!l.is_unlocked&&l.locked_buyer_id&&<div style={{background:"rgba(196,154,0,.06)",border:"1px solid rgba(196,154,0,.2)",borderRadius:"var(--rs)",padding:"10px 14px",fontSize:12,color:"var(--gold)"}}>
        Buyer locked in — seller hasn't paid to unlock yet
      </div>}

      {l.pending_reports>0&&<div style={{background:"rgba(192,48,48,.08)",border:"1px solid rgba(192,48,48,.2)",borderRadius:"var(--rs)",padding:"10px 14px",fontSize:12,color:"var(--red)",marginTop:8}}>
        {l.pending_reports} pending report{l.pending_reports>1?"s":""}
      </div>}
    </>}

    {tab==="edit"&&<>
      <div style={{background:"rgba(196,154,0,.06)",border:"1px solid rgba(196,154,0,.2)",borderRadius:"var(--rs)",padding:"10px 14px",fontSize:12,color:"var(--gold)",marginBottom:16}}>
        Changes you save will be sent as a notification to the seller.
      </div>
      <FF label="Title"><input className="inp" value={f.title} onChange={e=>sf("title",e.target.value)}/></FF>
      <FF label="Description"><textarea className="inp" rows={5} value={f.description} onChange={e=>sf("description",e.target.value)}/></FF>
      <FF label="Reason for Sale"><input className="inp" value={f.reason_for_sale} onChange={e=>sf("reason_for_sale",e.target.value)}/></FF>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <FF label="Price (KSh)"><input className="inp" type="number" value={f.price} onChange={e=>sf("price",e.target.value)}/></FF>
        <FF label="Category"><input className="inp" value={f.category} onChange={e=>sf("category",e.target.value)}/></FF>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <FF label="Location"><input className="inp" value={f.location} onChange={e=>sf("location",e.target.value)}/></FF>
        <FF label="County"><input className="inp" value={f.county} onChange={e=>sf("county",e.target.value)}/></FF>
      </div>
      <FF label="Status">
        <select className="inp" value={f.status} onChange={e=>sf("status",e.target.value)}>
          {["active","sold","archived","flagged","deleted"].map(s=><option key={s} value={s}>{s}</option>)}
        </select>
      </FF>
    </>}
  </Modal>;
}

// ── REVIEW QUEUE ─────────────────────────────────────────────────────────────
function ReviewQueue({token,notify}){
  const [listings,setListings]=useState([]);
  const [loading,setLoading]=useState(true);
  const [selected,setSelected]=useState(null);
  const [rejectReason,setRejectReason]=useState("");
  const [changeNote,setChangeNote]=useState("");
  const [action,setAction]=useState(null); // "reject" | "changes"
  const [submitting,setSubmitting]=useState(false);

  const load=()=>{
    setLoading(true);
    req("/api/admin/moderation/queue",{},token)
      .then(d=>{setListings(d.listings||[]);})
      .catch(()=>{}).finally(()=>setLoading(false));
  };
  useEffect(()=>{
    load();
    // Refresh review queue every 15s so new submissions appear automatically
    const iv=setInterval(load,15000);
    return()=>clearInterval(iv);
  },[token]);

  const approve=async id=>{
    setSubmitting(true);
    try{
      await req(`/api/admin/moderation/${id}/approve`,{method:"POST"},token);
      setListings(p=>p.filter(l=>l.id!==id));
      setSelected(null);
      notify("Listing approved and live!",true);
    }catch(e){notify(e.message,false);}
    finally{setSubmitting(false);}
  };

  const reject=async id=>{
    if(!rejectReason.trim()){notify("Enter a rejection reason.",false);return;}
    setSubmitting(true);
    try{
      await req(`/api/admin/moderation/${id}/reject`,{method:"POST",body:JSON.stringify({reason:rejectReason.trim()})},token);
      setListings(p=>p.filter(l=>l.id!==id));
      setSelected(null);setAction(null);setRejectReason("");
      notify("Listing rejected. Seller notified.",true);
    }catch(e){notify(e.message,false);}
    finally{setSubmitting(false);}
  };

  const requestChanges=async id=>{
    if(!changeNote.trim()){notify("Enter a note for the seller.",false);return;}
    setSubmitting(true);
    try{
      await req(`/api/admin/moderation/${id}/request-changes`,{method:"POST",body:JSON.stringify({note:changeNote.trim()})},token);
      setListings(p=>p.filter(l=>l.id!==id));
      setSelected(null);setAction(null);setChangeNote("");
      notify("Change request sent to seller.",true);
    }catch(e){notify(e.message,false);}
    finally{setSubmitting(false);}
  };

  const fmtKES=n=>"KSh "+Number(n||0).toLocaleString("en-KE");

  if(loading)return <div style={{textAlign:"center",padding:60}}><Spin/></div>;

  return <>
    {listings.length===0
      ?<div className="empty">
          <div style={{width:48,height:48,borderRadius:"50%",background:"rgba(20,40,160,.08)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}><svg viewBox="0 0 24 24" fill="none" stroke="#1428A0" strokeWidth="2" strokeLinecap="round" width={24} height={24}><polyline points="20,6 9,17 4,12"/></svg></div>
          <div style={{fontWeight:700,fontSize:16,marginBottom:6}}>All caught up!</div>
          <div style={{fontSize:13,color:"#636363"}}>No listings pending review</div>
        </div>
      :<>
        <div style={{fontSize:13,color:"#636363",marginBottom:16,fontWeight:600}}>{listings.length} listing{listings.length!==1?"s":""} awaiting review</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:14}}>
          {listings.map(l=>{
            const photos=l.photos||[];
            const cover=Array.isArray(photos)?photos[0]:null;
            return <div key={l.id} style={{background:"#fff",border:`1px solid ${selected?.id===l.id?"#1428A0":"#E6E6E6"}`,borderRadius:0,overflow:"hidden",cursor:"pointer",transition:"border-color .15s"}}
              onClick={()=>{setSelected(l);setAction(null);setRejectReason("");setChangeNote("");}}>
              <div style={{height:160,background:"#F4F4F4",position:"relative",overflow:"hidden"}}>
                {cover?<img src={cover} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  :<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%"}}><span style={{fontSize:11,color:"#ccc",fontWeight:700,textTransform:"uppercase",letterSpacing:".06em"}}>No Photo</span></div>}
                <span className="badge bm" style={{position:"absolute",top:8,right:8,fontSize:10}}>{l.category}</span>
              </div>
              <div style={{padding:"12px 14px"}}>
                <div style={{fontWeight:700,fontSize:14,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.title}</div>
                <div style={{fontSize:13,fontWeight:700,color:"#1428A0",marginBottom:4}}>{fmtKES(l.price)}</div>
                <div style={{fontSize:11,color:"#636363"}}>{l.seller_name} · {ago(l.created_at)}</div>
              </div>
            </div>;
          })}
        </div>
      </>
    }

    {/* Detail panel */}
    {selected&&<Modal title={`Review: ${selected.title}`} onClose={()=>{setSelected(null);setAction(null);}} large>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div>
          {/* Photos */}
          <div style={{aspectRatio:"4/3",background:"#F4F4F4",overflow:"hidden",marginBottom:8}}>
            {(selected.photos||[])[0]
              ?<img src={(selected.photos||[])[0]} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              :<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%"}}><span style={{fontSize:11,color:"#ccc",fontWeight:700,textTransform:"uppercase",letterSpacing:".06em"}}>No Photo</span></div>}
          </div>
          {(selected.photos||[]).length>1&&<div style={{display:"flex",gap:4,overflowX:"auto"}}>
            {(selected.photos||[]).slice(1).map((p,i)=><img key={i} src={p} alt="" style={{width:56,height:44,objectFit:"cover",flexShrink:0,borderRadius:0}}/>)}
          </div>}
        </div>
        <div>
          <div style={{marginBottom:12}}>
            <div className="lbl">Price</div>
            <div style={{fontSize:20,fontWeight:700,color:"#1428A0"}}>{fmtKES(selected.price)}</div>
          </div>
          <div style={{marginBottom:12}}>
            <div className="lbl">Category</div>
            <div style={{fontSize:13}}>{selected.category}{selected.subcat?" → "+selected.subcat:""}</div>
          </div>
          <div style={{marginBottom:12}}>
            <div className="lbl">Location</div>
            <div style={{fontSize:13}}>{selected.location||"—"}{selected.county?", "+selected.county:""}</div>
          </div>
          <div style={{marginBottom:12}}>
            <div className="lbl">Seller</div>
            <div style={{fontSize:13}}>{selected.seller_name}</div>
            <div style={{fontSize:11,color:"#636363"}}>{selected.seller_email}</div>
          </div>
          <div>
            <div className="lbl">Submitted</div>
            <div style={{fontSize:12,color:"#636363"}}>{new Date(selected.created_at).toLocaleString("en-KE")}</div>
          </div>
        </div>
      </div>

      <div style={{marginBottom:12}}>
        <div className="lbl">Description</div>
        <div style={{fontSize:13,lineHeight:1.7,color:"#1D1D1D",background:"#F6F6F6",padding:"10px 12px"}}>{selected.description}</div>
      </div>
      <div style={{marginBottom:16}}>
        <div className="lbl">Reason for Sale</div>
        <div style={{fontSize:13,color:"#636363"}}>{selected.reason_for_sale||"—"}</div>
      </div>

      {/* Action buttons */}
      {!action&&<div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <button className="btn bp" onClick={()=>approve(selected.id)} disabled={submitting}>{submitting?<Spin/>:"Approve — Go Live"}</button>
        <button className="btn by sm" onClick={()=>setAction("changes")}>Request Changes</button>
        <button className="btn br sm" onClick={()=>setAction("reject")}>Reject</button>
      </div>}

      {action==="reject"&&<div>
        <div className="lbl" style={{marginBottom:6}}>Rejection Reason <span style={{color:"#C03030"}}>*</span></div>
        <textarea className="inp" rows={3} placeholder="Tell the seller why their listing was not approved..." value={rejectReason} onChange={e=>setRejectReason(e.target.value)} style={{marginBottom:10}}/>
        <div style={{display:"flex",gap:8}}>
          <button className="btn bs sm" onClick={()=>setAction(null)}>Cancel</button>
          <button className="btn br" onClick={()=>reject(selected.id)} disabled={submitting||!rejectReason.trim()}>{submitting?<Spin/>:"Confirm Rejection"}</button>
        </div>
      </div>}

      {action==="changes"&&<div>
        <div className="lbl" style={{marginBottom:6}}>Changes Needed <span style={{color:"#C03030"}}>*</span></div>
        <textarea className="inp" rows={3} placeholder="Tell the seller what they need to fix before the listing can go live..." value={changeNote} onChange={e=>setChangeNote(e.target.value)} style={{marginBottom:10}}/>
        <div style={{display:"flex",gap:8}}>
          <button className="btn bs sm" onClick={()=>setAction(null)}>Cancel</button>
          <button className="btn by" onClick={()=>requestChanges(selected.id)} disabled={submitting||!changeNote.trim()}>{submitting?<Spin/>:"Send Change Request"}</button>
        </div>
      </div>}
    </Modal>}
  </>;
}

function UserProfileModal({user:u,token,notify,onClose,onUpdated}){
  const [listings,setListings]=useState([]);const [loadingL,setLoadingL]=useState(true);
  const [lq,setLq]=useState("");const [lsf,setLsf]=useState("");
  const [viewListing,setViewListing]=useState(null);
  const [markSoldL,setMarkSoldL]=useState(null);const [soldCh,setSoldCh]=useState("platform");const [markingSold,setMarkingSold]=useState(false);

  useEffect(()=>{
    setLoadingL(true);
    req(`/api/admin/users/${u.id}/listings`,{},token)
      .then(d=>setListings(d.listings||[]))
      .catch(()=>{})
      .finally(()=>setLoadingL(false));
  },[u.id,token]);

  const filteredL=listings.filter(l=>
    (!lsf||l.status===lsf)&&
    (!lq||l.title?.toLowerCase().includes(lq.toLowerCase()))
  );

  const suspend=async()=>{
    try{
      await req(`/api/admin/users/${u.id}/suspend`,{method:"POST",body:JSON.stringify({suspend:!u.is_suspended})},token);
      notify(u.is_suspended?"User unsuspended.":"User suspended.",true);
      onUpdated({...u,is_suspended:!u.is_suspended});
    }catch(e){notify(e.message,false);}
  };

  const updListingStatus=async(id,status)=>{
    try{
      await req(`/api/admin/listings/${id}`,{method:"PATCH",body:JSON.stringify({status})},token);
      setListings(p=>p.map(l=>l.id===id?{...l,status}:l));
      notify(`Status set to "${status}".`,true);
    }catch(e){notify(e.message,false);}
  };

  const delListing=async id=>{
    if(!window.confirm("Permanently delete this listing?"))return;
    try{
      await req(`/api/admin/listings/${id}`,{method:"DELETE"},token);
      setListings(p=>p.filter(l=>l.id!==id));
      notify("Deleted.",true);
    }catch(e){notify(e.message,false);}
  };

  const confirmMarkSold=async()=>{
    if(!markSoldL)return;
    setMarkingSold(true);
    try{
      await req(`/api/admin/listings/${markSoldL.id}/mark-sold`,{method:"POST",body:JSON.stringify({sold_channel:soldCh})},token);
      setListings(p=>p.map(l=>l.id===markSoldL.id?{...l,status:"sold"}:l));
      notify(`"${markSoldL.title}" marked as sold.`,true);
      setMarkSoldL(null);
    }catch(e){notify(e.message,false);}
    setMarkingSold(false);
  };

  const freeUnlock=async id=>{
    try{
      await req(`/api/admin/listings/${id}/free-unlock`,{method:"POST"},token);
      setListings(p=>p.map(l=>l.id===id?{...l,is_unlocked:true}:l));
      notify("Listing unlocked for free.",true);
    }catch(e){notify(e.message,false);}
  };

  const sc=s=>({active:"bg",sold:"by2",locked:"bb2",deleted:"br2",archived:"by2",flagged:"br2",pending_review:"bb2",rejected:"br2"}[s]||"bm");

  const totalAds=listings.length;
  const activeAds=listings.filter(l=>l.status==="active").length;
  const lockedAds=listings.filter(l=>l.status==="locked").length;
  const soldAds=listings.filter(l=>l.status==="sold").length;
  const pendingAds=listings.filter(l=>l.status==="pending_review").length;
  const rejectedAds=listings.filter(l=>l.status==="rejected").length;

  return <div className="modal-ov" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
    <div className="modal lg" style={{maxWidth:900,maxHeight:"90vh",display:"flex",flexDirection:"column"}}>
      <div className="mh">
        <span style={{fontWeight:700,fontSize:16}}>User: {u.name}</span>
        <button className="btn bgh sm" onClick={onClose}>✕</button>
      </div>
      <div className="mb" style={{overflowY:"auto",flex:1}}>

        {/* User info card */}
        <div style={{background:"var(--sh)",border:"1px solid var(--border)",padding:"16px 18px",marginBottom:20,display:"flex",gap:20,flexWrap:"wrap",alignItems:"flex-start"}}>
          <div style={{flex:1,minWidth:200}}>
            <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>{u.name}</div>
            <div style={{fontSize:12,color:"var(--mut)",marginBottom:2}}>{u.email}</div>
            {u.phone&&<div style={{fontSize:12,color:"var(--mut)",marginBottom:2}}>{u.phone}</div>}
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
              <span className={`badge ${u.role==="seller"?"bg":"bm"}`}>{u.role}</span>
              {u.is_verified&&<span className="badge bg">Verified</span>}
              <span className={`badge ${u.is_suspended?"br2":"bg"}`}>{u.is_suspended?"Suspended":"Active"}</span>
              {u.violation_count>0&&<span className="badge br2">{u.violation_count} violations</span>}
            </div>
            <div style={{fontSize:11,color:"var(--mut)",marginTop:6}}>Joined {ago(u.created_at)}</div>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",alignSelf:"flex-start"}}>
            <button className={`btn sm ${u.is_suspended?"bp":"by"}`} onClick={suspend}>
              {u.is_suspended?"Unsuspend":"Suspend"}
            </button>
          </div>
        </div>

        {/* Listing stats strip */}
        {!loadingL&&<div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20}}>
          {[
            {l:"Total Ads",v:totalAds,cls:""},
            {l:"Active",v:activeAds,cls:"bg"},
            {l:"Locked",v:lockedAds,cls:"bb2"},
            {l:"Sold",v:soldAds,cls:"by2"},
            {l:"Pending Review",v:pendingAds,cls:"bb2"},
            {l:"Rejected",v:rejectedAds,cls:"br2"},
          ].map(s=>(
            <div key={s.l} style={{background:"var(--sh)",border:"1px solid var(--border)",borderRadius:2,padding:"10px 16px",textAlign:"center",minWidth:80}}>
              <div style={{fontSize:22,fontWeight:800,color:"var(--accent)",lineHeight:1}}>{s.v}</div>
              <div style={{fontSize:10,color:"var(--mut)",marginTop:3,fontWeight:600,letterSpacing:".04em",textTransform:"uppercase"}}>{s.l}</div>
            </div>
          ))}
        </div>}

        {/* Listings management */}
        <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>All Listings by {u.name}</div>
        <div className="sb" style={{marginBottom:12}}>
          <input className="inp" style={{flex:1,maxWidth:220}} placeholder="Search listings..." value={lq} onChange={e=>setLq(e.target.value)}/>
          <select className="inp" style={{width:150}} value={lsf} onChange={e=>setLsf(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="locked">Locked</option>
            <option value="sold">Sold</option>
            <option value="pending_review">Pending Review</option>
            <option value="rejected">Rejected</option>
            <option value="archived">Archived</option>
            <option value="deleted">Deleted</option>
          </select>
        </div>

        {loadingL?<div style={{textAlign:"center",padding:32}}><Spin/></div>
        :filteredL.length===0?<div className="empty">No listings found</div>
        :<div className="tw"><div className="ts"><table>
          <thead><tr><th>Title</th><th>Price</th><th>Category</th><th>Status</th><th>Views</th><th>Posted</th><th>Actions</th></tr></thead>
          <tbody>{filteredL.map(l=>(
            <tr key={l.id}>
              <td style={{fontWeight:600,maxWidth:150,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"#1428A0",cursor:"pointer"}} onClick={()=>setViewListing(l)} title={l.title}>{l.title}</td>
              <td style={{color:"#1428A0",fontWeight:700}}>{fmtKES(l.price)}</td>
              <td style={{fontSize:12,color:"var(--mut)"}}>{l.category}</td>
              <td><span className={`badge ${sc(l.status)}`}>{l.status==="pending_review"?"Review":l.status}</span></td>
              <td style={{fontSize:12,color:"var(--mut)"}}>{l.view_count||0}</td>
              <td style={{fontSize:11,color:"var(--mut)"}}>{ago(l.created_at)}</td>
              <td><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                <button className="btn bs sm" onClick={()=>setViewListing(l)}>View</button>
                {l.status!=="active"&&l.status!=="deleted"&&<button className="btn bp sm" onClick={()=>updListingStatus(l.id,"active")}>Activate</button>}
                {(l.status==="active"||l.status==="locked")&&<button className="btn by sm" onClick={()=>{setSoldCh("platform");setMarkSoldL(l);}}>Mark Sold</button>}
                {!l.is_unlocked&&(l.status==="active"||l.status==="locked")&&<button className="btn bb sm" onClick={()=>freeUnlock(l.id)}>Free Unlock</button>}
                <button className="btn br sm" onClick={()=>delListing(l.id)}>Delete</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table></div></div>}
      </div>
    </div>

    {viewListing&&<ListingDetailModal listing={viewListing} token={token} notify={notify} onClose={()=>setViewListing(null)} onUpdated={updated=>{setListings(p=>p.map(l=>l.id===updated.id?updated:l));setViewListing(updated);}}/>}

    {markSoldL&&<Modal title="Mark Listing as Sold" onClose={()=>setMarkSoldL(null)}>
      <div style={{fontWeight:700,marginBottom:4}}>{markSoldL.title}</div>
      <div style={{fontSize:12,color:"var(--mut)",marginBottom:16}}>{fmtKES(markSoldL.price)}</div>
      <label className="lbl">Where was it sold?</label>
      <div style={{display:"flex",flexDirection:"column",gap:8,margin:"8px 0 16px"}}>
        {[{val:"platform",label:"Via Weka Soko"},{val:"outside",label:"Outside the platform"}].map(o=>(
          <div key={o.val} onClick={()=>setSoldCh(o.val)} style={{padding:"10px 14px",border:`2px solid ${soldCh===o.val?"#1428A0":"#E6E6E6"}`,cursor:"pointer",background:soldCh===o.val?"rgba(20,40,160,.04)":"#fff"}}>
            <span style={{fontWeight:700,color:soldCh===o.val?"#1428A0":"var(--txt)"}}>{o.label}</span>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
        <button className="btn bs" onClick={()=>setMarkSoldL(null)}>Cancel</button>
        <button className="btn bp" onClick={confirmMarkSold} disabled={markingSold}>{markingSold?<Spin/>:"Confirm"}</button>
      </div>
    </Modal>}
  </div>;
}

function Users({token,notify}){
  const [users,setUsers]=useState([]);const [loading,setLoading]=useState(true);const [q,setQ]=useState("");
  const [viewUser,setViewUser]=useState(null);
  useEffect(()=>{
    const fetchUsers=()=>req("/api/admin/users",{},token).then(data=>{
      setUsers(Array.isArray(data)?data:(data.users||[]));
    }).catch(()=>{}).finally(()=>setLoading(false));
    fetchUsers();
    const iv=setInterval(fetchUsers,60000);
    return()=>clearInterval(iv);
  },[token]);
  const suspend=async u=>{
    try{
      await req(`/api/admin/users/${u.id}/suspend`,{method:"POST",body:JSON.stringify({suspend:!u.is_suspended})},token);
      setUsers(p=>p.map(x=>x.id===u.id?{...x,is_suspended:!u.is_suspended}:x));
      notify(u.is_suspended?"User unsuspended.":"User suspended.",true);
    }catch(e){notify(e.message,false);}
  };
  const deleteUser=async(id,name)=>{
    if(!window.confirm(`Permanently delete "${name}"? All their listings and data will be gone.`))return;
    try{await req(`/api/admin/users/${id}`,{method:"DELETE"},token);setUsers(p=>p.filter(u=>u.id!==id));notify("User deleted.",true);}catch(e){notify(e.message,false);}
  };
  const filtered=users.filter(u=>u.role!=='admin'&&(!q||u.name?.toLowerCase().includes(q.toLowerCase())||u.email?.toLowerCase().includes(q.toLowerCase())));
  return <>
    <div className="sb">
      <input className="inp" style={{flex:1,maxWidth:320}} placeholder="Search by name or email..." value={q} onChange={e=>setQ(e.target.value)}/>
      <span style={{fontSize:12,color:"var(--mut)",alignSelf:"center"}}>{filtered.length} users</span>
    </div>
    <div className="tw">{loading?<div style={{textAlign:"center",padding:40}}><Spin/></div>:
      <div className="ts"><table>
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Ads</th><th>Active</th><th>Sold</th><th>Joined</th><th>Violations</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{filtered.length===0?<tr><td colSpan={10}><div className="empty">No users</div></td></tr>:filtered.map(u=><tr key={u.id}>
          <td style={{fontWeight:600,cursor:"pointer",color:"#1428A0"}} onClick={()=>setViewUser(u)}>{u.name}</td>
          <td style={{color:"var(--mut)",fontSize:12}}>{u.email}</td>
          <td><span className={`badge ${u.role==="seller"?"bg":"bm"}`}>{u.role}</span></td>
          <td style={{fontWeight:700,textAlign:"center"}}>{u.listing_count||0}</td>
          <td style={{color:"#16a34a",fontWeight:600,textAlign:"center"}}>{u.active_listings||0}</td>
          <td style={{color:"var(--gold)",fontWeight:600,textAlign:"center"}}>{u.sold_listings||0}</td>
          <td style={{color:"var(--mut)",fontSize:12}}>{ago(u.created_at)}</td>
          <td style={{color:u.violation_count>0?"var(--red)":"var(--mut)",textAlign:"center"}}>{u.violation_count||0}</td>
          <td><span className={`badge ${u.is_suspended?"br2":"bg"}`}>{u.is_suspended?"Suspended":"Active"}</span></td>
          <td><div style={{display:"flex",gap:5}}>
            <button className="btn bs sm" onClick={()=>setViewUser(u)}>Manage</button>
            <button className={`btn sm ${u.is_suspended?"bp":"by"}`} onClick={()=>suspend(u)}>{u.is_suspended?"Unsuspend":"Suspend"}</button>
            <button className="btn br sm" onClick={()=>deleteUser(u.id,u.name)}>Delete</button>
          </div></td>
        </tr>)}</tbody>
      </table></div>}
    </div>
    {viewUser&&<UserProfileModal user={viewUser} token={token} notify={notify} onClose={()=>setViewUser(null)} onUpdated={updated=>{setUsers(p=>p.map(u=>u.id===updated.id?{...u,...updated}:u));setViewUser(updated);}}/>}
  </>;
}

function Listings({token,notify}){
  const [listings,setListings]=useState([]);const [loading,setLoading]=useState(true);const [q,setQ]=useState("");const [sf,setSf]=useState("");
  const [viewListing,setViewListing]=useState(null);
  const [markSoldListing,setMarkSoldListing]=useState(null); // listing to mark sold
  const [soldChannel,setSoldChannel]=useState("platform");
  const [markingSold,setMarkingSold]=useState(false);
  const [discountListing,setDiscountListing]=useState(null);
  const [discountAmount,setDiscountAmount]=useState("");
  const [applyingDiscount,setApplyingDiscount]=useState(false);

  const load=useCallback(()=>{
    setLoading(true);
    const p=new URLSearchParams();
    // Default to excluding 'sold' unless specifically selected
    if(sf){
      p.set("status",sf);
    } else {
      // When no status filter, exclude sold listings (they have their own section)
      p.set("status","active");
    }
    if(q)p.set("search",q);
    req(`/api/admin/listings?${p}`,{},token).then(d=>setListings(d.listings||[])).catch(()=>{}).finally(()=>setLoading(false));
  },[token,q,sf]);
  useEffect(()=>{load();},[load]);

  const updStatus=async(id,status)=>{try{await req(`/api/admin/listings/${id}`,{method:"PATCH",body:JSON.stringify({status})},token);setListings(p=>p.map(l=>l.id===id?{...l,status}:l));notify(`Status set to "${status}".`,true);}catch(e){notify(e.message,false);}};
  const del=async id=>{if(!window.confirm("Permanently delete this listing?"))return;try{await req(`/api/admin/listings/${id}`,{method:"DELETE"},token);setListings(p=>p.filter(l=>l.id!==id));notify("Deleted.",true);}catch(e){notify(e.message,false);}};
  const restoreListing=async id=>{try{await req(`/api/admin/listings/${id}/restore`,{method:"POST"},token);setListings(p=>p.map(l=>l.id===id?{...l,status:"active"}:l));notify("Listing restored to active.",true);}catch(e){notify(e.message,false);}};

  const applyDiscount=async()=>{
    const amt=parseInt(discountAmount);
    if(isNaN(amt)||amt<0||amt>250){notify("Enter an amount between 0 and 250.",false);return;}
    setApplyingDiscount(true);
    try{
      await req(`/api/admin/listings/${discountListing.id}/discount`,{method:"POST",body:JSON.stringify({discount_amount:amt})},token);
      setListings(p=>p.map(l=>l.id===discountListing.id?{...l,unlock_discount:amt}:l));
      notify(amt>=250?"Free unlock granted — seller notified.":`KSh ${amt} discount applied — seller notified.`,true);
      setDiscountListing(null);setDiscountAmount("");
    }catch(e){notify(e.message,false);}
    setApplyingDiscount(false);
  };

  const confirmMarkSold=async()=>{
    if(!markSoldListing)return;
    setMarkingSold(true);
    try{
      await req(`/api/admin/listings/${markSoldListing.id}/mark-sold`,{method:"POST",body:JSON.stringify({sold_channel:soldChannel})},token);
      setListings(p=>p.map(l=>l.id===markSoldListing.id?{...l,status:"sold"}:l));
      notify(`"${markSoldListing.title}" marked as sold.`,true);
      setMarkSoldListing(null);
    }catch(e){notify(e.message,false);}
    finally{setMarkingSold(false);}
  };

  const sc=s=>({active:"bg",sold:"by2",locked:"bb2",deleted:"br2",archived:"by2",flagged:"br2"}[s]||"bm");

  return <>
    <div className="sb">
      <input className="inp" style={{flex:1,maxWidth:260}} placeholder="Search listings..." value={q} onChange={e=>setQ(e.target.value)}/>
      <select className="inp" style={{width:160}} value={sf} onChange={e=>setSf(e.target.value)}><option value="">Active Listings</option><option value="active">Active</option><option value="locked">Locked</option><option value="archived">Archived</option><option value="flagged">Flagged</option><option value="deleted">Deleted</option><option value="all">All (including Sold)</option></select>
      <span style={{fontSize:12,color:"var(--mut)",alignSelf:"center"}}>{listings.length} listings</span>
    </div>
    <div className="tw">{loading?<div style={{textAlign:"center",padding:40}}><Spin/></div>:
      <div className="ts"><table>
        <thead><tr><th>Title</th><th>Seller</th><th>Price</th><th>Category</th><th>Status</th><th>Flags</th><th>Posted</th><th>Actions</th></tr></thead>
        <tbody>{listings.length===0?<tr><td colSpan={8}><div className="empty">No listings found</div></td></tr>:listings.map(l=><tr key={l.id}>
          <td style={{fontWeight:600,maxWidth:160}}>
            <div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",cursor:"pointer",color:"#1428A0"}} onClick={()=>setViewListing(l)} title="Click to view details">{l.title}</div>
          </td>
          <td style={{fontSize:12,color:"#636363"}}>{l.seller_name}</td>
          <td style={{color:"#1428A0",fontWeight:700}}>{fmtKES(l.price)}</td>
          <td style={{fontSize:12,color:"#636363"}}>{l.category}</td>
          <td><span className={`badge ${sc(l.status)}`}>{l.status}</span></td>
          <td>{parseInt(l.pending_reports||0)>0&&<span className="badge br2">{l.pending_reports} report{l.pending_reports>1?"s":""}</span>}</td>
          <td style={{fontSize:11,color:"#636363"}}>{ago(l.created_at)}</td>
          <td><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            <button className="btn bs sm" onClick={()=>setViewListing(l)}>View</button>
            {l.status!=="active"&&<button className="btn bp sm" onClick={()=>updStatus(l.id,"active")}>Activate</button>}
            {(l.status==="archived"||l.status==="flagged")&&<button className="btn bp sm" onClick={()=>restoreListing(l.id)}>↩ Restore</button>}
            {(l.status==="active"||l.status==="locked")&&<button className="btn by sm" onClick={()=>{setSoldChannel("platform");setMarkSoldListing(l);}}>Mark Sold</button>}
            {(l.status==="active"||l.status==="locked")&&<button className="btn bb sm" onClick={()=>{setDiscountListing(l);setDiscountAmount(l.unlock_discount>0?String(l.unlock_discount):"");}} title="Grant unlock discount or free unlock">{l.unlock_discount>0?`Discount: -${l.unlock_discount}`:"Discount"}</button>}
            <button className="btn br sm" onClick={()=>del(l.id)}>Delete</button>
          </div></td>
        </tr>)}</tbody>
      </table></div>}
    </div>

    {/* Mark as Sold modal */}
    {markSoldListing&&<Modal title="Mark Listing as Sold" onClose={()=>setMarkSoldListing(null)}>
      <div style={{marginBottom:16}}>
        <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>{markSoldListing.title}</div>
        <div style={{fontSize:13,color:"#636363"}}>{fmtKES(markSoldListing.price)} · {markSoldListing.category} · {markSoldListing.seller_name}</div>
      </div>
      <div style={{marginBottom:20}}>
        <div className="lbl" style={{marginBottom:8}}>Where was this item sold? <span style={{color:"#C03030"}}>*</span></div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[
            {val:"platform",label:"Via Weka Soko",desc:"Buyer and seller connected through the platform"},
            {val:"outside",label:"Outside the platform",desc:"Seller sold independently, not through Weka Soko"},
          ].map(opt=>(
            <div key={opt.val} onClick={()=>setSoldChannel(opt.val)}
              style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 14px",border:`2px solid ${soldChannel===opt.val?"#1428A0":"var(--border)"}`,borderRadius:"var(--rs)",cursor:"pointer",background:soldChannel===opt.val?"rgba(20,40,160,.04)":"#fff",transition:"all .15s"}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13,color:soldChannel===opt.val?"#1428A0":"var(--txt)"}}>{opt.label}</div>
                <div style={{fontSize:12,color:"var(--mut)",marginTop:3}}>{opt.desc}</div>
              </div>
              <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${soldChannel===opt.val?"#1428A0":"#ADADAD"}`,background:soldChannel===opt.val?"#1428A0":"transparent",flexShrink:0,marginTop:3,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {soldChannel===opt.val&&<div style={{width:8,height:8,borderRadius:"50%",background:"#fff"}}/>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:"rgba(192,48,48,.04)",border:"1px solid rgba(192,48,48,.15)",borderRadius:"var(--rs)",padding:"10px 13px",fontSize:12,color:"#7f1d1d",marginBottom:16}}>
        This action cannot be undone. The listing will be permanently marked as <strong>Sold</strong> and the seller will be notified.
      </div>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
        <button className="btn bs" onClick={()=>setMarkSoldListing(null)}>Cancel</button>
        <button className="btn bp" onClick={confirmMarkSold} disabled={markingSold}>
          {markingSold?<Spin/>:"Confirm — Mark as Sold"}
        </button>
      </div>
    </Modal>}

    {viewListing&&<ListingDetailModal
      listing={viewListing}
      token={token}
      notify={notify}
      onClose={()=>setViewListing(null)}
      onUpdated={updated=>{setListings(p=>p.map(l=>l.id===updated.id?updated:l));setViewListing(updated);}}
    />}

    {discountListing&&<div className="modal-ov" onClick={e=>{if(e.target===e.currentTarget){setDiscountListing(null);setDiscountAmount("");}}}>
      <div className="modal" style={{maxWidth:440}}>
        <div className="mh"><span style={{fontWeight:700}}>Grant Unlock Discount</span><button className="bgh" onClick={()=>{setDiscountListing(null);setDiscountAmount("");}} style={{fontSize:20,background:"none",border:"none",cursor:"pointer",color:"#636363"}}>×</button></div>
        <div className="mb">
          <div style={{fontWeight:700,marginBottom:4}}>{discountListing.title}</div>
          <div style={{fontSize:12,color:"var(--mut)",marginBottom:20}}>Seller: {discountListing.seller_name} · Current unlock fee: KSh {Math.max(0,250-(discountListing.unlock_discount||0))}</div>
          <label className="lbl">Discount Amount (KSh)</label>
          <input className="inp" type="number" min={0} max={250} value={discountAmount} onChange={e=>setDiscountAmount(e.target.value)} placeholder="e.g. 100" style={{marginBottom:8}}/>
          <div style={{fontSize:12,color:"var(--mut)",marginBottom:16}}>
            {discountAmount>=250||discountAmount==="250"
              ?<span style={{color:"#15803d",fontWeight:700}}>FREE unlock — seller pays KSh 0</span>
              :discountAmount>0
              ?<span>Seller will pay <strong>KSh {Math.max(0,250-parseInt(discountAmount||0))}</strong> (was KSh 250)</span>
              :"Enter 0–250. Enter 250 for a fully free unlock."
            }
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
            {[50,100,150,200,250].map(v=><button key={v} className="btn bb sm" onClick={()=>setDiscountAmount(String(v))}>{v===250?"FREE":"-"+v}</button>)}
          </div>
          <div style={{background:"rgba(20,40,160,.04)",border:"1px solid rgba(20,40,160,.2)",padding:"10px 13px",fontSize:12,color:"#1428A0",marginBottom:16}}>
            The seller will receive an in-app notification and email with the new price.
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button className="btn bs" onClick={()=>{setDiscountListing(null);setDiscountAmount("");}}>Cancel</button>
            <button className="btn bp" onClick={applyDiscount} disabled={applyingDiscount||discountAmount===""}>
              {applyingDiscount?<span className="spin"/>:null} Apply Discount
            </button>
          </div>
        </div>
      </div>
    </div>}
  </>;
}

function Violations({token,notify}){
  const [violations,setViolations]=useState([]);const [loading,setLoading]=useState(true);
  useEffect(()=>{req("/api/admin/violations?reviewed=false",{},token).then(setViolations).catch(()=>{}).finally(()=>setLoading(false));},[token]);
  const review=async(id,action)=>{try{await req(`/api/admin/violations/${id}/review`,{method:"POST",body:JSON.stringify({action})},token);setViolations(p=>p.filter(v=>v.id!==id));notify(`Action: ${action}.`,true);}catch(e){notify(e.message,false);}};
  return <>
    <div style={{background:"rgba(196,154,0,.06)",border:"1px solid rgba(196,154,0,.2)",borderRadius:"var(--rs)",padding:"10px 14px",fontSize:12,color:"var(--gold)",marginBottom:16}}>{violations.length} unreviewed violation{violations.length!==1?"s":""}</div>
    <div className="tw">{loading?<div style={{textAlign:"center",padding:40}}><Spin/></div>:violations.length===0?<div className="empty">No unreviewed violations</div>:
      <div className="ts"><table>
        <thead><tr><th>User</th><th>Severity</th><th>Listing</th><th>Reason</th><th>Time</th><th>Actions</th></tr></thead>
        <tbody>{violations.map(v=><tr key={v.id}>
          <td><div style={{fontWeight:600}}>{v.user_name}</div><div style={{fontSize:11,color:"var(--mut)"}}>{v.user_email}</div></td>
          <td><span className={`badge ${v.severity==="warning"?"by2":v.severity==="flagged"?"bb2":"br2"}`}>{v.severity}</span></td>
          <td style={{fontSize:12,color:"var(--mut)",maxWidth:150}}>{v.listing_title||"—"}</td>
          <td style={{fontSize:12,color:"var(--mut)",maxWidth:180}}>{v.reason}</td>
          <td style={{fontSize:11,color:"var(--mut)"}}>{ago(v.created_at)}</td>
          <td><div style={{display:"flex",gap:5}}><button className="btn bp sm" onClick={()=>review(v.id,"dismiss")}>Dismiss</button><button className="btn by sm" onClick={()=>review(v.id,"warn")}>Warn</button><button className="btn br sm" onClick={()=>review(v.id,"suspend")}>Suspend</button></div></td>
        </tr>)}</tbody>
      </table></div>}
    </div>
  </>;
}

function Escrow({token,notify}){
  const [escrows,setEscrows]=useState([]);const [disputes,setDisputes]=useState([]);const [loading,setLoading]=useState(true);const [tab,setTab]=useState("escrows");
  useEffect(()=>{Promise.all([req("/api/admin/escrows",{},token),req("/api/admin/disputes",{},token)]).then(([e,d])=>{setEscrows(e);setDisputes(d);}).catch(()=>{}).finally(()=>setLoading(false));},[token]);
  const escrowAction=async(id,action)=>{try{await req(`/api/admin/escrows/${id}/${action}`,{method:"POST"},token);setEscrows(p=>p.filter(e=>e.id!==id));notify(`Escrow ${action}d.`,true);}catch(e){notify(e.message,false);}};
  const resolveDispute=async(id,release_to)=>{try{await req(`/api/admin/disputes/${id}/resolve`,{method:"POST",body:JSON.stringify({resolution:`Admin resolved — funds sent to ${release_to}`,release_to})},token);setDisputes(p=>p.filter(d=>d.id!==id));notify("Dispute resolved.",true);}catch(e){notify(e.message,false);}};
  const sc=s=>({holding:"by2",released:"bg",refunded:"bb2",disputed:"br2"}[s]||"bm");
  return <>
    <div className="tab-row">
      <div className={`tab${tab==="escrows"?" on":""}`} onClick={()=>setTab("escrows")}>Escrows ({escrows.filter(e=>e.status==="holding").length} holding)</div>
      <div className={`tab${tab==="disputes"?" on":""}`} onClick={()=>setTab("disputes")}>Disputes ({disputes.filter(d=>d.status==="open").length} open)</div>
    </div>
    {loading?<div style={{textAlign:"center",padding:40}}><Spin/></div>:tab==="escrows"?(
      <div className="tw">{escrows.length===0?<div className="empty">No escrows</div>:
        <div className="ts"><table>
          <thead><tr><th>Listing</th><th>Buyer</th><th>Seller</th><th>Amount</th><th>Status</th><th>Approved</th><th>Actions</th></tr></thead>
          <tbody>{escrows.map(e=><tr key={e.id}>
            <td style={{maxWidth:150,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.listing_title}</td>
            <td style={{fontSize:12}}>{e.buyer_name}</td><td style={{fontSize:12}}>{e.seller_name}</td>
            <td style={{color:"var(--accent)",fontWeight:700}}>{fmtKES(e.total_amount)}</td>
            <td><span className={`badge ${sc(e.status)}`}>{e.status}</span></td>
            <td><span className={`badge ${e.admin_approved?"bg":"bm"}`}>{e.admin_approved?"Yes":"Pending"}</span></td>
            <td><div style={{display:"flex",gap:5}}>
              {!e.admin_approved&&<button className="btn bp sm" onClick={()=>escrowAction(e.id,"approve")}>Approve</button>}
              {e.status==="holding"&&<button className="btn by sm" onClick={()=>escrowAction(e.id,"release")}>Release</button>}
              {e.status==="holding"&&<button className="btn br sm" onClick={()=>escrowAction(e.id,"refund")}>Refund</button>}
            </div></td>
          </tr>)}</tbody>
        </table></div>}
      </div>
    ):(
      <div className="tw">{disputes.length===0?<div className="empty">No open disputes</div>:
        <div className="ts"><table>
          <thead><tr><th>Listing</th><th>Raised By</th><th>Reason</th><th>Amount</th><th>Actions</th></tr></thead>
          <tbody>{disputes.map(d=><tr key={d.id}>
            <td>{d.listing_title}</td><td style={{fontSize:12}}>{d.raised_by_name}</td>
            <td style={{fontSize:12,color:"var(--mut)",maxWidth:180}}>{d.reason}</td>
            <td style={{color:"var(--accent)",fontWeight:700}}>{fmtKES(d.item_amount)}</td>
            <td><div style={{display:"flex",gap:5}}><button className="btn bp sm" onClick={()=>resolveDispute(d.id,"seller")}>→ Seller</button><button className="btn bb sm" onClick={()=>resolveDispute(d.id,"buyer")}>→ Buyer</button></div></td>
          </tr>)}</tbody>
        </table></div>}
      </div>
    )}
  </>;
}

// ── SOLD LISTINGS ─────────────────────────────────────────────────────────────
function SoldListings({token}){
  const [items,setItems]=useState([]);
  const [loading,setLoading]=useState(true);
  const [pg,setPg]=useState(1);
  const [total,setTotal]=useState(0);
  const PER=30;

  useEffect(()=>{
    setLoading(true);
    req(`/api/listings/admin/sold?page=${pg}&limit=${PER}`,{},token)
      .then(d=>{setItems(d.listings||[]);setTotal(d.total||0);})
      .catch(()=>{}).finally(()=>setLoading(false));
  },[pg,token]);

  const fmtDate=ts=>ts?new Date(ts).toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"}):"—";
  const duration=(created,sold)=>{
    if(!created||!sold)return"—";
    const days=Math.round((new Date(sold)-new Date(created))/86400000);
    if(days===0)return"Same day";
    if(days===1)return"1 day";
    if(days<7)return`${days} days`;
    if(days<30)return`${Math.floor(days/7)}w`;
    return`${Math.floor(days/30)}mo`;
  };

  return <>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
      <div style={{fontSize:13,color:"#636363",fontWeight:600}}>{total} sold listing{total!==1?"s":""}</div>
    </div>
    <div className="tw">
      {loading?<div style={{textAlign:"center",padding:40}}><Spin/></div>:
      items.length===0?<div className="empty">No sold listings yet</div>:
      <div className="ts"><table>
        <thead><tr>
          <th>Item</th><th>Price</th><th>Category</th>
          <th>Listed</th><th>Sold</th><th>Time to Sell</th>
          <th>Channel</th><th>Seller</th>
        </tr></thead>
        <tbody>{items.map(l=>{
          const photo=Array.isArray(l.photos)?l.photos[0]:null;
          return <tr key={l.id}>
            <td>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:40,height:32,background:"#F4F4F4",overflow:"hidden",flexShrink:0}}>
                  {photo&&<img src={typeof photo==="string"?photo:photo?.url||photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
                </div>
                <div style={{fontWeight:600,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:160}}>{l.title}</div>
              </div>
            </td>
            <td style={{fontWeight:700,color:"#1428A0"}}>{fmtKES(l.price)}</td>
            <td><span className="badge bm" style={{fontSize:10}}>{l.category}</span></td>
            <td style={{fontSize:12,color:"#636363",whiteSpace:"nowrap"}}>{fmtDate(l.created_at)}</td>
            <td style={{fontSize:12,color:"#1428A0",fontWeight:600,whiteSpace:"nowrap"}}>{fmtDate(l.sold_at)}</td>
            <td style={{fontSize:12,fontWeight:700}}>{duration(l.created_at,l.sold_at)}</td>
            <td>{l.sold_channel
              ?<span className={`badge ${l.sold_channel==="platform"?"bg":"by2"}`} style={{fontSize:10}}>
                {l.sold_channel==="platform"?"Via WekaSoko":"Elsewhere"}
              </span>
              :<span style={{fontSize:11,color:"#AEAEB2"}}>—</span>}
            </td>
            <td style={{fontSize:12,color:"#636363"}}>{l.seller_name||"—"}</td>
          </tr>;
        })}</tbody>
      </table></div>}
    </div>
    {Math.ceil(total/PER)>1&&<div style={{display:"flex",gap:8,justifyContent:"center",marginTop:16}}>
      {pg>1&&<button className="btn bs sm" onClick={()=>setPg(p=>p-1)}>← Prev</button>}
      <span style={{padding:"6px 12px",fontSize:12,color:"#636363"}}>Page {pg} of {Math.ceil(total/PER)}</span>
      {pg<Math.ceil(total/PER)&&<button className="btn bs sm" onClick={()=>setPg(p=>p+1)}>Next →</button>}
    </div>}
  </>;
}

// ── BUYER REQUESTS ────────────────────────────────────────────────────────────
function BuyerRequests({token,notify}){
  const [items,setItems]=useState([]);
  const [loading,setLoading]=useState(true);
  const [total,setTotal]=useState(0);
  const [filter,setFilter]=useState("all");
  const [q,setQ]=useState("");
  const [selected,setSelected]=useState(null);
  const [pitches,setPitches]=useState([]);
  const [pitchLoading,setPitchLoading]=useState(false);
  const [deleting,setDeleting]=useState(false);
  const [statusSaving,setStatusSaving]=useState(false);

  const load=()=>{
    setLoading(true);
    const params=new URLSearchParams({limit:100});
    if(filter!=="all")params.set("status",filter);
    req(`/api/admin/requests?${params}`,{},token)
      .then(d=>{setItems(d.requests||[]);setTotal(d.total||0);})
      .catch(()=>{}).finally(()=>setLoading(false));
  };
  useEffect(()=>{load();},[filter,token]);

  const loadPitches=async(requestId)=>{
    setPitchLoading(true);
    try{const d=await req(`/api/admin/requests/${requestId}/pitches`,{},token);setPitches(d.pitches||[]);}
    catch(e){setPitches([]);}
    finally{setPitchLoading(false);}
  };

  const openDetail=r=>{setSelected(r);setPitches([]);loadPitches(r.id);};

  const changeStatus=async(id,status)=>{
    setStatusSaving(true);
    try{
      await req(`/api/admin/requests/${id}/status`,{method:"PATCH",body:JSON.stringify({status})},token);
      setItems(p=>p.map(r=>r.id===id?{...r,status}:r));
      if(selected?.id===id)setSelected(p=>({...p,status}));
      notify(`Request ${status}.`,true);
    }catch(e){notify(e.message,false);}
    finally{setStatusSaving(false);}
  };

  const approveRequest=async(id)=>{
    setStatusSaving(true);
    try{
      await req(`/api/admin/requests/${id}/approve`,{method:"POST"},token);
      setItems(p=>p.map(r=>r.id===id?{...r,status:"active"}:r));
      if(selected?.id===id)setSelected(p=>({...p,status:"active"}));
      notify("Request approved and now live.",true);
    }catch(e){notify(e.message,false);}
    finally{setStatusSaving(false);}
  };

  const rejectRequest=async(id)=>{
    const reason=window.prompt("Rejection reason (optional):");
    if(reason===null)return;
    setStatusSaving(true);
    try{
      await req(`/api/admin/requests/${id}/reject`,{method:"POST",body:JSON.stringify({reason})},token);
      setItems(p=>p.map(r=>r.id===id?{...r,status:"rejected"}:r));
      if(selected?.id===id)setSelected(p=>({...p,status:"rejected"}));
      notify("Request rejected.",true);
    }catch(e){notify(e.message,false);}
    finally{setStatusSaving(false);}
  };

  const deleteRequest=async(id)=>{
    if(!window.confirm("Permanently delete this buyer request and all its pitches?"))return;
    setDeleting(true);
    try{
      await req(`/api/admin/requests/${id}`,{method:"DELETE"},token);
      setItems(p=>p.filter(r=>r.id!==id));
      setTotal(t=>t-1);
      setSelected(null);
      notify("Request deleted.",true);
    }catch(e){notify(e.message,false);}
    finally{setDeleting(false);}
  };

  const fmtDate=ts=>ts?new Date(ts).toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"}):"-";
  const sc=s=>({active:"bg2",closed:"bm",archived:"by2",expired:"br2",pending_review:"bb2",rejected:"br2"}[s]||"bm");
  const filtered=items.filter(r=>!q||r.title?.toLowerCase().includes(q.toLowerCase())||r.description?.toLowerCase().includes(q.toLowerCase())||r.requester_anon?.toLowerCase().includes(q.toLowerCase()));

  return <>
    <div className="sb" style={{marginBottom:16}}>
      <input className="inp" style={{flex:1,maxWidth:280}} placeholder="Search requests..." value={q} onChange={e=>setQ(e.target.value)}/>
      <select className="inp" style={{width:160}} value={filter} onChange={e=>setFilter(e.target.value)}>
        <option value="all">All Statuses</option>
        <option value="pending_review">Pending Review</option>
        <option value="active">Active</option>
        <option value="closed">Closed</option>
        <option value="archived">Archived</option>
        <option value="expired">Expired</option>
        <option value="rejected">Rejected</option>
      </select>
      <span style={{fontSize:12,color:"#636363",alignSelf:"center"}}>{total} request{total!==1?"s":""}</span>
    </div>
    <div className="tw">
      {loading?<div style={{textAlign:"center",padding:40}}><Spin/></div>:
      filtered.length===0?<div className="empty">No buyer requests found</div>:
      <div className="ts"><table>
        <thead><tr>
          <th>Request</th><th>Budget</th><th>County</th><th>Pitches</th><th>Status</th><th>Posted</th><th>Actions</th>
        </tr></thead>
        <tbody>{filtered.map(r=><tr key={r.id}>
          <td>
            <div style={{fontWeight:600,fontSize:13,marginBottom:3,cursor:"pointer",color:"#1428A0"}} onClick={()=>openDetail(r)}>{r.title}</div>
            <div style={{fontSize:11,color:"#636363",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:260}}>
              {r.description?.slice(0,80)}{r.description?.length>80?"...":""}
            </div>
            <div style={{fontSize:11,color:"#ADADAD",marginTop:2}}>by {r.requester_anon||"Anonymous"}</div>
          </td>
          <td style={{fontWeight:700,color:"#1428A0"}}>{r.budget?fmtKES(r.budget):"—"}</td>
          <td style={{fontSize:12,color:"#636363"}}>{r.county||"Any"}</td>
          <td style={{textAlign:"center"}}>
            <span className={`badge ${parseInt(r.pitch_count)>0?"bg":"bm"}`} style={{fontSize:11}}>{r.pitch_count||0}</span>
          </td>
          <td><span className={`badge ${sc(r.status)}`} style={{fontSize:10}}>{r.status}</span></td>
          <td style={{fontSize:12,color:"#636363",whiteSpace:"nowrap"}}>{fmtDate(r.created_at)}</td>
          <td><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            <button className="btn bs sm" onClick={()=>openDetail(r)}>View</button>
            {r.status==="pending_review"&&<button className="btn bg sm" onClick={()=>approveRequest(r.id)} disabled={statusSaving}>Approve</button>}
            {r.status==="pending_review"&&<button className="btn br sm" onClick={()=>rejectRequest(r.id)} disabled={statusSaving}>Reject</button>}
            {r.status==="active"&&<button className="btn bm sm" onClick={()=>changeStatus(r.id,"closed")} disabled={statusSaving}>Close</button>}
            {r.status==="closed"&&<button className="btn bg2 sm" onClick={()=>changeStatus(r.id,"active")} disabled={statusSaving}>Reopen</button>}
            {r.status!=="archived"&&r.status!=="pending_review"&&<button className="btn by sm" onClick={()=>changeStatus(r.id,"archived")} disabled={statusSaving}>Archive</button>}
            <button className="btn br sm" onClick={()=>deleteRequest(r.id)} disabled={deleting}>Delete</button>
          </div></td>
        </tr>)}</tbody>
      </table></div>}
    </div>
    {selected&&<Modal title="Buyer Request Detail" onClose={()=>setSelected(null)} large>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div><div className="lbl">Title</div><div style={{fontWeight:700,fontSize:15}}>{selected.title}</div></div>
        <div><div className="lbl">Status</div><span className={`badge ${sc(selected.status)}`}>{selected.status}</span></div>
        <div><div className="lbl">Budget</div><div style={{fontWeight:700,color:"#1428A0",fontSize:18}}>{selected.budget?fmtKES(selected.budget):"Not specified"}</div></div>
        <div><div className="lbl">Location</div><div style={{fontSize:13}}>{selected.county||"Any county"}</div></div>
        <div><div className="lbl">Posted by</div><div style={{fontSize:13}}>{selected.requester_anon||"Anonymous"}</div></div>
        <div><div className="lbl">Posted on</div><div style={{fontSize:13}}>{fmtDate(selected.created_at)}</div></div>
      </div>
      <div style={{marginBottom:16}}>
        <div className="lbl">Description</div>
        <div style={{background:"#F6F6F6",padding:"12px 14px",fontSize:13,lineHeight:1.8,whiteSpace:"pre-wrap"}}>{selected.description}</div>
      </div>
      <div style={{marginBottom:16}}>
        <div style={{fontWeight:700,fontSize:13,marginBottom:10}}>Seller Pitches ({pitches.length})</div>
        {pitchLoading?<div style={{textAlign:"center",padding:20}}><Spin/></div>:
        pitches.length===0?<div style={{fontSize:13,color:"#636363",padding:"10px 0"}}>No pitches submitted yet</div>:
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {pitches.map(p=><div key={p.id} style={{background:"#F6F6F6",padding:"12px 14px",border:"1px solid #E6E6E6"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontWeight:600,fontSize:13}}>{p.seller_anon||"Seller"}</span>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                {p.offered_price&&<span style={{fontWeight:700,color:"#1428A0",fontSize:13}}>{fmtKES(p.offered_price)}</span>}
                <span className={`badge ${p.status==="accepted"?"bg2":p.status==="rejected"?"br2":"bm"}`} style={{fontSize:10}}>{p.status}</span>
              </div>
            </div>
            <div style={{fontSize:12,color:"#535353",lineHeight:1.7}}>{p.message}</div>
            <div style={{fontSize:11,color:"#ADADAD",marginTop:4}}>{fmtDate(p.created_at)}</div>
          </div>)}
        </div>}
      </div>
      <div style={{borderTop:"1px solid #E6E6E6",paddingTop:14,display:"flex",gap:8,flexWrap:"wrap"}}>
        {selected.status==="active"&&<button className="btn bs" onClick={()=>changeStatus(selected.id,"closed")} disabled={statusSaving}>{statusSaving?<Spin/>:"Close Request"}</button>}
        {selected.status==="closed"&&<button className="btn bg2" onClick={()=>changeStatus(selected.id,"active")} disabled={statusSaving}>{statusSaving?<Spin/>:"Reopen Request"}</button>}
        {selected.status!=="archived"&&<button className="btn by" onClick={()=>changeStatus(selected.id,"archived")} disabled={statusSaving}>{statusSaving?<Spin/>:"Archive"}</button>}
        <button className="btn br" onClick={()=>deleteRequest(selected.id)} disabled={deleting}>{deleting?<Spin/>:"Delete Request"}</button>
      </div>
    </Modal>}
  </>;
}
function Payments({token}){
  const [payments,setPayments]=useState([]);const [loading,setLoading]=useState(true);const [q,setQ]=useState("");
  useEffect(()=>{req("/api/admin/payments",{},token).then(setPayments).catch(()=>{}).finally(()=>setLoading(false));},[token]);
  const filtered=payments.filter(p=>!q||p.payer_name?.toLowerCase().includes(q.toLowerCase())||p.mpesa_receipt?.toLowerCase().includes(q.toLowerCase()));
  const sc=s=>({confirmed:"bg",pending:"by2",failed:"br2",refunded:"bb2"}[s]||"bm");
  const total=filtered.filter(p=>p.status==="confirmed").reduce((a,p)=>a+parseFloat(p.amount_kes||0),0);
  return <>
    <div className="sb">
      <input className="inp" style={{flex:1,maxWidth:300}} placeholder="Search by name or receipt..." value={q} onChange={e=>setQ(e.target.value)}/>
      <span style={{fontSize:12,color:"var(--mut)",alignSelf:"center"}}>Total confirmed: <strong style={{color:"var(--accent)"}}>{fmtKES(total)}</strong></span>
    </div>
    <div className="tw">{loading?<div style={{textAlign:"center",padding:40}}><Spin/></div>:
      <div className="ts"><table>
        <thead><tr><th>Payer</th><th>Listing</th><th>Type</th><th>Amount</th><th>Receipt</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>{filtered.length===0?<tr><td colSpan={7}><div className="empty">No payments</div></td></tr>:filtered.map(p=><tr key={p.id}>
          <td style={{fontWeight:600}}>{p.payer_name}</td>
          <td style={{fontSize:12,color:"var(--mut)",maxWidth:150,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.listing_title}</td>
          <td><span className={`badge ${p.type==="unlock"?"bg":"bb2"}`}>{p.type}</span></td>
          <td style={{color:"var(--accent)",fontWeight:700}}>{fmtKES(p.amount_kes)}</td>
          <td style={{fontSize:11,fontFamily:"monospace",color:"var(--mut)"}}>{p.mpesa_receipt||"—"}</td>
          <td><span className={`badge ${sc(p.status)}`}>{p.status}</span></td>
          <td style={{fontSize:11,color:"var(--mut)"}}>{ago(p.created_at)}</td>
        </tr>)}</tbody>
      </table></div>}
    </div>
  </>;
}

function Vouchers({token,notify}){
  const [vouchers,setVouchers]=useState([]);const [loading,setLoading]=useState(true);const [show,setShow]=useState(false);
  const [form,setForm]=useState({type:"unlock",discount_percent:100,description:"",max_uses:50,expires_at:""});
  const sf=(k,v)=>setForm(p=>({...p,[k]:v}));
  useEffect(()=>{req("/api/admin/vouchers",{},token).then(setVouchers).catch(()=>{}).finally(()=>setLoading(false));},[token]);
  const create=async()=>{try{const v=await req("/api/admin/vouchers",{method:"POST",body:JSON.stringify({...form,discount_percent:parseInt(form.discount_percent),max_uses:parseInt(form.max_uses)})},token);setVouchers(p=>[v,...p]);setShow(false);notify(`Created: ${v.code}`,true);}catch(e){notify(e.message,false);}};
  const toggle=async v=>{try{const u=await req(`/api/admin/vouchers/${v.id}/toggle`,{method:"PATCH"},token);setVouchers(p=>p.map(x=>x.id===v.id?u:x));notify(`Voucher ${u.active?"activated":"deactivated"}.`,true);}catch(e){notify(e.message,false);}};
  return <>
    <div style={{marginBottom:20}}><button className="btn bp" onClick={()=>setShow(true)}>+ Generate Voucher</button></div>
    <div className="tw">{loading?<div style={{textAlign:"center",padding:40}}><Spin/></div>:
      <div className="ts"><table>
        <thead><tr><th>Code</th><th>Type</th><th>Discount</th><th>Used/Max</th><th>Expires</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{vouchers.length===0?<tr><td colSpan={7}><div className="empty">No vouchers yet</div></td></tr>:vouchers.map(v=><tr key={v.id}>
          <td style={{fontFamily:"monospace",fontWeight:700,color:"var(--accent)"}}>{v.code}</td>
          <td><span className="badge bm">{v.type}</span></td>
          <td style={{fontWeight:700,color:"var(--gold)"}}>{v.discount_percent}%</td>
          <td style={{color:"var(--mut)"}}>{v.uses}/{v.max_uses}</td>
          <td style={{fontSize:12,color:"var(--mut)"}}>{v.expires_at?new Date(v.expires_at).toLocaleDateString():"No expiry"}</td>
          <td><span className={`badge ${v.active?"bg":"br2"}`}>{v.active?"Active":"Inactive"}</span></td>
          <td><button className={`btn sm ${v.active?"br":"bp"}`} onClick={()=>toggle(v)}>{v.active?"Deactivate":"Activate"}</button></td>
        </tr>)}</tbody>
      </table></div>}
    </div>
    {show&&<Modal title="Generate Voucher" onClose={()=>setShow(false)} footer={<><button className="btn bs" onClick={()=>setShow(false)}>Cancel</button><button className="btn bp" onClick={create}>Generate →</button></>}>
      <FF label="Type"><select className="inp" value={form.type} onChange={e=>sf("type",e.target.value)}><option value="unlock">Unlock Fee</option><option value="escrow">Escrow Fee</option><option value="both">Both</option></select></FF>
      <FF label="Discount %"><input className="inp" type="number" min={1} max={100} value={form.discount_percent} onChange={e=>sf("discount_percent",e.target.value)}/></FF>
      <FF label="Description"><input className="inp" placeholder="e.g. Launch promo" value={form.description} onChange={e=>sf("description",e.target.value)}/></FF>
      <FF label="Max Uses"><input className="inp" type="number" min={1} value={form.max_uses} onChange={e=>sf("max_uses",e.target.value)}/></FF>
      <FF label="Expiry Date (optional)"><input className="inp" type="date" value={form.expires_at} onChange={e=>sf("expires_at",e.target.value)}/></FF>
    </Modal>}
  </>;
}

function Reports({token,notify}){
  const [reports,setReports]=useState([]);
  const [loading,setLoading]=useState(true);
  const [status,setStatus]=useState("pending");
  const [restoring,setRestoring]=useState(null);
  const load=useCallback(()=>{
    setLoading(true);
    req(`/api/admin/reports?status=${status}`,{},token).then(d=>setReports(Array.isArray(d)?d:[])).catch(()=>{}).finally(()=>setLoading(false));
  },[status,token]);
  useEffect(()=>load(),[load]);
  const resolve=async(id,action)=>{try{await req(`/api/admin/reports/${id}`,{method:"PATCH",body:JSON.stringify({action})},token);setReports(p=>p.filter(r=>r.id!==id));notify(`Report ${action}d.`,true);}catch(e){notify(e.message,false);}};
  const restore=async(listingId)=>{setRestoring(listingId);try{await req(`/api/admin/listings/${listingId}/restore`,{method:"POST"},token);notify("Listing restored to active.",true);load();}catch(e){notify(e.message,false);}finally{setRestoring(null);}};
  const REASON_LABELS={scam:"Scam",fake_item:"Fake item",wrong_price:"Wrong price",offensive:"Offensive",spam:"Spam",wrong_category:"Wrong category",already_sold:"Already sold",other:"Other"};
  return <div>
    <div style={{display:"flex",gap:8,marginBottom:20}}>
      {["pending","resolved","dismissed"].map(s=><button key={s} className={`btn ${status===s?"bp":"bs"} sm`} onClick={()=>setStatus(s)}>{s.charAt(0).toUpperCase()+s.slice(1)}</button>)}
    </div>
    {loading?<div style={{textAlign:"center",padding:40}}>Loading...</div>:reports.length===0?<div style={{textAlign:"center",padding:40,color:"var(--mut)"}}>No {status} reports.</div>:(
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {reports.map(r=><div key={r.id} className="card" style={{display:"flex",gap:14,alignItems:"flex-start"}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6,flexWrap:"wrap"}}>
              <span style={{fontWeight:700}}>{REASON_LABELS[r.reason]||r.reason}</span>
              <span className={`badge ${r.listing_status==="active"?"bg":r.listing_status==="flagged"?"by2":"br2"}`}>{r.listing_status}</span>
            </div>
            <div style={{fontWeight:600,marginBottom:4,fontSize:13}}>{r.listing_title}</div>
            {r.details&&<div style={{color:"var(--mut)",fontSize:12,marginBottom:4}}>{r.details}</div>}
            <div style={{fontSize:11,color:"var(--dim)"}}>Reported by {r.reporter_name} ({r.reporter_email}) · {new Date(r.created_at).toLocaleDateString()}</div>
          </div>
          {status==="pending"&&<div style={{display:"flex",gap:6,flexDirection:"column",flexShrink:0}}>
            <button className="btn bp sm" onClick={()=>resolve(r.id,"resolve")}>✓ Resolve</button>
            <button className="btn br sm" onClick={()=>resolve(r.id,"dismiss")}>✕ Dismiss</button>
            {r.listing_status==="flagged"&&<button className="btn by sm" onClick={()=>restore(r.listing_id)} disabled={restoring===r.listing_id}>↩ Restore</button>}
          </div>}
        </div>)}
      </div>
    )}
  </div>;
}


function AdminInvites({token,notify}){
  const [admins,setAdmins]=useState([]);
  const [loading,setLoading]=useState(true);
  const [form,setForm]=useState({name:"",email:"",admin_level:"viewer"});
  const [sending,setSending]=useState(false);
  const sf=(k,v)=>setForm(p=>({...p,[k]:v}));
  const LEVELS=[["viewer","Viewer — read-only"],["moderator","Moderator — manage listings & violations"],["manager","Manager — all except invites"],["super","Super Admin — full access"]];

  useEffect(()=>{
    req("/api/admin/admins",{},token).then(setAdmins).catch(()=>{}).finally(()=>setLoading(false));
  },[token]);

  const sendInvite=async()=>{
    if(!form.name.trim()||!form.email.trim()){notify("Name and email required",false);return;}
    setSending(true);
    try{
      const r=await req("/api/admin/invite",{method:"POST",body:JSON.stringify(form)},token);
      notify("Invite sent to "+form.email,true);
      setForm({name:"",email:"",admin_level:"viewer"});
      req("/api/admin/admins",{},token).then(setAdmins).catch(()=>{});
    }catch(e){notify(e.message,false);}
    finally{setSending(false);}
  };

  const changeLevel=async(id,admin_level)=>{
    try{await req(`/api/admin/admins/${id}/level`,{method:"PATCH",body:JSON.stringify({admin_level})},token);setAdmins(p=>p.map(a=>a.id===id?{...a,admin_level}:a));notify("Level updated",true);}
    catch(e){notify(e.message,false);}
  };

  const revokeAccess=async(id,name)=>{
    if(!window.confirm(`Revoke admin access for ${name}?`))return;
    try{await req(`/api/admin/admins/${id}`,{method:"DELETE"},token);setAdmins(p=>p.filter(a=>a.id!==id));notify("Access revoked",true);}
    catch(e){notify(e.message,false);}
  };

  return <>
    <div style={{background:"rgba(37,99,235,.06)",border:"1px solid rgba(37,99,235,.2)",borderRadius:"var(--rs)",padding:"18px 20px",marginBottom:20}}>
      <div className="lbl" style={{marginBottom:12}}>Invite Admin</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
        <FF label="Full Name"><input className="inp" placeholder="Jane Doe" value={form.name} onChange={e=>sf("name",e.target.value)}/></FF>
        <FF label="Email"><input className="inp" type="email" placeholder="jane@example.com" value={form.email} onChange={e=>sf("email",e.target.value)}/></FF>
      </div>
      <FF label="Access Level">
        <select className="inp" value={form.admin_level} onChange={e=>sf("admin_level",e.target.value)}>
          {LEVELS.map(([v,l])=><option key={v} value={v}>{l}</option>)}
        </select>
      </FF>
      <div style={{marginTop:4,padding:"10px 12px",background:"#fff",borderRadius:"var(--rs)",fontSize:12,color:"var(--mut)"}}>
        {{
          viewer:"Can view all data. Cannot make changes.",
          moderator:"Can review violations, manage listings, and view users.",
          manager:"Can do everything except invite new admins.",
          super:"Full access including inviting and revoking other admins.",
        }[form.admin_level]}
      </div>
      <button className="btn bp" style={{marginTop:12}} onClick={sendInvite} disabled={sending}>{sending?<Spin/>:"Send Invite"}</button>
    </div>

    <div className="lbl" style={{marginBottom:12}}>Current Admins ({admins.length})</div>
    {loading?<div style={{textAlign:"center",padding:40}}><Spin/></div>:
      <div className="tw"><div className="ts"><table>
        <thead><tr><th>Name</th><th>Email</th><th>Level</th><th>Joined</th><th>Actions</th></tr></thead>
        <tbody>{admins.map(a=><tr key={a.id}>
          <td style={{fontWeight:600}}>{a.name}</td>
          <td style={{fontSize:12,color:"var(--mut)"}}>{a.email}</td>
          <td>
            <select className="inp" style={{padding:"4px 8px",fontSize:12,width:"auto"}} value={a.admin_level||"viewer"} onChange={e=>changeLevel(a.id,e.target.value)}>
              {LEVELS.map(([v,l])=><option key={v} value={v}>{v}</option>)}
            </select>
          </td>
          <td style={{fontSize:12,color:"var(--mut)"}}>{ago(a.created_at)}</td>
          <td><button className="btn br sm" onClick={()=>revokeAccess(a.id,a.name)}>Revoke</button></td>
        </tr>)}</tbody>
      </table></div></div>
    }
  </>;
}

// ── Audit Log ──────────────────────────────────────────────────────────────
function AuditLog({token}){
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(true);
  const [page,setPage]=useState(1);
  const [hasMore,setHasMore]=useState(false);
  const PER=50;

  const load=async(p=1)=>{
    setLoading(true);
    try{
      const d=await req(`/api/admin/audit-log?limit=${PER}&offset=${(p-1)*PER}`,{},token);
      setRows(d.logs||[]);
      setHasMore((d.logs||[]).length===PER);
    }catch(e){console.error(e);}
    setLoading(false);
  };
  useEffect(()=>{load(page);},[page]);

  const ACTION_COLOR={listing_approved:"#15803d",listing_rejected:"#C03030",user_suspended:"#C03030",user_unsuspended:"#15803d",maintenance_on:"#92400E",maintenance_off:"#15803d",payment_confirmed:"#1428A0",broadcast:"#7C3AED"};

  return <>
    <div className="page-header"><h1 className="page-title">Audit Log</h1><button className="btn bs sm" onClick={()=>load(page)}>Refresh</button></div>
    {loading?<div className="empty"><span className="spin"/></div>:<>
      <div className="tw"><div className="ts"><table>
        <thead><tr><th>Time</th><th>Admin</th><th>Action</th><th>Target</th><th>IP</th><th>Details</th></tr></thead>
        <tbody>{rows.map(r=><tr key={r.id}>
          <td style={{whiteSpace:"nowrap",color:"var(--mut)",fontSize:11}}>{new Date(r.created_at).toLocaleString("en-KE")}</td>
          <td style={{fontSize:12}}>{r.admin_email||"—"}</td>
          <td><span className="badge" style={{background:ACTION_COLOR[r.action]?"rgba(0,0,0,.06)":"#F0F0F0",color:ACTION_COLOR[r.action]||"#636363",textTransform:"uppercase",fontSize:9}}>{r.action}</span></td>
          <td style={{fontSize:12}}>{r.target_type&&r.target_id?`${r.target_type} #${r.target_id}`:"—"}</td>
          <td style={{fontSize:11,color:"var(--mut)"}}>{r.ip||"—"}</td>
          <td style={{fontSize:11,color:"var(--mut)",maxWidth:260,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.details?JSON.stringify(r.details):""}</td>
        </tr>)}
        {rows.length===0&&<tr><td colSpan={6} className="empty">No audit entries found.</td></tr>}
        </tbody>
      </table></div></div>
      <div style={{display:"flex",gap:8,marginTop:14,justifyContent:"flex-end"}}>
        <button className="btn bs sm" disabled={page===1} onClick={()=>setPage(p=>p-1)}>Previous</button>
        <span style={{alignSelf:"center",fontSize:12,color:"var(--mut)"}}>Page {page}</span>
        <button className="btn bs sm" disabled={!hasMore} onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>
    </>}
  </>;
}

// ── Maintenance Control ────────────────────────────────────────────────────
function MaintenanceControl({token,notify}){
  const [state,setState]=useState({enabled:false,message:""});
  const [msg,setMsg]=useState("");
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);

  useEffect(()=>{
    req("/api/admin/maintenance",{},token).then(d=>{setState(d);setMsg(d.message||"");}).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  const toggle=async()=>{
    setSaving(true);
    try{
      const d=await req("/api/admin/maintenance",{method:"POST",body:JSON.stringify({enabled:!state.enabled,message:msg})},token);
      setState(d);setMsg(d.message||"");
      notify(`Maintenance mode ${d.enabled?"enabled":"disabled"}.`,!d.enabled);
    }catch(e){notify(e.message,false);}
    setSaving(false);
  };

  if(loading)return <div className="empty"><span className="spin"/></div>;

  return <>
    <div className="page-header"><h1 className="page-title">Maintenance Mode</h1></div>
    <div className="card" style={{maxWidth:560}}>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20,padding:"14px 18px",background:state.enabled?"#FEF3C7":"#F0FDF4",border:`1px solid ${state.enabled?"#F59E0B":"#86EFAC"}`,borderRadius:"var(--rs)"}}>
        <div style={{width:36,height:36,borderRadius:"50%",background:state.enabled?"#F59E0B":"#86EFAC",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg viewBox="0 0 16 16" fill="none" stroke={state.enabled?"#fff":"#15803d"} strokeWidth="2" strokeLinecap="round" width={16} height={16}>{state.enabled?<><line x1="8" y1="4" x2="8" y2="9"/><circle cx="8" cy="12" r=".5" fill="currentColor" stroke="none"/></>:<polyline points="3,8 6.5,11.5 13,5"/>}</svg>
        </div>
        <div>
          <div style={{fontWeight:700,fontSize:15,color:state.enabled?"#92400E":"#15803d"}}>{state.enabled?"Platform is in Maintenance Mode":"Platform is Live"}</div>
          <div style={{fontSize:12,color:"var(--mut)",marginTop:2}}>{state.enabled?"All non-admin API routes are returning 503.":"All routes are serving normally."}</div>
        </div>
      </div>
      <div style={{marginBottom:16}}>
        <label className="lbl">Maintenance Message (shown to users)</label>
        <textarea className="inp" rows={3} value={msg} onChange={e=>setMsg(e.target.value)} placeholder="We are performing scheduled maintenance. Back shortly."/>
      </div>
      <button className={`btn ${state.enabled?"bs":"bp"} sm`} onClick={toggle} disabled={saving}>
        {saving?<span className="spin"/>:null}
        {state.enabled?"Disable Maintenance Mode":"Enable Maintenance Mode"}
      </button>
      <div style={{fontSize:11,color:"var(--mut)",marginTop:10}}>Toggling maintenance mode takes effect within 30 seconds (cached on the server).</div>
    </div>
  </>;
}

// ── Pending Payments ───────────────────────────────────────────────────────
function PendingPayments({token,notify}){
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(true);
  const [confirming,setConfirming]=useState(null);
  const [receipt,setReceipt]=useState("");

  const load=async()=>{
    setLoading(true);
    try{const d=await req("/api/admin/payments/pending",{},token);setRows(d.payments||[]);}
    catch(e){notify(e.message,false);}
    setLoading(false);
  };
  useEffect(()=>{load();},[]);

  const confirm=async(id)=>{
    if(!receipt.trim()){notify("Enter M-Pesa receipt number",false);return;}
    try{
      await req(`/api/admin/payments/${id}/manual-confirm`,{method:"POST",body:JSON.stringify({receipt:receipt.trim()})},token);
      notify("Payment confirmed.",true);
      setConfirming(null);setReceipt("");
      load();
    }catch(e){notify(e.message,false);}
  };

  return <>
    <div className="page-header"><h1 className="page-title">Pending Payments</h1><button className="btn bs sm" onClick={load}>Refresh</button></div>
    {loading?<div className="empty"><span className="spin"/></div>:<>
      <div className="tw"><div className="ts"><table>
        <thead><tr><th>Created</th><th>User</th><th>Type</th><th>Amount</th><th>Phone</th><th>Listing</th><th>Action</th></tr></thead>
        <tbody>{rows.map(p=><tr key={p.id}>
          <td style={{fontSize:11,color:"var(--mut)",whiteSpace:"nowrap"}}>{ago(p.created_at)}</td>
          <td style={{fontSize:12}}>{p.user_name||"?"}<br/><span style={{fontSize:10,color:"var(--mut)"}}>{p.user_email}</span></td>
          <td><span className="badge bg">{p.type}</span></td>
          <td style={{fontWeight:700}}>{fmtKES(p.amount)}</td>
          <td style={{fontSize:12}}>{p.phone||"—"}</td>
          <td style={{fontSize:12,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.listing_title||"—"}</td>
          <td>
            {confirming===p.id
              ?<div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <input className="inp" style={{width:130,padding:"5px 8px",fontSize:12}} value={receipt} onChange={e=>setReceipt(e.target.value)} placeholder="Receipt no."/>
                  <button className="btn bp sm" onClick={()=>confirm(p.id)}>Confirm</button>
                  <button className="btn bgh sm" onClick={()=>{setConfirming(null);setReceipt("");}}>Cancel</button>
                </div>
              :<button className="btn bb sm" onClick={()=>{setConfirming(p.id);setReceipt("");}}>Manual Confirm</button>
            }
          </td>
        </tr>)}
        {rows.length===0&&<tr><td colSpan={7} className="empty">No pending payments.</td></tr>}
        </tbody>
      </table></div></div>
    </>}
  </>;
}

// ── Emergency Broadcast ────────────────────────────────────────────────────
function Broadcast({token,notify}){
  const [title,setTitle]=useState("");
  const [body,setBody]=useState("");
  const [type,setType]=useState("info");
  const [sending,setSending]=useState(false);
  const [history,setHistory]=useState([]);

  const TYPES=["info","warning","success","error"];

  const send=async()=>{
    if(!title.trim()||!body.trim()){notify("Title and body are required",false);return;}
    if(!window.confirm(`Send broadcast to ALL users?\n\n"${title}"`))return;
    setSending(true);
    try{
      const d=await req("/api/admin/broadcast",{method:"POST",body:JSON.stringify({title:title.trim(),body:body.trim(),type})},token);
      notify(`Broadcast sent to ${d.sent||0} users.`,true);
      setHistory(h=>[{title,body,type,sent:d.sent,at:new Date()},...h.slice(0,9)]);
      setTitle("");setBody("");setType("info");
    }catch(e){notify(e.message,false);}
    setSending(false);
  };

  const TYPE_COLOR={info:"#1428A0",warning:"#92400E",success:"#15803d",error:"#C03030"};

  return <>
    <div className="page-header"><h1 className="page-title">Emergency Broadcast</h1></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,alignItems:"start"}}>
      <div className="card">
        <div style={{marginBottom:12}}>
          <label className="lbl">Type</label>
          <select className="inp" value={type} onChange={e=>setType(e.target.value)}>
            {TYPES.map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
          </select>
        </div>
        <div style={{marginBottom:12}}>
          <label className="lbl">Title</label>
          <input className="inp" value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Platform Maintenance in 10 minutes"/>
        </div>
        <div style={{marginBottom:16}}>
          <label className="lbl">Message</label>
          <textarea className="inp" rows={4} value={body} onChange={e=>setBody(e.target.value)} placeholder="Message body shown to all users..."/>
        </div>
        <div style={{background:"#F6F6F6",border:"1px solid #E6E6E6",borderRadius:2,padding:"10px 14px",marginBottom:16,fontSize:12}}>
          <span style={{fontWeight:700,color:TYPE_COLOR[type]||"#1428A0"}}>Preview — </span>
          <strong>{title||"Title"}</strong><br/>
          <span style={{color:"var(--mut)"}}>{body||"Message body..."}</span>
        </div>
        <button className="btn bp" onClick={send} disabled={sending||!title.trim()||!body.trim()}>
          {sending?<span className="spin"/>:null} Send to All Users
        </button>
        <div style={{fontSize:11,color:"var(--mut)",marginTop:8}}>This creates an in-app notification for every user and emits a real-time socket event.</div>
      </div>
      <div>
        <div style={{fontWeight:700,fontSize:13,marginBottom:10}}>Recent Broadcasts</div>
        {history.length===0?<div style={{color:"var(--mut)",fontSize:12}}>No broadcasts sent this session.</div>
          :<div style={{display:"flex",flexDirection:"column",gap:8}}>
            {history.map((h,i)=><div key={i} style={{background:"#fff",border:"1px solid #E6E6E6",padding:"10px 14px",borderRadius:2}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <span className="badge" style={{background:TYPE_COLOR[h.type]+"22",color:TYPE_COLOR[h.type],fontSize:9}}>{h.type.toUpperCase()}</span>
                <span style={{fontSize:10,color:"var(--mut)"}}>{h.sent} users · {h.at.toLocaleTimeString("en-KE")}</span>
              </div>
              <div style={{fontWeight:700,fontSize:12}}>{h.title}</div>
              <div style={{fontSize:11,color:"var(--mut)"}}>{h.body}</div>
            </div>)}
          </div>
        }
      </div>
    </div>
  </>;
}

// ── SVG ICON COMPONENT ────────────────────────────────────────────────────────
function NavIcon({id}){
  const s={className:"nav-icon",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"};
  if(id==="overview")return<svg {...s}><rect x="1" y="9" width="3" height="6"/><rect x="6" y="6" width="3" height="9"/><rect x="11" y="2" width="3" height="13"/></svg>;
  if(id==="review")return<svg {...s}><rect x="2" y="1" width="12" height="14" rx="2"/><polyline points="5,8.5 7,10.5 11,6.5"/><line x1="5" y1="4" x2="11" y2="4"/></svg>;
  if(id==="users")return<svg {...s}><circle cx="5.5" cy="5" r="2.5"/><path d="M1 14c0-2.5 2-4.5 4.5-4.5S10 11.5 10 14"/><circle cx="12" cy="4.5" r="2"/><path d="M12 9c2 0 3 1.5 3 3"/></svg>;
  if(id==="listings")return<svg {...s}><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg>;
  if(id==="sold")return<svg {...s}><circle cx="8" cy="8" r="6"/><polyline points="5,8 7,10.5 11,6"/></svg>;
  if(id==="requests")return<svg {...s}><rect x="2" y="2" width="12" height="9" rx="2"/><path d="M5 15h6M8 11v4"/></svg>;
  if(id==="reports")return<svg {...s}><path d="M3 2.5l9 3.5-3 1.5-1.5 5L3 2.5z"/></svg>;
  if(id==="violations")return<svg {...s}><path d="M8 1.5L1.5 13.5h13L8 1.5z"/><line x1="8" y1="6.5" x2="8" y2="9.5"/><circle cx="8" cy="11.5" r=".6" fill="currentColor" stroke="none"/></svg>;
  if(id==="escrow")return<svg {...s}><path d="M8 1.5l5.5 2.5v3.5c0 3.5-2.5 5.5-5.5 6.5C5.5 13 3 11 3 7.5V4L8 1.5z"/></svg>;
  if(id==="payments")return<svg {...s}><rect x="1" y="3.5" width="14" height="9" rx="2"/><line x1="1" y1="7" x2="15" y2="7"/><line x1="4" y1="10" x2="7" y2="10"/></svg>;
  if(id==="vouchers")return<svg {...s}><rect x="1" y="4" width="14" height="8" rx="2"/><line x1="1" y1="8" x2="5" y2="8" strokeDasharray="2 2"/><line x1="11" y1="8" x2="15" y2="8" strokeDasharray="2 2"/><circle cx="8" cy="8" r="2"/></svg>;
  if(id==="admins")return<svg {...s}><circle cx="6" cy="5" r="3"/><path d="M1 14c0-2.8 2.2-5 5-5"/><path d="M11 10l1.5 1.5L15 8.5"/></svg>;
  if(id==="pending-payments")return<svg {...s}><circle cx="8" cy="8" r="6"/><polyline points="8,5 8,8 10.5,10"/></svg>;
  if(id==="broadcast")return<svg {...s}><path d="M12 4a5 5 0 010 8"/><path d="M9.5 6a2 2 0 010 4"/><line x1="7" y1="8" x2="2" y2="8"/><line x1="2" y1="6" x2="4" y2="6"/><line x1="2" y1="10" x2="4" y2="10"/></svg>;
  if(id==="maintenance")return<svg {...s}><path d="M12 3.5A3.5 3.5 0 018.5 7c-.5 0-1-.1-1.4-.3L3 11.5a1.5 1.5 0 002 2L9.3 9a3.5 3.5 0 003.3-5.8l-1.5 1.5-.7-.7L12 3.5z"/></svg>;
  if(id==="audit")return<svg {...s}><rect x="2" y="1" width="12" height="14" rx="2"/><line x1="5" y1="5" x2="11" y2="5"/><line x1="5" y1="8" x2="11" y2="8"/><line x1="5" y1="11" x2="8.5" y2="11"/></svg>;
  return<svg {...s}><circle cx="8" cy="8" r="6"/></svg>;
}

const SECTIONS=[
  {id:"overview",label:"Overview"},
  {id:"review",label:"Review Queue"},
  {id:"users",label:"Users"},
  {id:"listings",label:"Listings"},
  {id:"sold",label:"Sold Listings"},
  {id:"requests",label:"Buyer Requests"},
  {id:"reports",label:"Reports"},
  {id:"violations",label:"Violations"},
  {id:"escrow",label:"Escrow & Disputes"},
  {id:"payments",label:"Payments"},
  {id:"vouchers",label:"Vouchers"},
  {id:"admins",label:"Admin Team"},
  {id:"pending-payments",label:"Pending Payments"},
  {id:"broadcast",label:"Broadcast"},
  {id:"maintenance",label:"Maintenance"},
  {id:"audit",label:"Audit Log"},
];

export default function AdminApp(){
  const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem("ws_admin_user"));}catch{return null;}});
  const [token,setToken]=useState(()=>localStorage.getItem("ws_admin_token"));
  const [section,setSection]=useState("overview");
  const [toast,setToast]=useState(null);
  const [drawerOpen,setDrawerOpen]=useState(false);
  const [alertCount,setAlertCount]=useState(0);
  const prevCounts=useRef({review:0,reports:0,violations:0,disputes:0});
  const playSound=useAdminSound();
  const notify=useCallback((msg,ok=true)=>setToast({msg,ok,id:Date.now()}),[]);

  useEffect(()=>{let el=document.getElementById("admin-css");if(!el){el=document.createElement("style");el.id="admin-css";document.head.appendChild(el);}el.textContent=CSS;},[]);

  // Auth check on mount
  useEffect(()=>{
    if(token){
      req("/api/auth/me",{},token).then(u=>{
        if(u.role!=="admin"){localStorage.removeItem("ws_admin_token");localStorage.removeItem("ws_admin_user");setUser(null);setToken(null);}
        else{setUser(u);localStorage.setItem("ws_admin_user",JSON.stringify(u));}
      }).catch(()=>{localStorage.removeItem("ws_admin_token");localStorage.removeItem("ws_admin_user");setUser(null);setToken(null);});
    }
  },[]);

  // Request browser notification permission
  useEffect(()=>{
    if(!token||!user)return;
    if('Notification' in window&&Notification.permission==='default'){
      Notification.requestPermission().catch(()=>{});
    }
  },[token,user]);

  // Poll for new items every 30s — play sound + browser notification when counts rise
  useEffect(()=>{
    if(!token||!user)return;
    const poll=async()=>{
      try{
        const d=await req("/api/admin/stats",{},token);
        const r=d.listings?.pending_review||0;
        const rp=d.reports?.pending||0;
        const v=d.violations?.total||0;
        const dis=d.disputes?.open||0;
        const prev=prevCounts.current;
        // Only alert if we had a previous reading (not first load)
        if(prev.review>-1){
          const newReview=r>prev.review;
          const newReport=rp>prev.reports;
          const newViolation=v>prev.violations;
          const newDispute=dis>prev.disputes;
          const hasNew=newReview||newReport||newViolation||newDispute;
          const urgent=newReport||newViolation||newDispute;
          if(hasNew){
            playSound(urgent?'urgent':'alert');
            setAlertCount(c=>c+1);
            const msg=newReport?'New report filed'
              :newViolation?'New chat violation detected'
              :newDispute?'New dispute opened'
              :'New listing awaiting review';
            if('Notification' in window&&Notification.permission==='granted'){
              new Notification('Weka Soko Admin',{
                body:msg,icon:'/icon.svg',badge:'/icon.svg',
                tag:'ws-admin-alert',requireInteraction:urgent,
              });
            }
          }
        }
        prevCounts.current={review:r,reports:rp,violations:v,disputes:dis};
      }catch(e){}
    };
    // Delay first poll so we don't alert on initial load
    const t1=setTimeout(()=>{prevCounts.current={review:-1,reports:-1,violations:-1,disputes:-1};poll();},3000);
    const iv=setInterval(poll,30000);
    return()=>{clearTimeout(t1);clearInterval(iv);};
  },[token,user]);

  const handleLogin=(u,t)=>{setUser(u);setToken(t);localStorage.setItem("ws_admin_token",t);localStorage.setItem("ws_admin_user",JSON.stringify(u));};
  const logout=()=>{setUser(null);setToken(null);localStorage.removeItem("ws_admin_token");localStorage.removeItem("ws_admin_user");};

  const navigate=(id)=>{setSection(id);setDrawerOpen(false);};

  if(!user||!token)return <Login onLogin={handleLogin}/>;
  const cur=SECTIONS.find(s=>s.id===section);

  const SidebarContent=()=><>
    <div style={{padding:"20px 20px 16px",borderBottom:"1px solid var(--border)"}}>
      <WsLogo size={28}/>
    </div>
    <div style={{flex:1,overflowY:"auto",padding:"8px 0"}}>
      {SECTIONS.map(s=><div key={s.id} className={`nav-item${section===s.id?" on":""}`} onClick={()=>navigate(s.id)}>
        <NavIcon id={s.id}/><span>{s.label}</span>
      </div>)}
    </div>
    <div style={{padding:"16px 20px",borderTop:"1px solid var(--border)"}}>
      <div style={{fontSize:11,color:"var(--mut)",marginBottom:2,fontWeight:600,letterSpacing:".04em",textTransform:"uppercase"}}>Signed in as</div>
      <div style={{fontWeight:700,fontSize:13,marginBottom:10,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</div>
      <button className="btn bs sm" style={{width:"100%"}} onClick={logout}>Sign Out</button>
    </div>
  </>;

  return <>
    {/* Desktop sidebar */}
    <div className="sidebar"><SidebarContent/></div>

    {/* Mobile top bar */}
    <div className="topbar">
      <button className="hamburger" onClick={()=>setDrawerOpen(o=>!o)} aria-label="Menu">
        <span/><span/><span/>
      </button>
      <WsLogo size={22} showText={true}/>
      <div style={{position:"relative",width:36,display:"flex",alignItems:"center",justifyContent:"center"}}>
        {alertCount>0&&<div style={{width:24,height:24,borderRadius:"50%",background:"#C03030",color:"#fff",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}
          onClick={()=>setAlertCount(0)}>{alertCount>9?"9+":alertCount}</div>}
      </div>
    </div>

    {/* Mobile drawer overlay */}
    <div className={`drawer-ov${drawerOpen?" open":""}`} onClick={()=>setDrawerOpen(false)}/>
    <div className={`drawer${drawerOpen?" open":""}`}><SidebarContent/></div>

    {/* Main content */}
    <div className="main">
      <div className="page-header">
        <h1 className="page-title">{cur?.label}</h1>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {alertCount>0&&<div style={{display:"flex",alignItems:"center",gap:6,background:"rgba(192,48,48,.08)",border:"1px solid rgba(192,48,48,.2)",borderRadius:8,padding:"4px 10px",cursor:"pointer"}} onClick={()=>setAlertCount(0)}>
            <div style={{width:8,height:8,borderRadius:"50%",background:"#C03030"}}/>
            <span style={{fontSize:12,color:"#C03030",fontWeight:700}}>{alertCount} new</span>
          </div>}
          <div style={{fontSize:12,color:"var(--mut)"}}>{new Date().toLocaleDateString("en-KE",{weekday:"long",day:"numeric",month:"long"})}</div>
        </div>
      </div>
      {section==="overview"&&<Overview token={token}/>}
      {section==="review"&&<ReviewQueue token={token} notify={notify}/>}
      {section==="users"&&<Users token={token} notify={notify}/>}
      {section==="listings"&&<Listings token={token} notify={notify}/>}
      {section==="sold"&&<SoldListings token={token}/>}
      {section==="requests"&&<BuyerRequests token={token} notify={notify}/>}
      {section==="reports"&&<Reports token={token} notify={notify}/>}
      {section==="violations"&&<Violations token={token} notify={notify}/>}
      {section==="escrow"&&<Escrow token={token} notify={notify}/>}
      {section==="payments"&&<Payments token={token}/>}
      {section==="vouchers"&&<Vouchers token={token} notify={notify}/>}
      {section==="admins"&&<AdminInvites token={token} notify={notify}/>}
      {section==="pending-payments"&&<PendingPayments token={token} notify={notify}/>}
      {section==="broadcast"&&<Broadcast token={token} notify={notify}/>}
      {section==="maintenance"&&<MaintenanceControl token={token} notify={notify}/>}
      {section==="audit"&&<AuditLog token={token}/>}
    </div>
    {toast&&<Toast key={toast.id} msg={toast.msg} ok={toast.ok} onClose={()=>setToast(null)}/>}
  </>;
}
