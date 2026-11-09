# 🧠 Mentora AI

**Mentora AI** is an AI-powered learning and development platform designed to help students and developers learn computer science, practice technical interviews, understand algorithms, and write better code.

A major focus of Mentora is **local AI inference**, using **Ollama and locally running LLMs** to provide privacy-focused, context-aware AI assistance.

---

## 🚀 Features

### 🎓 AI RAG — Intelligent Tutor
Upload PDFs and learn from your own study material with an adaptive AI tutor.

- RAG-powered document understanding
- Beginner, Intermediate, and Advanced learning levels
- Socratic, Feynman, Exam, and Hint modes
- Context-aware tutoring powered by local LLMs

### 💻 Smart IDE
A Monaco-based intelligent code editor that understands code **in real time**.

- Tracks code as the user types
- Does not submit code while the user is actively typing
- When the user pauses, the current code context is sent to the **local LLM**
- Completed code blocks can be submitted automatically after approximately 5 lines
- Detects syntax errors, logical issues, and potential bugs
- Maintains surrounding code context for better AI feedback
- Local inference through Ollama keeps source code on the user's machine

The goal is to make the IDE behave like an intelligent coding partner without interrupting the developer's workflow.

### 🎙️ Local AI Voice Agent
A conversational voice agent powered by the **local LLM through Ollama**.

Users can:

- Ask programming questions
- Discuss their current code
- Get debugging help
- Ask for concept explanations
- Interact with Mentora while learning or coding

The voice agent can use the current coding context to provide more relevant answers.

### 🗣️ AI Interviewer
A conversational technical interviewer that:

- Conducts mock interviews
- Asks adaptive technical questions
- Evaluates answers
- Provides feedback and scoring
- Uses local AI for conversational reasoning

### 🧩 SVM Quest
A gamified environment for learning Support Vector Machines through an interactive training loop.

- Adjust SVM hyperparameters
- Visualize decision boundaries
- Experiment with model behavior
- Learn ML concepts interactively

### 📝 AI Summarizer
Generate concise summaries from educational content such as lectures, videos, and technical material.

### 📊 Algorithm Visualization
Interactive visualizations for understanding data structures and algorithms step by step.

### 🗺️ Personalized Roadmap
**In development:** personalized learning paths based on career goals, skill level, and knowledge gaps.

---

## 🤖 Local-First AI

Mentora is designed around **local AI using Ollama**.

```text
Mentora AI
    │
    ├── Smart IDE
    ├── AI Tutor
    ├── AI Interviewer
    └── Voice Agent
             │
             ▼
          Ollama
             │
             ▼
       Local LLMs
```

Required models:

```bash
ollama pull gemma3:4b
ollama pull nomic-embed-text
```

Local inference provides:

- 🔒 Better privacy
- ⚡ Low-latency AI interactions
- 💰 Reduced cloud AI dependency
- 🛡️ Local code and document processing

Cloud inference through **OpenRouter** is also supported for higher-tier generative tasks.

---

## 🛠️ Tech Stack

**Frontend**
- Next.js
- React
- Tailwind CSS
- shadcn/ui
- Monaco Editor
- Lucide React

**Backend**
- Next.js API Routes
- Python FastAPI
- LangChain
- LangGraph
- ChromaDB
- PyMuPDF4LLM

**AI**
- Ollama
- Gemma 3 4B
- Nomic Embed Text
- OpenRouter

---

## ⚙️ Setup

### 1. Install dependencies

Requirements:

- Node.js 18+
- pnpm
- Python 3.9+
- Ollama

### 2. Configure environment

Create `.env.local`:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 3. Install local models

```bash
ollama pull gemma3:4b
ollama pull nomic-embed-text
```

### 4. Start FastAPI

```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --port 8000
```

### 5. Start Next.js

```bash
pnpm install
pnpm dev
```

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:8000
```

---

## 🎯 Vision

Mentora AI brings together **learning, coding, interviews, algorithms, voice interaction, and local AI** into one intelligent environment.

> **Learn. Code. Practice. Interact — powered by AI that can run locally on your machine.**
