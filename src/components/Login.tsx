import { ArrowRight, Hexagon, ShieldAlert } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

export interface Session { name: string; workspace: string; email?: string; picture?: string }

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

declare global {
  interface Window {
    google?: {
      accounts: { id: {
        initialize: (config: { client_id: string; callback: (resp: { credential: string }) => void }) => void;
        renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
      } };
    };
  }
}

// Decodes the Google ID token's payload only — this is NOT signature verification.
// Good enough to read a name/email/photo for a demo login; a real backend would
// still need to verify the token before trusting it for anything sensitive.
function decodeGoogleCredential(token: string): { name?: string; email?: string; picture?: string } {
  try {
    const payload = token.split(".")[1];
    const json = decodeURIComponent(atob(payload.replace(/-/g, "+").replace(/_/g, "/")).split("").map(c => "%" + c.charCodeAt(0).toString(16).padStart(2, "0")).join(""));
    return JSON.parse(json);
  } catch { return {}; }
}

export function Login({ onLogin }: { onLogin: (session: Session) => void }) {
  const [name, setName] = useState("");
  const [workspace, setWorkspace] = useState("");
  const [google, setGoogle] = useState<{ email?: string; picture?: string }>({});
  const googleButton = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !window.google || !googleButton.current) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (resp) => {
        const info = decodeGoogleCredential(resp.credential);
        if (info.name) setName(info.name);
        setGoogle({ email: info.email, picture: info.picture });
      },
    });
    window.google.accounts.id.renderButton(googleButton.current, { theme: "outline", size: "large", width: 320, text: "continue_with" });
  }, []);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onLogin({ name: name.trim(), workspace: workspace.trim() || "K&K Aarnas", ...google });
  }

  return <div className="login-screen">
    <form className="login-card" onSubmit={submit}>
      <div className="login-brand"><span className="brand-mark"><Hexagon size={22}/><i/></span><span><strong>AIDOS</strong><small>Distribution OS</small></span></div>
      <h1>Enter your workspace</h1>
      <p>Sign in with Google, or just type a name — either way, give AIDOS a workspace to greet you by while you explore the demo.</p>
      {GOOGLE_CLIENT_ID && <><div className="google-button" ref={googleButton}/><div className="login-divider"><span>or</span></div></>}
      <label>Your name<input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Vurimi" autoFocus required/></label>
      <label>Workspace<input value={workspace} onChange={e => setWorkspace(e.target.value)} placeholder="e.g. K&K Aarnas"/></label>
      <button className="primary" type="submit">Enter workspace <ArrowRight size={16}/></button>
      <div className="login-note"><ShieldAlert size={15}/><span>Demo access only — {GOOGLE_CLIENT_ID ? "Google sign-in confirms a real account, but this app" : "nothing is verified or password-protected here, and this app"} still doesn't check anything server-side or separate anyone's data. It just personalizes the workspace on this browser.</span></div>
    </form>
  </div>;
}
