import React,{useState,useEffect,useCallback} from "react";
import EscrowManagement from "./components/EscrowManagement";
import ChatViolations from "./components/ChatViolations";
import ChatViolations from "./components/ChatViolations";

const API = (process.env.REACT_APP_API_URL || "https://weka-soko-backend-production.up.railway.app").replace(/\/$/, "");

const CSS = `
@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap");
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#F4F4F4;--surf:#FFFFFF;--sh:#F4F4F4;--border:#E0E0E0;
  --accent:#1428A0;--accent2:#0F1F8A;--gold:#B07F10;--red:#C03030;--blue:#1428A0;
  --txt:#1D1D1D;--mut:#535353;--dim:#767676;
  --r:0px;--rs:0px;--fn:\'Outfit\',system-ui,sans-serif;
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

  if(mode==="reset")return <div className="login-wrap"><div className="login-box" style={{textAlign:"center"}}><div style={{fontSize:18,fontWeight:700,marginBottom:20}}>Reset Password</div>{err&&<div style={{color:"var(--red)",marginBottom:12,fontSize:13}}>{err}</div>}{msg&&<div style={{color:"var(--accent)",marginBottom:12,fontSize:13}}>{msg}</div>}<FF label="New Password"><input type="password" value={newPw} onChange={e=>setNewPw(e.target.value)} className="inp"/></FF><FF label="Confirm New Password"><input type="password" value={newPw2} onChange={e=>setNewPw2(e.target.value)} className="inp"/></FF><button onClick={doReset} disabled={loading} className="btn bp" style={{width:"100%",marginTop:10}}>{loading?<Spin/>:"Set New Password"}</button></div></div>;

  return <div className="login-wrap">
    <div className="login-box">
      <div style={{textAlign:"center",fontSize:18,fontWeight:700,marginBottom:20}}>WekaSoko Admin</div>
      {err&&<div style={{color:"var(--red)",marginBottom:12,fontSize:13}}>{err}</div>}
      {msg&&<div style={{color:"var(--accent)",marginBottom:12,fontSize:13}}>{msg}</div>}
      {mode==="login"&&<>
        <FF label="Email"><input value={email} onChange={e=>setEmail(e.target.value)} className="inp"/></FF>
        <FF label="Password"><input type="password" value={pw} onChange={e=>setPw(e.target.value)} className="inp"/></FF>
        <button onClick={submit} disabled={loading} className="btn bp" style={{width:"100%",marginTop:10}}>{loading?<Spin/>:"Sign In"}</button>
        <div style={{textAlign:"center",marginTop:16}}><button className="btn bgh sm" onClick={()=>setMode("forgot")}>Forgot password?</button></div>
      </>}
      {mode==="forgot"&&<>
        <FF label="Admin Email"><input value={email} onChange={e=>setEmail(e.target.value)} className="inp"/></FF>
        <button onClick={sendReset} disabled={loading} className="btn bp" style={{width:"100%",marginTop:10}}>{loading?<Spin/>:"Send Reset Link"}</button>
        <div style={{textAlign:"center",marginTop:16}}><button className="btn bgh sm" onClick={()=>setMode("login")}>Back to Sign In</button></div>
      </>}
    </div>
  </div>;
}

function App(){
  const [user,setUser]=useState(null);const [token,setToken]=useState(null);
  const [toast,setToast]=useState(null); // {msg,ok}
  const [activeTab,setActiveTab]=useState("dashboard"); // dashboard, users, listings, moderation, reports, payments, escrows, vouchers, chat-violations

  const logout=()=>{
    localStorage.removeItem("wekasoko_admin_token");
    setUser(null);setToken(null);
  };

  const onLogin=(u,t)=>{
    localStorage.setItem("wekasoko_admin_token",t);
    setUser(u);setToken(t);
  };

  // Check for token on load
  useEffect(()=>{
    const t=localStorage.getItem("wekasoko_admin_token");
    if(t){
      req("/api/auth/me",{},t)
        .then(d=>{if(d.user.role!=="admin"){logout();return;}setUser(d.user);setToken(t);})
        .catch(()=>logout());
    }
  },[]);

  if(!user)return <Login onLogin={onLogin}/>;

  return <>
    <style>{CSS}</style>
    <div className="sidebar">
      <div className="sidebar-logo">Weka<span>Soko</span></div>
      <nav>
        <div className={`nav-item ${activeTab==="dashboard"?"on":""}`} onClick={()=>setActiveTab("dashboard")}>Dashboard</div>
        <div className={`nav-item ${activeTab==="users"?"on":""}`} onClick={()=>setActiveTab("users")}>Users</div>
        <div className={`nav-item ${activeTab==="listings"?"on":""}`} onClick={()=>setActiveTab("listings")}>Listings</div>
        <div className={`nav-item ${activeTab==="moderation"?"on":""}`} onClick={()=>setActiveTab("moderation")}>Moderation</div>
        <div className={`nav-item ${activeTab==="reports"?"on":""}`} onClick={()=>setActiveTab("reports")}>Reports</div>
        <div className={`nav-item ${activeTab==="payments"?"on":""}`} onClick={()=>setActiveTab("payments")}>Payments</div>
        <div className={`nav-item ${activeTab==="escrows"?"on":""}`} onClick={()=>setActiveTab("escrows")}>Escrows</div>
        <div className={`nav-item ${activeTab==="vouchers"?"on":""}`} onClick={()=>setActiveTab("vouchers")}>Vouchers</div>
        <div className={`nav-item ${activeTab==="chat-violations"?"on":""}`} onClick={()=>setActiveTab("chat-violations")}>Chat Violations</div>
      </nav>
      <div style={{marginTop:"auto",padding:"12px 20px",borderTop:"1px solid rgba(255,255,255,.1)"}}>
        <div style={{fontSize:12,color:"rgba(255,255,255,.6)",marginBottom:4}}>{user.email}</div>
        <button className="btn bgh sm" onClick={logout} style={{color:"#fff",padding:0}}>Sign Out</button>
      </div>
    </div>
    <main className="main">
      {activeTab==="dashboard"&&<Dashboard token={token}/>}
      {activeTab==="users"&&<Users token={token}/>}
      {activeTab==="listings"&&<Listings token={token}/>}
      {activeTab==="moderation"&&<Moderation token={token}/>}
      {activeTab==="reports"&&<Reports token={token}/>}
      {activeTab==="payments"&&<Payments token={token}/>}
      {activeTab==="escrows"&&<EscrowManagement token={token} req={req} Spin={Spin} fmtKES={fmtKES} ago={ago} Toast={Toast} />}
      {activeTab==="vouchers"&&<Vouchers token={token}/>}
    {activeTab==="chat-violations"&&<ChatViolations token={token} req={req} Spin={Spin} ago={ago} Toast={Toast} />}req={req} Spin={Spin} ago={ago} Toast={Toast} />}
    </main>
    {toast&&<Toast msg={toast.msg} ok={toast.ok} onClose={()=>setToast(null)}/>}
  </>;
}

function Dashboard({token}){
  const [stats,setStats]=useState(null);const [loading,setLoading]=useState(true);
  useEffect(()=>{
    req("/api/stats",{},token).then(setStats).finally(()=>setLoading(false));
  },[token]);

  return <>
    <div className="page-header"><h1 className="page-title">Dashboard</h1></div>
    {loading?<div style={{padding:40,textAlign:"center"}}><Spin/></div>:stats&&<div className="stat-grid">
      <div className="stat-card"><div className="stat-val">{stats.users}</div><div className="stat-lbl">Total Users</div></div>
      <div className="stat-card"><div className="stat-val">{stats.listings}</div><div className="stat-lbl">Total Listings</div></div>
      <div className="stat-card"><div className="stat-val">{fmtKES(stats.payments)}</div><div className="stat-lbl">Total Payments</div></div>
      <div className="stat-card"><div className="stat-val">{fmtKES(stats.escrows)}</div><div className="stat-lbl">Active Escrows</div></div>
    </div>}
  </>;
}

function Users({token}){
  const [users,setUsers]=useState([]);const [loading,setLoading]=useState(true);
  const [q,setQ]=useState("");

  const fetchUsers=useCallback(()=>{
    setLoading(true);
    req(`/api/users?q=${q}`,{},token).then(setUsers).finally(()=>setLoading(false));
  },[token,q]);

  useEffect(fetchUsers,[fetchUsers]);

  return <>
    <div className="page-header"><h1 className="page-title">Users</h1></div>
    <div className="sb"><input className="inp" style={{maxWidth:300}} placeholder="Search by name, email, phone..." value={q} onChange={e=>setQ(e.target.value)}/><button className="btn bp" onClick={fetchUsers}>Search</button></div>
    <div className="tw">
      <div className="ts">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>
            {loading?<tr><td colSpan="7" style={{textAlign:"center",padding:40}}><Spin/></td></tr>:users.length===0?<tr><td colSpan="7" className="empty">No users found</td></tr>:users.map(u=><tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.phone_number}</td>
              <td><span className={`badge ${u.role==="admin"?"by2":"bm"}`}>{u.role}</span></td>
              <td>{ago(u.created_at)}</td>
              <td><button className="btn sm">View</button></td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  </>;
}

function Listings({token}){
  const [listings,setListings]=useState([]);const [loading,setLoading]=useState(true);
  const [q,setQ]=useState("");

  const fetchListings=useCallback(()=>{
    setLoading(true);
    req(`/api/listings?q=${q}`,{},token).then(setListings).finally(()=>setLoading(false));
  },[token,q]);

  useEffect(fetchListings,[fetchListings]);

  return <>
    <div className="page-header"><h1 className="page-title">Listings</h1></div>
    <div className="sb"><input className="inp" style={{maxWidth:300}} placeholder="Search by title, tag..." value={q} onChange={e=>setQ(e.target.value)}/><button className="btn bp" onClick={fetchListings}>Search</button></div>
    <div className="tw">
      <div className="ts">
        <table>
          <thead><tr><th>ID</th><th>Title</th><th>Seller</th><th>Price</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
          <tbody>
            {loading?<tr><td colSpan="7" style={{textAlign:"center",padding:40}}><Spin/></td></tr>:listings.length===0?<tr><td colSpan="7" className="empty">No listings found</td></tr>:listings.map(l=><tr key={l.id}>
              <td>{l.id}</td>
              <td>{l.title}</td>
              <td>{l.seller_name}</td>
              <td>{fmtKES(l.price)}</td>
              <td><span className={`badge ${l.status==="active"?"bg":l.status==="sold"?"br2":"bm"}`}>{l.status}</span></td>
              <td>{ago(l.created_at)}</td>
              <td><button className="btn sm">View</button></td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  </>;
}

function Moderation({token}){
  const [pending,setPending]=useState([]);const [loading,setLoading]=useState(true);

  const fetchPending=useCallback(()=>{
    setLoading(true);
    req("/api/listings/pending",{},token).then(setPending).finally(()=>setLoading(false));
  },[token]);

  useEffect(fetchPending,[fetchPending]);

  const approve=async(id)=>{
    await req(`/api/listings/${id}/approve`,{method:"POST"},token);
    fetchPending();
  };

  const reject=async(id)=>{
    await req(`/api/listings/${id}/reject`,{method:"POST"},token);
    fetchPending();
  };

  return <>
    <div className="page-header"><h1 className="page-title">Moderation Queue</h1></div>
    <div className="tw">
      <div className="ts">
        <table>
          <thead><tr><th>ID</th><th>Title</th><th>Seller</th><th>Price</th><th>Created</th><th>Actions</th></tr></thead>
          <tbody>
            {loading?<tr><td colSpan="6" style={{textAlign:"center",padding:40}}><Spin/></td></tr>:pending.length===0?<tr><td colSpan="6" className="empty">No pending listings</td></tr>:pending.map(l=><tr key={l.id}>
              <td>{l.id}</td>
              <td>{l.title}</td>
              <td>{l.seller_name}</td>
              <td>{fmtKES(l.price)}</td>
              <td>{ago(l.created_at)}</td>
              <td><div style={{display:"flex",gap:6}}><button className="btn sm bp" onClick={()=>approve(l.id)}>Approve</button><button className="btn sm br" onClick={()=>reject(l.id)}>Reject</button></div></td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  </>;
}

function Reports({token}){
  const [reports,setReports]=useState([]);const [loading,setLoading]=useState(true);

  const fetchReports=useCallback(()=>{
    setLoading(true);
    req("/api/reports",{},token).then(setReports).finally(()=>setLoading(false));
  },[token]);

  useEffect(fetchReports,[fetchReports]);

  return <>
    <div className="page-header"><h1 className="page-title">Reports</h1></div>
    <div className="tw">
      <div className="ts">
        <table>
          <thead><tr><th>ID</th><th>Reporter</th><th>Reported Item</th><th>Reason</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {loading?<tr><td colSpan="6" style={{textAlign:"center",padding:40}}><Spin/></td></tr>:reports.length===0?<tr><td colSpan="6" className="empty">No reports found</td></tr>:reports.map(r=><tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.reporter_name}</td>
              <td>{r.listing_title||`User #${r.reported_user_id}`}</td>
              <td>{r.reason}</td>
              <td>{ago(r.created_at)}</td>
              <td><button className="btn sm">View Details</button></td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  </>;
}

function Payments({token}){
  const [payments,setPayments]=useState([]);const [loading,setLoading]=useState(true);

  const fetchPayments=useCallback(()=>{
    setLoading(true);
    req("/api/payments",{},token).then(setPayments).finally(()=>setLoading(false));
  },[token]);

  useEffect(fetchPayments,[fetchPayments]);

  return <>
    <div className="page-header"><h1 className="page-title">Payments</h1></div>
    <div className="tw">
      <div className="ts">
        <table>
          <thead><tr><th>ID</th><th>User</th><th>Amount</th><th>Type</th><th>Reference</th><th>Date</th></tr></thead>
          <tbody>
            {loading?<tr><td colSpan="6" style={{textAlign:"center",padding:40}}><Spin/></td></tr>:payments.length===0?<tr><td colSpan="6" className="empty">No payments found</td></tr>:payments.map(p=><tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.user_name}</td>
              <td>{fmtKES(p.amount)}</td>
              <td><span className="badge bm">{p.type}</span></td>
              <td>{p.mpesa_receipt_number}</td>
              <td>{ago(p.created_at)}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  </>;
}

function Vouchers({token}){
  const [vouchers,setVouchers]=useState([]);const [loading,setLoading]=useState(true);

  const fetchVouchers=useCallback(()=>{
    setLoading(true);
    req("/api/vouchers",{},token).then(setVouchers).finally(()=>setLoading(false));
  },[token]);

  useEffect(fetchVouchers,[fetchVouchers]);

  return <>
    <div className="page-header"><h1 className="page-title">Vouchers</h1></div>
    <div className="tw">
      <div className="ts">
        <table>
          <thead><tr><th>ID</th><th>Code</th><th>Discount</th><th>Uses</th><th>Expires</th><th>Actions</th></tr></thead>
          <tbody>
            {loading?<tr><td colSpan="6" style={{textAlign:"center",padding:40}}><Spin/></td></tr>:vouchers.length===0?<tr><td colSpan="6" className="empty">No vouchers found</td></tr>:vouchers.map(v=><tr key={v.id}>
              <td>{v.id}</td>
              <td><code>{v.code}</code></td>
              <td>{v.discount_type==="percentage"?`${v.discount_value}%`:`${fmtKES(v.discount_value)}`}</td>
              <td>{v.use_count} / {v.max_uses}</td>
              <td>{v.expires_at?ago(v.expires_at):"—"}</td>
              <td><button className="btn sm">Edit</button></td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  </>;
}

function ChatViolations({ token, req, Spin, ago, Toast }) {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null); // { msg, ok }

  const fetchViolations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await req("/api/chat-violations", {}, token);
      setViolations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, req]);

  useEffect(() => {
    fetchViolations();
  }, [fetchViolations]);

  const handleDismiss = async (id) => {
    if (!window.confirm(`Are you sure you want to dismiss violation ${id}?`)) return;
    try {
      setLoading(true);
      await req(`/api/chat-violations/${id}/dismiss`, { method: "POST" }, token);
      setToast({ msg: `Violation ${id} dismissed successfully!`, ok: true });
      fetchViolations();
    } catch (err) {
      setToast({ msg: `Failed to dismiss violation: ${err.message}`, ok: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Chat Violations</h1>
      </div>
      {loading && <div style={{ padding: 40, textAlign: "center" }}><Spin /></div>}
      {error && <div className="empty">Error: {error}</div>}
      {!loading && !error && violations.length === 0 && <div className="empty">No chat violations found.</div>}
      {!loading && !error && violations.length > 0 && (
        <div className="tw">
          <div className="ts">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Message</th>
                  <th>Reason</th>
                  <th>Timestamp</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {violations.map((v) => (
                  <tr key={v.id}>
                    <td>{v.id}</td>
                    <td>{v.user_id}</td>
                    <td>{v.message}</td>
                    <td>{v.reason}</td>
                    <td>{ago(v.created_at)}</td>
                    <td>
                      <button className="btn sm br" onClick={() => handleDismiss(v.id)}>Dismiss</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {toast && <Toast msg={toast.msg} ok={toast.ok} onClose={() => setToast(null)} />}
    </div>
  );
}

export default App;
