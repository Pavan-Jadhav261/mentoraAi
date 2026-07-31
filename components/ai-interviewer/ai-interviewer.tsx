'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Volume2, VolumeX, RotateCcw, ChevronRight, Loader2 } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

// ─── Types ──────────────────────────────────────────────────────────────────
type Role = 'user' | 'assistant'
type SessionStatus = 'idle' | 'recording' | 'thinking' | 'speaking'

interface ChatMessage {
  role: Role
  content: string
}

// ─── Orb Visual ─────────────────────────────────────────────────────────────
function InterviewerOrb({ status }: { status: SessionStatus }) {
  const bars = [4, 10, 14, 8, 16, 6, 12, 4, 9, 13]

  return (
    <div className="relative flex items-center justify-center w-36 h-36 mx-auto select-none">
      {/* outer glow rings */}
      {(status === 'thinking' || status === 'speaking') && (
        <>
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-15"
            style={{ background: 'radial-gradient(circle, var(--accent-blue), var(--accent-purple))' }}
          />
          <div
            className="absolute inset-3 rounded-full animate-pulse opacity-25"
            style={{ background: 'radial-gradient(circle, var(--accent-blue), var(--accent-purple))' }}
          />
        </>
      )}
      {status === 'recording' && (
        <div
          className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ background: 'radial-gradient(circle, var(--accent-green), #059669)' }}
        />
      )}

      {/* core orb */}
      <div
        className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-2xl"
        style={{
          background:
            status === 'recording'
              ? 'radial-gradient(circle at 40% 40%, #34D399, #059669)'
              : 'radial-gradient(circle at 40% 40%, var(--accent-blue), var(--accent-purple))',
          transition: 'background 0.4s ease',
        }}
      >
        {/* waveform bars */}
        <div className="flex items-end gap-[3px] h-8">
          {bars.map((h, i) => (
            <div
              key={i}
              className="w-[3px] rounded-full bg-white/85"
              style={{
                height:
                  status === 'speaking'
                    ? `${h}px`
                    : status === 'recording'
                    ? `${Math.max(4, h * 0.6)}px`
                    : '4px',
                transition: `height ${0.12 + i * 0.04}s ease-in-out`,
                animationDelay: `${i * 0.07}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Typing Dots ─────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex gap-1 items-center py-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-[var(--muted-foreground)] animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  )
}

// ─── Formatted Message ───────────────────────────────────────────────────────
function FormattedMessage({ content }: { content: string }) {
  const parts = content.split(/(```[\s\S]*?(?:```|$))/)
  return (
    <div className="space-y-3">
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const match = part.match(/```(\w*)\n?([\s\S]*?)(?:```|$)/)
          const lang = match?.[1] || 'text'
          const code = match?.[2] || ''
          return (
            <div key={i} className="rounded-md overflow-hidden my-2 text-xs">
              <SyntaxHighlighter language={lang} style={vscDarkPlus} customStyle={{ margin: 0 }}>
                {code}
              </SyntaxHighlighter>
            </div>
          )
        }
        return <span key={i} className="whitespace-pre-wrap">{part}</span>
      })}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AIInterviewer() {
  const [topic, setTopic] = useState('')
  const [sessionStarted, setSessionStarted] = useState(false)
  const [status, setStatus] = useState<SessionStatus>('idle')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [streamingText, setStreamingText] = useState('')
  const [isMuted, setIsMuted] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoiceIdx, setSelectedVoiceIdx] = useState(0)
  const [report, setReport] = useState<string | null>(null)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  const recognitionRef = useRef<any>(null)
  const finalTranscriptRef = useRef('')
  const listeningRef = useRef(false)
  const isProcessingRef = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const startRecordingRef = useRef<(() => void) | null>(null)
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load TTS voices
  useEffect(() => {
    if (typeof window === 'undefined') return
    synthRef.current = window.speechSynthesis

    const load = () => {
      const v = window.speechSynthesis.getVoices()
      setVoices(v)
      // prefer English voice
      const enIdx = v.findIndex((vv) => vv.lang.startsWith('en'))
      if (enIdx >= 0) setSelectedVoiceIdx(enIdx)
    }
    load()
    window.speechSynthesis.onvoiceschanged = load
  }, [])

  // Auto-scroll chat
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [messages, streamingText])

  // ── TTS: speak a single chunk at rate 1.4 ─────────────────────────────────
  const speakChunk = useCallback(
    (text: string, onEnd?: () => void) => {
      if (!synthRef.current || isMuted || !text.trim()) {
        onEnd?.()
        return
      }
      const utt = new SpeechSynthesisUtterance(text.trim())
      const voice = voices[selectedVoiceIdx]
      if (voice) utt.voice = voice
      utt.rate = 1.4
      utt.pitch = 1.0
      utt.onend = () => onEnd?.()
      utt.onerror = () => onEnd?.()
      synthRef.current.speak(utt)
    },
    [isMuted, voices, selectedVoiceIdx]
  )

  // ── Call Ollama API — stream text + speak sentences as they arrive ─────────
  const callInterviewAI = useCallback(
    async (msgs: ChatMessage[]) => {
      setStatus('thinking')
      setStreamingText('')
      synthRef.current?.cancel()
      
      // Abort any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      try {
        const res = await fetch('/api/interview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: msgs, topic }),
          signal: abortControllerRef.current.signal
        })

        if (!res.ok || !res.body) throw new Error('Failed to reach interview API')

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let fullText = ''
        let spokenCleanIndex = 0

        setStatus('speaking')

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          fullText += chunk
          setStreamingText(fullText)

          // Strip out markdown code blocks for TTS
          const cleanText = fullText.replace(/```[\s\S]*?(?:```|$)/g, '')
          let textToProcess = cleanText.slice(spokenCleanIndex)

          // Drain complete sentences from cleanText and enqueue them
          let match: RegExpExecArray | null
          while ((match = /([.!?])(?:\s|$)/.exec(textToProcess)) !== null) {
            const endIdx = match.index + match[0].length
            const sentence = textToProcess.slice(0, endIdx)
            speakChunk(sentence)
            spokenCleanIndex += endIdx
            textToProcess = cleanText.slice(spokenCleanIndex)
          }
        }

        // Speak any remaining text that didn't end with punctuation
        const cleanText = fullText.replace(/```[\s\S]*?(?:```|$)/g, '')
        const remaining = cleanText.slice(spokenCleanIndex)
        if (remaining.trim()) speakChunk(remaining)

        // Commit to messages
        const aiMsg: ChatMessage = { role: 'assistant', content: fullText }
        setMessages((prev) => [...prev, aiMsg])
        setStreamingText('')

        // Wait for TTS queue to finish, then go idle
        const waitForSpeech = () => {
          if (synthRef.current && synthRef.current.speaking) {
            setTimeout(waitForSpeech, 200)
          } else {
            setStatus('idle')
            isProcessingRef.current = false
            setTimeout(() => {
              startRecordingRef.current?.()
            }, 600)
          }
        }
        waitForSpeech()
      } catch (err: any) {
        if (err.name === 'AbortError') return
        console.error(err)
        const errMsg = "Sorry, I couldn't connect to the interview AI. Make sure Ollama is running with gemma3:4b."
        setMessages((prev) => [...prev, { role: 'assistant', content: errMsg }])
        setStreamingText('')
        speakChunk(errMsg, () => {
          setStatus('idle')
          isProcessingRef.current = false
        })
      }
    },
    [topic, speakChunk]
  )

  // ── Start Session ─────────────────────────────────────────────────────────
  const startSession = useCallback(async () => {
    if (!topic.trim()) return
    setSessionStarted(true)
    setMessages([])
    setStreamingText('')
    finalTranscriptRef.current = ''
    setTranscript('')
    setInterimTranscript('')

    // kick off with interviewer greeting + first question
    await callInterviewAI([])
  }, [topic, callInterviewAI])

  // ── Speech Recognition ────────────────────────────────────────────────────
  const stopRecording = useCallback(() => {
    listeningRef.current = false
    recognitionRef.current?.stop()

    const spoken = finalTranscriptRef.current.trim()
    setTranscript('')
    setInterimTranscript('')
    finalTranscriptRef.current = ''

    if (spoken) {
      if (isProcessingRef.current) return // Prevent double submissions
      isProcessingRef.current = true

      // immediately transition to thinking — don't touch idle
      const userMsg: ChatMessage = { role: 'user', content: spoken }
      setMessages((prev) => {
        const updated = [...prev, userMsg]
        callInterviewAI(updated)
        return updated
      })
    } else {
      setStatus('idle')
      isProcessingRef.current = false
    }
  }, [callInterviewAI])

  const stopAI = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    synthRef.current?.cancel()
    setStreamingText('')
    setStatus('idle')
    isProcessingRef.current = false
  }, [])

  const startRecording = useCallback(() => {
    if (status !== 'idle') return

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognitionAPI) {
      alert('Speech recognition is not supported in this browser. Try Chrome or Edge.')
      return
    }

    const recognition: any = new SpeechRecognitionAPI()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognitionRef.current = recognition
    finalTranscriptRef.current = ''

    recognition.onstart = () => {
      setStatus('recording')
    }

    recognition.onresult = (event: any) => {
      let interim = ''
      let final = finalTranscriptRef.current

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const piece = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += piece + ' '
        } else {
          interim += piece
        }
      }

      finalTranscriptRef.current = final
      setTranscript(final)
      setInterimTranscript(interim)
    }

    recognition.onerror = () => {
      stopRecording()
    }

    recognition.onend = () => {
      // browser auto-stopped but we're still listening → restart
      if (listeningRef.current) {
        recognition.start()
      }
    }

    listeningRef.current = true
    recognition.start()
  }, [status, stopRecording])

  startRecordingRef.current = startRecording

  // ── Auto-stop recording after silence ───────────────────────────────────────
  useEffect(() => {
    if (status !== 'recording') return

    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current)
    }

    // Only start the silence timer if the user has actually said something
    if (transcript || interimTranscript) {
      silenceTimeoutRef.current = setTimeout(() => {
        stopRecording()
      }, 3500)
    }

    return () => {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current)
      }
    }
  }, [transcript, interimTranscript, status, stopRecording])

  const toggleMic = () => {
    if (status === 'recording') {
      stopRecording()
    } else if (status === 'idle') {
      startRecording()
    }
  }

  const resetSession = () => {
    synthRef.current?.cancel()
    recognitionRef.current?.stop()
    listeningRef.current = false
    setSessionStarted(false)
    setStatus('idle')
    setMessages([])
    setStreamingText('')
    setTranscript('')
    setInterimTranscript('')
    finalTranscriptRef.current = ''
    setReport(null)
  }

  const endInterview = async () => {
    stopAI()
    if (recognitionRef.current) {
      listeningRef.current = false
      recognitionRef.current.stop()
    }
    
    setIsGeneratingReport(true)
    try {
      const res = await fetch('/api/interview-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, topic })
      })
      if (!res.ok) throw new Error('Failed to fetch report')
      const data = await res.json()
      setReport(data.report)
    } catch (err) {
      console.error(err)
      setReport("Failed to generate the report. Please try again.")
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const statusLabel = {
    idle: 'Ready',
    recording: 'Listening…',
    thinking: 'Thinking…',
    speaking: 'Speaking…',
  }[status]

  const statusColor = {
    idle: 'border-[var(--border)] text-[var(--muted-foreground)] bg-transparent',
    recording: 'border-[var(--accent-green)]/40 text-[var(--accent-green)] bg-[var(--accent-green)]/10',
    thinking: 'border-[var(--accent-yellow)]/40 text-[var(--accent-yellow)] bg-[var(--accent-yellow)]/10',
    speaking: 'border-[var(--accent-blue)]/40 text-[var(--accent-blue)] bg-[var(--accent-blue)]/10',
  }[status]

  // ── Topic Entry Screen ────────────────────────────────────────────────────
  if (!sessionStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[520px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-10 flex flex-col gap-6 shadow-2xl">
            {/* Orb preview */}
            <InterviewerOrb status="idle" />

            <div className="text-center">
              <h2 className="font-display font-bold text-2xl text-[var(--foreground)] mb-2">
                What topic shall we cover?
              </h2>
              <p className="text-sm text-[var(--muted-foreground)]">
                Type a subject and the AI will interview you like a real-world interviewer.
              </p>
            </div>

            <div className="relative">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && startSession()}
                placeholder="e.g. React hooks, System Design, Python, DSA…"
                className="w-full px-5 py-3.5 rounded-2xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
              />
            </div>

            {/* Voice selector */}
            {voices.length > 0 && (
              <div className="flex items-center gap-3">
                <Volume2 size={14} className="text-[var(--muted-foreground)] shrink-0" />
                <select
                  value={selectedVoiceIdx}
                  onChange={(e) => setSelectedVoiceIdx(Number(e.target.value))}
                  className="flex-1 text-xs rounded-xl px-3 py-2 border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none"
                >
                  {voices.map((v, i) => (
                    <option key={i} value={i}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={startSession}
              disabled={!topic.trim()}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[var(--accent-blue)] text-white font-semibold text-sm hover:opacity-90 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_8px_24px_-8px_var(--accent-blue)]"
            >
              Start Interview <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── Live Session Screen ───────────────────────────────────────────────────
  return (
    <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6">
      {/* Left — Interviewer panel */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-[var(--foreground)]">Live Session</h2>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Topic: <span className="text-[var(--accent-blue)]">{topic}</span></p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColor}`}>
              {statusLabel}
            </span>
            <button
              onClick={() => setIsMuted((m) => !m)}
              className="p-2 rounded-xl border border-[var(--border)] hover:bg-[var(--border)] transition"
              title={isMuted ? 'Unmute AI' : 'Mute AI'}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <button
              onClick={resetSession}
              className="p-2 rounded-xl border border-[var(--border)] hover:bg-[var(--border)] transition"
              title="Reset session"
            >
              <RotateCcw size={14} />
            </button>
            <button
              onClick={endInterview}
              disabled={isGeneratingReport || messages.length === 0}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 transition disabled:opacity-50"
            >
              {isGeneratingReport ? 'Ending...' : 'End Interview'}
            </button>
          </div>
        </div>

        {/* Orb */}
        <div className="py-8">
          <InterviewerOrb status={status} />
          <p className="text-center text-xs text-[var(--muted-foreground)] mt-3 font-medium">
            {status === 'recording'
              ? 'Speak now — press mic to stop'
              : status === 'thinking'
              ? 'AI is thinking…'
              : status === 'speaking'
              ? 'AI is responding…'
              : 'Press mic to answer'}
          </p>
        </div>

        {/* Live transcript box */}
        <div className="px-6 pb-4">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-5 py-4 min-h-[64px]">
            <p className="text-[0.7rem] uppercase tracking-wider font-semibold text-[var(--muted-foreground)] mb-1.5">
              Your Answer (Live)
            </p>
            {transcript || interimTranscript ? (
              <p className="text-sm text-[var(--foreground)] leading-relaxed">
                {transcript}
                <span className="text-[var(--muted-foreground)] italic">{interimTranscript}</span>
              </p>
            ) : (
              <p className="text-sm text-[var(--muted-foreground)] italic">
                {status === 'recording' ? 'Listening for your voice…' : 'Press the mic below to start speaking'}
              </p>
            )}
          </div>
        </div>

        {/* Mic button */}
        <div className="flex justify-center pb-6 gap-4">
          <button
            onClick={toggleMic}
            disabled={status === 'thinking' || status === 'speaking'}
            className={`flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-[0.96] disabled:opacity-40 disabled:cursor-not-allowed
              ${status === 'recording'
                ? 'bg-red-500 text-white shadow-[0_8px_24px_-8px_rgba(239,68,68,0.7)] hover:bg-red-600'
                : 'bg-[var(--accent-blue)] text-white shadow-[0_8px_24px_-8px_var(--accent-blue)] hover:opacity-90'
              }`}
          >
            {status === 'recording' ? (
              <><MicOff size={16} /> Stop Recording</>
            ) : status === 'thinking' ? (
              <><Loader2 size={16} className="animate-spin" /> Thinking…</>
            ) : (
              <><Mic size={16} /> Speak Answer</>
            )}
          </button>
          
          {(status === 'thinking' || status === 'speaking') && (
            <button
              onClick={stopAI}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-[0.96] border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--border)] hover:text-[var(--foreground)]"
            >
              Stop AI
            </button>
          )}
        </div>
      </div>

      {/* Right — Chat log */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] flex flex-col overflow-hidden">
        <div className="px-6 py-5 border-b border-[var(--border)]">
          <h2 className="font-display font-bold text-xl text-[var(--foreground)]">Conversation</h2>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Powered by gemma3:4b via Ollama</p>
        </div>

        <div
          ref={logRef}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-4"
          style={{ minHeight: '420px', maxHeight: '580px' }}
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className="w-7 h-7 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-bold text-white"
                  style={{
                    background:
                      msg.role === 'assistant'
                        ? 'radial-gradient(circle, var(--accent-blue), var(--accent-purple))'
                        : 'radial-gradient(circle, var(--accent-green), #059669)',
                  }}
                >
                  {msg.role === 'assistant' ? 'AI' : 'You'}
                </div>
                {/* Bubble */}
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'assistant'
                      ? 'bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] w-full overflow-hidden'
                      : 'bg-[var(--accent-blue)]/15 border border-[var(--accent-blue)]/25 text-[var(--foreground)]'
                  }`}
                >
                  <FormattedMessage content={msg.content} />
                </div>
              </motion.div>
            ))}

            {/* Streaming AI response */}
            {(status === 'thinking' || streamingText) && (
              <motion.div
                key="streaming"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div
                  className="w-7 h-7 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: 'radial-gradient(circle, var(--accent-blue), var(--accent-purple))' }}
                >
                  AI
                </div>
                <div className="max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] w-full overflow-hidden">
                  {streamingText ? <FormattedMessage content={streamingText} /> : <TypingDots />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {messages.length === 0 && status === 'idle' && (
            <div className="flex flex-col items-center justify-center h-full text-center py-16 gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'radial-gradient(circle, var(--accent-blue), var(--accent-purple))' }}
              >
                <Mic size={20} className="text-white" />
              </div>
              <p className="text-[var(--muted-foreground)] text-sm max-w-xs">
                The AI interviewer will ask you questions here. Press <strong>Speak Answer</strong> when you're ready to respond.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Report Section */}
      {(isGeneratingReport || report) && (
        <div className="lg:col-span-2 mt-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xl">
          <h2 className="font-display font-bold text-2xl text-[var(--foreground)] mb-6 flex items-center gap-3">
            Interview Report
            {isGeneratingReport && <Loader2 size={20} className="animate-spin text-[var(--accent-blue)]" />}
          </h2>
          {report ? (
            <div className="prose prose-invert max-w-none text-sm">
              <FormattedMessage content={report} />
            </div>
          ) : (
            <p className="text-[var(--muted-foreground)] italic text-sm">Analyzing your responses and generating feedback...</p>
          )}
        </div>
      )}
    </div>
  )
}
