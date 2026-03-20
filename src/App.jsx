import React,{useState,useEffect,useCallback} from "react";

const API = (process.env.REACT_APP_API_URL || "https://weka-soko-backend-production.up.railway.app").replace(/\/$/, "");

const CSS = `
@font-face{font-family:'SamsungSharpSans';font-weight:400;font-style:normal;font-display:swap;
  src:url('https://db.onlinewebfonts.com/t/339ef4168eec714f8750c1b72eea3528.woff2') format('woff2'),
      url('https://db.onlinewebfonts.com/t/339ef4168eec714f8750c1b72eea3528.woff') format('woff');}
@font-face{font-family:'SamsungSharpSans';font-weight:700;font-style:normal;font-display:swap;
  src:url('https://db.onlinewebfonts.com/t/03fe5644d1605049951f58ca7961c33f.woff2') format('woff2'),
      url('https://db.onlinewebfonts.com/t/03fe5644d1605049951f58ca7961c33f.woff') format('woff');}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#FFFFFF;--surf:#FFFFFF;--sh:#F6F6F6;--border:#E6E6E6;
  --accent:#1428A0;--accent2:#0F1F8A;--gold:#8B6400;--red:#C03030;--blue:#1428A0;
  --txt:#1D1D1D;--mut:#636363;--dim:#ADADAD;
  --r:2px;--rs:2px;--fn:'SamsungSharpSans','Helvetica Neue',Helvetica,Arial,sans-serif;
}
body{background:#F4F4F4;color:var(--txt);font-family:var(--fn);font-size:14px;line-height:1.55;min-height:100vh;-webkit-font-smoothing:antialiased;}
::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-thumb{background:#CCCCCC;}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 18px;border-radius:0;font-size:12px;font-weight:700;cursor:pointer;border:none;transition:all .14s;white-space:nowrap;font-family:var(--fn);letter-spacing:.04em;}
.btn:disabled{opacity:.4;cursor:not-allowed;}
.bp{background:#1428A0;color:#fff;border:2px solid #1428A0;}.bp:hover:not(:disabled){background:#0F1F8A;border-color:#0F1F8A;}
.bs{background:transparent;color:var(--txt);border:1.5px solid var(--txt);}.bs:hover:not(:disabled){background:var(--txt);color:#fff;}
.br{background:transparent;color:var(--red);border:1px solid var(--red);}.br:hover:not(:disabled){background:var(--red);color:#fff;}
.by{background:transparent;color:var(--gold);border:1px solid var(--gold);}.by:hover:not(:disabled){background:var(--gold);color:#fff;}
.bb{background:rgba(20,40,160,.08);color:#1428A0;border:1px solid rgba(20,40,160,.2);}.bb:hover:not(:disabled){background:rgba(20,40,160,.15);}
.bgh{background:transparent;border:none;color:var(--mut);}.bgh:hover{color:var(--txt);}
.sm{padding:6px 12px;font-size:11px;}
.inp{width:100%;padding:10px 14px;background:#fff;border:1px solid #D9D9D9;border-radius:0;color:var(--txt);font-family:var(--fn);font-size:13px;outline:none;transition:border-color .14s;}
.inp:focus{border-color:#1428A0;}
.inp::placeholder{color:#AEAEB2;}
select.inp{appearance:none;cursor:pointer;}
textarea.inp{resize:vertical;min-height:80px;}
.lbl{display:block;font-size:10px;font-weight:700;color:#636363;letter-spacing:.08em;text-transform:uppercase;margin-bottom:5px;}
.card{background:#fff;border:1px solid var(--border);border-radius:0;padding:18px 20px;}
.badge{display:inline-flex;align-items:center;padding:2px 10px;border-radius:2px;font-size:10px;font-weight:700;letter-spacing:.04em;}
.bg{background:rgba(20,40,160,.08);color:#1428A0;}
.bg2{background:rgba(22,163,74,.1);color:#15803d;}
.by2{background:rgba(139,100,0,.1);color:#8B6400;}
.br2{background:rgba(192,48,48,.1);color:var(--red);}
.bb2{background:rgba(91,155,213,.1);color:#1d6fa4;}
.bm{background:var(--sh);color:var(--mut);}
.spin{display:inline-block;width:16px;height:16px;border:2px solid #E5E5E5;border-top-color:#1428A0;border-radius:50%;animation:sp .7s linear infinite;}
@keyframes sp{to{transform:rotate(360deg)}}
.sidebar{position:fixed;left:0;top:0;bottom:0;width:220px;background:#fff;border-right:1px solid #E6E6E6;display:flex;flex-direction:column;z-index:50;}
.sidebar-logo{padding:20px 20px 16px;border-bottom:1px solid #E6E6E6;font-family:var(--fn);font-size:18px;font-weight:700;letter-spacing:-.02em;color:#1D1D1D;}
.sidebar-logo span{color:#1428A0;}
.nav-item{display:flex;align-items:center;gap:10px;padding:11px 20px;cursor:pointer;font-size:12px;font-weight:700;letter-spacing:.04em;color:#636363;transition:all .14s;border-left:3px solid transparent;}
.nav-item:hover{color:#1D1D1D;background:#F6F6F6;}
.nav-item.on{color:#1428A0;background:rgba(20,40,160,.04);border-left-color:#1428A0;}
.main{margin-left:220px;padding:32px 40px;min-height:100vh;}
.page-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;padding-bottom:16px;border-bottom:2px solid #1428A0;}
.page-title{font-size:22px;font-weight:700;letter-spacing:-.02em;color:#1D1D1D;}
.stat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px;margin-bottom:28px;}
.stat-card{background:#fff;border:1px solid #EBEBEB;border-radius:0;padding:18px 20px;}
.stat-val{font-size:28px;font-weight:700;letter-spacing:-.02em;line-height:1;}
.stat-lbl{font-size:10px;text-transform:uppercase;letter-spacing:.07em;color:#636363;margin-top:6px;}
.tw{background:#fff;border:1px solid #E6E6E6;border-radius:0;overflow:hidden;}
.ts{overflow-x:auto;}
table{width:100%;border-collapse:collapse;}
thead th{padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#636363;border-bottom:1px solid #E6E6E6;background:#F6F6F6;}
tbody tr{border-bottom:1px solid #F0F0F0;transition:background .1s;}
tbody tr:hover{background:#F9F9F9;}
tbody td{padding:11px 14px;font-size:13px;vertical-align:middle;}
.sb{display:flex;gap:10px;margin-bottom:16px;align-items:center;flex-wrap:wrap;}
.modal-ov{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(6px);}
.modal{background:#fff;border:1px solid #E0E0E0;border-radius:0;width:100%;max-width:540px;max-height:90vh;overflow-y:auto;animation:mu .18s ease;box-shadow:0 8px 40px rgba(0,0,0,.12);}
@keyframes mu{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.mh{padding:18px 24px 14px;border-bottom:1px solid #E6E6E6;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:#fff;z-index:2;}
.mb{padding:20px 24px;}
.mf{padding:12px 24px 18px;border-top:1px solid #E6E6E6;display:flex;gap:8px;justify-content:flex-end;}
.tab-row{display:flex;gap:0;border-bottom:1px solid #E5E5E5;margin-bottom:20px;overflow-x:auto;}
.tab{padding:10px 18px;border-radius:0;font-size:12px;font-weight:700;letter-spacing:.04em;cursor:pointer;color:#9E9E9E;white-space:nowrap;border-bottom:2px solid transparent;margin-bottom:-1px;background:transparent;transition:all .13s;}
.tab.on{color:#1428A0;border-bottom-color:#1428A0;}
.empty{text-align:center;padding:48px 20px;color:#9E9E9E;}
.login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#F4F4F4;}
.login-box{background:#fff;border:1px solid #E6E6E6;border-radius:0;padding:40px 36px;width:100%;max-width:400px;box-shadow:0 4px 24px rgba(0,0,0,.06);}
.alert-g{background:rgba(20,40,160,.04);border-left:3px solid #1428A0;padding:10px 14px;font-size:12px;color:#1428A0;margin-bottom:14px;}
.alert-r{background:rgba(192,48,48,.04);border-left:3px solid #C03030;padding:10px 14px;font-size:12px;color:#C03030;margin-bottom:14px;}
@media(max-width:768px){
  .sidebar{width:100%;height:52px;flex-direction:row;bottom:auto;border-right:none;border-bottom:1px solid #E6E6E6;overflow-x:auto;}
  .sidebar-logo{display:none;}
  .main{margin-left:0;margin-top:52px;padding:16px 14px;}
  .nav-item{padding:8px 12px;border-left:none;border-bottom:3px solid transparent;font-size:11px;}
  .nav-item.on{border-bottom-color:#1428A0;border-left-color:transparent;}
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

function Toast({msg,ok,onClose}){
  useEffect(()=>{const t=setTimeout(onClose,4500);return()=>clearTimeout(t);},[]);
  return <div style={{position:"fixed",bottom:24,right:24,zIndex:300,background:"#fff",border:`1px solid ${ok?"#1428A0":"#C03030"}`,borderLeft:`4px solid ${ok?"#1428A0":"#C03030"}`,borderRadius:0,padding:"13px 18px",fontSize:13,fontFamily:"var(--fn)",display:"flex",gap:10,alignItems:"center",maxWidth:360,boxShadow:"0 4px 20px rgba(0,0,0,.1)"}}><span>{ok?"✅":"❌"}</span><span style={{flex:1}}>{msg}</span><button className="btn bgh sm" style={{padding:"2px 6px"}} onClick={onClose}>✕</button></div>;
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
      <div style={{textAlign:"center",marginBottom:28,paddingBottom:20,borderBottom:"1px solid #E6E6E6"}}>
        <div style={{fontSize:24,fontWeight:700,letterSpacing:"-.02em",marginBottom:4}}>Weka<span style={{color:"#1428A0"}}>Soko</span></div>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"#636363"}}>Admin Panel</div>
      </div>
      <p style={{color:"#636363",fontSize:13,marginBottom:20}}>Sign in to manage the platform.</p>
      {err&&<div className="alert-r">{err}</div>}
      <FF label="Email"><input className="inp" type="email" placeholder="admin@wekasoko.co.ke" value={email} onChange={e=>setEmail(e.target.value)}/></FF>
      <FF label="Password"><input className="inp" type="password" placeholder="••••••••" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/></FF>
      <button className="btn bp" style={{width:"100%",marginTop:8}} onClick={submit} disabled={loading}>{loading?<Spin/>:"Sign In →"}</button>
    </div>
  </div>;
}

function Overview({token}){
  const [s,setS]=useState(null);const [loading,setLoading]=useState(true);
  useEffect(()=>{req("/api/admin/stats",{},token).then(setS).catch(()=>{}).finally(()=>setLoading(false));},[token]);
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
    {SC&&parseInt(SC.total_sold)>0&&<div style={{background:"#fff",border:"1px solid #E6E6E6",padding:"16px 20px",marginTop:16}}>
      <div style={{fontWeight:700,fontSize:13,marginBottom:12,letterSpacing:"-.01em"}}>🏷️ Sale Channel Breakdown</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
        {[
          {l:"Via Weka Soko",v:SC.sold_on_platform||0,icon:"🛒",c:"#1428A0"},
          {l:"Outside Platform",v:SC.sold_outside||0,icon:"🤝",c:"#8B6400"},
          {l:"Unknown",v:SC.sold_channel_unknown||0,icon:"❓",c:"#636363"},
        ].map(x=><div key={x.l} style={{background:"#F6F6F6",padding:"12px 14px"}}>
          <div style={{fontSize:18,marginBottom:4}}>{x.icon}</div>
          <div style={{fontSize:20,fontWeight:700,color:x.c}}>{x.v}</div>
          <div style={{fontSize:10,color:"#636363",marginTop:2,textTransform:"uppercase",letterSpacing:".06em"}}>{x.l}</div>
          <div style={{fontSize:10,color:"#AEAEB2",marginTop:1}}>{parseInt(SC.total_sold)>0?Math.round((x.v/parseInt(SC.total_sold))*100):0}% of sold</div>
        </div>)}
      </div>
    </div>}
    <div style={{background:"rgba(20,40,160,.04)",border:"1px solid rgba(20,40,160,.2)",padding:"10px 14px",fontSize:12,color:"#1428A0",marginTop:12}}>✓ Live data from Railway database. Refresh to update.</div>
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
      notify("✅ Listing updated. Seller has been notified.",true);
      onUpdated({...l,...updated,...body});
      setTab("view");
    }catch(e){notify(e.message,false);}
    finally{setSaving(false);}
  };

  const freeUnlock=async()=>{
    try{
      await req(`/api/admin/listings/${l.id}/free-unlock`,{method:"POST"},token);
      notify("🔓 Listing unlocked — seller notified.",true);
      onUpdated({...l,is_unlocked:true});
    }catch(e){notify(e.message,false);}
  };

  return <Modal title={`📦 ${l.title}`} onClose={onClose} large footer={
    <div style={{display:"flex",gap:8,width:"100%",alignItems:"center"}}>
      {!l.is_unlocked&&<button className="btn bb sm" onClick={freeUnlock}>🔓 Free Unlock</button>}
      <div style={{flex:1}}/>
      {tab==="edit"&&<><button className="btn bs sm" onClick={()=>setTab("view")}>Cancel</button><button className="btn bp sm" onClick={save} disabled={saving}>{saving?<Spin/>:"Save Changes →"}</button></>}
      {tab==="view"&&<button className="btn by sm" onClick={()=>setTab("edit")}>✏️ Edit Listing</button>}
    </div>
  }>
    <div className="tab-row" style={{marginBottom:16}}>
      <div className={`tab${tab==="view"?" on":""}`} onClick={()=>setTab("view")}>👁 View</div>
      <div className={`tab${tab==="edit"?" on":""}`} onClick={()=>setTab("edit")}>✏️ Edit</div>
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
      {photos.length===0&&<div style={{background:"var(--sh)",borderRadius:"var(--rs)",height:120,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,opacity:.3,marginBottom:14}}>📦</div>}

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

      {l.is_unlocked&&<div style={{background:"rgba(20,40,160,.06)",border:"1px solid rgba(20,40,160,.2)",borderRadius:"var(--rs)",padding:"10px 14px",fontSize:12,color:"var(--accent)"}}>
        🔓 Unlocked · Seller can see buyer contact
      </div>}
      {!l.is_unlocked&&l.locked_buyer_id&&<div style={{background:"rgba(139,100,0,.06)",border:"1px solid rgba(139,100,0,.2)",borderRadius:"var(--rs)",padding:"10px 14px",fontSize:12,color:"var(--gold)"}}>
        🔥 Buyer has locked in — seller hasn't paid to unlock yet
      </div>}

      {l.pending_reports>0&&<div style={{background:"rgba(224,80,80,.08)",border:"1px solid rgba(224,80,80,.2)",borderRadius:"var(--rs)",padding:"10px 14px",fontSize:12,color:"var(--red)",marginTop:8}}>
        🚩 {l.pending_reports} pending report{l.pending_reports>1?"s":""}
      </div>}
    </>}

    {tab==="edit"&&<>
      <div style={{background:"rgba(139,100,0,.06)",border:"1px solid rgba(139,100,0,.2)",borderRadius:"var(--rs)",padding:"10px 14px",fontSize:12,color:"var(--gold)",marginBottom:16}}>
        ⚠️ Any changes you save will be sent as a notification to the seller.
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
  useEffect(()=>{load();},[token]);

  const approve=async id=>{
    setSubmitting(true);
    try{
      await req(`/api/admin/moderation/${id}/approve`,{method:"POST"},token);
      setListings(p=>p.filter(l=>l.id!==id));
      setSelected(null);
      notify("✅ Listing approved and live!",true);
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
      notify("❌ Listing rejected, seller notified.",true);
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
      notify("✏️ Change request sent to seller.",true);
    }catch(e){notify(e.message,false);}
    finally{setSubmitting(false);}
  };

  const fmtKES=n=>"KSh "+Number(n||0).toLocaleString("en-KE");

  if(loading)return <div style={{textAlign:"center",padding:60}}><Spin/></div>;

  return <>
    {listings.length===0
      ?<div className="empty">
          <div style={{fontSize:48,marginBottom:12,opacity:.2}}>✅</div>
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
                  :<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",fontSize:40,opacity:.15}}>📦</div>}
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
              :<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",fontSize:48,opacity:.1}}>📦</div>}
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
            <div style={{fontSize:13}}>📍 {selected.location||"—"}{selected.county?", "+selected.county:""}</div>
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
        <button className="btn bp" onClick={()=>approve(selected.id)} disabled={submitting}>{submitting?<Spin/>:"✅ Approve — Go Live"}</button>
        <button className="btn by sm" onClick={()=>setAction("changes")}>✏️ Request Changes</button>
        <button className="btn br sm" onClick={()=>setAction("reject")}>❌ Reject</button>
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

function Users({token,notify}){
  const [users,setUsers]=useState([]);const [loading,setLoading]=useState(true);const [q,setQ]=useState("");
  useEffect(()=>{
    req("/api/admin/users",{},token).then(data=>{
      setUsers(Array.isArray(data)?data:(data.users||[]));
    }).catch(()=>{}).finally(()=>setLoading(false));
  },[token]);
  const suspend=async u=>{try{await req(`/api/admin/users/${u.id}/suspend`,{method:"POST",body:JSON.stringify({suspend:!u.is_suspended})},token);setUsers(p=>p.map(x=>x.id===u.id?{...x,is_suspended:!u.is_suspended}:x));notify(u.is_suspended?"User unsuspended.":"User suspended.",true);}catch(e){notify(e.message,false);}};
  const deleteUser=async(id,name)=>{
    if(!window.confirm(`Permanently delete "${name}"? All their listings and data will be gone.`))return;
    try{await req(`/api/admin/users/${id}`,{method:"DELETE"},token);setUsers(p=>p.filter(u=>u.id!==id));notify("User deleted.",true);}catch(e){notify(e.message,false);}
  };
  const filtered=users.filter(u=>u.role!=='admin'&&(!q||u.name?.toLowerCase().includes(q.toLowerCase())||u.email?.toLowerCase().includes(q.toLowerCase())));
  return <>
    <div className="sb"><input className="inp" style={{flex:1,maxWidth:320}} placeholder="Search by name or email..." value={q} onChange={e=>setQ(e.target.value)}/><span style={{fontSize:12,color:"var(--mut)",alignSelf:"center"}}>{filtered.length} users</span></div>
    <div className="tw">{loading?<div style={{textAlign:"center",padding:40}}><Spin/></div>:
      <div className="ts"><table>
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Violations</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{filtered.length===0?<tr><td colSpan={7}><div className="empty">No users</div></td></tr>:filtered.map(u=><tr key={u.id}>
          <td style={{fontWeight:600}}>{u.name}</td>
          <td style={{color:"var(--mut)",fontSize:12}}>{u.email}</td>
          <td><span className={`badge ${u.role==="admin"?"bb2":u.role==="seller"?"bg":"bm"}`}>{u.role}</span></td>
          <td style={{color:"var(--mut)",fontSize:12}}>{ago(u.created_at)}</td>
          <td style={{color:u.violation_count>0?"var(--red)":"var(--mut)"}}>{u.violation_count||0}</td>
          <td><span className={`badge ${u.is_suspended?"br2":"bg"}`}>{u.is_suspended?"Suspended":"Active"}</span></td>
          <td><div style={{display:"flex",gap:5}}>
            <button className={`btn sm ${u.is_suspended?"bp":"br"}`} onClick={()=>suspend(u)}>{u.is_suspended?"Unsuspend":"Suspend"}</button>
            <button className="btn br sm" onClick={()=>deleteUser(u.id,u.name)}>Delete</button>
          </div></td>
        </tr>)}</tbody>
      </table></div>}
    </div>
  </>;
}

function Listings({token,notify}){
  const [listings,setListings]=useState([]);const [loading,setLoading]=useState(true);const [q,setQ]=useState("");const [sf,setSf]=useState("");
  const [viewListing,setViewListing]=useState(null);
  const [markSoldListing,setMarkSoldListing]=useState(null); // listing to mark sold
  const [soldChannel,setSoldChannel]=useState("platform");
  const [markingSold,setMarkingSold]=useState(false);

  const load=useCallback(()=>{
    setLoading(true);
    const p=new URLSearchParams();if(sf)p.set("status",sf);if(q)p.set("search",q);
    req(`/api/admin/listings?${p}`,{},token).then(d=>setListings(d.listings||[])).catch(()=>{}).finally(()=>setLoading(false));
  },[token,q,sf]);
  useEffect(()=>{load();},[load]);

  const updStatus=async(id,status)=>{try{await req(`/api/admin/listings/${id}`,{method:"PATCH",body:JSON.stringify({status})},token);setListings(p=>p.map(l=>l.id===id?{...l,status}:l));notify(`Status set to "${status}".`,true);}catch(e){notify(e.message,false);}};
  const del=async id=>{if(!window.confirm("Permanently delete this listing?"))return;try{await req(`/api/admin/listings/${id}`,{method:"DELETE"},token);setListings(p=>p.filter(l=>l.id!==id));notify("Deleted.",true);}catch(e){notify(e.message,false);}};
  const restoreListing=async id=>{try{await req(`/api/admin/listings/${id}/restore`,{method:"POST"},token);setListings(p=>p.map(l=>l.id===id?{...l,status:"active"}:l));notify("Listing restored to active.",true);}catch(e){notify(e.message,false);}};

  const confirmMarkSold=async()=>{
    if(!markSoldListing)return;
    setMarkingSold(true);
    try{
      await req(`/api/admin/listings/${markSoldListing.id}/mark-sold`,{method:"POST",body:JSON.stringify({sold_channel:soldChannel})},token);
      setListings(p=>p.map(l=>l.id===markSoldListing.id?{...l,status:"sold"}:l));
      notify(`✅ "${markSoldListing.title}" marked as sold (${soldChannel}).`,true);
      setMarkSoldListing(null);
    }catch(e){notify(e.message,false);}
    finally{setMarkingSold(false);}
  };

  const sc=s=>({active:"bg",sold:"by2",locked:"bb2",deleted:"br2",archived:"by2",flagged:"br2"}[s]||"bm");

  return <>
    <div className="sb">
      <input className="inp" style={{flex:1,maxWidth:260}} placeholder="Search listings..." value={q} onChange={e=>setQ(e.target.value)}/>
      <select className="inp" style={{width:160}} value={sf} onChange={e=>setSf(e.target.value)}><option value="">All Statuses</option><option value="active">Active</option><option value="sold">Sold</option><option value="locked">Locked</option><option value="archived">Archived</option><option value="flagged">Flagged</option><option value="deleted">Deleted</option></select>
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
          <td>{parseInt(l.pending_reports||0)>0&&<span className="badge br2">🚩 {l.pending_reports}</span>}</td>
          <td style={{fontSize:11,color:"#636363"}}>{ago(l.created_at)}</td>
          <td><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            <button className="btn bs sm" onClick={()=>setViewListing(l)}>👁 View</button>
            {l.status!=="active"&&<button className="btn bp sm" onClick={()=>updStatus(l.id,"active")}>Activate</button>}
            {(l.status==="archived"||l.status==="flagged")&&<button className="btn bp sm" onClick={()=>restoreListing(l.id)}>↩ Restore</button>}
            {(l.status==="active"||l.status==="locked")&&<button className="btn by sm" onClick={()=>{setSoldChannel("platform");setMarkSoldListing(l);}}>✅ Mark Sold</button>}
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
            {val:"platform",icon:"🛒",label:"Sold via Weka Soko",desc:"The buyer and seller connected and transacted through the platform"},
            {val:"outside",icon:"🤝",label:"Sold outside the platform",desc:"The seller sold the item independently, not through Weka Soko"},
          ].map(opt=>(
            <div key={opt.val} onClick={()=>setSoldChannel(opt.val)}
              style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 14px",border:`2px solid ${soldChannel===opt.val?"#1428A0":"#E6E6E6"}`,cursor:"pointer",background:soldChannel===opt.val?"rgba(20,40,160,.04)":"#fff",transition:"all .15s"}}>
              <div style={{fontSize:24,marginTop:2}}>{opt.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13,color:soldChannel===opt.val?"#1428A0":"#1D1D1D"}}>{opt.label}</div>
                <div style={{fontSize:12,color:"#636363",marginTop:3}}>{opt.desc}</div>
              </div>
              <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${soldChannel===opt.val?"#1428A0":"#ADADAD"}`,background:soldChannel===opt.val?"#1428A0":"transparent",flexShrink:0,marginTop:3,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {soldChannel===opt.val&&<div style={{width:8,height:8,borderRadius:"50%",background:"#fff"}}/>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:"rgba(192,48,48,.04)",border:"1px solid rgba(192,48,48,.15)",padding:"10px 13px",fontSize:12,color:"#7f1d1d",marginBottom:16}}>
        ⚠️ This action cannot be undone. The listing status will be permanently changed to <strong>Sold</strong> and the seller will be notified.
      </div>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
        <button className="btn bs" onClick={()=>setMarkSoldListing(null)}>Cancel</button>
        <button className="btn bp" onClick={confirmMarkSold} disabled={markingSold}>
          {markingSold?<Spin/>:"✅ Confirm — Mark as Sold"}
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
  </>;
}

function Violations({token,notify}){
  const [violations,setViolations]=useState([]);const [loading,setLoading]=useState(true);
  useEffect(()=>{req("/api/admin/violations?reviewed=false",{},token).then(setViolations).catch(()=>{}).finally(()=>setLoading(false));},[token]);
  const review=async(id,action)=>{try{await req(`/api/admin/violations/${id}/review`,{method:"POST",body:JSON.stringify({action})},token);setViolations(p=>p.filter(v=>v.id!==id));notify(`Action: ${action}.`,true);}catch(e){notify(e.message,false);}};
  return <>
    <div style={{background:"rgba(139,100,0,.06)",border:"1px solid rgba(139,100,0,.2)",borderRadius:"var(--rs)",padding:"10px 14px",fontSize:12,color:"var(--gold)",marginBottom:16}}>⚠️ {violations.length} unreviewed violation{violations.length!==1?"s":""}</div>
    <div className="tw">{loading?<div style={{textAlign:"center",padding:40}}><Spin/></div>:violations.length===0?<div className="empty">✅ No unreviewed violations</div>:
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
      <div className={`tab${tab==="escrows"?" on":""}`} onClick={()=>setTab("escrows")}>🔐 Escrows ({escrows.filter(e=>e.status==="holding").length} holding)</div>
      <div className={`tab${tab==="disputes"?" on":""}`} onClick={()=>setTab("disputes")}>⚖️ Disputes ({disputes.filter(d=>d.status==="open").length} open)</div>
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
      <div className="tw">{disputes.length===0?<div className="empty">No open disputes ✅</div>:
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
    req(`/api/admin/sold?page=${pg}&limit=${PER}`,{},token)
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
                {l.sold_channel==="platform"?"🛒 WekaSoko":"🤝 Elsewhere"}
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
  const sc=s=>({active:"bg2",closed:"bm",archived:"by2",expired:"br2"}[s]||"bm");
  const filtered=items.filter(r=>!q||r.title?.toLowerCase().includes(q.toLowerCase())||r.description?.toLowerCase().includes(q.toLowerCase())||r.requester_anon?.toLowerCase().includes(q.toLowerCase()));

  return <>
    <div className="sb" style={{marginBottom:16}}>
      <input className="inp" style={{flex:1,maxWidth:280}} placeholder="Search requests..." value={q} onChange={e=>setQ(e.target.value)}/>
      <select className="inp" style={{width:140}} value={filter} onChange={e=>setFilter(e.target.value)}>
        <option value="all">All Statuses</option>
        <option value="active">Active</option>
        <option value="closed">Closed</option>
        <option value="archived">Archived</option>
        <option value="expired">Expired</option>
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
            <button className="btn bs sm" onClick={()=>openDetail(r)}>👁 View</button>
            {r.status==="active"&&<button className="btn bm sm" onClick={()=>changeStatus(r.id,"closed")} disabled={statusSaving}>Close</button>}
            {r.status==="closed"&&<button className="btn bg2 sm" onClick={()=>changeStatus(r.id,"active")} disabled={statusSaving}>Reopen</button>}
            {r.status!=="archived"&&<button className="btn by sm" onClick={()=>changeStatus(r.id,"archived")} disabled={statusSaving}>Archive</button>}
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
        <div><div className="lbl">Location</div><div style={{fontSize:13}}>📍 {selected.county||"Any county"}</div></div>
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
        <button className="btn br" onClick={()=>deleteRequest(selected.id)} disabled={deleting}>{deleting?<Spin/>:"🗑 Delete Request"}</button>
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
  const REASON_LABELS={scam:"🚨 Scam",fake_item:"🎭 Fake item",wrong_price:"💰 Wrong price",offensive:"🚫 Offensive",spam:"📧 Spam",wrong_category:"📂 Wrong category",already_sold:"✅ Already sold",other:"❓ Other"};
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
            <div style={{fontWeight:600,marginBottom:4,fontSize:13}}>📦 {r.listing_title}</div>
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
  const LEVELS=[["viewer","👁 Viewer — read-only"],["moderator","🛡 Moderator — manage listings & violations"],["manager","⚙️ Manager — all except invites"],["super","🔑 Super Admin — full access"]];

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
      <button className="btn bp" style={{marginTop:12}} onClick={sendInvite} disabled={sending}>{sending?<Spin/>:"📨 Send Invite"}</button>
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

const SECTIONS=[
  {id:"overview",icon:"📊",label:"Overview"},
  {id:"review",icon:"🔍",label:"Review Queue"},
  {id:"users",icon:"👥",label:"Users"},
  {id:"listings",icon:"📦",label:"Listings"},
  {id:"sold",icon:"✅",label:"Sold Listings"},
  {id:"requests",icon:"🛒",label:"Buyer Requests"},
  {id:"reports",icon:"🚩",label:"Reports"},
  {id:"violations",icon:"🚨",label:"Violations"},
  {id:"escrow",icon:"🔐",label:"Escrow & Disputes"},
  {id:"payments",icon:"💳",label:"Payments"},
  {id:"vouchers",icon:"🎟️",label:"Vouchers"},
  {id:"admins",icon:"🔑",label:"Admin Team"},
];

export default function AdminApp(){
  const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem("ws_admin_user"));}catch{return null;}});
  const [token,setToken]=useState(()=>localStorage.getItem("ws_admin_token"));
  const [section,setSection]=useState("overview");
  const [toast,setToast]=useState(null);
  const notify=useCallback((msg,ok=true)=>setToast({msg,ok,id:Date.now()}),[]);

  useEffect(()=>{let el=document.getElementById("admin-css");if(!el){el=document.createElement("style");el.id="admin-css";document.head.appendChild(el);}el.textContent=CSS;},[]);
  useEffect(()=>{
    if(token){req("/api/auth/me",{},token).then(u=>{if(u.role!=="admin"){localStorage.removeItem("ws_admin_token");localStorage.removeItem("ws_admin_user");setUser(null);setToken(null);}else{setUser(u);localStorage.setItem("ws_admin_user",JSON.stringify(u));}}).catch(()=>{localStorage.removeItem("ws_admin_token");localStorage.removeItem("ws_admin_user");setUser(null);setToken(null);});}
  },[]);

  const handleLogin=(u,t)=>{setUser(u);setToken(t);localStorage.setItem("ws_admin_token",t);localStorage.setItem("ws_admin_user",JSON.stringify(u));};
  const logout=()=>{setUser(null);setToken(null);localStorage.removeItem("ws_admin_token");localStorage.removeItem("ws_admin_user");};

  if(!user||!token)return <Login onLogin={handleLogin}/>;
  const cur=SECTIONS.find(s=>s.id===section);

  return <>
    <div className="sidebar">
      <div className="sidebar-logo">Weka<span>Soko</span> <span style={{fontSize:10,fontWeight:700,letterSpacing:".08em",color:"#636363",textTransform:"uppercase",verticalAlign:"middle"}}>Admin</span></div>
      {SECTIONS.map(s=><div key={s.id} className={`nav-item${section===s.id?" on":""}`} onClick={()=>setSection(s.id)}><span>{s.icon}</span><span>{s.label}</span></div>)}
      <div style={{flex:1}}/>
      <div style={{padding:"16px 20px",borderTop:"1px solid #E6E6E6"}}>
        <div style={{fontSize:11,color:"#636363",marginBottom:2,fontWeight:600,letterSpacing:".04em",textTransform:"uppercase"}}>Signed in as</div>
        <div style={{fontWeight:700,fontSize:13,marginBottom:10,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</div>
        <button className="btn bs sm" style={{width:"100%"}} onClick={logout}>Sign Out</button>
      </div>
    </div>
    <div className="main">
      <div className="page-header">
        <h1 className="page-title">{cur?.icon} {cur?.label}</h1>
        <div style={{fontSize:12,color:"#636363"}}>Live · {new Date().toLocaleDateString("en-KE",{weekday:"long",day:"numeric",month:"long"})}</div>
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
    </div>
    {toast&&<Toast key={toast.id} msg={toast.msg} ok={toast.ok} onClose={()=>setToast(null)}/>}
  </>;
}
