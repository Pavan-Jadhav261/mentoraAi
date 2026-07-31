'use client'
import { motion } from 'framer-motion'

const STEPS = [
  { n: '1', title: 'Paste a YouTube URL', body: 'Drop any CS lecture link into the Summarizer. We extract the transcript automatically.' },
  { n: '2', title: 'Study with AI', body: 'Get a structured summary, key points, and a quiz generated from the actual lecture content.' },
  { n: '3', title: 'Practice & Get Hired', body: 'Solve drag-and-drop code challenges, explore algorithm visuals, and nail mock AI interviews.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 px-6 lg:px-24 max-w-[1360px] mx-auto border-t border-[var(--border)]">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <p className="text-[0.75rem] uppercase tracking-[0.12em] font-semibold text-[var(--muted-foreground)] mb-4">How it works</p>
        <h2 className="font-display font-bold text-balance mb-16" style={{ fontSize: 'clamp(2rem,4vw,3.25rem)' }}>
          Three steps to mastery.
        </h2>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-12">
        {STEPS.map((s, i) => (
          <motion.div key={s.n}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
            className="group flex flex-col gap-4"
          >
            <span className="font-display font-extrabold text-[4rem] leading-none text-[var(--border)] transition-colors duration-300 group-hover:text-[var(--accent-blue)]">
              {s.n}
            </span>
            <h3 className="font-display font-semibold text-xl text-[var(--foreground)]">{s.title}</h3>
            <p className="text-[var(--muted-foreground)] leading-relaxed text-sm">{s.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
