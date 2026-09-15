import type { Risk } from "../types";
export function RiskPill({ risk, label }: { risk: Risk; label?: string }) { return <span className={`risk-pill ${risk}`}><i/>{label ?? risk}</span>; }
