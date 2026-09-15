import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, Bell, Box, Boxes, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronRight, CircleDollarSign, Clock3, CloudUpload, Download, FileCheck2, Filter, Gauge, IndianRupee, Info, Layers3, PackageCheck, Plus, RefreshCcw, Search, ShieldCheck, Sparkles, TrendingDown, TrendingUp, TriangleAlert, Upload, WalletCards, X } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Cell, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Copilot } from "./components/Copilot";
import { Login, type Session } from "./components/Login";
import { MetricCard } from "./components/MetricCard";
import { RiskPill } from "./components/RiskPill";
import { Sidebar } from "./components/Sidebar";
import { categoryMix, initialActivity, products as demoProducts, salesTrend } from "./data/demo";
import { analyzeAll } from "./lib/intelligence";
import type { Activity, Insight, Page, Product, Risk } from "./types";

const STORAGE_KEY = "aidos-command-center-v1";
const SESSION_KEY = "aidos-session-v1";
const money = (n:number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const num = (n:number) => Math.round(n).toLocaleString("en-IN");

function App() {
  const [session, setSession] = useState<Session | null>(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
  });
  const [page, setPage] = useState<Page>("Command center");
  const [products, setProducts] = useState<Product[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null")?.products ?? demoProducts; } catch { return demoProducts; }
  });
  const [activity, setActivity] = useState<Activity[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null")?.activity ?? initialActivity; } catch { return initialActivity; }
  });
  const [customFields, setCustomFields] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null")?.customFields ?? []; } catch { return []; }
  });
  const [copilot, setCopilot] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState("");
  const insights = useMemo(() => analyzeAll(products), [products]);

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify({ products, activity, customFields })), [products, activity, customFields]);
  useEffect(() => { const key = (e:KeyboardEvent) => { if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k"){ e.preventDefault(); setCopilot(v=>!v); } }; window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key); }, []);
  function notify(message:string) { setToast(message); window.setTimeout(() => setToast(""), 2800); }
  function addActivity(label:string, type:Activity["type"] = "approved") { setActivity(a => [{ id:String(Date.now()), type, label, time:"Just now" }, ...a]); notify("Added to today's action plan"); }
  function resetDemo() { localStorage.removeItem(STORAGE_KEY); setProducts(demoProducts); setActivity(initialActivity); setCustomFields([]); notify("Demo workspace restored"); }
  function updateProductField(sku:string, field:string, value:string) {
    setProducts(ps => ps.map(p => p.sku === sku ? { ...p, extraFields: { ...p.extraFields, [field]: value } } : p));
  }
  function addCustomField(name:string) {
    const clean = name.trim();
    if (!clean || customFields.includes(clean)) return;
    setCustomFields(cf => [...cf, clean]);
    setProducts(ps => ps.map(p => ({ ...p, extraFields: { ...p.extraFields, [clean]: p.extraFields?.[clean] ?? "" } })));
  }
  function removeCustomField(name:string) {
    setCustomFields(cf => cf.filter(f => f !== name));
    setProducts(ps => ps.map(p => {
      if (!p.extraFields || !(name in p.extraFields)) return p;
      const rest = { ...p.extraFields }; delete rest[name];
      return { ...p, extraFields: rest };
    }));
  }
  function mergeCustomFields(names:string[]) {
    setCustomFields(cf => Array.from(new Set([...cf, ...names])));
  }
  function handleLogin(s: Session) { setSession(s); try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch { /* ignore */ } }
  function handleLogout() { setSession(null); try { localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ } }

  if (!session) return <Login onLogin={handleLogin}/>;

  return <div className="app-shell">
    <Sidebar page={page} setPage={setPage} open={mobileNav} setOpen={setMobileNav} session={session} onLogout={handleLogout}/>
    <div className="main-column">
      <Topbar page={page} onCopilot={() => setCopilot(true)}/>
      <main>
        {page === "Command center" && <Dashboard insights={insights} activity={activity} setPage={setPage} onApprove={addActivity} openCopilot={()=>setCopilot(true)} name={session.name}/>}
        {page === "Inventory" && <Inventory insights={insights} customFields={customFields} onFieldChange={updateProductField}/>}
        {page === "Forecast" && <Forecast insights={insights}/>}
        {page === "Action center" && <ActionCenter insights={insights} activity={activity} onApprove={addActivity}/>}
        {page === "Data hub" && <DataHub products={products} setProducts={setProducts} onImport={label=>addActivity(label,"imported")} resetDemo={resetDemo} customFields={customFields} onAddField={addCustomField} onRemoveField={removeCustomField} onMergeFields={mergeCustomFields}/>}
      </main>
    </div>
    <Copilot insights={insights} open={copilot} setOpen={setCopilot} onApprove={addActivity} name={session.name}/>
    {toast && <div className="toast"><CheckCircle2 size={18}/>{toast}</div>}
  </div>;
}

function Topbar({ page, onCopilot }:{ page:Page; onCopilot:()=>void }) {
  return <header className="topbar"><div><span>Operations</span><ChevronRight size={13}/><strong>{page}</strong></div><div className="topbar-actions"><span className="last-sync"><i/> Data synced 2 min ago</span><button className="icon-button" aria-label="Notifications"><Bell size={19}/><b>3</b></button><button className="ask-button" onClick={onCopilot}><Sparkles size={16}/> Ask AIDOS <kbd>⌘ K</kbd></button></div></header>;
}

function PageHead({ eyebrow, title, copy, actions }:{ eyebrow:string; title:string; copy:string; actions?:React.ReactNode }) {
  return <div className="page-head"><div><span>{eyebrow}</span><h1>{title}</h1><p>{copy}</p></div>{actions && <div className="page-actions">{actions}</div>}</div>;
}

function Dashboard({ insights, activity, setPage, onApprove, openCopilot, name }:{ insights:Insight[]; activity:Activity[]; setPage:(p:Page)=>void; onApprove:(s:string)=>void; openCopilot:()=>void; name:string }) {
  const critical = insights.filter(x=>x.risk === "critical");
  const watch = insights.filter(x=>x.risk === "watch");
  const inventoryValue = insights.reduce((a,x)=>a+x.product.stock*x.product.unitPrice,0);
  const riskValue = insights.reduce((a,x)=>a+x.exposure,0);
  const service = Math.max(0, Math.round(97.8-critical.length*1.8-watch.length*.4));
  const riskRank = { critical: 0, watch: 1, healthy: 2 };
  const top = [...insights].sort((a,b) => riskRank[a.risk] - riskRank[b.risk]);
  return <>
    <PageHead eyebrow="Monday · 14 September" title={`Good morning, ${name}.`} copy="Here’s what needs your attention across the Hyderabad depot." actions={<><button className="secondary" onClick={()=>setPage("Data hub")}><Upload size={16}/> Import data</button><button className="primary" onClick={openCopilot}><Sparkles size={16}/> Ask AIDOS</button></>}/>
    <section className="attention-strip"><span className="attention-icon"><TriangleAlert size={20}/></span><div><strong>{critical.length} decisions need attention today</strong><p>Acting now could protect <b>{money(riskValue)}</b> in inventory value and maintain service levels.</p></div><button onClick={()=>setPage("Action center")}>Review decisions <ArrowRight size={16}/></button></section>
    <section className="metric-grid">
      <MetricCard label="Inventory value" value={money(inventoryValue)} note="Across 8 active SKUs" icon={WalletCards} tone="blue" trend="+4.2%"/>
      <MetricCard label="Service level" value={`${service}%`} note="On-time fulfilment" icon={Gauge} trend="+1.1%"/>
      <MetricCard label="At-risk value" value={money(riskValue)} note={`${critical.length + watch.length} items need review`} icon={AlertTriangle} tone="coral"/>
      <MetricCard label="Forecast accuracy" value="92.4%" note="7-day weighted MAPE" icon={TrendingUp} tone="amber" trend="+2.8%"/>
    </section>
    <section className="dashboard-grid">
      <article className="panel trend-panel"><PanelTitle title="Demand pulse" copy="Actual vs. projected unit movement" action="10-day view"/><div className="chart-legend"><span><i className="actual"/>Actual</span><span><i className="projected"/>AIDOS forecast</span><b><TrendingUp size={14}/> Demand +12.6%</b></div><div className="trend-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={salesTrend} margin={{top:15,right:10,left:-25,bottom:0}}><defs><linearGradient id="mintFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#29d3a2" stopOpacity=".28"/><stop offset="1" stopColor="#29d3a2" stopOpacity="0"/></linearGradient></defs><CartesianGrid strokeDasharray="4 5" vertical={false} stroke="#e8eeeb"/><XAxis dataKey="day" tickLine={false} axisLine={false} tick={{fontSize:11,fill:"#84918d"}}/><YAxis tickLine={false} axisLine={false} tick={{fontSize:11,fill:"#84918d"}}/><Tooltip contentStyle={{borderRadius:12,border:"1px solid #dfe8e4",boxShadow:"0 8px 30px #16362e18"}}/><Area type="monotone" dataKey="actual" stroke="#20b889" strokeWidth={2.5} fill="url(#mintFill)" connectNulls={false}/><Line type="monotone" dataKey="forecast" stroke="#365eeb" strokeWidth={2.5} strokeDasharray="6 5" dot={false}/></AreaChart></ResponsiveContainer></div></article>
      <article className="panel risk-panel"><PanelTitle title="Risk radar" copy="Current inventory health" action="Live"/><div className="risk-radar-body"><div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{value:critical.length,color:"#fb755e"},{value:watch.length,color:"#ffbd66"},{value:insights.length-critical.length-watch.length,color:"#29d3a2"}]} dataKey="value" innerRadius={57} outerRadius={72} paddingAngle={4} cornerRadius={5}>{["#fb755e","#ffbd66","#29d3a2"].map(c=><Cell key={c} fill={c}/>)}</Pie></PieChart></ResponsiveContainer><div><strong>{insights.length}</strong><span>SKUs tracked</span></div></div><div className="risk-counts"><div><i className="critical"/><span><strong>{critical.length}</strong> Critical</span><small>Act today</small></div><div><i className="watch"/><span><strong>{watch.length}</strong> Watch</span><small>Monitor</small></div><div><i className="healthy"/><span><strong>{insights.length-critical.length-watch.length}</strong> Healthy</span><small>On track</small></div></div></div></article>
    </section>
    <section className="lower-grid">
      <article className="panel signals-panel"><PanelTitle title="Priority signals" copy="Ranked by operational impact" action={<button className="text-button" onClick={()=>setPage("Action center")}>View all <ArrowRight size={14}/></button>}/><div className="signal-list">{top.slice(0,4).map((item,i)=><SignalRow key={item.product.sku} insight={item} rank={i+1} approve={()=>onApprove(item.action)}/>)}</div></article>
      <article className="panel activity-panel"><PanelTitle title="Decision trail" copy="Recent workspace activity" action="Today"/><div className="activity-list">{activity.slice(0,4).map(a=><div key={a.id}><span className={a.type}><ActivityIcon type={a.type}/></span><p><strong>{a.label}</strong><small>{a.time}</small></p></div>)}</div><button className="audit-button"><ShieldCheck size={15}/> View complete audit log</button></article>
    </section>
  </>;
}

function PanelTitle({title,copy,action}:{title:string;copy:string;action:React.ReactNode}) { return <header className="panel-title"><div><h2>{title}</h2><p>{copy}</p></div>{typeof action === "string" ? <span>{action}</span> : action}</header>; }

function ActivityIcon({type}:{type:Activity["type"]}) { return type === "imported" ? <CloudUpload size={15}/> : type === "reviewed" ? <FileCheck2 size={15}/> : <Check size={15}/>; }

function SignalRow({insight,rank,approve}:{insight:Insight;rank:number;approve:()=>void}) {
  const [open,setOpen] = useState(false); const [done,setDone] = useState(false);
  return <div className={`signal-row ${open ? "expanded" : ""}`}><button className="signal-main" onClick={()=>setOpen(!open)}><span className="rank">0{rank}</span><span className={`product-glyph ${insight.risk}`}><Box size={18}/></span><span className="signal-copy"><b>{insight.product.name}</b><small>{insight.product.sku} · {insight.product.category}</small></span><span className="signal-stat"><small>{insight.signal}</small><b>{insight.cover.toFixed(1)} days cover</b></span><RiskPill risk={insight.risk}/><ChevronDown size={17}/></button>{open&&<div className="signal-detail"><div><span>Why AIDOS flagged this</span><p>{insight.reason}</p></div><div><span>Recommended action</span><p>{insight.action}</p></div><button className={done ? "done" : ""} onClick={()=>{if(!done){setDone(true);approve();}}}>{done?<><Check size={15}/> Added</>:<>Add to plan <ArrowRight size={15}/></>}</button></div>}</div>;
}

function Inventory({insights,customFields,onFieldChange}:{insights:Insight[];customFields:string[];onFieldChange:(sku:string,field:string,value:string)=>void}) {
  const [query,setQuery]=useState(""); const [risk,setRisk]=useState<"all"|Risk>("all"); const [selected,setSelected]=useState<Insight|null>(null);
  const rows=insights.filter(x=>(risk==="all"||x.risk===risk)&&(`${x.product.name} ${x.product.sku} ${x.product.category}`.toLowerCase().includes(query.toLowerCase())));
  const selectedLive = selected ? rows.find(x=>x.product.sku===selected.product.sku) ?? selected : null;
  return <><PageHead eyebrow="Inventory intelligence" title="Every SKU, one decision layer." copy="Search movement, cover, freshness, and risk signals in a single view." actions={<button className="secondary"><Download size={16}/> Export report</button>}/><section className="inventory-summary"><div><Boxes/><span><strong>{num(insights.reduce((a,x)=>a+x.product.stock,0))}</strong><small>Units on hand</small></span></div><div><IndianRupee/><span><strong>{money(insights.reduce((a,x)=>a+x.product.stock*x.product.unitPrice,0))}</strong><small>Inventory value</small></span></div><div><PackageCheck/><span><strong>{insights.filter(x=>x.risk==="healthy").length}/{insights.length}</strong><small>SKUs on track</small></span></div></section><section className="panel inventory-panel"><div className="table-toolbar"><label><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search SKU, product, or category…"/></label><div><Filter size={15}/>{(["all","critical","watch","healthy"] as const).map(x=><button className={risk===x?"active":""} onClick={()=>setRisk(x)} key={x}>{x}</button>)}</div></div><div className="data-table-wrap"><table className="data-table"><thead><tr><th>Product</th><th>On hand</th><th>Daily velocity</th><th>Days cover</th><th>Sell-through</th><th>Expiry</th><th>Signal</th><th/></tr></thead><tbody>{rows.map(x=><tr key={x.product.sku} onClick={()=>setSelected(x)}><td><span className={`product-glyph ${x.risk}`}><Box size={17}/></span><span><strong>{x.product.name}</strong><small>{x.product.sku} · {x.product.category}</small></span></td><td><strong>{x.product.stock}</strong> units</td><td>{x.product.dailySales}/day <em className={x.product.demandChange<0?"down":"up"}>{x.product.demandChange>0?"+":""}{x.product.demandChange}%</em></td><td><strong>{x.cover.toFixed(1)}d</strong></td><td><span className="progress"><i style={{width:`${x.product.sellThrough}%`}}/></span>{x.product.sellThrough}%</td><td>{x.product.expiryDays} days</td><td><RiskPill risk={x.risk} label={x.signal}/></td><td><ChevronRight size={16}/></td></tr>)}</tbody></table></div></section>{selectedLive&&<InsightDrawer insight={selectedLive} customFields={customFields} onFieldChange={onFieldChange} close={()=>setSelected(null)}/>}</>;
}

function InsightDrawer({insight,customFields,onFieldChange,close}:{insight:Insight;customFields:string[];onFieldChange:(sku:string,field:string,value:string)=>void;close:()=>void}) { return <div className="drawer-scrim" onClick={close}><aside className="insight-drawer" onClick={e=>e.stopPropagation()}><header><RiskPill risk={insight.risk} label={insight.signal}/><button onClick={close}><X/></button></header><span className={`drawer-glyph ${insight.risk}`}><Box size={25}/></span><h2>{insight.product.name}</h2><p>{insight.product.sku} · {insight.product.category}</p><div className="drawer-metrics"><span><small>Stock</small><strong>{insight.product.stock}</strong></span><span><small>Days cover</small><strong>{insight.cover.toFixed(1)}</strong></span><span><small>Sell-through</small><strong>{insight.product.sellThrough}%</strong></span><span><small>Expires in</small><strong>{insight.product.expiryDays}d</strong></span></div><section><span><Info size={15}/> Why this matters</span><p>{insight.reason}</p></section><section className="drawer-action"><span><Sparkles size={15}/> AIDOS recommendation</span><p>{insight.action}</p><button>Start action <ArrowRight size={15}/></button></section>{customFields.length>0&&<section className="drawer-custom"><span><Layers3 size={15}/> Custom fields</span><div className="custom-field-rows">{customFields.map(f=><label key={f}><small>{f}</small><input value={insight.product.extraFields?.[f] ?? ""} onChange={e=>onFieldChange(insight.product.sku,f,e.target.value)} placeholder="Not set"/></label>)}</div></section>}<footer><ShieldCheck size={15}/> Calculated from workspace data</footer></aside></div>; }

function Forecast({insights}:{insights:Insight[]}) {
  const [sku,setSku]=useState(insights[0]?.product.sku||""); const current=insights.find(x=>x.product.sku===sku)??insights[0];
  const chart=current.product.forecast.map((value,i)=>({day:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i], forecast:value, capacity:Math.round(current.product.stock/7)}));
  return <><PageHead eyebrow="Demand forecasting" title="See demand before it reaches the shelf." copy="A transparent seven-day baseline forecast turns movement into replenishment decisions." actions={<select className="sku-select" value={sku} onChange={e=>setSku(e.target.value)}>{insights.map(x=><option value={x.product.sku} key={x.product.sku}>{x.product.sku} · {x.product.name}</option>)}</select>}/><section className="forecast-hero"><div><span className={`product-glyph ${current.risk}`}><Box size={20}/></span><div><small>Selected product</small><h2>{current.product.name}</h2></div></div><RiskPill risk={current.risk} label={current.signal}/></section><section className="forecast-layout"><article className="panel forecast-chart-panel"><PanelTitle title="7-day demand outlook" copy="Units per day · moving baseline with trend adjustment" action="92.4% accuracy"/><div className="forecast-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chart} margin={{top:15,right:15,left:-20,bottom:0}}><defs><linearGradient id="blueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#537cf1" stopOpacity=".25"/><stop offset="1" stopColor="#537cf1" stopOpacity="0"/></linearGradient></defs><CartesianGrid strokeDasharray="4 5" vertical={false} stroke="#e8eeeb"/><XAxis dataKey="day" tickLine={false} axisLine={false}/><YAxis tickLine={false} axisLine={false}/><Tooltip/><Area type="monotone" dataKey="forecast" stroke="#365eeb" strokeWidth={3} fill="url(#blueFill)"/><Line dataKey="capacity" stroke="#ff9f5a" strokeDasharray="5 5" dot={false}/></AreaChart></ResponsiveContainer></div></article><aside className="forecast-side"><article className="panel"><PanelTitle title="Forecast drivers" copy="Signals influencing the outlook" action={<Sparkles size={16}/>}/><div className="drivers"><div><TrendingUp/><p><strong>Demand momentum</strong><span>{current.product.demandChange>0?"Up":"Down"} {Math.abs(current.product.demandChange)}% vs prior period</span></p></div><div><CalendarDays/><p><strong>Weekly pattern</strong><span>Weekend uplift included</span></p></div><div><Layers3/><p><strong>Recent velocity</strong><span>{current.product.dailySales} units/day baseline</span></p></div></div></article><article className="reorder-card"><span>AIDOS recommendation</span><h3>{current.reorderQty>0?`Reorder ${current.reorderQty} units` : "No reorder needed"}</h3><p>{current.reason}</p><button>Review calculation <ChevronRight size={15}/></button></article></aside></section></>;
}

function ActionCenter({insights,activity,onApprove}:{insights:Insight[];activity:Activity[];onApprove:(s:string)=>void}) {
  const actionable=insights.filter(x=>x.risk!=="healthy");
  return <><PageHead eyebrow="Decision workspace" title="Turn signals into controlled action." copy="Review evidence, accept a recommendation, and leave a traceable decision trail."/><section className="action-stats"><div><strong>{actionable.length}</strong><span>Open decisions</span></div><div><strong>{actionable.filter(x=>x.risk==="critical").length}</strong><span>Due today</span></div><div><strong>{activity.filter(x=>x.type==="approved").length}</strong><span>Approved</span></div><div><strong>{money(actionable.reduce((a,x)=>a+x.exposure,0))}</strong><span>Value protected</span></div></section><section className="action-board">{actionable.map((x,i)=><ActionCard insight={x} key={x.product.sku} number={i+1} onApprove={onApprove}/>)}</section></>;
}

function ActionCard({insight,number,onApprove}:{insight:Insight;number:number;onApprove:(s:string)=>void}) { const [done,setDone]=useState(false); return <article className={`action-card ${done?"completed":""}`}><div className="action-number">{done?<Check size={17}/>:String(number).padStart(2,"0")}</div><div className="action-content"><div><RiskPill risk={insight.risk}/><span>Due {insight.risk==="critical"?"today":"this week"}</span></div><h2>{insight.signal}: {insight.product.name}</h2><p>{insight.reason}</p><section><Sparkles size={16}/><div><span>Recommended action</span><strong>{insight.action}</strong></div></section><footer><span><Clock3 size={14}/> 2 min to review</span><span><CircleDollarSign size={14}/> {money(insight.exposure)} exposure</span><button onClick={()=>{if(!done){setDone(true);onApprove(insight.action)}}}>{done?<>Approved <Check size={15}/></>:<>Review & approve <ArrowRight size={15}/></>}</button></footer></div></article>; }

function DataHub({products,setProducts,onImport,resetDemo,customFields,onAddField,onRemoveField,onMergeFields}:{products:Product[];setProducts:(p:Product[])=>void;onImport:(s:string)=>void;resetDemo:()=>void;customFields:string[];onAddField:(name:string)=>void;onRemoveField:(name:string)=>void;onMergeFields:(names:string[])=>void}) {
  const [drag,setDrag]=useState(false); const [result,setResult]=useState(""); const [newField,setNewField]=useState("");
  const required=["sku","name","category","stock","daily_sales","sell_through","lead_time","safety_stock","expiry_days","unit_price","demand_change"];
  function processCsvText(text:string){
    const lines=text.trim().split(/\r?\n/).filter(l=>l.trim());
    const headers=lines[0].split(",").map(x=>x.trim());
    const missing=required.filter(x=>!headers.includes(x));if(missing.length)throw new Error(`Missing columns: ${missing.join(", ")}`);
    const extraHeaders=headers.filter(h=>!required.includes(h));
    const imported=lines.slice(1).map(line=>{const cells=line.split(",").map(x=>x.trim());const row=Object.fromEntries(headers.map((h,j)=>[h,cells[j]]));return {sku:row.sku,name:row.name,category:row.category,stock:+row.stock,dailySales:+row.daily_sales,sellThrough:+row.sell_through,leadTime:+row.lead_time,safetyStock:+row.safety_stock,expiryDays:+row.expiry_days,unitPrice:+row.unit_price,demandChange:+row.demand_change,forecast:[0,1,2,3,4,5,6].map(n=>Math.max(0,Math.round(+row.daily_sales*(1+(+row.demand_change/100)*(n+1)/7)))),extraFields:Object.fromEntries(extraHeaders.map(h=>[h,row[h]??""]))} as Product;}).filter(x=>x.sku&&x.name);
    setProducts(imported);if(extraHeaders.length)onMergeFields(extraHeaders);
    setResult(`${imported.length} products imported and analyzed successfully.${extraHeaders.length?` Picked up ${extraHeaders.length} extra column${extraHeaders.length===1?"":"s"}: ${extraHeaders.join(", ")}.`:""}`);
    onImport(`${imported.length} inventory rows imported`);
  }
  function parse(file:File){
    const isExcel=/\.(xlsx|xls)$/i.test(file.name);
    const reader=new FileReader();
    reader.onload=async ()=>{
      try{
        if(isExcel){
          const XLSX=await import("xlsx");
          const workbook=XLSX.read(reader.result,{type:"array"});
          const sheet=workbook.Sheets[workbook.SheetNames[0]];
          processCsvText(XLSX.utils.sheet_to_csv(sheet));
        } else {
          processCsvText(String(reader.result));
        }
      }catch(e){setResult(e instanceof Error?e.message:"Could not read this file.");}
    };
    if(isExcel) reader.readAsArrayBuffer(file); else reader.readAsText(file);
  }
  return <><PageHead eyebrow="Connected data" title="Bring your data. Keep the intelligence." copy="Use the included sample now; connect an ERP or Supabase workspace when the pilot is ready." actions={<button className="secondary" onClick={resetDemo}><RefreshCcw size={16}/> Restore demo</button>}/><section className="hub-grid"><article className="panel upload-panel"><span className="step-label">01 · Upload</span><h2>Import inventory snapshot</h2><p>Drop a CSV or Excel export from your existing system. AIDOS validates the schema before updating decisions. Columns beyond the required list are kept automatically as custom fields.</p><label className={`drop-zone ${drag?"drag":""}`} onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);const f=e.dataTransfer.files[0];if(f)parse(f)}}><input type="file" accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" onChange={e=>{const f=e.target.files?.[0];if(f)parse(f)}}/><span><CloudUpload size={24}/></span><strong>Drop inventory CSV or Excel file here</strong><p>.csv, .xlsx, or .xls · or click to browse · maximum 5 MB</p></label>{result&&<div className="import-result"><FileCheck2 size={17}/>{result}</div>}<a className="template-link" href="/demo/aidos_inventory_sample.csv" download><Download size={15}/> Download sample CSV</a></article><article className="panel schema-panel"><span className="step-label">02 · Validate</span><h2>Expected fields</h2><p>Stable SKU codes connect every future sales, supplier, and order record.</p><div>{["sku","name","category","stock","daily_sales","sell_through","lead_time","safety_stock","expiry_days","unit_price","demand_change"].map((x,i)=><span key={x}><Check size={13}/>{x}{i<3&&<b>required</b>}</span>)}</div></article><article className="panel connection-panel"><span className="step-label">03 · Connect later</span><h2>Production-ready path</h2><p>The UI works without cloud services today. When ready, replace local storage with authenticated, row-secured data.</p><div className="flow"><span>CSV / ERP</span><ArrowRight/><span>Supabase</span><ArrowRight/><span>AIDOS</span></div><ul><li><ShieldCheck/>Workspace-level isolation</li><li><RefreshCcw/>Scheduled data sync</li><li><FileCheck2/>Audited decisions</li></ul></article></section><section className="panel custom-fields-panel"><PanelTitle title="Custom fields" copy="Track anything AIDOS doesn't already model — supplier, warehouse, batch code…" action={`${customFields.length} active`}/><form className="field-form" onSubmit={e=>{e.preventDefault();if(newField.trim()){onAddField(newField);setNewField("");}}}><input value={newField} onChange={e=>setNewField(e.target.value)} placeholder="e.g. Supplier"/><button type="submit" className="secondary"><Plus size={15}/> Add field</button></form>{customFields.length?<div className="field-chips">{customFields.map(f=><span key={f}>{f}<button type="button" onClick={()=>onRemoveField(f)} aria-label={`Remove ${f}`}><X size={12}/></button></span>)}</div>:<p className="empty-note">No custom fields yet — add one above, or upload a CSV with extra columns and they'll appear here automatically.</p>}</section><section className="panel data-preview"><PanelTitle title="Current workspace preview" copy={`${products.length} products in the active demo workspace`} action={<span className="connected"><i/> Connected</span>}/><div className="preview-cards">{products.slice(0,6).map(p=><div key={p.sku}><span className="product-glyph healthy"><Box size={16}/></span><p><strong>{p.name}</strong><small>{p.sku}</small></p><b>{p.stock}<small> units</small></b></div>)}</div></section></>;
}

export default App;
