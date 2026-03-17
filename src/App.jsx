import React,{useState,useEffect,useCallback} from "react";

const API = (process.env.REACT_APP_API_URL || "https://weka-soko-backend-production.up.railway.app").replace(/\/$/, "");

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#F4F4F4;--surf:#FFFFFF;--sh:#F4F4F4;--border:#E0E0E0;
  --accent:#1428A0;--accent2:#0F1F8A;--gold:#B07F10;--red:#C03030;--blue:#1428A0;
  --txt:#1D1D1D;--mut:#535353;--dim:#767676;
  --r:0px;--rs:0px;--fn:'Outfit',system-ui,sans-serif;
}
.dark{
  --bg:#000000;--surf:#161616;--sh:#1E1E1E;--border:#2C2C2C;
  --accent:#4B77FF;--accent2:#3A63F0;
  --txt:#FFFFFF;--mut:#A0A0A0;--dim:#666666;
}
body{background:var(--bg);color:var(--txt);font-family:var(--fn);font-size:14px;line-height:1.6;min-height:100vh;transition:background .2s,color .2s;}
::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:var(--border);}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 20px;border-radius:0;font-size:12px;font-weight:700;cursor:pointer;border:none;transition:all .14s;white-space:nowrap;font-family:var(--fn);letter-spacing:.02em;}
.btn:disabled{opacity:.4;cursor:not-allowed;}
.bp{background:var(--accent);color:#fff;}.bp:hover:not(:disabled){background:var(--accent2);}
.bs{background:transparent;color:var(--txt);border:1.5px solid var(--txt);}.bs:hover:not(:disabled){background:var(--txt);color:var(--bg);}
.br{background:transparent;color:var(--red);border:1.5px solid var(--red);}.br:hover:not(:disabled){background:var(--red);color:#fff;}
.by{background:transparent;color:var(--gold);border:1.5px solid var(--gold);}.by:hover:not(:disabled){background:var(--gold);color:#fff;}
.bb{background:transparent;color:var(--blue);border:1.5px solid var(--blue);}.bb:hover:not(:disabled){background:var(--blue);color:#fff;}
.bgh{background:transparent;border:none;color:var(--mut);}.bgh:hover{color:var(--txt);}
.sm{padding:6px 14px;font-size:11px;}
.inp{width:100%;padding:10px 12px;background:var(--sh);border:1px solid var(--border);border-radius:0;color:var(--txt);font-family:var(--fn);font-size:13px;outline:none;transition:border-color .14s;}
.inp:focus{border-color:var(--accent);background:var(--surf);}
.inp::placeholder{color:var(--dim);}
select.inp{appearance:none;cursor:pointer;}
textarea.inp{resize:vertical;min-height:80px;}
.lbl{display:block;font-size:10px;font-weight:700;color:var(--mut);letter-spacing:.1em;text-transform:uppercase;margin-bottom:5px;}
.card{background:var(--surf);border:1px solid var(--border);border-radius:0;padding:20px 24px;}
.badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:0;font-size:10px;font-weight:700;letter-spacing:.04em;}
.bg{background:rgba(20,40,160,.08);color:var(--accent);border:1px solid rgba(20,40,160,.2);}
.by2{background:rgba(176,127,16,.08);color:var(--gold);border:1px solid rgba(176,127,16,.2);}
.br2{background:rgba(192,48,48,.08);color:var(--red);border:1px solid rgba(192,48,48,.2);}
.bm{background:var(--sh);color:var(--mut);border:1px solid var(--border);}
.bb2{background:rgba(20,40,160,.08);color:var(--accent);border:1px solid rgba(20,40,160,.2);}
.spin{display:inline-block;width:16px;height:16px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:sp .7s linear infinite;}
@keyframes sp{to{transform:rotate(360deg)}}
.sidebar{position:fixed;left:0;top:0;bottom:0;width:220px;background:#000;display:flex;flex-direction:column;z-index:50;}
.dark .sidebar{background:#000;}
.sidebar-logo{padding:24px 20px 20px;border-bottom:1px solid rgba(255,255,255,.1);font-size:17px;font-weight:800;letter-spacing:-.01em;color:#fff;}
.sidebar-logo span{color:#4B77FF;}
.nav-item{display:flex;align-items:center;gap:10px;padding:11px 20px;cursor:pointer;font-size:13px;font-weight:500;color:rgba(255,255,255,.6);transition:all .14s;border-left:2px solid transparent;}
.nav-item:hover{color:#fff;background:rgba(255,255,255,.06);}
.nav-item.on{color:#fff;background:rgba(75,119,255,.15);border-left-color:#4B77FF;}
.main{margin-left:220px;min-height:100vh;padding:32px 36px;background:var(--bg);}
.dark .main{background:var(--bg);}
.page-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;flex-wrap:wrap;gap:12px;}
.page-title{font-size:24px;font-weight:800;letter-spacing:-.02em;}
.stat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:1px;background:var(--border);margin-bottom:32px;}
.stat-card{background:var(--surf);border:none;padding:20px 22px;}
.stat-val{font-size:28px;font-weight:800;line-height:1;margin-bottom:4px;color:var(--accent);}
.stat-lbl{font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--mut);}
table{width:100%;border-collapse:collapse;}
thead th{padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--mut);border-bottom:2px solid var(--border);}
tbody tr{border-bottom:1px solid var(--border);transition:background .1s;}
tbody tr:hover{background:var(--sh);}
td{padding:12px 14px;font-size:13px;vertical-align:middle;}
.tw{background:var(--surf);border:1px solid var(--border);border-radius:0;overflow:hidden;}
.ts{overflow-x:auto;}
.modal-ov{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);}
.modal{background:var(--surf);border:1px solid var(--border);border-radius:0;width:100%;max-width:560px;max-height:90vh;overflow-y:auto;animation:mu .18s ease;}
.modal.lg{max-width:780px;}
@keyframes mu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.mh{padding:22px 26px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--surf);z-index:2;}
.mb{padding:22px 26px;}
.mf{padding:14px 26px 22px;border-top:1px solid var(--border);display:flex;gap:8px;justify-content:flex-end;}
.tab-row{display:flex;gap:0;background:transparent;border-bottom:2px solid var(--border);padding:0;margin-bottom:24px;overflow-x:auto;}
.tab{padding:10px 18px;border-radius:0;font-size:12px;font-weight:600;cursor:pointer;color:var(--mut);transition:all .13s;white-space:nowrap;border-bottom:2px solid transparent;margin-bottom:-2px;}
.tab.on{color:var(--accent);border-bottom-color:var(--accent);}
.sb{display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap;}
.empty{text-align:center;padding:60px 20px;color:var(--mut);}
.login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#000;}
.login-box{background:var(--surf);border:1px solid var(--border);border-radius:0;padding:40px 36px;width:100%;max-width:400px;}
@media(max-width:768px){.sidebar{width:100%;height:54px;flex-direction:row;bottom:auto;border-right:none;border-bottom:1px solid rgba(255,255,255,.1);overflow-x:auto;}.sidebar-logo{display:none;}.main{margin-left:0;margin-top:54px;padding:20px 16px;}.nav-item{padding:8px 14px;border-left:none;border-bottom:2px solid transparent;font-size:12px;}.nav-item.on{border-bottom-color:#4B77FF;border-left-color:transparent;}}
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
  return <div style={{position:"fixed",bottom:20,right:20,zIndex:300,background:ok?"rgba(20,40,160,.15)":"rgba(224,80,80,.15)",border:`1px solid ${ok?"var(--accent)":"var(--red)"}`,borderRadius:"var(--r)",padding:"12px 18px",fontSize:13,display:"flex",gap:8,alignItems:"center",maxWidth:360}}><span>{ok?"✅":"❌"}</span><span>{msg}</span><button className="btn bgh sm" style={{marginLeft:"auto",padding:"2px 6px"}} onClick={onClose}>✕</button></div>;
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
  const [mode,setMode]=useState("login"); // "login" | "forgot" | "reset"
  const [email,setEmail]=useState("");const [pw,setPw]=useState("");
  const [loading,setLoading]=useState(false);const [err,setErr]=useState("");
  const [msg,setMsg]=useState("");
  const [newPw,setNewPw]=useState("");const [newPw2,setNewPw2]=useState("");

  // Check for reset_token in URL
  const [resetToken]=useState(()=>{
    const p=new URLSearchParams(window.location.search);
    const t=p.get("reset_token");
    if(t)window.history.replaceState({},"",window.location.pathname);
    return t||null;
  });
  if(resetToken&&mode==="login"){setMode("reset");}

  const submit=async()=>{
    if(!email||!pw){setErr("Enter email and password.");return;}
    setLoading(true);setErr("");
    try{
      const d=await req("/api/auth/login",{method:"POST",body:JSON.stringify({email:email.trim(),password:pw})});
      if(d.user.role!=="admin"){setErr("This account does not have admin access.");setLoading(false);return;}
      onLogin(d.user,d.token);
    }catch(e){setErr(e.message);}finally{setLoading(false);}
  };

  const sendReset=async()=>{
    if(!email.trim()){setErr("Enter your admin email.");return;}
    setLoading(true);setErr("");
    try{
      await req("/api/auth/forgot-password",{method:"POST",body:JSON.stringify({email:email.trim(),admin:true})});
      setMsg("If that admin email exists, a reset link has been sent. Check your inbox.");
    }catch(e){setErr(e.message);}finally{setLoading(false);}
  };

  const doReset=async()=>{
    if(!newPw||newPw.length<8){setErr("Password must be at least 8 characters.");return;}
    if(newPw!==newPw2){setErr("Passwords do not match.");return;}
    setLoading(true);setErr("");
    try{
      await req("/api/auth/reset-password",{method:"POST",body:JSON.stringify({token:resetToken,password:newPw})});
      setMsg("Password updated. You can now sign in.");
      setMode("login");
    }catch(e){setErr(e.message);}finally{setLoading(false);}
  };

  if(mode==="reset")return <div className="login-wrap">
    <div className="login-box">
      <div style={{fontSize:24,fontWeight:800,marginBottom:4,letterSpacing:"-.02em"}}>Weka<span style={{color:"var(--accent)"}}>Soko</span></div>
      <div style={{fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"var(--mut)",marginBottom:24}}>Set New Password</div>
      {err&&<div style={{background:"rgba(192,48,48,.06)",borderLeft:"3px solid var(--red)",padding:"10px 14px",fontSize:12,color:"var(--red)",marginBottom:16}}>{err}</div>}
      {msg&&<div style={{background:"rgba(20,40,160,.06)",borderLeft:"3px solid var(--accent)",padding:"10px 14px",fontSize:12,color:"var(--accent)",marginBottom:16}}>{msg}</div>}
      <FF label="New Password"><input className="inp" type="password" placeholder="Min 8 characters" value={newPw} onChange={e=>setNewPw(e.target.value)}/></FF>
      <FF label="Confirm Password"><input className="inp" type="password" placeholder="Repeat password" value={newPw2} onChange={e=>setNewPw2(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doReset()}/></FF>
      <button className="btn bp" style={{width:"100%",marginTop:8}} onClick={doReset} disabled={loading}>{loading?<Spin/>:"Set New Password →"}</button>
      <button className="btn bgh" style={{width:"100%",marginTop:8,fontSize:12}} onClick={()=>setMode("login")}>← Back to Sign In</button>
    </div>
  </div>;

  if(mode==="forgot")return <div className="login-wrap">
    <div className="login-box">
      <div style={{fontSize:24,fontWeight:800,marginBottom:4,letterSpacing:"-.02em"}}>Weka<span style={{color:"var(--accent)"}}>Soko</span></div>
      <div style={{fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"var(--mut)",marginBottom:24}}>Reset Password</div>
      {err&&<div style={{background:"rgba(192,48,48,.06)",borderLeft:"3px solid var(--red)",padding:"10px 14px",fontSize:12,color:"var(--red)",marginBottom:16}}>{err}</div>}
      {msg
        ?<><div style={{background:"rgba(20,40,160,.06)",borderLeft:"3px solid var(--accent)",padding:"12px 14px",fontSize:13,color:"var(--accent)",marginBottom:20,lineHeight:1.6}}>{msg}</div>
          <button className="btn bgh" style={{width:"100%",fontSize:12}} onClick={()=>{setMode("login");setMsg("");}}>← Back to Sign In</button></>
        :<>
          <p style={{fontSize:13,color:"var(--mut)",marginBottom:20,lineHeight:1.6}}>Enter your admin email address and we'll send you a link to reset your password.</p>
          <FF label="Admin Email"><input className="inp" type="email" placeholder="admin@wekasoko.co.ke" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendReset()}/></FF>
          <button className="btn bp" style={{width:"100%",marginTop:8}} onClick={sendReset} disabled={loading}>{loading?<Spin/>:"Send Reset Link →"}</button>
          <button className="btn bgh" style={{width:"100%",marginTop:8,fontSize:12}} onClick={()=>setMode("login")}>← Back to Sign In</button>
        </>
      }
    </div>
  </div>;

  return <div className="login-wrap">
    <div className="login-box">
      <div style={{fontSize:24,fontWeight:800,marginBottom:4,letterSpacing:"-.02em"}}>Weka<span style={{color:"var(--accent)"}}>Soko</span></div>
      <div style={{fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"var(--mut)",marginBottom:24}}>Admin Panel</div>
      {err&&<div style={{background:"rgba(192,48,48,.06)",borderLeft:"3px solid var(--red)",padding:"10px 14px",fontSize:12,color:"var(--red)",marginBottom:16}}>{err}</div>}
      <FF label="Email"><input className="inp" type="email" placeholder="admin@wekasoko.co.ke" value={email} onChange={e=>setEmail(e.target.value)}/></FF>
      <FF label="Password"><input className="inp" type="password" placeholder="••••••••" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/></FF>
      <button className="btn bp" style={{width:"100%",marginTop:8}} onClick={submit} disabled={loading}>{loading?<Spin/>:"Sign In →"}</button>
      <button className="btn bgh" style={{width:"100%",marginTop:8,fontSize:12,color:"var(--mut)"}} onClick={()=>{setMode("forgot");setErr("");}}>Forgot password?</button>
    </div>
  </div>;
}

function Overview({token}){
  const [s,setS]=useState(null);const [loading,setLoading]=useState(true);
  useEffect(()=>{req("/api/admin/stats",{},token).then(setS).catch(()=>{}).finally(()=>setLoading(false));},[token]);
  if(loading)return <div style={{textAlign:"center",padding:60}}><Spin/></div>;
  if(!s)return <div className="empty">Could not load stats.</div>;
  const {listings:L,users:U,payments:P,violations:V,escrows:E,disputes:D}=s;
  return <>
    <div className="stat-grid">
      {[{l:"Total Users",v:U?.total||0,c:"var(--txt)"},{l:"Sellers",v:U?.sellers||0,c:"var(--accent)"},{l:"Buyers",v:U?.buyers||0,c:"var(--blue)"},{l:"Active Listings",v:L?.active||0,c:"var(--accent)"},{l:"Sold Items",v:L?.sold||0,c:"var(--gold)"},{l:"Unlock Revenue",v:fmtKES(P?.unlock_revenue),c:"var(--accent)",sm:true},{l:"Escrow Volume",v:fmtKES(P?.escrow_volume),c:"var(--blue)",sm:true},{l:"Active Escrows",v:E?.active||0,c:"var(--blue)"},{l:"Open Disputes",v:D?.open||0,c:"var(--red)"},{l:"Violations",v:V?.total||0,c:"var(--gold)"},{l:"Suspended",v:U?.suspended||0,c:"var(--red)"}].map(x=>(
        <div key={x.l} className="stat-card"><div className="stat-val" style={{color:x.c,fontSize:x.sm?15:26}}>{x.v}</div><div className="stat-lbl">{x.l}</div></div>
      ))}
    </div>
    <div style={{background:"rgba(20,40,160,.06)",border:"1px solid rgba(20,40,160,.2)",borderRadius:"var(--rs)",padding:"10px 14px",fontSize:12,color:"var(--accent)"}}>✓ Live data from Railway database. Refresh to update.</div>
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

      {l.is_unlocked&&<div style={{background:"rgba(20,40,160,.08)",border:"1px solid rgba(20,40,160,.2)",borderRadius:"var(--rs)",padding:"10px 14px",fontSize:12,color:"var(--accent)"}}>
        🔓 Unlocked · Seller can see buyer contact
      </div>}
      {!l.is_unlocked&&l.locked_buyer_id&&<div style={{background:"rgba(240,192,64,.08)",border:"1px solid rgba(240,192,64,.2)",borderRadius:"var(--rs)",padding:"10px 14px",fontSize:12,color:"var(--gold)"}}>
        🔥 Buyer has locked in — seller hasn't paid to unlock yet
      </div>}

      {l.pending_reports>0&&<div style={{background:"rgba(224,80,80,.08)",border:"1px solid rgba(224,80,80,.2)",borderRadius:"var(--rs)",padding:"10px 14px",fontSize:12,color:"var(--red)",marginTop:8}}>
        🚩 {l.pending_reports} pending report{l.pending_reports>1?"s":""}
      </div>}
    </>}

    {tab==="edit"&&<>
      <div style={{background:"rgba(240,192,64,.08)",border:"1px solid rgba(240,192,64,.2)",borderRadius:"var(--rs)",padding:"10px 14px",fontSize:12,color:"var(--gold)",marginBottom:16}}>
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
  const filtered=users.filter(u=>!q||u.name?.toLowerCase().includes(q.toLowerCase())||u.email?.toLowerCase().includes(q.toLowerCase()));
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
  const [viewListing,setViewListing]=useState(null); // listing to show in detail modal
  const load=useCallback(()=>{
    setLoading(true);
    const p=new URLSearchParams();if(sf)p.set("status",sf);if(q)p.set("search",q);
    req(`/api/admin/listings?${p}`,{},token).then(d=>setListings(d.listings||[])).catch(()=>{}).finally(()=>setLoading(false));
  },[token,q,sf]);
  useEffect(()=>{load();},[load]);

  const updStatus=async(id,status)=>{try{await req(`/api/admin/listings/${id}`,{method:"PATCH",body:JSON.stringify({status})},token);setListings(p=>p.map(l=>l.id===id?{...l,status}:l));notify(`Status set to "${status}".`,true);}catch(e){notify(e.message,false);}};
  const del=async id=>{if(!window.confirm("Permanently delete this listing?"))return;try{await req(`/api/admin/listings/${id}`,{method:"DELETE"},token);setListings(p=>p.filter(l=>l.id!==id));notify("Deleted.",true);}catch(e){notify(e.message,false);}};
  const restoreListing=async id=>{try{await req(`/api/admin/listings/${id}/restore`,{method:"POST"},token);setListings(p=>p.map(l=>l.id===id?{...l,status:"active"}:l));notify("Listing restored to active.",true);}catch(e){notify(e.message,false);}};
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
            <div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",cursor:"pointer",color:"var(--accent)"}} onClick={()=>setViewListing(l)} title="Click to view details">{l.title}</div>
          </td>
          <td style={{fontSize:12,color:"var(--mut)"}}>{l.seller_name}</td>
          <td style={{color:"var(--accent)",fontWeight:700}}>{fmtKES(l.price)}</td>
          <td style={{fontSize:12,color:"var(--mut)"}}>{l.category}</td>
          <td><span className={`badge ${sc(l.status)}`}>{l.status}</span></td>
          <td>{parseInt(l.pending_reports||0)>0&&<span className="badge br2">🚩 {l.pending_reports}</span>}</td>
          <td style={{fontSize:11,color:"var(--mut)"}}>{ago(l.created_at)}</td>
          <td><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            <button className="btn bs sm" onClick={()=>setViewListing(l)}>👁 View</button>
            {l.status!=="active"&&<button className="btn bp sm" onClick={()=>updStatus(l.id,"active")}>Activate</button>}
            {(l.status==="archived"||l.status==="flagged")&&<button className="btn bp sm" onClick={()=>restoreListing(l.id)}>↩ Restore</button>}
            <button className="btn br sm" onClick={()=>del(l.id)}>Delete</button>
          </div></td>
        </tr>)}</tbody>
      </table></div>}
    </div>

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
    <div style={{background:"rgba(240,192,64,.08)",border:"1px solid rgba(240,192,64,.2)",borderRadius:"var(--rs)",padding:"10px 14px",fontSize:12,color:"var(--gold)",marginBottom:16}}>⚠️ {violations.length} unreviewed violation{violations.length!==1?"s":""}</div>
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


// ── MODERATION QUEUE ──────────────────────────────────────────────────────────
function ModerationQueue({token,notify}){
  const [items,setItems]=useState([]);
  const [total,setTotal]=useState(0);
  const [loading,setLoading]=useState(true);
  const [selected,setSelected]=useState(null);
  const [actionModal,setActionModal]=useState(null); // {id,title,action:"approve"|"reject"|"changes"}
  const [note,setNote]=useState("");
  const [submitting,setSubmitting]=useState(false);
  const [photoIdx,setPhotoIdx]=useState(0);

  const load=()=>{
    setLoading(true);
    req("/api/admin/moderation/queue",{},token).then(d=>{
      setItems(d.listings||[]);setTotal(d.total||0);
    }).catch(()=>{}).finally(()=>setLoading(false));
  };
  useEffect(()=>{load();},[token]);

  const doAction=async()=>{
    if(!actionModal)return;
    if((actionModal.action==="reject"||actionModal.action==="changes")&&!note.trim()){
      notify("Please provide a reason",false);return;
    }
    setSubmitting(true);
    const endpoint=actionModal.action==="approve"?`/api/admin/moderation/${actionModal.id}/approve`
      :actionModal.action==="reject"?`/api/admin/moderation/${actionModal.id}/reject`
      :`/api/admin/moderation/${actionModal.id}/request-changes`;
    const body=actionModal.action==="approve"?{}
      :actionModal.action==="reject"?{reason:note}:{note};
    try{
      await req(endpoint,{method:"POST",body:JSON.stringify(body)},token);
      notify(actionModal.action==="approve"?"✅ Listing approved and live"
        :actionModal.action==="reject"?"❌ Listing rejected":"✏️ Changes requested",true);
      setItems(p=>p.filter(l=>l.id!==actionModal.id));
      setTotal(t=>t-1);
      setActionModal(null);setNote("");
      if(selected?.id===actionModal.id)setSelected(null);
    }catch(e){notify(e.message,false);}
    finally{setSubmitting(false);}
  };

  if(loading)return<div style={{textAlign:"center",padding:60}}><Spin/></div>;

  return<>
    <div style={{display:"flex",gap:12,marginBottom:20,alignItems:"center",flexWrap:"wrap"}}>
      <div style={{fontSize:13,color:"var(--mut)"}}>
        {total===0?"All caught up! No listings pending review.":`${total} listing${total!==1?"s":""} waiting for review`}
      </div>
      <button className="btn bs sm" onClick={load} style={{marginLeft:"auto"}}>↻ Refresh</button>
    </div>

    {total===0?<div className="empty">
      <div style={{fontSize:48,marginBottom:12,opacity:.2}}>✅</div>
      <div style={{fontWeight:700,fontSize:16,marginBottom:6}}>Queue is empty</div>
      <div style={{fontSize:13,color:"var(--mut)"}}>All listings have been reviewed</div>
    </div>:

    <div style={{display:"grid",gridTemplateColumns:selected?"1fr 420px":"1fr",gap:16}}>
      {/* List */}
      <div>
        {items.map(l=>(
          <div key={l.id} onClick={()=>{setSelected(l);setPhotoIdx(0);}}
            style={{padding:"14px 16px",background:selected?.id===l.id?"rgba(20,40,160,.04)":"var(--surf)",
              border:`1px solid ${selected?.id===l.id?"var(--accent)":"var(--border)"}`,
              marginBottom:8,cursor:"pointer",display:"flex",gap:12,alignItems:"flex-start",transition:"all .15s"}}>
            {/* Thumb */}
            <div style={{width:72,height:58,background:"var(--sh)",flexShrink:0,overflow:"hidden",borderRadius:"var(--rs)"}}>
              {l.photos?.length>0?<img src={l.photos[0]} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                :<span style={{fontSize:28,display:"flex",alignItems:"center",justifyContent:"center",height:"100%",opacity:.2}}>📦</span>}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:700,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.title}</div>
              <div style={{fontSize:12,color:"var(--mut)",marginTop:2}}>{l.category} · {fmtKES(l.price)}</div>
              <div style={{fontSize:11,color:"var(--dim)",marginTop:2}}>{l.seller_name} · {ago(l.created_at)}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:4,flexShrink:0}}>
              <button className="btn bp sm" onClick={e=>{e.stopPropagation();setActionModal({id:l.id,title:l.title,action:"approve"});}} style={{fontSize:11}}>✅ Approve</button>
              <button className="btn by sm" onClick={e=>{e.stopPropagation();setNote("");setActionModal({id:l.id,title:l.title,action:"changes"});}} style={{fontSize:11}}>✏️ Changes</button>
              <button className="btn br sm" onClick={e=>{e.stopPropagation();setNote("");setActionModal({id:l.id,title:l.title,action:"reject"});}} style={{fontSize:11}}>❌ Reject</button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      {selected&&<div style={{background:"var(--surf)",border:"1px solid var(--border)",padding:20,position:"sticky",top:80,maxHeight:"calc(100vh - 120px)",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontWeight:700,fontSize:15}}>Ad Details</div>
          <button className="btn bgh sm" onClick={()=>setSelected(null)}>✕</button>
        </div>

        {/* Photos carousel */}
        {selected.photos?.length>0&&<div style={{marginBottom:14}}>
          <div style={{aspectRatio:"16/9",background:"var(--sh)",overflow:"hidden",borderRadius:"var(--rs)",position:"relative"}}>
            <img src={selected.photos[photoIdx]} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            {selected.photos.length>1&&<>
              <button onClick={()=>setPhotoIdx(p=>(p-1+selected.photos.length)%selected.photos.length)}
                style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,.5)",color:"#fff",border:"none",borderRadius:"50%",width:28,height:28,cursor:"pointer",fontSize:14}}>←</button>
              <button onClick={()=>setPhotoIdx(p=>(p+1)%selected.photos.length)}
                style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,.5)",color:"#fff",border:"none",borderRadius:"50%",width:28,height:28,cursor:"pointer",fontSize:14}}>→</button>
              <div style={{position:"absolute",bottom:8,right:8,background:"rgba(0,0,0,.6)",color:"#fff",fontSize:11,padding:"2px 8px",borderRadius:10}}>{photoIdx+1}/{selected.photos.length}</div>
            </>}
          </div>
        </div>}

        <div style={{fontSize:13,marginBottom:10}}>
          <strong>{selected.title}</strong>
          <div style={{color:"var(--mut)",marginTop:3,fontSize:12}}>{selected.category}{selected.subcat?" › "+selected.subcat:""}</div>
        </div>
        <div style={{fontSize:18,fontWeight:700,color:"var(--accent)",marginBottom:10}}>{fmtKES(selected.price)}</div>
        <div className="lbl">Description</div>
        <div style={{fontSize:13,color:"var(--mut)",lineHeight:1.65,marginBottom:12,whiteSpace:"pre-wrap",maxHeight:140,overflow:"auto"}}>{selected.description}</div>
        {selected.reason_for_sale&&<><div className="lbl">Reason for Sale</div>
          <div style={{fontSize:13,color:"var(--mut)",marginBottom:12}}>{selected.reason_for_sale}</div></>}
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
          {selected.location&&<span className="badge bm">📍 {selected.location}</span>}
          {selected.county&&<span className="badge bm">{selected.county}</span>}
        </div>
        <div className="lbl">Seller</div>
        <div style={{fontSize:13,marginBottom:16}}>
          <div style={{fontWeight:600}}>{selected.seller_name}</div>
          <div style={{color:"var(--mut)",fontSize:12}}>{selected.seller_email}</div>
        </div>

        <div style={{display:"flex",gap:8,flexDirection:"column"}}>
          <button className="btn bp" style={{width:"100%"}} onClick={()=>setActionModal({id:selected.id,title:selected.title,action:"approve"})}>✅ Approve — Go Live</button>
          <button className="btn by" style={{width:"100%"}} onClick={()=>{setNote("");setActionModal({id:selected.id,title:selected.title,action:"changes"});}}>✏️ Request Changes</button>
          <button className="btn br" style={{width:"100%"}} onClick={()=>{setNote("");setActionModal({id:selected.id,title:selected.title,action:"reject"});}}>❌ Reject Listing</button>
        </div>
      </div>}
    </div>}

    {/* Action Modal */}
    {actionModal&&<div className="modal-ov" onClick={e=>e.target===e.currentTarget&&setActionModal(null)}>
      <div className="modal">
        <div className="mh">
          <span style={{fontWeight:700}}>
            {actionModal.action==="approve"?"✅ Approve Listing"
              :actionModal.action==="reject"?"❌ Reject Listing":"✏️ Request Changes"}
          </span>
          <button className="btn bgh sm" onClick={()=>setActionModal(null)}>✕</button>
        </div>
        <div className="mb">
          <div style={{fontSize:13,color:"var(--mut)",marginBottom:16}}>
            Listing: <strong>{actionModal.title}</strong>
          </div>
          {actionModal.action==="approve"&&<div style={{background:"rgba(20,40,160,.06)",border:"1px solid rgba(20,40,160,.2)",padding:"12px 14px",borderRadius:"var(--rs)",fontSize:13,color:"var(--accent)"}}>
            This listing will go live immediately and be visible to all buyers. The seller will be notified by email and in-app.
          </div>}
          {actionModal.action==="reject"&&<>
            <div style={{fontSize:12,color:"var(--mut)",marginBottom:10}}>Explain why this listing was rejected. The seller will receive this message and may edit and resubmit.</div>
            <FF label="Rejection Reason (required)">
              <textarea className="inp" rows={3} placeholder="e.g. Prohibited item, misleading description, contact info in photos..." value={note} onChange={e=>setNote(e.target.value)}/>
            </FF>
          </>}
          {actionModal.action==="changes"&&<>
            <div style={{fontSize:12,color:"var(--mut)",marginBottom:10}}>Tell the seller what needs to be fixed. They can edit the listing and resubmit.</div>
            <FF label="Changes Needed (required)">
              <textarea className="inp" rows={3} placeholder="e.g. Please add more photos, the price seems too high for this condition..." value={note} onChange={e=>setNote(e.target.value)}/>
            </FF>
          </>}
        </div>
        <div className="mf">
          <button className="btn bs" onClick={()=>setActionModal(null)}>Cancel</button>
          <button className={`btn ${actionModal.action==="approve"?"bp":actionModal.action==="reject"?"br":"by"}`}
            onClick={doAction} disabled={submitting}>
            {submitting?<Spin/>:actionModal.action==="approve"?"✅ Approve"
              :actionModal.action==="reject"?"❌ Reject":"✏️ Send Feedback"}
          </button>
        </div>
      </div>
    </div>}
  </>;
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
      <div style={{marginTop:4,padding:"10px 12px",background:"var(--surf)",borderRadius:"var(--rs)",fontSize:12,color:"var(--mut)"}}>
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
  {id:"moderation",icon:"🔍",label:"Review Queue"},
  {id:"users",icon:"👥",label:"Users"},
  {id:"listings",icon:"📦",label:"Listings"},
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
  const [dark,setDark]=useState(()=>{try{return localStorage.getItem("ws-admin-theme")==="dark";}catch{return false;}});
  useEffect(()=>{document.documentElement.className=dark?"dark":"";try{localStorage.setItem("ws-admin-theme",dark?"dark":"light");}catch{};},[dark]);
  useEffect(()=>{let el=document.getElementById("ws-admin-css");if(!el){el=document.createElement("style");el.id="ws-admin-css";document.head.appendChild(el);}el.textContent=CSS;},[]);
  const notify=useCallback((msg,ok=true)=>setToast({msg,ok,id:Date.now()}),[]);

  useEffect(()=>{
    if(token){req("/api/auth/me",{},token).then(u=>{if(u.role!=="admin"){localStorage.removeItem("ws_admin_token");localStorage.removeItem("ws_admin_user");setUser(null);setToken(null);}else{setUser(u);localStorage.setItem("ws_admin_user",JSON.stringify(u));}}).catch(()=>{localStorage.removeItem("ws_admin_token");localStorage.removeItem("ws_admin_user");setUser(null);setToken(null);});}
  },[]);

  const handleLogin=(u,t)=>{setUser(u);setToken(t);localStorage.setItem("ws_admin_token",t);localStorage.setItem("ws_admin_user",JSON.stringify(u));};
  const logout=()=>{setUser(null);setToken(null);localStorage.removeItem("ws_admin_token");localStorage.removeItem("ws_admin_user");};

  if(!user||!token)return <Login onLogin={handleLogin}/>;
  const cur=SECTIONS.find(s=>s.id===section);

  return <>
    <div className="sidebar">
      <div className="sidebar-logo">Weka<span>Soko</span></div>
      {SECTIONS.map(s=><div key={s.id} className={`nav-item${section===s.id?" on":""}`} onClick={()=>setSection(s.id)}><span>{s.icon}</span><span>{s.label}</span></div>)}
      <div style={{flex:1}}/>
      <div style={{padding:"14px 20px",borderTop:"1px solid rgba(255,255,255,.1)",fontSize:12}}>
        <button className="btn bgh sm" style={{width:"100%",color:"rgba(255,255,255,.6)",marginBottom:8,justifyContent:"flex-start",gap:8}} onClick={()=>setDark(d=>!d)}>{dark?"☀ Light Mode":"🌙 Dark Mode"}</button>
        <div style={{color:"rgba(255,255,255,.4)",marginBottom:6,fontSize:11}}>Signed in as<br/><strong style={{color:"rgba(255,255,255,.8)"}}>{user.name}</strong></div>
        <button className="btn br sm" style={{width:"100%"}} onClick={logout}>Sign Out</button>
      </div>
    </div>
    <div className="main">
      <div className="page-header">
        <h1 className="page-title">{cur?.icon} {cur?.label}</h1>
        <div style={{fontSize:12,color:"var(--mut)"}}>Live · {new Date().toLocaleDateString("en-KE",{weekday:"long",day:"numeric",month:"long"})}</div>
      </div>
      {section==="overview"&&<Overview token={token}/>}
      {section==="users"&&<Users token={token} notify={notify}/>}
      {section==="moderation"&&<ModerationQueue token={token} notify={notify}/>}
      {section==="listings"&&<Listings token={token} notify={notify}/>}
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
