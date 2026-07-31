'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, FileText, Send, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ReactMarkdown from 'react-markdown'

const MODE_OPTIONS = [
  "Standard Mode",
  "Socratic Mode",
  "Feynman Mode",
  "Hint Mode",
  "Exam Mode",
  "Interview Mode"
]

export default function RagChat() {
  const [learningMode, setLearningMode] = useState("Standard Mode")
  const [learnerLevel, setLearnerLevel] = useState("Beginner")
  const [hintLevel, setHintLevel] = useState(1)
  
  const [file, setFile] = useState<File | null>(null)
  const [isProcessed, setIsProcessed] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const [ollamaStatus, setOllamaStatus] = useState<"checking" | "connected" | "error">("checking")
  const [ollamaError, setOllamaError] = useState("")

  const [messages, setMessages] = useState<{role: string, content: string}[]>([])
  const [input, setInput] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  useEffect(() => {
    // Check backend connection
    const checkBackend = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/test')
        if (res.ok) {
          setOllamaStatus("connected")
        } else {
          const data = await res.json()
          setOllamaStatus("error")
          setOllamaError(data.detail || "Unknown error")
        }
      } catch (err) {
        setOllamaStatus("error")
        setOllamaError("Backend server is not running on port 8000")
      }
    }
    checkBackend()
  }, [])

  const handleModeChange = (val: string) => {
    setLearningMode(val)
    if (val === "Hint Mode") setHintLevel(1)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setIsProcessed(false)
    }
  }

  const processDocument = async () => {
    if (!file) return
    setIsProcessing(true)
    
    const formData = new FormData()
    formData.append("file", file)
    
    try {
      const res = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData
      })
      
      if (res.ok) {
        setIsProcessed(true)
      } else {
        const data = await res.json()
        alert("Error processing document: " + (data.detail || "Unknown error"))
      }
    } catch (err) {
      alert("Failed to connect to backend server")
    } finally {
      setIsProcessing(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || !isProcessed) return
    
    let currentHintLevel = hintLevel
    if (learningMode === "Hint Mode" && (input.toLowerCase().includes("next hint") || input.toLowerCase().includes("show answer"))) {
      currentHintLevel += 1
      setHintLevel(currentHintLevel)
    }

    const userMessage = { role: "user", content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsThinking(true)

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMessage.content,
          history: messages,
          learning_mode: learningMode,
          learner_level: learnerLevel,
          hint_level: currentHintLevel
        })
      })

      if (res.ok) {
        const data = await res.json()
        setMessages(prev => [...prev, { role: "assistant", content: data.answer }])
        if (data.new_level) {
          setLearnerLevel(data.new_level)
        }
      } else {
        const data = await res.json()
        setMessages(prev => [...prev, { role: "assistant", content: `Error: ${data.detail}` }])
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Error: Failed to connect to backend." }])
    } finally {
      setIsThinking(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full max-w-7xl mx-auto px-4">
      {/* Sidebar Setup */}
      <aside className="w-full md:w-80 flex-shrink-0 flex flex-col gap-6">
        <div className="bg-card border rounded-xl p-5 shadow-sm">
          <h2 className="text-xl font-bold mb-4 font-space">Document Setup</h2>
          
          <div className="mb-6">
            {ollamaStatus === "checking" && (
              <div className="flex items-center text-muted-foreground text-sm gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> Checking connection...
              </div>
            )}
            {ollamaStatus === "connected" && (
              <div className="flex items-center text-green-500 text-sm gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Connected to Local Ollama
              </div>
            )}
            {ollamaStatus === "error" && (
              <div className="flex flex-col text-red-500 text-sm gap-1">
                <div className="flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4" /> Connection Error
                </div>
                <p className="text-xs text-red-400 opacity-90">{ollamaError}</p>
                <p className="text-xs text-muted-foreground mt-1">Make sure you have started your local Python backend (<code>uvicorn main:app --port 8000</code>) and Ollama server.</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium">Upload a PDF Document</label>
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-3 text-center transition-colors hover:border-primary/50 cursor-pointer relative">
              <input 
                type="file" 
                accept="application/pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              <FileText className="w-8 h-8 text-muted-foreground" />
              <div className="text-sm">
                {file ? <span className="font-medium text-primary">{file.name}</span> : <span className="text-muted-foreground">Click or drag PDF to upload</span>}
              </div>
            </div>

            <Button 
              onClick={processDocument} 
              disabled={!file || isProcessing || isProcessed}
              className="w-full"
            >
              {isProcessing ? "Processing..." : isProcessed ? "Processed Successfully" : "Process Document"}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Chat Interface */}
      <main className="flex-1 flex flex-col min-h-[600px] max-h-[85vh] bg-card border rounded-xl shadow-sm overflow-hidden">
        
        {/* Chat Header */}
        <div className="border-b p-4 flex flex-wrap gap-4 justify-between items-center bg-card z-10">
          <div>
            <h1 className="text-2xl font-bold font-space flex items-center gap-2">🎓 Intelligent Teaching Engine</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Learning Mode</span>
              <Select value={learningMode} onValueChange={handleModeChange}>
                <SelectTrigger className="w-[180px] h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODE_OPTIONS.map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Current Level</span>
              <div className="h-8 flex items-center px-3 border rounded-md text-sm font-medium bg-secondary/50">
                {learnerLevel}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-muted/20">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 opacity-70">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-2">
                <FileText className="w-8 h-8" />
              </div>
              <p>Upload and process a document to start learning.</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-4 ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-br-none' 
                    : 'bg-card border shadow-sm rounded-tl-none'
                }`}>
                  <div className={`prose prose-sm ${msg.role === 'user' ? 'prose-invert' : 'dark:prose-invert'} max-w-none break-words`}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))
          )}
          {isThinking && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl p-4 bg-card border shadow-sm rounded-tl-none flex gap-2 items-center text-muted-foreground text-sm">
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="ml-2">Thinking ({learningMode})...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-card border-t">
          <form 
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="flex gap-2 relative"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isProcessed ? "Ask a question about your document..." : "Please process a document first..."}
              disabled={!isProcessed || isThinking}
              className="flex-1 bg-secondary/50 border rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
            />
            <Button 
              type="submit" 
              size="icon" 
              className="rounded-full w-11 h-11 flex-shrink-0 absolute right-1 top-1"
              disabled={!isProcessed || isThinking || !input.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
