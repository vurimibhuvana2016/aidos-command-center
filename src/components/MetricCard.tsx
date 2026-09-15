import type { LucideIcon } from "lucide-react";

export function MetricCard({ label, value, note, icon:Icon, tone="mint", trend }: { label:string; value:string; note:string; icon:LucideIcon; tone?:string; trend?:string }) {
  return <article className="metric-card"><div className={`metric-icon ${tone}`}><Icon size={18}/></div><div className="metric-head"><span>{label}</span>{trend && <b>{trend}</b>}</div><strong>{value}</strong><p>{note}</p></article>;
}
