import { Activity, Boxes, ChartNoAxesCombined, Database, Gauge, Hexagon, LogOut, Menu, Sparkles, X } from "lucide-react";
import type { Session } from "./Login";
import type { Page } from "../types";

const nav: { page: Page; icon: typeof Gauge; eyebrow?: string }[] = [
  { page:"Command center", icon:Gauge },
  { page:"Inventory", icon:Boxes },
  { page:"Forecast", icon:ChartNoAxesCombined },
  { page:"Action center", icon:Activity, eyebrow:"3" },
  { page:"Data hub", icon:Database },
];

const initials = (name: string) => name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join("") || "?";

interface Props { page: Page; setPage: (page: Page) => void; open: boolean; setOpen: (v:boolean) => void; session: Session; onLogout: () => void; }

export function Sidebar({ page, setPage, open, setOpen, session, onLogout }: Props) {
  return <>
    <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation"><Menu size={20}/></button>
    {open && <button className="sidebar-scrim" onClick={() => setOpen(false)} aria-label="Close navigation"/>}
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="brand"><span className="brand-mark"><Hexagon size={22}/><i/></span><span><strong>AIDOS</strong><small>Distribution OS</small></span></div>
      <button className="sidebar-close" onClick={() => setOpen(false)} aria-label="Close navigation"><X size={18}/></button>
      <div className="workspace-label">Workspace</div>
      <button className="workspace-card"><span className="workspace-avatar">{initials(session.workspace)}</span><span><strong>{session.workspace}</strong><small>Hyderabad · Main depot</small></span><span className="live-dot"/></button>
      <nav>
        <span className="nav-label">Intelligence</span>
        {nav.map(({ page: item, icon: Icon, eyebrow }) => <button key={item} className={page === item ? "active" : ""} onClick={() => { setPage(item); setOpen(false); }}><Icon size={18}/><span>{item}</span>{eyebrow && <b>{eyebrow}</b>}</button>)}
      </nav>
      <div className="sidebar-note"><Sparkles size={17}/><div><strong>Demo environment</strong><p>Safe sample data · no API key required</p></div></div>
      <button className="sidebar-user" onClick={onLogout} aria-label="Log out">{session.picture ? <img className="user-avatar" src={session.picture} alt=""/> : <span className="user-avatar">{initials(session.name)}</span>}<span><strong>{session.name}</strong><small>{session.email ?? "Operations manager"}</small></span><LogOut size={16}/></button>
    </aside>
  </>;
}
