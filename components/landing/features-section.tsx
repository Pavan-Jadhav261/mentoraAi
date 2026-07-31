'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FileText, BarChart2, Layers, Mic, ArrowUpRight } from 'lucide-react'

const FEATURES = [
  { num: '01', icon: FileText, color: 'var(--accent-blue)', title: 'YouTube Summarizer & Quiz', desc: 'Paste any lecture URL — get an AI transcript, structured summary, and instant quiz.', href: '/summarizer' },
  { num: '02', icon: BarChart2, color: 'var(--accent-green)', title: 'Visual Algorithm Explorer', desc: 'Browse 40+ algorithms with complexity badges and step-through visualizations.', href: '/algorithms' },
  { num: '03', icon: Layers, color: 'var(--accent-orange)', title: 'Code Reconstruction Challenge', desc: 'Drag and drop scrambled code blocks back into the correct order to learn by doing.', href: '/code-challenge' },
  { num: '04', icon: Mic, color: 'var(--accent-purple)', title: 'AI Voice Interviewer', desc: 'A live mock interview with a code editor, AI feedback, and difficulty levels.', href: '/ai-interviewer' },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-32 px-6 lg:px-24 max-w-[1360px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <p className="text-[0.75rem] uppercase tracking-[0.12em] font-semibold text-[var(--muted-foreground)] mb-4">Core Tools</p>
        <h2 className="font-display font-bold text-balance mb-16" style={{ fontSize: 'clamp(2rem,4vw,3.25rem)' }}>
          Four tools, one platform.
        </h2>
      </motion.div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px border border-[var(--border)] rounded-3xl overflow-hidden bg-[var(--border)]">
        {FEATURES.map((f, i) => (
          <motion.div key={f.num}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Link href={f.href}
              className="group relative flex flex-col gap-6 p-8 bg-[var(--surface)] hover:-translate-y-1.5 transition-transform duration-300 ease-out h-full overflow-hidden">
              {/* accent wash on hover */}
              <span
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `radial-gradient(120% 80% at 50% 0%, ${f.color}14, transparent 70%)` }}
              />
              {/* top accent bar */}
              <span
                className="pointer-events-none absolute top-0 left-0 h-0.5 w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
                style={{ background: f.color }}
              />
              <div className="relative flex items-start justify-between">
                <span className="text-xs font-semibold text-[var(--muted-foreground)] font-mono">{f.num}</span>
                <f.icon size={20} style={{ color: f.color }} className="transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
              </div>
              <div className="relative">
                <h3 className="font-display font-semibold text-[var(--foreground)] text-lg mb-2 group-hover:text-[var(--accent-blue)] transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{f.desc}</p>
              </div>
              <span className="relative mt-auto flex items-center gap-1 text-xs font-medium text-[var(--muted-foreground)] opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                Explore <ArrowUpRight size={13} />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
