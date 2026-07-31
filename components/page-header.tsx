'use client'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export default function PageHeader({ eyebrow, title, children }: { eyebrow: ReactNode; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-12">
      <motion.p
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="text-[0.75rem] uppercase tracking-[0.12em] font-semibold text-[var(--accent-blue)] mb-3"
      >
        {eyebrow}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
        className="font-display font-bold text-4xl text-[var(--foreground)] text-balance"
      >
        {title}
      </motion.h1>
      {children && (
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.12 }}
          className="text-[var(--muted-foreground)] max-w-[52ch] mt-4 leading-relaxed"
        >
          {children}
        </motion.div>
      )}
    </div>
  )
}
