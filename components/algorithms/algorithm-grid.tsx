'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { ALGORITHMS } from '@/lib/dummy-data'
import StarRating from '@/components/star-rating'

const CATEGORIES = ['Sorting', 'Searching', 'Graph', 'Trees', 'Dynamic Programming', 'Backtracking']

export default function AlgorithmGrid() {
  return (
    <div className="space-y-14">
      {CATEGORIES.map(cat => {
        const algos = ALGORITHMS.filter(a => a.category === cat)
        if (!algos.length) return null
        return (
          <div key={cat}>
            <motion.h2
              initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4 }}
              className="font-display font-bold text-xl text-[var(--foreground)] mb-6 flex items-center gap-3"
            >
              <span className="w-1.5 h-5 rounded-full bg-[var(--accent-blue)]" />
              {cat}
              <span className="text-xs font-sans font-normal text-[var(--muted-foreground)] border border-[var(--border)] rounded-full px-2 py-0.5">{algos.length}</span>
            </motion.h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {algos.map((algo, i) => (
                <motion.div key={algo.slug}
                  initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
                >
                  <Link href={`/algorithms/${algo.slug}`}
                    className="group relative flex flex-col gap-3 p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:-translate-y-1.5 hover:border-[var(--accent-blue)]/40 hover:shadow-[0_8px_28px_-8px_rgba(0,0,0,0.12)] transition-all duration-300 h-full overflow-hidden">
                    <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(120%_80%_at_100%_0%,var(--accent-blue)/8,transparent_60%)]" />
                    <ArrowUpRight size={14} className="absolute top-4 right-4 text-[var(--accent-blue)] opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                    <div className="relative flex items-start justify-between gap-2">
                      <h3 className="font-display font-semibold text-[var(--foreground)] text-sm group-hover:text-[var(--accent-blue)] transition-colors pr-4">
                        {algo.name}
                      </h3>
                      <StarRating stars={algo.stars}/>
                    </div>
                    <p className="relative text-xs text-[var(--muted-foreground)] leading-relaxed">{algo.desc}</p>
                    <div className="relative flex gap-2 mt-auto">
                      <span className="text-[0.65rem] font-mono text-[var(--accent-green)] bg-[var(--accent-green)]/10 px-2 py-0.5 rounded-full transition-transform duration-200 group-hover:scale-105">{algo.time}</span>
                      <span className="text-[0.65rem] font-mono text-[var(--accent-orange)] bg-[var(--accent-orange)]/10 px-2 py-0.5 rounded-full transition-transform duration-200 group-hover:scale-105">{algo.space}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
