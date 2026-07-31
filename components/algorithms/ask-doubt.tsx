'use client'

import { FormEvent, useEffect, useState } from 'react'
import { LoaderCircle, Send, Sparkles } from 'lucide-react'

type Message = { role: 'user' | 'assistant'; content: string }

export default function AskDoubt({ slug, algorithm, explanation }: { slug: string; algorithm: string; explanation: string }) {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setQuestion('')
    setMessages([])
    setLoading(false)
  }, [slug])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = question.trim()
    if (!trimmed || loading) return
    setMessages(current => [...current, { role: 'user', content: trimmed }])
    setQuestion('')
    setLoading(true)
    window.setTimeout(() => {
      setMessages(current => [...current, {
        role: 'assistant',
        content: `For ${algorithm}, focus on this idea: ${explanation.split('. ')[0]}. To answer “${trimmed}”, trace a tiny example by hand and watch how each step changes the input before moving on.`,
      }])
      setLoading(false)
    }, 700)
  }

  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-5">
        <span className="grid size-9 place-items-center rounded-xl bg-[var(--accent-purple)]/10 text-[var(--accent-purple)]"><Sparkles size={17} /></span>
        <div><h2 className="font-display font-bold text-lg text-[var(--foreground)]">Ask a Doubt</h2><p className="text-xs text-[var(--muted-foreground)]">Get a quick, guided explanation.</p></div>
      </div>
      {messages.length > 0 && <div className="space-y-3 mb-5" aria-live="polite">
        {messages.map((message, index) => <div key={`${message.role}-${index}`} className={`max-w-[48rem] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === 'user' ? 'ml-auto bg-[var(--accent-blue)]/10 text-[var(--foreground)]' : 'bg-[var(--background)] text-[var(--muted-foreground)] border border-[var(--border)]'}`}>{message.content}</div>)}
        {loading && <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--muted-foreground)]"><LoaderCircle size={15} className="animate-spin" /> Thinking through it…</div>}
      </div>}
      <form onSubmit={submit} className="flex gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-2 focus-within:ring-2 focus-within:ring-[var(--ring)]/30">
        <input value={question} onChange={event => setQuestion(event.target.value)} disabled={loading} placeholder="Ask anything about this algorithm..." className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] disabled:opacity-60" />
        <button type="submit" disabled={!question.trim() || loading} aria-label="Send doubt" className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-45"><Send size={16} /></button>
      </form>
    </section>
  )
}
