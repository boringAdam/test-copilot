import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

type Msg = { from: "user" | "ai"; text: string };
const STORAGE_KEY = "copilot.chat.v1";

function App() {
  const [messages, setMessages] = React.useState<Msg[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
    catch { return []; }
  });
  const [input, setInput] = React.useState("");
  const api = (import.meta as any).env.VITE_API_URL || "http://localhost:8000";

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((p) => [...p, { from: "user", text: userMsg }]);
    setInput("");

    const r = await fetch(api + "/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMsg,
        history: messages.map(m => ({ role: m.from === "user" ? "user" : "assistant", content: m.text }))
      }),
    });
    const data = await r.json();
    setMessages((p) => [...p, { from: "ai", text: r.ok ? data.reply : (data.detail || "Error") }]);
  }

  return (
    <div className="chat-container">
      <div className="console">
        <div className="banner"><span className="lamp"></span><h1>Terminal · Copilot</h1></div>
        <div className="status">/dev/tty0 · session: #1 · model: gpt-4o-mini</div>
        <div className="chat-box">
          {messages.map((m, i) => <div key={i} className={`msg ${m.from}`}>{m.text}</div>)}
        </div>
        <form onSubmit={send} className="chat-input">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="type a prompt…" />
          <button type="submit">Send</button>
          <button type="button" onClick={() => { localStorage.removeItem(STORAGE_KEY); setMessages([]); }}>
            Clear
          </button>
        </form>
      </div>
      <div className="footer">▲ READY — type to interact • Ctrl+Enter to send (optional)</div>
    </div>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
