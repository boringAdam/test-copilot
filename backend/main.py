from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/health")
def health(): return {"ok": True}

@app.get("/api/demo")
def demo(): return {"msg": "Hello from FastAPI"}

@app.get("/test")
def demo(): return {"msg": "TEST: OK"}
