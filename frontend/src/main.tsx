import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [msg, setMsg] = React.useState("say hi to the AI…");
  const [input, setInput] = React.useState("");
  const api = (import.meta as any).env.VITE_API_URL || "http://localhost:8000";

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch(api + "/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await r.json();
    setMsg(data.reply);
    setInput("");
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>Copilot (demo)</h1>
      <form onSubmit={send}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask the copilot…" />
        <button type="submit">Send</button>
      </form>
      <p><b>AI:</b> {msg}</p>
    </div>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
