import { useState, useEffect, useCallback, useRef } from "react";

// ── DEMO DATA ──────────────────────────────────────────────────────────────────
const DEMO = {
  stats: {
    totalUsers:1247,newToday:23,newWeek:156,
    activeListings:384,totalListings:3275,sold:2891,
    pendingUnlocks:17,unlockRevenue:722750,
    escrowVolume:4250000,escrowFees:106250,totalRevenue:829000,
    flagged:8,suspended:3,openDisputes:2,activeEscrows:12,
  },
  revenue:[{m:"Aug",r:42000},{m:"Sep",r:67000},{m:"Oct",r:89000},{m:"Nov",r:112000},{m:"Dec",r:145000},{m:"Jan",r:128000},{m:"Feb",r:147000}],
  categories:[
    {cat:"Electronics",active:98,sold:412},{cat:"Vehicles",active:34,sold:89},{cat:"Furniture",active:67,sold:203},
    {cat:"Fashion",active:89,sold:334},{cat:"Sports & Outdoors",active:45,sold:167},{cat:"Baby & Kids",active:23,sold:78},
    {cat:"Property",active:12,sold:34},{cat:"Agriculture",active:18,sold:67},{cat:"Other",active:56,sold:189},
  ],
  users:[
    {id:"u1",name:"James Kariuki",email:"james@gmail.com",role:"seller",phone:"0712345678",mpesa:"0712345678",joined:"2025-10-12",status:"active",listings:8,violations:0,revenue:2000,approved:false},
    {id:"u2",name:"Amina Hassan",email:"amina@gmail.com",role:"buyer",phone:"0723456789",mpesa:"0723456789",joined:"2025-11-03",status:"active",listings:0,violations:0,revenue:0,approved:false},
    {id:"u3",name:"Peter Mwangi",email:"peter@yahoo.com",role:"seller",phone:"0734567890",mpesa:"0734567890",joined:"2025-09-22",status:"flagged",listings:12,violations:2,revenue:3000,approved:false},
    {id:"u4",name:"Grace Njoroge",email:"grace@gmail.com",role:"seller",phone:"0745678901",mpesa:"0745678901",joined:"2025-12-01",status:"active",listings:5,violations:0,revenue:1250,approved:false},
    {id:"u5",name:"David Ochieng",email:"david@gmail.com",role:"buyer",phone:"0756789012",mpesa:"0756789012",joined:"2026-01-15",status:"suspended",listings:0,violations:3,revenue:0,approved:false},
  ],
  listings:[
    {id:"l1",title:'Samsung 65" QLED TV',seller:"James Kariuki",sellerEmail:"james@gmail.com",price:72000,category:"Electronics",status:"active",views:143,created:"2026-02-24",flagged:false,freeApproved:false},
    {id:"l2",title:"Trek Mountain Bike",seller:"Grace Njoroge",sellerEmail:"grace@gmail.com",price:28000,category:"Sports & Outdoors",status:"active",views:87,created:"2026-02-25",flagged:false,freeApproved:false},
    {id:"l3",title:"MacBook Pro M1",seller:"Peter Mwangi",sellerEmail:"peter@yahoo.com",price:120000,category:"Electronics",status:"sold",views:312,created:"2026-02-21",flagged:true,freeApproved:false},
    {id:"l4",title:"KTM Duke 390",seller:"Grace Njoroge",sellerEmail:"grace@gmail.com",price:480000,category:"Vehicles",status:"active",views:521,created:"2026-02-20",flagged:false,freeApproved:true},
  ],
  violations:[
    {id:"v1",user:"Peter Mwangi",email:"peter@yahoo.com",listing:"Trek Mountain Bike",message:"My number is 0734567890 please call me",severity:"flagged",date:"2026-02-25",reviewed:false},
    {id:"v2",user:"David Ochieng",email:"david@gmail.com",listing:"PS5 + 3 Games",message:"Reach me on whatsapp 0756789012",severity:"suspended",date:"2026-02-24",reviewed:true},
    {id:"v3",user:"James Kariuki",email:"james@gmail.com",listing:"Samsung TV",message:"email me at james@gmail.com",severity:"warning",date:"2026-02-26",reviewed:false},
  ],
  escrows:[
    {id:"e1",listing:"MacBook Pro M1",buyer:"Amina Hassan",seller:"Peter Mwangi",amount:120000,fee:3000,total:123000,status:"holding",created:"2026-02-21",releaseAt:"2026-02-23",approved:false},
    {id:"e2",listing:"KTM Duke 390",buyer:"Grace Njoroge",seller:"James Kariuki",amount:480000,fee:12000,total:492000,status:"disputed",created:"2026-02-20",releaseAt:"2026-02-22",approved:true},
    {id:"e3",listing:"Dining Table",buyer:"David Ochieng",seller:"Grace Njoroge",amount:35000,fee:875,total:35875,status:"released",created:"2026-02-18",releaseAt:"2026-02-20",approved:true},
  ],
  disputes:[
    {id:"d1",listing:"KTM Duke 390",raisedBy:"Grace Njoroge",reason:"Bike has hidden damage not shown in photos. Front fork is bent.",amount:492000,status:"open",date:"2026-02-22"},
  ],
  payments:[
    {id:"p1",type:"unlock",payer:"James Kariuki",listing:"Samsung TV",amount:250,status:"confirmed",date:"2026-02-25",receipt:"QH12345678",till:"5673935"},
    {id:"p2",type:"escrow",payer:"Amina Hassan",listing:"MacBook Pro M1",amount:123000,status:"confirmed",date:"2026-02-21",receipt:"QH23456789",till:"5673935"},
    {id:"p3",type:"unlock",payer:"Grace Njoroge",listing:"Dining Table",amount:250,status:"confirmed",date:"2026-02-18",receipt:"QH34567890",till:"5673935"},
    {id:"p4",type:"escrow",payer:"Grace Njoroge",listing:"KTM Duke 390",amount:492000,status:"confirmed",date:"2026-02-20",receipt:"QH45678901",till:"5673935"},
    {id:"p5",type:"unlock",payer:"James Kariuki",listing:"PS5",amount:250,status:"failed",date:"2026-02-23",receipt:null,till:"5673935"},
  ],
  vouchers:[
    {id:"vc1",code:"WS-FREE50",type:"unlock",discount:100,desc:"Free unlock",createdBy:"Admin",uses:3,maxUses:50,expires:"2026-06-01",active:true},
    {id:"vc2",code:"WS-ESC25",type:"escrow",discount:50,desc:"50% off escrow fee",createdBy:"Admin",uses:1,maxUses:20,expires:"2026-04-01",active:true},
    {id:"vc3",code:"WS-LAUNCH",type:"both",discount:100,desc:"Launch promo — free everything",createdBy:"Admin",uses:12,maxUses:100,expires:"2026-03-01",active:false},
  ],
  followUps:[
    {id:"f1",listing:"Samsung 65 QLED TV",seller:"James Kariuki",email:"james@gmail.com",phone:"0712345678",posted:"2026-02-03",lastFollowUp:"2026-02-20",status:"pending",response:null},
    {id:"f2",listing:"Trek Mountain Bike",seller:"Grace Njoroge",email:"grace@gmail.com",phone:"0745678901",posted:"2026-01-20",lastFollowUp:"2026-02-05",status:"sent",response:"Still available"},
  ],
};

// ── HELPERS ───────────────────────────────────────────────────────────────────
function fmtKES(n){return"KSh "+Number(n).toLocaleString("en-KE");}
function genCode(){return"WS-"+Math.random().toString(36).substring(2,8).toUpperCase();}

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS=`
/* fonts loaded via link tag */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{background:#0C0C0C;color:#F0F0F0;font-family:'Inter',sans-serif;font-size:14px;line-height:1.6;min-height:100vh;}
h1,h2,h3{font-family:'Playfair Display',serif;}
h4,h5,button,th,.lbl{font-family:'Inter',sans-serif;}
::-webkit-scrollbar{width:4px;height:4px;}::-webkit-scrollbar-track{background:#0C0C0C;}::-webkit-scrollbar-thumb{background:#333;border-radius:2px;}
.layout{display:flex;min-height:100vh;}
.sidebar{width:220px;min-width:220px;background:#111;border-right:1px solid #1E1E1E;display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto;}
.slogo{padding:18px 20px 14px;border-bottom:1px solid #1E1E1E;}
.slogo h2{font-family:'Playfair Display',serif;font-size:18px;font-weight:800;}
.slogo h2 span{color:#00C853;}
.slogo p{font-size:11px;color:#444;margin-top:2px;}
.ni{display:flex;align-items:center;gap:10px;padding:9px 20px;cursor:pointer;font-size:13px;color:#777;transition:all .13s;font-weight:600;border-left:3px solid transparent;}
.ni:hover{color:#F0F0F0;background:rgba(255,255,255,.03);}
.ni.on{color:#00C853;border-left-color:#00C853;background:rgba(0,200,83,.05);}
.ni .ic{font-size:15px;width:20px;text-align:center;}
.ns{padding:14px 20px 5px;font-size:10px;color:#333;text-transform:uppercase;letter-spacing:.08em;font-weight:700;}
.main{flex:1;overflow-y:auto;}
.topbar{background:#111;border-bottom:1px solid #1E1E1E;padding:0 26px;height:54px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10;}
.content{padding:26px;}
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 15px;border-radius:7px;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;cursor:pointer;border:none;transition:all .13s;white-space:nowrap;}
.bp{background:#00C853;color:#000;}.bp:hover{background:#00E060;}
.bs{background:#1C1C1C;color:#F0F0F0;border:1px solid #2A2A2A;}.bs:hover{border-color:#00C853;color:#00C853;}
.br{background:rgba(204,34,34,.1);color:#FF4444;border:1px solid rgba(204,34,34,.2);}.br:hover{background:rgba(204,34,34,.2);}
.bo{background:rgba(255,214,0,.1);color:#FFD600;border:1px solid rgba(255,214,0,.2);}.bo:hover{background:rgba(255,214,0,.2);}
.bsm{padding:5px 11px;font-size:11px;}
.badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;}
.bg{background:rgba(0,200,83,.12);color:#00C853;border:1px solid rgba(0,200,83,.2);}
.bgo{background:rgba(255,214,0,.1);color:#FFD600;border:1px solid rgba(255,214,0,.18);}
.bgr{background:rgba(204,34,34,.1);color:#FF4444;border:1px solid rgba(204,34,34,.18);}
.bgm{background:rgba(120,120,120,.1);color:#888;border:1px solid #2A2A2A;}
.bgb{background:rgba(100,149,237,.1);color:#6495ED;border:1px solid rgba(100,149,237,.18);}
.card{background:#141414;border:1px solid #1E1E1E;border-radius:10px;}
.sg{display:grid;grid-template-columns:repeat(auto-fill,minmax(175px,1fr));gap:10px;margin-bottom:22px;}
.sc{background:#141414;border:1px solid #1E1E1E;border-radius:10px;padding:16px 18px;}
.sv{font-size:26px;font-weight:800;font-family:'Inter',sans-serif;margin-bottom:2px;}
.sl{font-size:10px;color:#555;text-transform:uppercase;letter-spacing:.05em;}
.ss{font-size:11px;color:#00C853;margin-top:3px;}
table{width:100%;border-collapse:collapse;}
th{text-align:left;padding:9px 13px;font-size:10px;color:#444;text-transform:uppercase;letter-spacing:.05em;font-weight:700;border-bottom:1px solid #1A1A1A;background:#0F0F0F;white-space:nowrap;}
td{padding:11px 13px;border-bottom:1px solid #181818;font-size:13px;vertical-align:middle;}
tr:last-child td{border-bottom:none;}
tr:hover td{background:rgba(255,255,255,.015);}
.inp{padding:8px 11px;background:#1C1C1C;border:1px solid #2A2A2A;border-radius:7px;color:#F0F0F0;font-family:'Inter',sans-serif;font-size:13px;outline:none;transition:border-color .13s;}
.inp:focus{border-color:#00C853;}
select.inp{appearance:none;cursor:pointer;}
.st{font-size:15px;font-weight:700;font-family:'Inter',sans-serif;margin-bottom:14px;display:flex;align-items:center;gap:8px;}
.alert{padding:11px 14px;border-radius:7px;font-size:13px;margin-bottom:14px;}
.ag{background:rgba(0,200,83,.08);border:1px solid rgba(0,200,83,.2);color:#00C853;}
.ay{background:rgba(255,214,0,.06);border:1px solid rgba(255,214,0,.2);color:#FFD600;}
.ar{background:rgba(204,34,34,.08);border:1px solid rgba(204,34,34,.2);color:#FF4444;}
.bar-bg{height:5px;background:#1E1E1E;border-radius:3px;overflow:hidden;flex:1;}
.bar-fill{height:100%;border-radius:3px;background:#00C853;transition:width .6s;}
.chart{display:flex;align-items:flex-end;gap:7px;height:110px;margin-top:10px;padding-bottom:22px;}
.cb2{flex:1;background:rgba(0,200,83,.15);border-radius:4px 4px 0 0;position:relative;cursor:pointer;transition:background .15s;}
.cb2:hover{background:rgba(0,200,83,.35);}
.cbl2{position:absolute;bottom:-20px;left:50%;transform:translateX(-50%);font-size:10px;color:#444;white-space:nowrap;}
.cval{position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:10px;color:#00C853;white-space:nowrap;opacity:0;transition:.15s;}
.cb2:hover .cval{opacity:1;}
.mo{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(3px);}
.md{background:#141414;border:1px solid #2A2A2A;border-radius:14px;width:100%;max-width:460px;animation:su .18s ease;}
@keyframes su{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.mh{padding:18px 22px 14px;border-bottom:1px solid #1E1E1E;display:flex;align-items:center;justify-content:space-between;}
.mb{padding:18px 22px;}
.mf{padding:12px 22px 18px;border-top:1px solid #1E1E1E;display:flex;gap:8px;justify-content:flex-end;}
.lw{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0C0C0C;}
.lb{background:#141414;border:1px solid #1E1E1E;border-radius:14px;padding:36px;width:100%;max-width:380px;}
.otp{display:flex;gap:7px;justify-content:center;}
.ob{width:44px;height:52px;text-align:center;font-size:20px;font-weight:700;background:#1C1C1C;border:2px solid #2A2A2A;border-radius:7px;color:#F0F0F0;outline:none;transition:border-color .13s;}
.ob:focus{border-color:#00C853;}
.vc{background:repeating-linear-gradient(45deg,#1A1A1A,#1A1A1A 8px,#141414 8px,#141414 16px);border:2px dashed #00C853;border-radius:10px;padding:18px;text-align:center;}
.tag{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background:rgba(0,200,83,.08);color:#00C853;border:1px solid rgba(0,200,83,.15);}
.two{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
@media(max-width:900px){.sidebar{display:none}.two{grid-template-columns:1fr}}
.toast{position:fixed;bottom:22px;right:22px;z-index:200;background:#1E1E1E;border:1px solid #333;border-radius:10px;padding:12px 16px;font-size:13px;display:flex;align-items:center;gap:9px;max-width:320px;box-shadow:0 8px 28px rgba(0,0,0,.5);animation:su .2s ease;}
`;

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function Login({onLogin}){
  const [email,setEmail]=useState("");const [pass,setPass]=useState("");const [err,setErr]=useState("");
  const [step,setStep]=useState("creds");const [otp,setOtp]=useState("");
  const go=()=>{if(email==="admin@wekasoko.co.ke"&&pass==="admin123"){setStep("otp");}else setErr("Use admin@wekasoko.co.ke / admin123");};
  return(
    <div className="lw">
      <div className="lb">
        <div style={{textAlign:"center",marginBottom:26}}>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:800}}>Weka<span style={{color:"#00C853"}}>Soko</span></h2>
          <p style={{color:"#444",fontSize:12,marginTop:3}}>Admin Panel — Restricted Access</p>
        </div>
        {err&&<div className="alert ar" style={{marginBottom:14}}>{err}</div>}
        {step==="creds"?<>
          <div style={{marginBottom:12}}><label style={{display:"block",fontSize:10,color:"#444",marginBottom:5,textTransform:"uppercase",letterSpacing:".06em"}}>Admin Email</label><input className="inp" style={{width:"100%"}} value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@wekasoko.co.ke"/></div>
          <div style={{marginBottom:18}}><label style={{display:"block",fontSize:10,color:"#444",marginBottom:5,textTransform:"uppercase",letterSpacing:".06em"}}>Password</label><input className="inp" type="password" style={{width:"100%"}} value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="••••••••"/></div>
          <button className="btn bp" style={{width:"100%",padding:12}} onClick={go}>Continue →</button>
        </>:<>
          <div className="alert ag" style={{marginBottom:14,fontSize:12}}>📧 OTP sent to {email}. Demo: use <strong>123456</strong></div>
          <div style={{marginBottom:18}}><label style={{display:"block",fontSize:10,color:"#444",marginBottom:5,textTransform:"uppercase",letterSpacing:".06em"}}>6-Digit OTP</label>
            <input className="inp" style={{width:"100%",fontSize:20,textAlign:"center",letterSpacing:".3em"}} value={otp} onChange={e=>setOtp(e.target.value)} maxLength={6} placeholder="——————"/>
          </div>
          <button className="btn bp" style={{width:"100%",padding:12}} onClick={()=>otp==="123456"?onLogin({name:"Admin",email}):setErr("Invalid OTP. Use 123456.")} disabled={otp.length<6}>Verify & Sign In</button>
        </>}
        <p style={{textAlign:"center",marginTop:14,fontSize:11,color:"#222"}}>🔒 Restricted to platform administrators only.</p>
      </div>
    </div>
  );
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
function Toast({msg,type,onClose}){
  useEffect(()=>{const t=setTimeout(onClose,3500);return()=>clearTimeout(t);},[]);
  return <div className="toast"><span>{type==="success"?"✅":type==="error"?"❌":"ℹ️"}</span><span>{msg}</span></div>;
}

// ── CONFIRM ───────────────────────────────────────────────────────────────────
function Confirm({title,body,onConfirm,onClose,danger}){
  return(
    <div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="md">
        <div className="mh"><h4 style={{fontWeight:700}}>{title}</h4><button className="btn bs bsm" onClick={onClose} style={{padding:"3px 8px"}}>✕</button></div>
        <div className="mb"><p style={{color:"#888",fontSize:14,lineHeight:1.6}}>{body}</p></div>
        <div className="mf"><button className="btn bs" onClick={onClose}>Cancel</button><button className={`btn ${danger?"br":"bp"}`} onClick={()=>{onConfirm();onClose();}}>Confirm</button></div>
      </div>
    </div>
  );
}

// ── BAR CHART ─────────────────────────────────────────────────────────────────
function Chart({data,vk,lk}){
  const max=Math.max(...data.map(d=>d[vk]));
  return(
    <div className="chart">
      {data.map(d=>(
        <div key={d[lk]} className="cb2" style={{height:`${(d[vk]/max)*100}%`}}>
          <span className="cval">{d[vk].toLocaleString()}</span>
          <span className="cbl2">{d[lk]}</span>
        </div>
      ))}
    </div>
  );
}

// ── OVERVIEW ──────────────────────────────────────────────────────────────────
function Overview({d}){
  const s=d.stats;
  return(
    <div>
      <div className="st">📊 Platform Overview</div>
      <div className="sg">
        <div className="sc"><div className="sv" style={{color:"#00C853"}}>{s.totalUsers.toLocaleString()}</div><div className="sl">Total Users</div><div className="ss">+{s.newToday} today</div></div>
        <div className="sc"><div className="sv">{s.activeListings}</div><div className="sl">Active Ads</div><div className="ss">{s.totalListings.toLocaleString()} total</div></div>
        <div className="sc"><div className="sv">{s.sold.toLocaleString()}</div><div className="sl">Ads Sold</div><div className="ss">{((s.sold/s.totalListings)*100).toFixed(1)}% conversion</div></div>
        <div className="sc"><div className="sv" style={{color:"#FFD600"}}>{fmtKES(s.totalRevenue)}</div><div className="sl">Total Revenue</div><div className="ss">Till 5673935</div></div>
        <div className="sc"><div className="sv">{s.pendingUnlocks}</div><div className="sl">Pending Unlocks</div><div className="ss">{fmtKES(s.pendingUnlocks*250)} potential</div></div>
        <div className="sc"><div className="sv">{s.activeEscrows}</div><div className="sl">Active Escrows</div><div className="ss">{fmtKES(s.escrowVolume)} held</div></div>
        <div className="sc"><div className="sv" style={{color:"#FF4444"}}>{s.flagged}</div><div className="sl">Flagged Accounts</div><div className="ss">{s.suspended} suspended</div></div>
        <div className="sc"><div className="sv" style={{color:"#FF4444"}}>{s.openDisputes}</div><div className="sl">Open Disputes</div><div className="ss">Needs review</div></div>
      </div>
      <div className="two" style={{marginBottom:18}}>
        <div className="card" style={{padding:18}}>
          <div className="st" style={{fontSize:13,marginBottom:4}}>📈 Monthly Revenue (KSh)</div>
          <div style={{height:132,paddingBottom:22}}><Chart data={d.revenue} vk="r" lk="m"/></div>
        </div>
        <div className="card" style={{padding:18}}>
          <div className="st" style={{fontSize:13,marginBottom:14}}>💰 Revenue Split</div>
          {[{l:"Unlock Fees",v:s.unlockRevenue,t:s.totalRevenue},{l:"Escrow Fees (2.5%)",v:s.escrowFees,t:s.totalRevenue}].map(r=>(
            <div key={r.l} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:12}}>
                <span style={{color:"#888"}}>{r.l}</span><span style={{fontWeight:700}}>{fmtKES(r.v)}</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div className="bar-bg"><div className="bar-fill" style={{width:Math.round(r.v/r.t*100)+"%"}}/></div>
                <span style={{fontSize:11,color:"#444",minWidth:28}}>{Math.round(r.v/r.t*100)}%</span>
              </div>
            </div>
          ))}
          <div style={{marginTop:14,padding:"10px 12px",background:"rgba(0,200,83,.05)",borderRadius:7,border:"1px solid rgba(0,200,83,.1)",fontSize:12}}>
            💳 All payments to Till <strong style={{color:"#00C853"}}>5673935</strong>
          </div>
        </div>
      </div>
      <div className="card" style={{padding:18}}>
        <div className="st" style={{fontSize:13,marginBottom:14}}>🏷 Categories Performance</div>
        <table>
          <thead><tr><th>Category</th><th>Active</th><th>Sold</th><th>Performance</th></tr></thead>
          <tbody>{d.categories.sort((a,b)=>b.sold-a.sold).map(c=>(
            <tr key={c.cat}>
              <td style={{fontWeight:600}}>{c.cat}</td><td>{c.active}</td>
              <td><span className="badge bg">{c.sold}</span></td>
              <td><div style={{display:"flex",alignItems:"center",gap:8}}><div className="bar-bg" style={{width:100}}><div className="bar-fill" style={{width:Math.round(c.sold/Math.max(...d.categories.map(x=>x.sold))*100)+"%"}}/></div></div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ── USERS ─────────────────────────────────────────────────────────────────────
function Users({data,setData,notify}){
  const [q,setQ]=useState("");const [f,setF]=useState("all");const [conf,setConf]=useState(null);
  const filtered=data.users.filter(u=>{
    const ms=!q||u.name.toLowerCase().includes(q.toLowerCase())||u.email.includes(q);
    const mf=f==="all"||u.status===f||u.role===f;return ms&&mf;
  });
  const act=(type,u)=>{
    const actions={
      suspend:()=>setData(p=>({...p,users:p.users.map(x=>x.id===u.id?{...x,status:"suspended"}:x)})),
      restore:()=>setData(p=>({...p,users:p.users.map(x=>x.id===u.id?{...x,status:"active"}:x)})),
      dismiss:()=>setData(p=>({...p,users:p.users.map(x=>x.id===u.id?{...x,status:"active"}:x)})),
      approve_free:()=>setData(p=>({...p,users:p.users.map(x=>x.id===u.id?{...x,approved:true}:x)})),
    };
    const msgs={suspend:`Suspend ${u.name}?`,restore:`Restore ${u.name}'s account?`,dismiss:`Dismiss flag on ${u.name}?`,approve_free:`Grant ${u.name} a free unlock? Their next ad unlock will be free.`};
    setConf({title:"Confirm Action",body:msgs[type],onConfirm:()=>{actions[type]();notify(`Done: ${type} on ${u.name}.`,"success");},danger:type==="suspend"});
  };
  return(
    <div>
      <div className="st">👥 Users ({data.users.length})</div>
      <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
        <input className="inp" placeholder="Search name or email..." value={q} onChange={e=>setQ(e.target.value)} style={{flex:1,minWidth:180}}/>
        <select className="inp" value={f} onChange={e=>setF(e.target.value)}>
          <option value="all">All</option><option value="seller">Sellers</option><option value="buyer">Buyers</option>
          <option value="flagged">Flagged</option><option value="suspended">Suspended</option>
        </select>
      </div>
      <div className="card">
        <table>
          <thead><tr><th>Name</th><th>Role</th><th>M-Pesa</th><th>Status</th><th>Violations</th><th>Actions</th></tr></thead>
          <tbody>{filtered.map(u=>(
            <tr key={u.id}>
              <td><div style={{fontWeight:600}}>{u.name}</div><div style={{fontSize:11,color:"#444"}}>{u.email}</div></td>
              <td><span className={`badge ${u.role==="seller"?"bgo":"bgb"}`}>{u.role}</span></td>
              <td style={{color:"#666",fontSize:12}}>{u.mpesa}</td>
              <td><span className={`badge ${u.status==="active"?"bg":u.status==="flagged"?"bgo":"bgr"}`}>{u.status}</span>{u.approved&&<span className="badge bg" style={{marginLeft:4}}>Free ✓</span>}</td>
              <td>{u.violations>0?<span style={{color:"#FF4444",fontWeight:700}}>{u.violations}</span>:<span style={{color:"#333"}}>0</span>}</td>
              <td><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {u.status!=="suspended"&&<button className="btn br bsm" onClick={()=>act("suspend",u)}>Suspend</button>}
                {u.status==="suspended"&&<button className="btn bs bsm" onClick={()=>act("restore",u)}>Restore</button>}
                {u.status==="flagged"&&<button className="btn bo bsm" onClick={()=>act("dismiss",u)}>Dismiss</button>}
                {!u.approved&&<button className="btn bs bsm" onClick={()=>act("approve_free",u)}>Free Unlock</button>}
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {conf&&<Confirm {...conf} onClose={()=>setConf(null)}/>}
    </div>
  );
}

// ── LISTINGS ──────────────────────────────────────────────────────────────────
function Listings({data,setData,notify}){
  const [q,setQ]=useState("");const [conf,setConf]=useState(null);
  const filtered=data.listings.filter(l=>!q||l.title.toLowerCase().includes(q.toLowerCase()));
  const approveFree=(l)=>setConf({title:"Approve Free Ad",body:`Allow "${l.title}" seller to bypass the KSh 250 unlock fee? This is a one-time approval and will be logged.`,onConfirm:()=>{setData(p=>({...p,listings:p.listings.map(x=>x.id===l.id?{...x,freeApproved:true}:x)}));notify(`Free unlock approved for "${l.title}".`,"success");},danger:false});
  return(
    <div>
      <div className="st">📦 All Listings</div>
      <input className="inp" placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)} style={{width:"100%",marginBottom:14}}/>
      <div className="card">
        <table>
          <thead><tr><th>Title</th><th>Seller</th><th>Price</th><th>Category</th><th>Status</th><th>Views</th><th>Actions</th></tr></thead>
          <tbody>{filtered.map(l=>(
            <tr key={l.id}>
              <td><div style={{fontWeight:600}}>{l.title}</div>{l.flagged&&<span className="badge bgr" style={{marginTop:3}}>⚠️ Flagged</span>}{l.freeApproved&&<span className="badge bg" style={{marginTop:3,marginLeft:4}}>Free ✓</span>}</td>
              <td><div style={{fontSize:12}}>{l.seller}</div><div style={{fontSize:11,color:"#444"}}>{l.sellerEmail}</div></td>
              <td style={{fontWeight:700,color:"#00C853"}}>{fmtKES(l.price)}</td>
              <td><span className="badge bgm">{l.category}</span></td>
              <td><span className={`badge ${l.status==="active"?"bg":"bgm"}`}>{l.status}</span></td>
              <td style={{color:"#666"}}>{l.views}</td>
              <td>{!l.freeApproved&&l.status==="active"&&<button className="btn bp bsm" onClick={()=>approveFree(l)}>Approve Free</button>}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {conf&&<Confirm {...conf} onClose={()=>setConf(null)}/>}
    </div>
  );
}

// ── VIOLATIONS ────────────────────────────────────────────────────────────────
function Violations({data,setData,notify}){
  const unread=data.violations.filter(v=>!v.reviewed).length;
  const act=(type,v)=>{
    const fns={
      dismiss:()=>setData(p=>({...p,violations:p.violations.map(x=>x.id===v.id?{...x,reviewed:true}:x)})),
      warn:()=>setData(p=>({...p,violations:p.violations.map(x=>x.id===v.id?{...x,reviewed:true}:x)})),
      suspend:()=>setData(p=>({...p,violations:p.violations.map(x=>x.id===v.id?{...x,reviewed:true}:x),users:p.users.map(x=>x.email===v.email?{...x,status:"suspended"}:x)})),
    };
    fns[type]();notify(`${type} applied to ${v.user}.`,"success");
  };
  return(
    <div>
      <div className="st">🚨 Chat Violations</div>
      {unread>0&&<div className="alert ay" style={{marginBottom:14}}>⚠️ {unread} pending review</div>}
      <div className="card">
        <table>
          <thead><tr><th>User</th><th>Blocked Message</th><th>Severity</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>{data.violations.map(v=>(
            <tr key={v.id}>
              <td><div style={{fontWeight:600}}>{v.user}</div><div style={{fontSize:11,color:"#444"}}>{v.listing}</div></td>
              <td><div style={{background:"rgba(255,68,68,.06)",border:"1px solid rgba(255,68,68,.12)",borderRadius:6,padding:"5px 9px",fontSize:12,color:"#FF8888",fontStyle:"italic",maxWidth:200}}>{v.message}</div></td>
              <td><span className={`badge ${v.severity==="warning"?"bgo":v.severity==="flagged"?"bo":"bgr"}`}>{v.severity}</span></td>
              <td style={{color:"#444",fontSize:12}}>{v.date}</td>
              <td>{!v.reviewed?<div style={{display:"flex",gap:5}}><button className="btn bs bsm" onClick={()=>act("dismiss",v)}>Dismiss</button><button className="btn bo bsm" onClick={()=>act("warn",v)}>Warn</button><button className="btn br bsm" onClick={()=>act("suspend",v)}>Suspend</button></div>:<span className="badge bgm">Done</span>}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ── ESCROW ────────────────────────────────────────────────────────────────────
function Escrow({data,setData,notify}){
  const [conf,setConf]=useState(null);
  const approve=(e)=>setConf({title:"Approve Escrow",body:`Approve the escrow for "${e.listing}"? This will allow funds to be held. Buyer and seller will be notified via email and WhatsApp.`,onConfirm:()=>{setData(p=>({...p,escrows:p.escrows.map(x=>x.id===e.id?{...x,approved:true}:x)}));notify(`Escrow approved for ${e.listing}.`,"success");},danger:false});
  const release=(e)=>setConf({title:"Release Funds",body:`Release ${fmtKES(e.total)} to seller for "${e.listing}"? Seller's M-Pesa will be credited. This cannot be undone.`,onConfirm:()=>{setData(p=>({...p,escrows:p.escrows.map(x=>x.id===e.id?{...x,status:"released"}:x)}));notify(`Funds released for ${e.listing}.`,"success");},danger:false});
  const refund=(e)=>setConf({title:"Refund Buyer",body:`Refund ${fmtKES(e.total)} to buyer for "${e.listing}"? Buyer's M-Pesa will be credited. This cannot be undone.`,onConfirm:()=>{setData(p=>({...p,escrows:p.escrows.map(x=>x.id===e.id?{...x,status:"refunded"}:x)}));notify(`Refund issued for ${e.listing}.`,"success");},danger:true});
  return(
    <div>
      <div className="st">🔐 Escrow Management</div>
      <div className="alert ay" style={{marginBottom:14,fontSize:12}}>⚠️ All escrow approvals are logged and require admin confirmation. Funds move to/from Till <strong>5673935</strong>.</div>
      <div className="sg" style={{gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",marginBottom:18}}>
        <div className="sc"><div className="sv">{data.escrows.filter(e=>e.status==="holding").length}</div><div className="sl">Holding</div></div>
        <div className="sc"><div className="sv" style={{color:"#FF4444"}}>{data.escrows.filter(e=>e.status==="disputed").length}</div><div className="sl">Disputed</div></div>
        <div className="sc"><div className="sv" style={{color:"#00C853"}}>{data.escrows.filter(e=>e.status==="released").length}</div><div className="sl">Released</div></div>
        <div className="sc"><div className="sv" style={{color:"#FFD600"}}>{fmtKES(data.stats.escrowFees)}</div><div className="sl">Fees Earned</div></div>
      </div>
      <div className="card" style={{marginBottom:18}}>
        <table>
          <thead><tr><th>Listing</th><th>Buyer</th><th>Amount</th><th>Fee (2.5%)</th><th>Status</th><th>Approved</th><th>Actions</th></tr></thead>
          <tbody>{data.escrows.map(e=>(
            <tr key={e.id}>
              <td style={{fontWeight:600}}>{e.listing}</td>
              <td style={{fontSize:12,color:"#888"}}>{e.buyer}</td>
              <td style={{fontWeight:700}}>{fmtKES(e.amount)}</td>
              <td style={{color:"#FFD600"}}>{fmtKES(e.fee)}</td>
              <td><span className={`badge ${e.status==="holding"?"bgo":e.status==="disputed"?"bgr":e.status==="released"?"bg":"bgm"}`}>{e.status}</span></td>
              <td>{e.approved?<span className="badge bg">✓ Yes</span>:<span className="badge bgr">Pending</span>}</td>
              <td><div style={{display:"flex",gap:5}}>
                {!e.approved&&<button className="btn bp bsm" onClick={()=>approve(e)}>Approve</button>}
                {e.approved&&(e.status==="holding"||e.status==="disputed")&&<><button className="btn bp bsm" onClick={()=>release(e)}>Release →</button><button className="btn br bsm" onClick={()=>refund(e)}>Refund</button></>}
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {data.disputes.length>0&&<>
        <div className="st" style={{fontSize:13}}>⚖️ Open Disputes</div>
        <div className="card">
          <table>
            <thead><tr><th>Listing</th><th>Raised By</th><th>Reason</th><th>Amount</th><th>Status</th><th>Resolve</th></tr></thead>
            <tbody>{data.disputes.map(d=>(
              <tr key={d.id}>
                <td style={{fontWeight:600}}>{d.listing}</td><td style={{color:"#888"}}>{d.raisedBy}</td>
                <td style={{fontSize:12,color:"#888",maxWidth:180}}>{d.reason}</td>
                <td style={{fontWeight:700}}>{fmtKES(d.amount)}</td>
                <td><span className={`badge ${d.status==="open"?"bgr":"bg"}`}>{d.status}</span></td>
                <td>{d.status==="open"&&<div style={{display:"flex",gap:5}}>
                  <button className="btn bp bsm" onClick={()=>{setData(p=>({...p,disputes:p.disputes.map(x=>x.id===d.id?{...x,status:"resolved"}:x)}));notify("Resolved in seller's favour.","success");}}>→ Seller</button>
                  <button className="btn bs bsm" onClick={()=>{setData(p=>({...p,disputes:p.disputes.map(x=>x.id===d.id?{...x,status:"resolved"}:x)}));notify("Resolved in buyer's favour.","success");}}>→ Buyer</button>
                </div>}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </>}
      {conf&&<Confirm {...conf} onClose={()=>setConf(null)}/>}
    </div>
  );
}

// ── PAYMENTS ──────────────────────────────────────────────────────────────────
function Payments({data}){
  return(
    <div>
      <div className="st">💳 Payment Records — Till 5673935</div>
      <div className="alert ag" style={{marginBottom:14,fontSize:12}}>All payments flow to M-Pesa Till Number <strong>5673935</strong>. Receipts are sent to user email, WhatsApp and platform inbox.</div>
      <div className="card">
        <table>
          <thead><tr><th>Type</th><th>Payer</th><th>Listing</th><th>Amount</th><th>Status</th><th>Date</th><th>M-Pesa Receipt</th></tr></thead>
          <tbody>{data.payments.map(p=>(
            <tr key={p.id}>
              <td><span className={`badge ${p.type==="unlock"?"bg":"bgo"}`}>{p.type}</span></td>
              <td style={{fontWeight:600}}>{p.payer}</td>
              <td style={{color:"#888",fontSize:12}}>{p.listing}</td>
              <td style={{fontWeight:700,color:"#00C853"}}>{fmtKES(p.amount)}</td>
              <td><span className={`badge ${p.status==="confirmed"?"bg":"bgr"}`}>{p.status}</span></td>
              <td style={{color:"#444",fontSize:12}}>{p.date}</td>
              <td style={{fontSize:12,color:"#444",fontFamily:"monospace"}}>{p.receipt||"—"}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ── VOUCHERS ──────────────────────────────────────────────────────────────────
function Vouchers({data,setData,notify}){
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({type:"unlock",discount:100,desc:"",maxUses:50,expires:""});
  const sf=(k,v)=>setForm(p=>({...p,[k]:v}));
  const create=()=>{
    const code=genCode();
    const nv={id:"vc"+Date.now(),code,type:form.type,discount:parseInt(form.discount),desc:form.desc,createdBy:"Admin",uses:0,maxUses:parseInt(form.maxUses),expires:form.expires,active:true};
    setData(p=>({...p,vouchers:[nv,...p.vouchers]}));
    notify(`Voucher ${code} created!`,"success");setShow(false);
    setForm({type:"unlock",discount:100,desc:"",maxUses:50,expires:""});
  };
  const toggle=(vc)=>setData(p=>({...p,vouchers:p.vouchers.map(x=>x.id===vc.id?{...x,active:!x.active}:x)}));
  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <div className="st" style={{marginBottom:0}}>🎟 Voucher Management</div>
        <button className="btn bp" onClick={()=>setShow(true)}>+ Generate Voucher</button>
      </div>
      {show&&<div className="card" style={{padding:18,marginBottom:18}}>
        <div style={{fontWeight:700,marginBottom:14,fontSize:13}}>New Voucher</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          <div><label style={{display:"block",fontSize:10,color:"#555",marginBottom:4,textTransform:"uppercase"}}>Type</label>
            <select className="inp" style={{width:"100%"}} value={form.type} onChange={e=>sf("type",e.target.value)}>
              <option value="unlock">Unlock Fee (KSh 250)</option><option value="escrow">Escrow Fee (2.5%)</option><option value="both">Both</option>
            </select>
          </div>
          <div><label style={{display:"block",fontSize:10,color:"#555",marginBottom:4,textTransform:"uppercase"}}>Discount %</label>
            <input className="inp" style={{width:"100%"}} type="number" min={1} max={100} value={form.discount} onChange={e=>sf("discount",e.target.value)}/>
          </div>
          <div><label style={{display:"block",fontSize:10,color:"#555",marginBottom:4,textTransform:"uppercase"}}>Description</label>
            <input className="inp" style={{width:"100%"}} placeholder="e.g. Launch promo" value={form.desc} onChange={e=>sf("desc",e.target.value)}/>
          </div>
          <div><label style={{display:"block",fontSize:10,color:"#555",marginBottom:4,textTransform:"uppercase"}}>Max Uses</label>
            <input className="inp" style={{width:"100%"}} type="number" value={form.maxUses} onChange={e=>sf("maxUses",e.target.value)}/>
          </div>
          <div><label style={{display:"block",fontSize:10,color:"#555",marginBottom:4,textTransform:"uppercase"}}>Expires</label>
            <input className="inp" style={{width:"100%"}} type="date" value={form.expires} onChange={e=>sf("expires",e.target.value)}/>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn bp" onClick={create} disabled={!form.desc}>Generate</button>
          <button className="btn bs" onClick={()=>setShow(false)}>Cancel</button>
        </div>
      </div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
        {data.vouchers.map(vc=>(
          <div key={vc.id} className="vc" style={{opacity:vc.active?1:.5}}>
            <div style={{fontFamily:"monospace",fontSize:20,fontWeight:700,color:"#00C853",letterSpacing:".1em",marginBottom:8}}>{vc.code}</div>
            <div style={{fontSize:12,color:"#888",marginBottom:4}}>{vc.desc}</div>
            <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:12,flexWrap:"wrap"}}>
              <span className="tag">{vc.type}</span>
              <span className="tag">{vc.discount}% off</span>
              <span className="tag">{vc.uses}/{vc.maxUses} uses</span>
              {vc.expires&&<span className="tag">Exp: {vc.expires}</span>}
            </div>
            <button className={`btn bsm ${vc.active?"br":"bp"}`} onClick={()=>toggle(vc)}>{vc.active?"Deactivate":"Activate"}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── FOLLOW-UPS ────────────────────────────────────────────────────────────────
function FollowUps({data,setData,notify}){
  const send=(f)=>{
    setData(p=>({...p,followUps:p.followUps.map(x=>x.id===f.id?{...x,status:"sent",lastFollowUp:new Date().toISOString().split("T")[0]}:x)}));
    notify(`Follow-up sent to ${f.seller} via WhatsApp and inbox.`,"success");
  };
  return(
    <div>
      <div className="st">🔔 Automated Follow-Ups</div>
      <div className="alert ay" style={{marginBottom:14,fontSize:12}}>Sellers are automatically messaged every 2.5 weeks if their ad has not been marked as sold. Follow-ups go via WhatsApp and platform inbox.</div>
      <div className="card">
        <table>
          <thead><tr><th>Listing</th><th>Seller</th><th>Phone</th><th>Posted</th><th>Last Follow-Up</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{data.followUps.map(f=>(
            <tr key={f.id}>
              <td style={{fontWeight:600}}>{f.listing}</td>
              <td style={{fontSize:12}}>{f.seller}</td>
              <td style={{color:"#888",fontSize:12}}>{f.phone}</td>
              <td style={{color:"#444",fontSize:12}}>{f.posted}</td>
              <td style={{color:"#444",fontSize:12}}>{f.lastFollowUp}</td>
              <td><span className={`badge ${f.status==="sent"?"bg":"bgo"}`}>{f.status}</span>{f.response&&<div style={{fontSize:11,color:"#00C853",marginTop:3}}>"{f.response}"</div>}</td>
              <td><button className="btn bp bsm" onClick={()=>send(f)}>Send Now</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ── MAIN ADMIN ────────────────────────────────────────────────────────────────
export default function Admin(){
  const [admin,setAdmin]=useState(null);
  const [ap,setAp]=useState("overview");
  const [data,setData]=useState(DEMO);
  const [toast,setToast]=useState(null);
  const notify=useCallback((msg,type="success")=>setToast({msg,type,id:Date.now()}),[]);
  const NAV=[
    {id:"overview",ic:"📊",label:"Overview"},
    {id:"users",ic:"👥",label:"Users",badge:data.users.filter(u=>u.status==="flagged").length},
    {id:"listings",ic:"📦",label:"Listings"},
    {id:"violations",ic:"🚨",label:"Violations",badge:data.violations.filter(v=>!v.reviewed).length},
    {id:"escrow",ic:"🔐",label:"Escrow & Disputes",badge:data.disputes.filter(d=>d.status==="open").length+data.escrows.filter(e=>!e.approved&&e.status==="holding").length},
    {id:"payments",ic:"💳",label:"Payments"},
    {id:"vouchers",ic:"🎟",label:"Vouchers"},
    {id:"followups",ic:"🔔",label:"Follow-Ups"},
  ];
  if(!admin)return <><style>{CSS}</style><Login onLogin={setAdmin}/></>;
  return(<>
    <style>{CSS}</style>
    <div className="layout">
      <div className="sidebar">
        <div className="slogo"><h2>Weka<span>Soko</span></h2><p>Admin Panel</p></div>
        <div style={{flex:1,paddingTop:10}}>
          <div className="ns">Main</div>
          {NAV.map(n=>(
            <div key={n.id} className={`ni ${ap===n.id?"on":""}`} onClick={()=>setAp(n.id)}>
              <span className="ic">{n.ic}</span><span style={{flex:1}}>{n.label}</span>
              {n.badge>0&&<span style={{background:"#FF4444",color:"#fff",borderRadius:10,padding:"1px 6px",fontSize:10,fontWeight:700}}>{n.badge}</span>}
            </div>
          ))}
        </div>
        <div style={{padding:"14px 20px",borderTop:"1px solid #1A1A1A"}}>
          <div style={{fontSize:11,color:"#333",marginBottom:6}}>Signed in as</div>
          <div style={{fontWeight:600,fontSize:13}}>{admin.name}</div>
          <div style={{fontSize:11,color:"#333",marginBottom:10}}>{admin.email}</div>
          <button className="btn bs bsm" style={{width:"100%"}} onClick={()=>setAdmin(null)}>Sign Out</button>
        </div>
      </div>
      <div className="main">
        <div className="topbar">
          <div>
            <div style={{fontWeight:700,fontSize:14}}>{NAV.find(n=>n.id===ap)?.label}</div>
            <div style={{fontSize:11,color:"#333",marginTop:1}}>{new Date().toLocaleDateString("en-KE",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            {data.violations.filter(v=>!v.reviewed).length>0&&<button className="btn br bsm" onClick={()=>setAp("violations")}>🚨 {data.violations.filter(v=>!v.reviewed).length} Violations</button>}
            {data.disputes.filter(d=>d.status==="open").length>0&&<button className="btn bo bsm" onClick={()=>setAp("escrow")}>⚖️ {data.disputes.filter(d=>d.status==="open").length} Disputes</button>}
          </div>
        </div>
        <div className="content">
          {ap==="overview"&&<Overview d={data}/>}
          {ap==="users"&&<Users data={data} setData={setData} notify={notify}/>}
          {ap==="listings"&&<Listings data={data} setData={setData} notify={notify}/>}
          {ap==="violations"&&<Violations data={data} setData={setData} notify={notify}/>}
          {ap==="escrow"&&<Escrow data={data} setData={setData} notify={notify}/>}
          {ap==="payments"&&<Payments data={data}/>}
          {ap==="vouchers"&&<Vouchers data={data} setData={setData} notify={notify}/>}
          {ap==="followups"&&<FollowUps data={data} setData={setData} notify={notify}/>}
        </div>
      </div>
    </div>
    {toast&&<Toast key={toast.id} msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
  </>);
}
