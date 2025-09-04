import React from "react"; 
import { createRoot } from "react-dom/client";

function App(){
  const [msg,setMsg]=React.useState("checking...");

  React.useEffect(()=>{ 
    const api=(import.meta as any).env.VITE_API_URL || "http://localhost:8000";

    fetch(api+"/test")
    .then(r=>r.json())
    //.then(d=>setMsg(JSON.stringify(d)))
    .then(d => setMsg(d.msg))
    .catch(()=>setMsg("backend unreachable")); 
  },[]);

  return <div style={{padding:16}}><h1>Construction Copilot (demo)</h1><p>Backend: {msg}</p></div>;
}
createRoot(document.getElementById("root")!).render(<App/>);
