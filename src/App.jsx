import { useState, useEffect, useCallback } from "react";

const API = (process.env.REACT_APP_API_URL || "https://weka-soko-backend-production.up.railway.app").replace(/\/$/, "");

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{--bg:#0C0C0A;--surf:#131311;--sh:#191917;--border:#252521;--accent:#2ECC71;--accent2:#27AE60;--gold:#F0C040;--red:#E05050;--blue:#5B9BD5;--txt:#F0EFE9;--mut:#888880;--dim:#444440;--r:10px;--rs:7px;--fn:'DM Sans',system-ui,sans-serif;}
body{background:var(--bg);color:var(--txt);font-family:var(--fn);font-size:14px;line-height:1.6;min-height:100vh;}
::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px;}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 16px;border-radius:var(--rs);font-size:12px;font-weight:600;cursor:pointer;border:none;transition:all .14s;white-space:nowrap;font-family:var(--fn);}
.btn:disabled{opacity:.4;cursor:not-allowed;}
.bp{background:var(--accent);color:#000;}.bp:hover:not(:disabled){background:var(--accent2);}
.bs{background:var(--sh);color:var(--txt);border:1px solid var(--border);}.bs:hover:not(:disabled){border-color:var(--accent);color:var(--accent);}
.br{background:rgba(224,80,80,.1);color:var(--red);border:1px solid rgba(224,80,80,.2);}.br:hover:not(:disabled){background:rgba(224,80,80,.2);}
.by{background:rgba(240,192,64,.1);color:var(--gold);border:1px solid rgba(240,192,64,.2);}.by:hover:not(:disabled){background:rgba(240,192,64,.2);}
.bb{background:rgba(91,155,213,.1);color:var(--blue);border:1px solid rgba(91,155,213,.2);}.bb:hover:not(:disabled){background:rgba(91,155,213,.2);}
.bgh{background:transparent;border:none;color:var(--mut);}.bgh:hover{color:var(--txt);}
.sm{padding:5px 10px;font-size:11px;}
.inp{width:100%;padding:9px 12px;background:var(--sh);border:1px solid var(--border);border-radius:var(--rs);color:var(--txt);font-family:var(--fn);font-size:13px;outline:none;transition:border-color .14s;}
.inp:focus{border-color:var(--accent);}
.inp::placeholder{color:var(--dim);}
select.inp{appearance:none;cursor:pointer;}
.lbl{display:block;font-size:10px;font-weight:700;color:var(--mut);letter-spacing:.07em;text-transform:uppercase;margin-bottom:4px;}
.card{background:var(--surf);border:1px solid var(--border);border-radius:var(--r);padding:18px 20px;}
.badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;}
.bg{background:rgba(46,204,113,.12);color:var(--accent);border:1px solid rgba(46,204,113,.2);}
.by2{background:rgba(240,192,64,.12);color:var(--gold);border:1px solid rgba(240,192,64,.2);}
.br2{background:rgba(224,80,80,.12);color:var(--red);border:1px solid rgba(224,80,80,.2);}
.bm{background:rgba(100,100,90,.1);color:var(--mut);border:1px solid var(--border);}
.bb2{background:rgba(91,155,213,.12);color:var(--blue);border:1px solid rgba(91,155,213,.2);}
.spin{display:inline-block;width:16px;height:16px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:sp .7s linear infinite;}
@keyframes sp{to{transform:rotate(360deg)}}
.sidebar{position:fixed;left:0;top:0;bottom:0;width:220px;background:var(--surf);border-right:1px solid var(--border);display:flex;flex-direction:column;z-index:50;}
.sidebar-logo{padding:22px 20px 18px;border-bottom:1px solid var(--border);font-size:18px;font-weight:800;letter-spacing:-.02em;}
.sidebar-logo span{color:var(--accent);}
.nav-item{display:flex;align-items:center;gap:10px;padding:10px 20px;cursor:pointer;font-size:13px;font-weight:500;color:var(--mut);transition:all .14s;border-left:3px solid transparent;}
.nav-item:hover{color:var(--txt);background:var(--sh);}
.nav-item.on{color:var(--accent);background:rgba(46,204,113,.06);border-left-color:var(--accent);}
.main{margin-left:220px;min-height:100vh;padding:28px 32px;}
.page-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;flex-wrap:wrap;gap:12px;}
.page-title{font-size:22px;font-weight:800;}
.stat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:12px;margin-bottom:28px;}
.stat-card{background:var(--surf);border:1px solid var(--border);border-radius:var(--r);padding:16px 18px;}
.stat-val{font-size:26px;font-weight:800;line-height:1;margin-bottom:4px;}
.stat-lbl{font-size:10px;text-transform:uppercase;letter-spacing:.07em;color:var(--mut);}
table{width:100%;border-collapse:collapse;}
thead th{padding:9px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--mut);border-bottom:1px solid var(--border);}
tbody tr{border-bottom:1px solid var(--border);transition:background .1s;}
tbody tr:hover{background:var(--sh);}
td{padding:11px 14px;font-size:13px;vertical-align:middle;}
.tw{background:var(--surf);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;}
.ts{overflow-x:auto;}
.modal-ov{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);}
.modal{background:var(--surf);border:1px solid var(--border);border-radius:14px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto;animation:mu .18s ease;}
@keyframes mu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.mh{padding:20px 24px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
.mb{padding:20px 24px;}
.mf{padding:12px 24px 20px;border-top:1px solid var(--border);display:flex;gap:8px;justify-content:flex-end;}
.tab-row{display:flex;gap:2px;background:var(--bg);border-radius:var(--rs);padding:3px;margin-bottom:20px;overflow-x:auto;}
.tab{padding:6px 14px;border-radius:5px;font-size:12px;font-weight:600;cursor:pointer;color:var(--mut);transition:all .13s;white-space:nowrap;}
.tab.on{background:var(--surf);color:var(--txt);}
.sb{display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap;}
.empty{text-align:center;padding:48px 20px;color:var(--mut);}
.login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;}
.login-box{background:var(--surf);border:1px solid var(--border);border-radius:14px;padding:36px 32px;width:100%;max-width:380px;}
@media(max-width:768px){.sidebar{width:100%;height:54px;flex-direction:row;bottom:auto;border-right:none;border-bottom:1px solid var(--border);overflow-x:auto;}.sidebar-logo{display:none;}.main{margin-left:0;margin-top:54px;padding:16px 12px;}.nav-item{padding:8px 12px;border-left:none;border-bottom:3px solid transparent;font-size:12px;}.nav-item.on{border-bottom-color:var(--accent);border-left-color:transparent;}}
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
  useEffect(()=>{const t=setTimeout(onClose,4000);return()=>clearTimeout(t);},[]);
  return <div style={{position:"fixed",bottom:20,right:20,zIndex:300,background:ok?"rgba(46,204,113,.15)":"rgba(224,80,80,.15)",border:`1px solid ${ok?"var(--accent)":"var(--red)"}`,borderRadius:"var(--r)",padding:"12px 18px",fontSize:13,display:"flex",gap:8,alignItems:"center",maxWidth:320}}><span>{ok?"✅":"❌"}</span><span>{msg}</span></div>;
}

function Modal({title,onClose,children,footer}){
  return <div className="modal-ov" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="modal">
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
      const d=await req("/api/auth/login",{method:"POST",body:JSON.stringify({email:email.trim(),password:pw})});
      if(d.user.role!=="admin"){setErr("This account does not have admin access.");setLoading(false);return;}
      onLogin(d.user,d.token);
    }catch(e){setErr(e.message);}finally{setLoading(false);}
  };
  return <div className="login-wrap">
    <div className="login-box">
      <div style={{fontSize:22,fontWeight:800,marginBottom:6}}>Weka<span style={{color:"var(--accent)"}}>Soko</span> <span style={{color:"var(--mut)",fontSize:14,fontWeight:500}}>Admin</span></div>
      <p style={{color:"var(--mut)",fontSize:13,marginBottom:24}}>Sign in to manage the platform.</p>
      {err&&<div style={{background:"rgba(224,80,80,.1)",border:"1px solid rgba(224,80,80,.2)",borderRadius:"var(--rs)",padding:"10px 13px",fontSize:12,color:"var(--red)",marginBottom:14}}>{err}</div>}
      <FF label="Email"><input className="inp" type="email" placeholder="admin@wekasoko.co.ke" value={email} onChange={e=>setEmail(e.target.value)}/></FF>
      <FF label="Password"><input className="inp" type="password" placeholder="••••••••" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/></FF>
      <button className="btn bp" style={{width:"100%",marginTop:6}} onClick={submit} disabled={loading}>{loading?<Spin/>:"Sign In →"}</button>
      <div style={{marginTop:20,padding:"12px 14px",background:"var(--sh)",borderRadius:"var(--rs)",fontSize:12,color:"var(--mut)"}}>
        <strong style={{color:"var(--txt)"}}>No admin account yet?</strong><br/>Run this in Railway terminal to create one:<br/>
        <code style={{fontSize:11,color:"var(--accent)",display:"block",marginTop:6,wordBreak:"break-all"}}>node -e "require('./src/db/seed-admin')"</code>
      </div>
    </div>
  </div>;
}

function Overview({token}){
  const [s,setS]=useState(null);const [loading,setLoading]=useState(true);
  useEffect(()=>{req("/api/admin/stats",{},token).then(setS).catch(()=>{}).finally(()=>setLoading(false));},[token]);
  if(loading)return <div style={{textAlign:"center",padding:60}}><Spin/></div>;
  if(!s)return <div className="empty">Could not load stats. Make sure REACT_APP_API_URL is set in Vercel environment variables.</div>;
  const {listings:L,users:U,payments:P,violations:V,escrows:E,disputes:D}=s;
  return <>
    <div className="stat-grid">
      {[{l:"Total Users",v:U?.total||0,c:"var(--txt)"},{l:"Sellers",v:U?.sellers||0,c:"var(--accent)"},{l:"Buyers",v:U?.buyers||0,c:"var(--blue)"},{l:"Active Listings",v:L?.active||0,c:"var(--accent)"},{l:"Sold Items",v:L?.sold||0,c:"var(--gold)"},{l:"Unlock Revenue",v:fmtKES(P?.unlock_revenue),c:"var(--accent)",sm:true},{l:"Escrow Volume",v:fmtKES(P?.escrow_volume),c:"var(--blue)",sm:true},{l:"Active Escrows",v:E?.active||0,c:"var(--blue)"},{l:"Open Disputes",v:D?.open||0,c:"var(--red)"},{l:"Violations",v:V?.total||0,c:"var(--gold)"},{l:"Suspended",v:U?.suspended||0,c:"var(--red)"}].map(x=>(
        <div key={x.l} className="stat-card"><div className="stat-val" style={{color:x.c,fontSize:x.sm?15:26}}>{x.v}</div><div className="stat-lbl">{x.l}</div></div>
      ))}
    </div>
    <div style={{background:"rgba(46,204,113,.06)",border:"1px solid rgba(46,204,113,.2)",borderRadius:"var(--rs)",padding:"10px 14px",fontSize:12,color:"var(--accent)"}}>✓ Live data from Railway database. Refresh to update.</div>
  </>;
}

function Users({token,notify}){
  const [users,setUsers]=useState([]);const [loading,setLoading]=useState(true);const [q,setQ]=useState("");
  useEffect(()=>{req("/api/admin/users",{},token).then(setUsers).catch(()=>{}).finally(()=>setLoading(false));},[token]);
  const suspend=async u=>{try{await req(`/api/admin/users/${u.id}/suspend`,{method:"POST",body:JSON.stringify({suspend:!u.is_suspended})},token);setUsers(p=>p.map(x=>x.id===u.id?{...x,is_suspended:!u.is_suspended}:x));notify(u.is_suspended?"User unsuspended.":"User suspended.",true);}catch(e){notify(e.message,false);}};
  const freeUnlock=async id=>{try{await req(`/api/admin/users/${id}/free-unlock`,{method:"POST"},token);notify("Free unlock granted.",true);}catch(e){notify(e.message,false);}};
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
          <td><div style={{display:"flex",gap:5}}><button className={`btn sm ${u.is_suspended?"bp":"br"}`} onClick={()=>suspend(u)}>{u.is_suspended?"Unsuspend":"Suspend"}</button><button className="btn by sm" onClick={()=>freeUnlock(u.id)}>Free Unlock</button></div></td>
        </tr>)}</tbody>
      </table></div>}
    </div>
  </>;
}

function Listings({token,notify}){
  const [listings,setListings]=useState([]);const [loading,setLoading]=useState(true);const [q,setQ]=useState("");const [sf,setSf]=useState("");
  const load=useCallback(()=>{
    setLoading(true);
    const p=new URLSearchParams();if(sf)p.set("status",sf);if(q)p.set("search",q);
    req(`/api/admin/listings?${p}`,{},token).then(d=>setListings(d.listings||[])).catch(()=>{}).finally(()=>setLoading(false));
  },[token,q,sf]);
  useEffect(()=>{load();},[load]);
  const updStatus=async(id,status)=>{try{await req(`/api/admin/listings/${id}`,{method:"PATCH",body:JSON.stringify({status})},token);setListings(p=>p.map(l=>l.id===id?{...l,status}:l));notify(`Set to "${status}".`,true);}catch(e){notify(e.message,false);}};
  const del=async id=>{if(!window.confirm("Permanently delete this listing?"))return;try{await req(`/api/admin/listings/${id}`,{method:"DELETE"},token);setListings(p=>p.filter(l=>l.id!==id));notify("Deleted.",true);}catch(e){notify(e.message,false);}};
  const sc=s=>({active:"bg",sold:"by2",locked:"bb2",deleted:"br2"}[s]||"bm");
  return <>
    <div className="sb">
      <input className="inp" style={{flex:1,maxWidth:260}} placeholder="Search listings..." value={q} onChange={e=>setQ(e.target.value)}/>
      <select className="inp" style={{width:140}} value={sf} onChange={e=>setSf(e.target.value)}><option value="">All Statuses</option><option value="active">Active</option><option value="sold">Sold</option><option value="locked">Locked</option><option value="deleted">Deleted</option></select>
      <span style={{fontSize:12,color:"var(--mut)",alignSelf:"center"}}>{listings.length} listings</span>
    </div>
    <div className="tw">{loading?<div style={{textAlign:"center",padding:40}}><Spin/></div>:
      <div className="ts"><table>
        <thead><tr><th>Title</th><th>Seller</th><th>Price</th><th>Category</th><th>Status</th><th>Posted</th><th>Actions</th></tr></thead>
        <tbody>{listings.length===0?<tr><td colSpan={7}><div className="empty">No listings found</div></td></tr>:listings.map(l=><tr key={l.id}>
          <td style={{fontWeight:600,maxWidth:170}}><div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.title}</div></td>
          <td style={{fontSize:12,color:"var(--mut)"}}>{l.seller_name}</td>
          <td style={{color:"var(--accent)",fontWeight:700}}>{fmtKES(l.price)}</td>
          <td style={{fontSize:12,color:"var(--mut)"}}>{l.category}</td>
          <td><span className={`badge ${sc(l.status)}`}>{l.status}</span></td>
          <td style={{fontSize:11,color:"var(--mut)"}}>{ago(l.created_at)}</td>
          <td><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            {l.status!=="active"&&<button className="btn bp sm" onClick={()=>updStatus(l.id,"active")}>Activate</button>}
            {l.status!=="sold"&&<button className="btn by sm" onClick={()=>updStatus(l.id,"sold")}>Sold</button>}
            {l.status!=="deleted"&&<button className="btn bs sm" onClick={()=>updStatus(l.id,"deleted")}>Suspend</button>}
            <button className="btn br sm" onClick={()=>del(l.id)}>Delete</button>
          </div></td>
        </tr>)}</tbody>
      </table></div>}
    </div>
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

const SECTIONS=[{id:"overview",icon:"📊",label:"Overview"},{id:"users",icon:"👥",label:"Users"},{id:"listings",icon:"📦",label:"Listings"},{id:"violations",icon:"🚨",label:"Violations"},{id:"escrow",icon:"🔐",label:"Escrow & Disputes"},{id:"payments",icon:"💳",label:"Payments"},{id:"vouchers",icon:"🎟️",label:"Vouchers"}];

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
      <div className="sidebar-logo">Weka<span>Soko</span></div>
      {SECTIONS.map(s=><div key={s.id} className={`nav-item${section===s.id?" on":""}`} onClick={()=>setSection(s.id)}><span>{s.icon}</span><span>{s.label}</span></div>)}
      <div style={{flex:1}}/>
      <div style={{padding:"14px 20px",borderTop:"1px solid var(--border)",fontSize:12}}>
        <div style={{color:"var(--mut)",marginBottom:6}}>Signed in as<br/><strong style={{color:"var(--txt)"}}>{user.name}</strong></div>
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
      {section==="listings"&&<Listings token={token} notify={notify}/>}
      {section==="violations"&&<Violations token={token} notify={notify}/>}
      {section==="escrow"&&<Escrow token={token} notify={notify}/>}
      {section==="payments"&&<Payments token={token}/>}
      {section==="vouchers"&&<Vouchers token={token} notify={notify}/>}
    </div>
    {toast&&<Toast key={toast.id} msg={toast.msg} ok={toast.ok} onClose={()=>setToast(null)}/>}
  </>;
}
