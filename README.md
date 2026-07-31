# Mentora AI

Mentora AI is a comprehensive, intelligent learning platform designed to help students and developers master computer science concepts, prepare for technical interviews, and learn algorithms through interactive, AI-driven experiences.

The platform combines the modern Next.js ecosystem with powerful local and cloud-based AI models to provide personalized tutoring, real-time code execution, and adaptive learning modes.

---

## 🚀 Features

Mentora AI is composed of several specialized modules:

- **🎓 AI RAG (Intelligent Teaching Engine)**: Upload study materials (PDFs) and chat with an adaptive AI tutor. Features multiple learning modes (Socratic, Feynman, Exam, Hint) and automatically adjusts its teaching style based on your estimated learner level (Beginner, Intermediate, Advanced).
- **🗣️ AI Interviewer**: A live, conversational AI that conducts mock technical interviews, evaluates your responses, and provides detailed feedback and scoring.
- **💻 Smart Editor**: An intelligent, Monaco-powered code editor with AI autocomplete, real-time feedback, and interactive coding sessions.
- **🧩 SVM Quest (Code Challenge)**: A gamified, interactive sandbox to learn Support Vector Machines (SVM) by playing through the actual training loop and adjusting hyperparameters visually.
- **📝 Summarizer**: Automatically generate concise summaries from lengthy educational content (e.g., YouTube lectures).
- **📊 Algorithms Visualization**: Interactive visualizations to help you understand complex data structures and algorithms intuitively.
- **📄 Resume Matcher** *(In Development)*: Analyze and match your resume against job descriptions.
- **🗺️ Roadmap** *(In Development)*: Personalized learning paths for your career goals.

---

## 🛠️ Technology Stack

### Frontend & Core Application
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Library**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/) (`@monaco-editor/react`)

### Backend & APIs
- **Next.js API Routes**: Handles lightweight backend operations, authentication, and external API proxying.
- **Python FastAPI Service**: A dedicated local Python microservice (`/backend`) that powers the AI RAG engine.
  - *Libraries*: `fastapi`, `langchain`, `langgraph`, `chromadb`, `pymupdf4llm`

### AI & Machine Learning
- **Cloud LLM**: [OpenRouter API](https://openrouter.ai/) for high-tier generative tasks.
- **Local AI**: [Ollama](https://ollama.ai/) for privacy-focused, zero-cost local inference (used heavily in the AI Interviewer and RAG engine).
  - *Required Models*: `gemma3:4b` (LLM), `nomic-embed-text` (Embeddings)

---

## ⚙️ Setup & Installation

To run Mentora AI locally, you need to start **three** separate services: the Next.js frontend, the Python FastAPI backend, and the local Ollama server.

### 1. Prerequisites
- **Node.js** (v18+) and **pnpm** installed.
- **Python** (v3.9+) installed.
- **Ollama** installed and running on your machine.

### 2. Configure Environment Variables
Create a `.env.local` file in the root of the project and add your OpenRouter API key:
\`\`\`env
OPENROUTER_API_KEY=your_openrouter_api_key_here
\`\`\`

### 3. Setup Local Ollama Models
Ensure your local Ollama server is running, then pull the required models in your terminal:
\`\`\`bash
ollama pull gemma3:4b
ollama pull nomic-embed-text
\`\`\`

### 4. Start the Python FastAPI Backend (RAG Engine)
Open a terminal, navigate to the `backend` directory, install dependencies, and start the server:
\`\`\`bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --port 8000
\`\`\`
*(The backend runs on `http://localhost:8000`)*

### 5. Start the Next.js Frontend
Open a new terminal in the project root, install the Node dependencies, and start the dev server:
\`\`\`bash
pnpm install
pnpm dev
\`\`\`
*(The frontend runs on `http://localhost:3000`)*

---

## 🏗️ Project Structure

\`\`\`text
mentora-backup2/
├── app/                  # Next.js App Router (Pages & API Routes)
│   ├── ai-interviewer/   # AI Interviewer module
│   ├── ai-rag/           # RAG Teaching Engine page
│   ├── algorithms/       # Algorithm visualizations
│   ├── api/              # Next.js backend API routes
│   ├── code-challenge/   # SVM Quest and coding challenges
│   ├── smart-editor/     # Monaco editor integration
│   └── summarizer/       # Content summarizer module
├── backend/              # Python FastAPI Microservice (RAG logic)
│   ├── main.py           # FastAPI server entry point
│   ├── rag_pipeline.py   # LangChain/Ollama document processing
│   ├── prompts.py        # System prompts for learning modes
│   └── requirements.txt  # Python dependencies
├── components/           # Reusable React components (shadcn, etc.)
│   ├── ai-rag/           # RAG specific frontend components
│   ├── smart-editor/     # Editor specific components
│   └── ui/               # Core UI building blocks
├── lib/                  # Utility functions and shared logic
└── public/               # Static assets
\`\`\`

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.