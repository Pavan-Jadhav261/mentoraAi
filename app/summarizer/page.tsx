'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Clock3, FileText, History, Lightbulb, LoaderCircle, Play, Send, Sparkles, CheckCircle2, XCircle } from 'lucide-react'
import NavPill from '@/components/nav-pill'
import SiteFooter from '@/components/site-footer'
import PageHeader from '@/components/page-header'
import Image from "next/image"

// ─────────────────────────────────────────
// CountUp animation
// ─────────────────────────────────────────
function CountUp({ to }: { to: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const dur = 700
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1)
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to])
  return <>{n}</>
}

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────
type Phase = 'idle' | 'loading-transcript' | 'transcript' | 'loading-summary' | 'summary' | 'loading-quiz' | 'quiz' | 'results'

interface TranscriptRow { ts: string; text: string }
interface QuizQuestion { q: string; options: string[]; answer: number }

// ─────────────────────────────────────────
// Static data
// ─────────────────────────────────────────
const RECENT_VIDEOS = [
  { title: 'Sorting Algorithms Explained', topic: 'Algorithms', time: '12 min ago', accent: 'var(--accent-blue)', url: 'https://www.youtube.com/watch?v=kgBjXUE_Nwc' },
  { title: 'React Server Components', topic: 'Frontend', time: 'Yesterday', accent: 'var(--accent-purple)', url: 'https://www.youtube.com/watch?v=AIRLegsFPRs' },
  { title: 'System Design Fundamentals', topic: 'Interview prep', time: 'Last week', accent: 'var(--accent-green)', url: 'https://www.youtube.com/watch?v=i53Gi_K3o7I' },
]

// ─────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────
function Skeleton({ lines = 6 }: { lines?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3.5 bg-[var(--border)] rounded-full" style={{ width: `${50 + (i % 4) * 12}%` }} />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────
// Markdown-like notes renderer
// ─────────────────────────────────────────
function NotesRenderer({ content }: { content: string }) {
  const lines = content.split('\n')
  return (
    <div className="space-y-2 text-sm">
      {lines.map((line, i) => {
        if (line.startsWith('## ')) {
          return <h3 key={i} className="font-display font-bold text-[var(--foreground)] text-base mt-4 mb-1">{line.replace('## ', '')}</h3>
        }
        if (line.startsWith('### ')) {
          return <h4 key={i} className="font-semibold text-[var(--foreground)] mt-3 mb-1">{line.replace('### ', '')}</h4>
        }
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <div key={i} className="flex gap-2 text-[var(--muted-foreground)] leading-relaxed">
              <span className="text-[var(--accent-blue)] mt-0.5 shrink-0">•</span>
              <span>{line.replace(/^[-*] /, '')}</span>
            </div>
          )
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={i} className="font-semibold text-[var(--foreground)]">{line.replace(/\*\*/g, '')}</p>
        }
        if (line.trim() === '') return <div key={i} className="h-1" />
        return <p key={i} className="text-[var(--muted-foreground)] leading-relaxed">{line}</p>
      })}
    </div>
  )
}

// ─────────────────────────────────────────
// VideoDoubtBox — now fully functional
// ─────────────────────────────────────────
function VideoDoubtBox({ transcript }: { transcript: string }) {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  const ask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const prompt = question.trim()
    if (!prompt || loading) return
    setMessages(curr => [...curr, { role: 'user', content: prompt }])
    setQuestion('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, type: 'chat', question: prompt }),
      })
      const data = await res.json()
      setMessages(curr => [...curr, { role: 'assistant', content: data.content || data.error || 'No response' }])
    } catch {
      setMessages(curr => [...curr, { role: 'assistant', content: 'Failed to get a response. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-xl bg-[var(--accent-purple)]/10 text-[var(--accent-purple)]">
          <Sparkles size={17} />
        </span>
        <div>
          <h2 className="font-display font-semibold text-[var(--foreground)]">Ask about this video</h2>
          <p className="text-xs text-[var(--muted-foreground)]">Get a quick explanation grounded in the summary.</p>
        </div>
      </div>

      {messages.length > 0 && (
        <div ref={scrollRef} className="mt-5 space-y-3 max-h-60 overflow-y-auto pr-1" aria-live="polite">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`max-w-3xl rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                message.role === 'user'
                  ? 'ml-auto bg-[var(--accent-blue)]/10 text-[var(--foreground)]'
                  : 'border border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)]'
              }`}
            >
              {message.content}
            </div>
          ))}
          {loading && (
            <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--muted-foreground)]">
              <LoaderCircle size={15} className="animate-spin" /> Thinking through the lecture…
            </div>
          )}
        </div>
      )}

      <form onSubmit={ask} className="mt-5 flex gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] p-2 focus-within:ring-2 focus-within:ring-[var(--ring)]/30">
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          disabled={loading}
          placeholder="Ask a doubt about this video..."
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
        />
        <button
          type="submit"
          disabled={!question.trim() || loading}
          aria-label="Ask doubt"
          className="grid size-10 shrink-0 place-items-center rounded-lg bg-[var(--accent-blue)] text-white transition-opacity hover:opacity-85 disabled:opacity-45"
        >
          {loading ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </form>
    </section>
  )
}

// ─────────────────────────────────────────
// Main page
// ─────────────────────────────────────────
export default function SummarizerPage() {
  const [url, setUrl] = useState('')
  const [phase, setPhase] = useState<Phase>('idle')
  const [videoId, setVideoId] = useState('')
  const [quizCount, setQuizCount] = useState(5)
  const [quizStep, setQuizStep] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>([])

  // Real data
  const [transcriptRows, setTranscriptRows] = useState<TranscriptRow[]>([])
  const [transcriptText, setTranscriptText] = useState('')
  const [notes, setNotes] = useState('')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [error, setError] = useState('')

  const extractId = (u: string) => {
    const m = u.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    return m ? m[1] : ''
  }

  // ── Fetch transcript ──
  const getTranscript = async (overrideUrl?: string) => {
    const target = overrideUrl ?? url
    if (!target.trim()) return
    const id = extractId(target)
    if (!id) { setError('Invalid YouTube URL'); return }

    setError('')
    setVideoId(id)
    setPhase('loading-transcript')
    setNotes('')
    setTranscriptRows([])
    setTranscriptText('')
    setQuestions([])

    try {
      const res = await fetch('/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setTranscriptRows(data.items)
      setTranscriptText(data.fullText)
      setPhase('transcript')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transcript')
      setPhase('idle')
    }
  }

  // ── Generate notes ──
  const getSummary = async () => {
    setPhase('loading-summary')
    setError('')
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: transcriptText, type: 'notes' }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setNotes(data.content)
      setPhase('summary')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate notes')
      setPhase('transcript')
    }
  }

  // ── Generate quiz ──
  const startQuiz = async () => {
    setPhase('loading-quiz')
    setError('')
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: transcriptText, type: 'quiz', quizCount }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      const qs: QuizQuestion[] = data.questions.slice(0, quizCount)
      setQuestions(qs)
      setAnswers(Array(qs.length).fill(null))
      setQuizStep(0)
      setSelected(null)
      setPhase('quiz')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate quiz')
      setPhase('summary')
    }
  }

  const handleNext = () => {
    const newAnswers = [...answers]
    newAnswers[quizStep] = selected
    setAnswers(newAnswers)
    if (quizStep + 1 < questions.length) {
      setQuizStep(s => s + 1)
      setSelected(null)
    } else {
      setAnswers(newAnswers)
      setPhase('results')
    }
  }

  const score = answers.filter((a, i) => a === questions[i]?.answer).length

  return (
    <div className="min-h-screen flex flex-col">
      <NavPill />
      <main className="flex-1 max-w-[1360px] mx-auto w-full px-6 lg:px-24 pt-32 pb-20">
        <PageHeader
          eyebrow={
            <span className="inline-flex items-center gap-1.5 text-sm">
              <Image src="/youtube.webp" alt="YouTube" width={30} height={30} className="shrink-0" />
              YouTube Summarizer
            </span>
          }
          title="Turn any lecture into notes."
        />

        {/* URL Input */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col gap-3 mb-10 max-w-2xl"
        >
          <div className="flex gap-3">
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) getTranscript() }}
              placeholder="Paste a YouTube URL…"
              className="flex-1 px-5 py-3.5 rounded-xl border border-[var(--border)] bg-transparent text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--accent-blue)] focus:ring-2 focus:ring-[var(--accent-blue)]/20 transition"
            />
            <button
              onClick={() => getTranscript()}
              disabled={phase === 'loading-transcript'}
              className="px-5 py-3.5 rounded-xl bg-[var(--accent-blue)] text-white text-sm font-medium hover:opacity-90 hover:shadow-[0_6px_20px_-6px_var(--accent-blue)] active:scale-[0.97] disabled:opacity-50 transition-all whitespace-nowrap"
            >
              {phase === 'loading-transcript' ? (
                <span className="inline-flex items-center gap-2"><LoaderCircle size={15} className="animate-spin" /> Loading…</span>
              ) : 'Get Transcript'}
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2.5">{error}</p>
          )}
        </motion.div>

        {/* ── Idle state ── */}
        {phase === 'idle' && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.22 }} className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Hero card */}
            <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
              <span className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full bg-[var(--accent-blue)]/10 blur-3xl" />
              <div className="relative">
                <span className="grid size-11 place-items-center rounded-2xl bg-[var(--accent-blue)]/10 text-[var(--accent-blue)]"><Play size={20} /></span>
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-blue)]">From lecture to learning kit</p>
                <h2 className="mt-3 max-w-lg font-display text-2xl font-bold text-[var(--foreground)]">Bring any YouTube lesson into one focused study space.</h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: FileText, title: 'Transcript', text: 'Follow every idea.' },
                    { icon: BookOpen, title: 'Summary', text: 'Keep the essentials.' },
                    { icon: Lightbulb, title: 'Quiz & doubts', text: 'Test what you learned.' },
                  ].map(item => (
                    <div key={item.title} className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-4">
                      <item.icon size={17} className="text-[var(--accent-blue)]" />
                      <p className="mt-3 text-sm font-semibold text-[var(--foreground)]">{item.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--muted-foreground)]">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Steps card */}
            <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-[var(--accent-orange)]/10 text-[var(--accent-orange)]"><Lightbulb size={17} /></span>
                <h2 className="font-display font-semibold text-[var(--foreground)]">A better study loop</h2>
              </div>
              <ol className="mt-6 space-y-5">
                {['Paste a public YouTube lecture link.', 'Read the transcript and generated notes.', 'Ask follow-up doubts or take a quick quiz.'].map((step, i) => (
                  <li key={step} className="flex gap-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--accent-orange)]/10 text-xs font-semibold text-[var(--accent-orange)]">{i + 1}</span>
                    <p className="pt-0.5 text-sm text-[var(--muted-foreground)]">{step}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-7 rounded-xl bg-[var(--background)] px-4 py-3 text-xs leading-relaxed text-[var(--muted-foreground)]">Tip: lectures with clear narration produce the most useful study materials.</p>
            </section>
          </motion.div>
        )}

        {/* Recent videos */}
        {phase === 'idle' && (
          <section className="mt-8 max-w-4xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-lg bg-[var(--accent-green)]/10 text-[var(--accent-green)]"><History size={16} /></span>
              <div>
                <h2 className="font-display font-semibold text-[var(--foreground)]">Recent summaries</h2>
                <p className="text-xs text-[var(--muted-foreground)]">Pick up where you left off.</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {RECENT_VIDEOS.map(video => (
                <button
                  key={video.title}
                  type="button"
                  onClick={() => { setUrl(video.url); getTranscript(video.url) }}
                  className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-left transition hover:-translate-y-0.5 hover:border-[var(--accent-blue)]/40"
                >
                  <span className="grid size-9 place-items-center rounded-xl" style={{ background: `color-mix(in srgb, ${video.accent} 10%, var(--background))`, color: video.accent }}>
                    <Play size={15} />
                  </span>
                  <p className="mt-4 text-sm font-semibold text-[var(--foreground)]">{video.title}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                    <span>{video.topic}</span><span>·</span><span>{video.time}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── YouTube embed ── */}
        {phase !== 'idle' && phase !== 'loading-transcript' && videoId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
            className="mb-10 aspect-video max-w-2xl rounded-2xl overflow-hidden border border-[var(--border)] shadow-[0_12px_40px_-16px_rgba(0,0,0,0.25)]"
          >
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen title="Lecture video"
            />
          </motion.div>
        )}

        {/* ── Loading transcript skeleton ── */}
        {phase === 'loading-transcript' && (
          <div className="max-w-2xl space-y-4">
            <p className="text-sm text-[var(--muted-foreground)] flex items-center gap-2">
              <LoaderCircle size={15} className="animate-spin text-[var(--accent-blue)]" /> Fetching transcript…
            </p>
            <Skeleton lines={8} />
          </div>
        )}

        {/* ── Transcript + Summary/Quiz panel ── */}
        {(phase === 'transcript' || phase === 'loading-summary' || phase === 'summary' || phase === 'loading-quiz' || phase === 'quiz' || phase === 'results') && (
          <div className="grid lg:grid-cols-2 gap-8">

            {/* ── Transcript panel ── */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-[var(--border)] flex items-center gap-2">
                <FileText size={16} className="text-[var(--accent-blue)]" />
                <h2 className="font-display font-semibold text-[var(--foreground)]">Transcript</h2>
                <span className="ml-auto text-xs text-[var(--muted-foreground)]">{transcriptRows.length} segments</span>
              </div>
              <div className="overflow-y-auto max-h-[420px] p-5 space-y-3 flex-1 scrollbar-thin">
                {transcriptRows.map((row, i) => (
                  <div key={i} className="flex gap-3 text-sm group">
                    <span className="font-mono text-[0.7rem] text-[var(--accent-blue)] bg-[var(--accent-blue)]/10 px-2 py-0.5 rounded shrink-0 h-fit mt-0.5">{row.ts}</span>
                    <span className="text-[var(--muted-foreground)] leading-relaxed group-hover:text-[var(--foreground)] transition-colors">{row.text}</span>
                  </div>
                ))}
              </div>
              {phase === 'transcript' && (
                <div className="px-5 pb-5 pt-3 border-t border-[var(--border)]">
                  <button
                    onClick={getSummary}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white text-sm font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
                  >
                    <Sparkles size={15} /> Make Notes
                  </button>
                </div>
              )}
            </div>

            {/* ── Summary / Quiz panel ── */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-[var(--border)] flex items-center gap-2">
                {phase === 'quiz' ? <Lightbulb size={16} className="text-[var(--accent-orange)]" />
                  : phase === 'results' ? <CheckCircle2 size={16} className="text-[var(--accent-green)]" />
                  : <BookOpen size={16} className="text-[var(--accent-purple)]" />}
                <h2 className="font-display font-semibold text-[var(--foreground)]">
                  {phase === 'loading-summary' ? 'Generating Notes…'
                    : phase === 'loading-quiz' ? 'Generating Quiz…'
                    : phase === 'summary' ? 'AI Notes'
                    : phase === 'quiz' ? `Quiz · Q${quizStep + 1}/${questions.length}`
                    : phase === 'results' ? 'Results'
                    : 'Summary'}
                </h2>
              </div>

              <div className="p-5 overflow-y-auto max-h-[420px] flex-1 scrollbar-thin">
                {/* Loading states */}
                {(phase === 'loading-summary' || phase === 'loading-quiz') && (
                  <div className="space-y-4">
                    <p className="text-sm text-[var(--muted-foreground)] flex items-center gap-2">
                      <LoaderCircle size={15} className="animate-spin text-[var(--accent-purple)]" />
                      {phase === 'loading-summary' ? 'Analyzing transcript and generating notes…' : 'Crafting quiz questions…'}
                    </p>
                    <Skeleton lines={10} />
                  </div>
                )}

                {/* Notes */}
                {phase === 'summary' && notes && (
                  <div className="space-y-5">
                    <NotesRenderer content={notes} />

                    {/* Quiz generator */}
                    <div className="border-t border-[var(--border)] pt-5 mt-5">
                      <p className="font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
                        <Lightbulb size={15} className="text-[var(--accent-orange)]" /> Generate Quiz
                      </p>
                      <div className="flex gap-2 mb-3 flex-wrap">
                        {[5, 10].map(n => (
                          <button
                            key={n}
                            onClick={() => setQuizCount(n)}
                            className={`px-4 py-1.5 rounded-full text-xs border transition ${
                              quizCount === n
                                ? 'border-[var(--accent-blue)] text-[var(--accent-blue)] bg-[var(--accent-blue)]/10 font-medium'
                                : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--foreground)]'
                            }`}
                          >
                            {n} questions
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={startQuiz}
                        className="w-full py-2.5 rounded-xl bg-[var(--accent-blue)] text-white text-sm font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
                      >
                        <Lightbulb size={15} /> Generate Quiz
                      </button>
                    </div>
                  </div>
                )}

                {/* Quiz */}
                {phase === 'quiz' && questions[quizStep] && (
                  <div className="space-y-5">
                    {/* Progress bar */}
                    <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] rounded-full transition-all duration-500"
                        style={{ width: `${(quizStep / questions.length) * 100}%` }}
                      />
                    </div>
                    <p className="font-semibold text-[var(--foreground)] text-sm leading-snug">{questions[quizStep].q}</p>
                    <div className="space-y-2">
                      {questions[quizStep].options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => setSelected(i)}
                          className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all active:scale-[0.98] ${
                            selected === i
                              ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]/10 text-[var(--foreground)]'
                              : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--foreground)] hover:translate-x-1'
                          }`}
                        >
                          <span className="font-mono text-xs text-[var(--accent-blue)] mr-2">{String.fromCharCode(65 + i)}.</span>
                          {opt}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleNext}
                      disabled={selected === null}
                      className="w-full py-2.5 rounded-xl bg-[var(--foreground)] text-[var(--background)] text-sm font-medium disabled:opacity-40 hover:opacity-80 transition"
                    >
                      {quizStep + 1 < questions.length ? 'Next →' : 'Finish Quiz'}
                    </button>
                  </div>
                )}

                {/* Results */}
                {phase === 'results' && (
                  <div className="space-y-5">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                      className="text-center py-6 rounded-2xl bg-gradient-to-b from-[var(--accent-blue)]/5 to-transparent border border-[var(--border)]"
                    >
                      <p className="font-display font-bold text-5xl text-[var(--accent-blue)]">
                        <CountUp to={score} /><span className="text-2xl text-[var(--muted-foreground)]">/{questions.length}</span>
                      </p>
                      <p className="text-[var(--muted-foreground)] text-sm mt-2">
                        {Math.round((score / questions.length) * 100)}% correct
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">
                        {score === questions.length ? '🎉 Perfect score!' : score >= questions.length * 0.7 ? '👏 Great job!' : '📖 Keep studying!'}
                      </p>
                    </motion.div>

                    <div className="space-y-2">
                      {questions.map((q, i) => {
                        const correct = answers[i] === q.answer
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.08 + i * 0.05 }}
                            className={`px-4 py-3 rounded-xl border text-xs ${correct ? 'border-[var(--accent-green)]/40 bg-[var(--accent-green)]/5' : 'border-red-400/30 bg-red-400/5'}`}
                          >
                            <div className="flex items-start gap-2">
                              {correct
                                ? <CheckCircle2 size={14} className="text-[var(--accent-green)] shrink-0 mt-0.5" />
                                : <XCircle size={14} className="text-red-400 shrink-0 mt-0.5" />}
                              <div>
                                <span className="text-[var(--foreground)] font-medium">{q.q}</span>
                                {!correct && (
                                  <p className="text-[var(--muted-foreground)] mt-1">
                                    Correct: <span className="text-[var(--accent-green)]">{q.options[q.answer]}</span>
                                    {answers[i] !== null && <> · Your answer: <span className="text-red-400">{q.options[answers[i]!]}</span></>}
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={startQuiz}
                        className="flex-1 py-2.5 rounded-xl bg-[var(--accent-blue)] text-white text-sm font-medium hover:opacity-90 transition"
                      >
                        Retry Quiz
                      </button>
                      <button
                        onClick={() => { setPhase('summary'); setAnswers([]); setQuizStep(0); setSelected(null) }}
                        className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-sm text-[var(--muted-foreground)] hover:bg-[var(--border)] transition"
                      >
                        Back to Notes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Ask about this video ── */}
        {(phase === 'summary' || phase === 'quiz' || phase === 'results') && (
          <VideoDoubtBox transcript={transcriptText} />
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
