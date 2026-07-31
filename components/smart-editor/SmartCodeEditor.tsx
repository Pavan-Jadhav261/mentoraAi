"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { ALGORITHMS, AlgorithmDef } from "./algorithms";
import { AlgorithmSidebar } from "./AlgorithmSidebar";
import { AINotification, Severity } from "./AINotification";
import { voiceManager } from "./VoiceManager";
import { Play, Loader2, Volume2, VolumeX, Mic, MicOff, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useVoiceAgent } from "./useVoiceAgent";

type Language = "c" | "cpp" | "javascript" | "python" | "java";

const LANG_MAP: Record<Language, string> = {
  c: "c",
  cpp: "cpp",
  javascript: "javascript",
  python: "python",
  java: "java",
};

interface AIResponse {
  shouldRespond: boolean;
  severity: Severity;
  message: string;
  line: number | null;
}

export function SmartCodeEditor() {
  const monaco = useMonaco();
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<any[]>([]);

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmDef>(ALGORITHMS[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("c");
  const [code, setCode] = useState<string>(ALGORITHMS[0].starterCode["c"] || "");
  
  const [aiNotification, setAiNotification] = useState<{ message: string; severity: Severity } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);

  // Tracking state for AI triggers
  const lastAnalyzedCode = useRef(code);
  const lastAnalyzedLineCount = useRef(code.split("\n").length);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const activeRequestId = useRef<number>(0);

  const handleVoiceQuery = async (query: string) => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    setAiNotification(null);
    clearHighlight();

    const currentReqId = ++activeRequestId.current;
    
    try {
      const response = await fetch("/api/code-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          algorithm: selectedAlgorithm.title,
          language: selectedLanguage,
          code,
          analysisType: "voice_query",
          voiceQuery: query
        }),
      });

      if (activeRequestId.current !== currentReqId) return;

      const data: AIResponse = await response.json();

      lastAnalyzedCode.current = code;
      lastAnalyzedLineCount.current = code.split("\n").length;

      if (data.shouldRespond && data.message) {
        setAiNotification({
          message: data.message,
          severity: data.severity,
        });

        if (data.line) {
          highlightLine(data.line);
        }

        if (voiceEnabled) {
          voiceManager.speak(data.message);
        }
      }
    } catch (error) {
      console.error("Voice AI Analysis failed:", error);
    } finally {
      if (activeRequestId.current === currentReqId) {
        setIsAnalyzing(false);
      }
    }
  };

  const { isMicActive, toggleMic, isListening, transcript } = useVoiceAgent({
    code,
    language: selectedLanguage,
    algorithm: selectedAlgorithm.title,
    onQueryActive: handleVoiceQuery,
  });

  const clearHighlight = () => {
    if (editorRef.current && decorationsRef.current.length > 0) {
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
    }
  };

  const highlightLine = (line: number) => {
    if (!monaco || !editorRef.current) return;
    clearHighlight();
    decorationsRef.current = editorRef.current.deltaDecorations(
      [],
      [
        {
          range: new monaco.Range(line, 1, line, 1),
          options: {
            isWholeLine: true,
            className: "bg-red-500/20 border-l-4 border-red-500",
          },
        },
      ]
    );
  };

  const analyzeCode = async (analysisType: "background" | "submit") => {
    const currentCode = editorRef.current?.getValue() || code;
    
    if (isAnalyzing || (analysisType === "background" && currentCode === lastAnalyzedCode.current)) return;
    
    setIsAnalyzing(true);
    setAiNotification(null);
    clearHighlight();

    const currentReqId = ++activeRequestId.current;
    
    try {
      const response = await fetch("/api/code-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          algorithm: selectedAlgorithm.title,
          language: selectedLanguage,
          code: currentCode,
          analysisType,
        }),
      });

      if (activeRequestId.current !== currentReqId) return; // Stale request

      const data: AIResponse = await response.json();

      lastAnalyzedCode.current = currentCode;
      lastAnalyzedLineCount.current = currentCode.split("\n").length;

      if (data.shouldRespond && data.message) {
        setAiNotification({
          message: data.message,
          severity: data.severity,
        });

        if (data.line) {
          highlightLine(data.line);
        }

        if (voiceEnabled) {
          voiceManager.speak(data.message);
        }
      }
    } catch (error) {
      console.error("AI Analysis failed:", error);
      if (activeRequestId.current === currentReqId) {
        setAiNotification({
          message: "AI check unavailable.",
          severity: "error",
        });
      }
    } finally {
      if (activeRequestId.current === currentReqId) {
        setIsAnalyzing(false);
      }
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || "";
    setCode(newCode);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    const currentLines = newCode.split("\n").length;
    const linesAdded = currentLines - lastAnalyzedLineCount.current;

    // Trigger 1: 5 new lines
    if (linesAdded >= 5) {
      analyzeCode("background");
    } else {
      // Trigger 2: 5 seconds of inactivity
      debounceTimer.current = setTimeout(() => {
        analyzeCode("background");
      }, 5000);
    }
  };

  const handleSubmit = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    analyzeCode("submit");
  };

  const handleAlgorithmSelect = (alg: AlgorithmDef) => {
    setSelectedAlgorithm(alg);
    const newCode = alg.starterCode[selectedLanguage] || "";
    setCode(newCode);
    lastAnalyzedCode.current = newCode;
    lastAnalyzedLineCount.current = newCode.split("\n").length;
    setAiNotification(null);
    clearHighlight();
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
  };

  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
    const newCode = selectedAlgorithm.starterCode[lang] || "";
    setCode(newCode);
    lastAnalyzedCode.current = newCode;
    lastAnalyzedLineCount.current = newCode.split("\n").length;
    setAiNotification(null);
    clearHighlight();
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
  };

  return (
    <div className="flex flex-col md:flex-row h-full bg-background text-foreground overflow-hidden font-sans">
      <AlgorithmSidebar selectedId={selectedAlgorithm.id} onSelect={handleAlgorithmSelect} />

      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-secondary">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
              className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors"
              title={isDescriptionOpen ? "Close Description Panel" : "Open Description Panel"}
            >
              {isDescriptionOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>
            <h1 className="text-sm font-semibold truncate max-w-[200px] md:max-w-xs">
              {selectedAlgorithm.title}
            </h1>
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value as Language)}
              className="bg-background border border-border text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            {isMicActive && (
              <div className="flex items-center text-xs px-3 py-1.5 bg-background border border-border rounded-md text-muted-foreground italic w-[250px] overflow-hidden whitespace-nowrap text-ellipsis">
                {transcript || (isListening ? "Listening..." : "Waiting for speech...")}
              </div>
            )}
            <button
              onClick={toggleMic}
              className={`p-2 rounded-md transition-colors relative ${
                isMicActive ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "hover:bg-accent text-muted-foreground hover:text-accent-foreground"
              }`}
              title={isMicActive ? "Stop Mentora (Listening)" : "Start Mentora (Voice Agent)"}
            >
              {isMicActive && isListening && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              )}
              {isMicActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors ${
                voiceEnabled ? "text-blue-500" : "text-muted-foreground"
              }`}
              title={voiceEnabled ? "Mute AI Voice" : "Enable AI Voice"}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isAnalyzing}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
            >
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Submit Code
            </button>
          </div>
        </div>

        {/* Workspace Area */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* Problem Description Panel */}
          {isDescriptionOpen && (
            <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-border bg-card p-6 overflow-y-auto">
              <h2 className="text-xl font-bold mb-6">{selectedAlgorithm.title}</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Description</h3>
                  <p className="text-sm leading-relaxed text-card-foreground/90">{selectedAlgorithm.description}</p>
                </div>
                
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Input</h3>
                  <div className="bg-secondary/50 rounded-md p-3 text-sm border border-border/50 text-card-foreground/90">
                    {selectedAlgorithm.input}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Output</h3>
                  <div className="bg-secondary/50 rounded-md p-3 text-sm border border-border/50 text-card-foreground/90">
                    {selectedAlgorithm.output}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Editor Area */}
          <div className="flex-1 relative min-w-0 h-full lg:h-auto">
            <div className="absolute top-2 right-4 z-10 flex items-center gap-2 text-xs text-muted-foreground font-medium">
              {isAnalyzing && (
                <span className="flex items-center gap-1.5 text-blue-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  AI checking...
                </span>
              )}
            </div>
            <Editor
              height="100%"
              language={LANG_MAP[selectedLanguage]}
              theme="vs-dark"
              value={code}
              onChange={handleEditorChange}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                lineHeight: 24,
                padding: { top: 16, bottom: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                formatOnPaste: true,
              }}
            />
          </div>
        </div>

        {/* AI Notification Toast */}
        <AINotification
          message={aiNotification?.message || ""}
          severity={aiNotification?.severity || "none"}
          onClose={() => setAiNotification(null)}
        />
      </div>
    </div>
  );
}
