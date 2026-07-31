'use client'

import { FormEvent, useState } from 'react'
import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, BookOpen, ChevronDown, Clock3, Lightbulb, LoaderCircle, Map, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { POPULAR_PATHS } from '@/lib/learning-mock-data'

const fieldClass = 'w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20 placeholder:text-[var(--muted-foreground)]'

function FieldLabel({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]"><span className="grid size-7 place-items-center rounded-lg bg-[var(--accent-blue)]/10 text-[var(--accent-blue)]">{icon}</span>{children}</label>
}

export default function RoadmapBuilder({ initialTopic = '' }: { initialTopic?: string }) {
  const [topic, setTopic] = useState(initialTopic)
  const [level, setLevel] = useState('Complete Beginner')
  const [commitment, setCommitment] = useState('5 hours/week')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!topic.trim()) { setError('Choose a technology, field, or role to generate your path.'); return }
    setError('')
    setLoading(true)
    window.setTimeout(() => {
      const params = new URLSearchParams({ topic: topic.trim(), level, commitment })
      router.push(`/roadmap/result?${params.toString()}`)
    }, 550)
  }

  return <div className="space-y-10">
    <section className="mx-auto max-w-3xl text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-blue)]">Personal learning plan</p>
      <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">Design Your Path</h1>
      <p className="mx-auto mt-5 max-w-[38rem] text-[var(--muted-foreground)]">Get a personalized, step-by-step learning roadmap tailored to your goals and pace.</p>
    </section>

    <form onSubmit={submit} className="mx-auto max-w-3xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-8">
      <div className="space-y-6">
        <div>
          <FieldLabel icon={<BookOpen size={15} />}>Technology / Field</FieldLabel>
          <div className="relative"><input value={topic} onChange={event => setTopic(event.target.value)} placeholder="e.g., React, AI, DevOps, Full Stack Development..." className={`${fieldClass} pr-28`} /><span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-[var(--border)] px-2 py-1 text-[0.65rem] text-[var(--muted-foreground)]">Press Enter</span></div>
          <p className="mt-2 text-xs text-[var(--muted-foreground)]">Enter any technology, framework, or field you want to master.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div><FieldLabel icon={<Lightbulb size={15} />}>Current Level</FieldLabel><div className="relative"><select value={level} onChange={event => setLevel(event.target.value)} className={fieldClass}><option>Complete Beginner</option><option>Some Experience</option><option>Intermediate</option><option>Advanced</option></select><ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={16} /></div></div>
          <div><FieldLabel icon={<Clock3 size={15} />}>Weekly Commitment</FieldLabel><div className="relative"><select value={commitment} onChange={event => setCommitment(event.target.value)} className={fieldClass}><option>5 hours/week</option><option>10 hours/week</option><option>15 hours/week</option><option>20+ hours/week</option></select><ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={16} /></div></div>
        </div>
        {error && <p role="alert" className="rounded-xl border border-[var(--accent-orange)]/30 bg-[var(--accent-orange)]/10 px-4 py-3 text-sm text-[var(--foreground)]">{error}</p>}
        <Button type="submit" size="lg" className="h-12 w-full rounded-xl text-sm" disabled={loading}>{loading ? <><LoaderCircle className="animate-spin" /> Building your path…</> : <>Generate Roadmap <ArrowRight /></>}</Button>
      </div>
      <div className="my-7 border-t border-[var(--border)]" />
      <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">Popular paths</p>
      <div className="flex flex-wrap gap-2">{POPULAR_PATHS.map(path => <button key={path} type="button" onClick={() => { setTopic(path); setError('') }} className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] transition hover:border-[var(--accent-blue)]/40 hover:bg-[var(--accent-blue)]/10 hover:text-[var(--foreground)]">{path}</button>)}</div>
    </form>

  </div>
}
