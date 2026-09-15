import { ArrowRight, Hexagon, ShieldAlert } from "lucide-react";
import { FormEvent, useState } from "react";

export interface Session { name: string; workspace: string }

export function Login({ onLogin }: { onLogin: (session: Session) => void }) {
  const [name, setName] = useState("");
  const [workspace, setWorkspace] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onLogin({ name: name.trim(), workspace: workspace.trim() || "K&K Aarnas" });
  }

  return <div className="login-screen">
    <form className="login-card" onSubmit={submit}>
      <div className="login-brand"><span className="brand-mark"><Hexagon size={22}/><i/></span><span><strong>AIDOS</strong><small>Distribution OS</small></span></div>
      <h1>Enter your workspace</h1>
      <p>Give AIDOS a name and a workspace to greet you by while you explore the demo.</p>
      <label>Your name<input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Vurimi" autoFocus required/></label>
      <label>Workspace<input value={workspace} onChange={e => setWorkspace(e.target.value)} placeholder="e.g. K&K Aarnas"/></label>
      <button className="primary" type="submit">Enter workspace <ArrowRight size={16}/></button>
      <div className="login-note"><ShieldAlert size={15}/><span>Demo access only — nothing is verified or password-protected. This just personalizes the workspace on this browser.</span></div>
    </form>
  </div>;
}
