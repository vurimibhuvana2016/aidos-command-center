import { ArrowUp, Bot, Check, ChevronRight, Database, MessageSquareText, ShieldCheck, Sparkles, X } from "lucide-react";
import { FormEvent, useState } from "react";
import type { Insight } from "../types";
import { answerQuestion } from "../lib/intelligence";

type Reply = ReturnType<typeof answerQuestion>;

export function Copilot({ insights, open, setOpen, onApprove, name }: { insights:Insight[]; open:boolean; setOpen:(v:boolean)=>void; onApprove:(label:string)=>void; name:string }) {
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState<Reply>(() => answerQuestion("summary today", insights));
  const [thinking, setThinking] = useState(false);
  const [approved, setApproved] = useState(false);
  const suggestions = ["Why is SKU-104 at risk?", "Which items may expire?", "Summarize today"];

  function ask(e?: FormEvent, value = question) {
    e?.preventDefault();
    if (!value.trim()) return;
    setQuestion(value); setThinking(true); setApproved(false);
    window.setTimeout(() => { setReply(answerQuestion(value, insights)); setThinking(false); }, 480);
  }

  return <>
    {!open && <button className="copilot-fab" onClick={() => setOpen(true)}><Sparkles size={18}/> Ask AIDOS <span>⌘ K</span></button>}
    <aside className={`copilot ${open ? "open" : ""}`} aria-hidden={!open}>
      <header><span className="ai-orb"><Bot size={19}/><i/></span><div><strong>AIDOS Copilot</strong><small><span/> Grounded in workspace data</small></div><button onClick={() => setOpen(false)} aria-label="Close copilot"><X size={19}/></button></header>
      <div className="copilot-scroll">
        <div className="copilot-intro"><Sparkles size={18}/><strong>Hello, {name}.</strong><p>I found three signals that can affect service level or working capital today.</p></div>
        <div className="user-bubble">{question || "Give me today's operating brief."}</div>
        {thinking ? <div className="thinking"><i/><i/><i/> Analyzing connected data</div> : <div className="answer-card">
          <div className="answer-label"><MessageSquareText size={14}/> Answer</div>
          <h3>{reply.title}</h3><p>{reply.answer}</p>
          <div className="evidence"><span><Database size={13}/> Evidence used</span>{reply.evidence.map(item => <div key={item}><Check size={13}/>{item}</div>)}</div>
          <div className="recommendation"><span>Recommended next step</span><p>{reply.action}</p><button className={approved ? "approved" : ""} onClick={() => { if(!approved){ setApproved(true); onApprove(reply.action); } }}>{approved ? <><Check size={15}/> Added to plan</> : <>Review action <ChevronRight size={15}/></>}</button></div>
        </div>}
        <div className="guardrail"><ShieldCheck size={15}/><span><strong>Evidence guardrail</strong> Answers use only imported and calculated workspace data.</span></div>
      </div>
      <form onSubmit={ask} className="copilot-input"><div>{suggestions.map(s => <button type="button" onClick={() => ask(undefined, s)} key={s}>{s}</button>)}</div><label><input value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Ask about inventory, risk, or demand…"/><button aria-label="Send"><ArrowUp size={18}/></button></label></form>
    </aside>
  </>;
}
