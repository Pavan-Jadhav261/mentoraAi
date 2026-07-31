import os
import requests
from typing_extensions import List, TypedDict, Any
from collections import defaultdict

import pymupdf4llm
from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langgraph.graph import START, StateGraph

from prompts import BASE_GROUNDING, ADAPTIVE_TEACHER, MODE_PROMPTS, HINT_PROMPT

OLLAMA_CONFIG = {
    "base_url": "http://localhost:11434",
    "llm_model": "gemma3:4b",
    "embed_model": "nomic-embed-text"
}

class OllamaConnectionError(Exception):
    pass

class OllamaModelNotFoundError(Exception):
    pass

class RAGState(TypedDict):
    question: str
    chat_history: List[dict]
    learning_mode: str
    learner_level: str
    hint_level: int
    context: List[Document]
    answer: str

class MultimodalRAG:
    def __init__(self, persist_directory="./chroma_db"):
        self.persist_directory = persist_directory
        self._verify_ollama()
        
        self.embeddings = OllamaEmbeddings(
            model=OLLAMA_CONFIG["embed_model"], 
            base_url=OLLAMA_CONFIG["base_url"]
        )
        self.llm = ChatOllama(
            model=OLLAMA_CONFIG["llm_model"],
            base_url=OLLAMA_CONFIG["base_url"]
        )
        self.vector_store = None
        self.graph = self._build_graph()

    def _verify_ollama(self):
        try:
            response = requests.get(f"{OLLAMA_CONFIG['base_url']}/api/tags", timeout=5)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            raise OllamaConnectionError(f"Ollama server is unavailable at {OLLAMA_CONFIG['base_url']}. Please start the server. Error: {e}")
            
        data = response.json()
        available_models = [model['name'] for model in data.get('models', [])]
        
        required_models = [OLLAMA_CONFIG["llm_model"], OLLAMA_CONFIG["embed_model"]]
        missing_models = []
        for model in required_models:
            if model not in available_models and f"{model}:latest" not in available_models:
                missing_models.append(model)
                
        if missing_models:
            raise OllamaModelNotFoundError(f"Missing required Ollama models: {', '.join(missing_models)}. Please run 'ollama pull <model_name>'")

    def test_connection(self):
        """Tests the LLM connection with a simple prompt."""
        response = self.llm.invoke("Hello, Ollama! Reply only with 'Hello from Ollama!'.")
        return response.content

    def _build_graph(self):
        graph_builder = StateGraph(RAGState)
        graph_builder.add_node("retrieve", self.retrieve)
        graph_builder.add_node("generate", self.generate)
        
        graph_builder.add_edge(START, "retrieve")
        graph_builder.add_edge("retrieve", "generate")
        return graph_builder.compile()

    def retrieve(self, state: RAGState):
        if not self.vector_store:
            raise ValueError("Vector store not initialized. Please load a document first.")
        
        retrieved_docs = self.vector_store.similarity_search(state["question"])
        return {"context": retrieved_docs}

    def generate(self, state: RAGState):
        docs_content = "\n\n".join(doc.page_content for doc in state["context"])
        
        # Assemble Prompt
        system_parts = [
            BASE_GROUNDING.format(context=docs_content),
            ADAPTIVE_TEACHER.format(learner_level=state["learner_level"])
        ]
        
        mode = state.get("learning_mode", "Standard Mode")
        if mode == "Hint Mode":
            system_parts.append(HINT_PROMPT.format(hint_level=state["hint_level"]))
        elif mode in MODE_PROMPTS:
            system_parts.append(MODE_PROMPTS[mode])
            
        system_prompt = "\n\n".join(system_parts)
        
        # Convert history
        langchain_messages = [{"role": "system", "content": system_prompt}]
        for msg in state.get("chat_history", []):
            langchain_messages.append({"role": msg["role"], "content": msg["content"]})
            
        langchain_messages.append({"role": "user", "content": state["question"]})
        
        response = self.llm.invoke(langchain_messages)
        return {"answer": response.content}

    def _extract_text_documents(self, md_text):
        page_contents = defaultdict(list)
        page_metadata = {}
        
        for i, text_item in enumerate(md_text):
            metadata = text_item.get('metadata', {})
            page = int(metadata.get('page', i + 1))
            page_contents[page].append(text_item.get('text', ''))
            if page not in page_metadata:
                page_metadata[page] = {
                    'source': metadata.get('file_path', 'unknown'),
                    'page': page
                }
        
        merged_docs = []
        for page in sorted(page_contents.keys()):
            full_content = '\n\n'.join(page_contents[page])
            doc = Document(
                page_content=full_content,
                metadata=page_metadata.get(page, {'page': page})
            )
            merged_docs.append(doc)
        
        return merged_docs

    def load_and_process_pdf(self, file_path, status_callback=None):
        if status_callback: status_callback("Extracting markdown with PyMuPDF4LLM...")
        md_text = pymupdf4llm.to_markdown(doc=file_path, page_chunks=True)
        
        if status_callback: status_callback("Formatting documents...")
        merged_docs = self._extract_text_documents(md_text)
        
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        all_splits = text_splitter.split_documents(merged_docs)
        
        if status_callback: status_callback("Creating local vector store embeddings...")
        self.vector_store = Chroma.from_documents(
            documents=all_splits,
            embedding=self.embeddings,
            persist_directory=self.persist_directory
        )
        
        if status_callback: status_callback("Ready!")
        return len(all_splits)

    def chat(self, question: str, history: List[dict], mode: str, level: str, hint_level: int):
        # Limit history to the last 6 messages to save context space
        limited_history = history[-6:] if len(history) > 6 else history
        
        response = self.graph.invoke({
            "question": question,
            "chat_history": limited_history,
            "learning_mode": mode,
            "learner_level": level,
            "hint_level": hint_level
        })
        return response["answer"]
