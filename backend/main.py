from http.client import HTTPException
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI, RateLimitError, APIError

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

client = OpenAI()

class ChatIn(BaseModel):
    message: str
    history: List[Dict[str, str]] = []


@app.post("/ai/chat")
def ai_chat(body: ChatIn):
    try:
        msgs = [{"role":"system","content":"You are a helpful construction estimator copilot."}]
        msgs += body.history
        msgs += [{"role":"user","content": body.message}]
        resp = client.chat.completions.create(model="gpt-4o-mini", max_tokens=300, messages=msgs)
        return {"reply": resp.choices[0].message.content}
    except RateLimitError:
        # clean 429 to frontend
        raise HTTPException(status_code=429, detail="OpenAI quota exceeded. Check plan/billing.")
    except APIError as e:
        raise HTTPException(status_code=502, detail=f"OpenAI API error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {e}")



@app.get("/health")
def health(): return {"ok": True}

@app.get("/api/demo")
def demo(): return {"msg": "Hello from FastAPI"}

@app.get("/test")
def demo(): return {"msg": "TEST: OK"}







