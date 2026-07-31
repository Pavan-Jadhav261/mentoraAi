from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import tempfile
import os
import re

from rag_pipeline import MultimodalRAG, OllamaConnectionError, OllamaModelNotFoundError

app = FastAPI(title="Mentora AI RAG Backend")

# Allow requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG system globally (lazy load)
rag_system = None

def get_rag():
    global rag_system
    if rag_system is None:
        rag_system = MultimodalRAG()
    return rag_system

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    question: str
    history: List[ChatMessage]
    learning_mode: str
    learner_level: str
    hint_level: int

@app.get("/api/test")
async def test_connection():
    try:
        rag = get_rag()
        msg = rag.test_connection()
        return {"status": "success", "message": msg}
    except OllamaConnectionError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except OllamaModelNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    rag = get_rag()
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
        content = await file.read()
        tmp_file.write(content)
        tmp_path = tmp_file.name
        
    try:
        chunks = rag.load_and_process_pdf(tmp_path)
        return {"status": "success", "chunks": chunks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)

@app.post("/api/chat")
async def chat(request: ChatRequest):
    rag = get_rag()
    
    try:
        # Convert Pydantic history to dict
        history_dicts = [{"role": msg.role, "content": msg.content} for msg in request.history]
        
        response_text = rag.chat(
            question=request.question,
            history=history_dicts,
            mode=request.learning_mode,
            level=request.learner_level,
            hint_level=request.hint_level
        )
        
        # Parse for adaptive level upgrade
        level_match = re.search(r"\[LEVEL:\s*(Beginner|Intermediate|Advanced)\]", response_text, re.IGNORECASE)
        new_level = None
        if level_match:
            new_level = level_match.group(1).title()
            response_text = re.sub(r"\[LEVEL:\s*(Beginner|Intermediate|Advanced)\]", "", response_text, flags=re.IGNORECASE).strip()
            
        return {
            "answer": response_text,
            "new_level": new_level
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
