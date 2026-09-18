import { ArrowRight, Hexagon, Mail, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { supabase } from "../lib/supabase";

type Mode = "signin" | "register" | "check-email";

export function Login() {
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [workspace, setWorkspace] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      if (mode === "register") {
        const { data, error: err } = await supabase.auth.signUp({
          email, password,
          options: { data: { name: name.trim(), workspace: workspace.trim() || "K&K Aarnas" }, emailRedirectTo: window.location.origin },
        });
        if (err) throw err;
        if (!data.session) setMode("check-email");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function withGoogle() {
    setError(""); setBusy(true);
    const { error: err } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } });
    if (err) { setError(err.message); setBusy(false); }
  }

  if (mode === "check-email") {
    return <div className="login-screen">
      <div className="login-card">
        <div className="login-brand"><span className="brand-mark"><Hexagon size={22}/><i/></span><span><strong>AIDOS</strong><small>Distribution OS</small></span></div>
        <span className="login-check-icon"><Mail size={22}/></span>
        <h1>Check your inbox</h1>
        <p>We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then come back and sign in.</p>
        <button className="secondary" type="button" onClick={() => setMode("signin")}>Back to sign in</button>
      </div>
    </div>;
  }

  return <div className="login-screen">
    <form className="login-card" onSubmit={submit}>
      <div className="login-brand"><span className="brand-mark"><Hexagon size={22}/><i/></span><span><strong>AIDOS</strong><small>Distribution OS</small></span></div>
      <h1>{mode === "register" ? "Create your account" : "Welcome back"}</h1>
      <p>{mode === "register" ? "Real accounts, real email confirmation — your inventory data still stays in this browser only, not on a server yet." : "Sign in to your AIDOS workspace."}</p>

      <button className="google-button-real" type="button" onClick={withGoogle} disabled={busy}>
        <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62Z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18Z"/><path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33Z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58Z"/></svg>
        Continue with Google
      </button>
      <div className="login-divider"><span>or</span></div>

      {mode === "register" && <>
        <label>Your name<input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Vurimi" required/></label>
        <label>Workspace<input value={workspace} onChange={e => setWorkspace(e.target.value)} placeholder="e.g. K&K Aarnas"/></label>
      </>}
      <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" required/></label>
      <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete={mode === "register" ? "new-password" : "current-password"} minLength={6} required/></label>

      {error && <p className="login-error">{error}</p>}

      <button className="primary" type="submit" disabled={busy}>
        {busy ? "Please wait…" : mode === "register" ? "Create account" : "Sign in"} <ArrowRight size={16}/>
      </button>

      <button type="button" className="login-switch" onClick={() => { setError(""); setMode(mode === "register" ? "signin" : "register"); }}>
        {mode === "register" ? "Already have an account? Sign in" : "New here? Create an account"}
      </button>

      <div className="login-note"><ShieldCheck size={15}/><span>Real accounts with email confirmation. Your inventory data stays local to this browser — not synced to a server yet.</span></div>
    </form>
  </div>;
}
