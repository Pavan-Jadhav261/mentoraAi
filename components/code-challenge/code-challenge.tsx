'use client'
import { useState, useCallback } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { GripVertical, CheckCircle2, XCircle, RotateCcw, Lightbulb, ChevronRight, Sparkles } from 'lucide-react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { ALGORITHMS, type CodeBlock } from '@/lib/dummy-data'
import { ALGORITHM_CHALLENGES } from '@/lib/algorithm-lessons'

const CHALLENGES = ALGORITHM_CHALLENGES

type Status = 'idle' | 'checked'

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

type SortableBlockProps = {
  block: CodeBlock
  status: Status
  isCorrect?: boolean
  hint?: boolean
  language: string
}

function SortableBlock({ block, status, isCorrect, hint, language }: SortableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id })
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : undefined }

  const border = status === 'checked'
    ? isCorrect ? 'border-[var(--accent-green)]' : 'border-[var(--accent-orange)]'
    : hint ? 'border-[var(--accent-yellow)]' : 'border-[var(--border)]'

  const bg = status === 'checked'
    ? isCorrect ? 'bg-[var(--accent-green)]/5' : 'bg-[var(--accent-orange)]/5'
    : hint ? 'bg-[var(--accent-yellow)]/5' : 'bg-[var(--surface)]'

  return (
    <div ref={setNodeRef} style={style} className={`rounded-2xl border ${border} ${bg} ${isDragging ? 'shadow-lg rotate-1 opacity-90' : ''} transition-shadow duration-150`}>
      <div className="flex items-start gap-3 p-4">
        <button {...attributes} {...listeners} className="mt-1 cursor-grab active:cursor-grabbing touch-none text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
          <GripVertical size={16}/>
        </button>
        <div className="flex-1 min-w-0">
          <SyntaxHighlighter language={language} style={githubGist}
            customStyle={{ background: 'transparent', fontSize: '0.75rem', padding: 0, margin: 0 }}>
            {block.code}
          </SyntaxHighlighter>
          <p className="text-xs text-[var(--muted-foreground)] mt-2 italic">{block.description}</p>
        </div>
        {status === 'checked' && (
          isCorrect
            ? <CheckCircle2 size={16} className="text-[var(--accent-green)] shrink-0 mt-1"/>
            : <XCircle size={16} className="text-[var(--accent-orange)] shrink-0 mt-1"/>
        )}
      </div>
    </div>
  )
}

const CHALLENGE_KEYS = Object.keys(CHALLENGES) as (keyof typeof CHALLENGES)[]

export default function CodeChallenge() {
  const [algo, setAlgo] = useState('bubble-sort')
  const [status, setStatus] = useState<Status>('idle')
  const [order, setOrder] = useState<CodeBlock[]>([])
  const [hintId, setHintId] = useState<string | null>(null)
  const [xp, setXp] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const load = useCallback((key: string) => {
    const ch = CHALLENGES[key as keyof typeof CHALLENGES]
    if (!ch) return
    setOrder(shuffle(ch.blocks))
    setStatus('idle')
    setHintId(null)
    setLoaded(true)
  }, [])

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    setOrder(prev => {
      const from = prev.findIndex(b => b.id === active.id)
      const to = prev.findIndex(b => b.id === over.id)
      return arrayMove(prev, from, to)
    })
    setStatus('idle')
  }

  const check = () => setStatus('checked')
  const reset = () => load(algo)
  const showHint = () => {
    const wrong = order.find((b, i) => b.correctIndex !== i)
    setHintId(wrong?.id ?? null)
  }

  const challenge = CHALLENGES[algo as keyof typeof CHALLENGES]
  const algorithm = ALGORITHMS.find(item => item.slug === algo)
  const correct = status === 'checked' ? order.filter((b, i) => b.correctIndex === i).length : 0
  const total = order.length
  const perfect = status === 'checked' && correct === total

  if (perfect && status === 'checked') {
    // award XP once
  }

  return (
    <div className="space-y-6">
      {/* Setup row */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-wider font-semibold text-[var(--muted-foreground)]">Challenge</label>
          <select value={algo} onChange={e => { setAlgo(e.target.value); setLoaded(false); setStatus('idle') }}
            className="px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--accent-blue)] transition">
            {CHALLENGE_KEYS.map(k => <option key={k} value={k}>{CHALLENGES[k].title}</option>)}
          </select>
        </div>
        <button onClick={() => load(algo)}
          className="px-5 py-2.5 rounded-xl bg-[var(--accent-blue)] text-white text-sm font-medium hover:opacity-90 active:scale-[0.97] transition-all">
          Generate Challenge
        </button>
      </div>

      {!loaded && (
        <div className="rounded-3xl border-2 border-dashed border-[var(--border)] bg-[var(--surface)] flex items-center justify-center py-24">
          <p className="text-[var(--muted-foreground)] text-sm">Click "Generate Challenge" to start.</p>
        </div>
      )}

      {loaded && (
        <>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="font-display font-semibold text-[var(--foreground)]">{challenge?.title}</p>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--muted-foreground)]">{algorithm?.desc} Put the six code pieces in the order a computer needs: start the main job, prepare its helpers, do the repeated work, then return the answer. Read each block’s clue before you move it.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--muted-foreground)] border border-[var(--border)] px-3 py-1 rounded-full">XP: {xp}</span>
            </div>
          </div>

          {/* Results banner */}
          {status === 'checked' && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className={`rounded-2xl px-6 py-4 flex items-center gap-4 ${perfect ? 'bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/30' : 'bg-[var(--accent-orange)]/10 border border-[var(--accent-orange)]/30'}`}>
              {perfect
                ? <><Sparkles size={18} className="text-[var(--accent-green)]"/><p className="text-sm font-semibold text-[var(--accent-green)]">Perfect! All {total} blocks correct. +50 XP</p></>
                : <><XCircle size={18} className="text-[var(--accent-orange)]"/><p className="text-sm text-[var(--accent-orange)]">{correct}/{total} correct — keep rearranging!</p></>}
            </motion.div>
          )}

          {/* Block list */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={order.map(b => b.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {order.map((block, i) => (
                  <SortableBlock key={block.id} block={block}
                    status={status}
                    isCorrect={block.correctIndex === i}
                    hint={hintId === block.id}
                    language={challenge?.language ?? 'javascript'}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <button onClick={check}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--foreground)] text-[var(--background)] text-sm font-medium hover:opacity-80 transition">
              <CheckCircle2 size={15}/> Check Solution
            </button>
            <button onClick={reset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border)] text-[var(--foreground)] text-sm hover:bg-[var(--border)] transition">
              <RotateCcw size={15}/> Reset Order
            </button>
            <button onClick={showHint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border)] text-[var(--muted-foreground)] text-sm hover:bg-[var(--border)] transition">
              <Lightbulb size={15}/> Show Hint
            </button>
            {perfect && (
              <button onClick={() => {
                const next = CHALLENGE_KEYS[(CHALLENGE_KEYS.indexOf(algo as any) + 1) % CHALLENGE_KEYS.length]
                setAlgo(next); load(next); setXp(x => x + 50)
              }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent-green)] text-white text-sm font-medium hover:opacity-90 transition">
                <ChevronRight size={15}/> Next Challenge
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
