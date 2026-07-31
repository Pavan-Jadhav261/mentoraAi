'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function CtaBand() {
  return (
    <section className="mx-6 lg:mx-24 mb-20 rounded-3xl bg-[var(--accent-blue)] overflow-hidden relative">
      {/* floating decorative shapes */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-10 h-52 w-52 rounded-full bg-white/10"
        animate={{ y: [0, 20, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-12 h-64 w-64 rounded-full bg-white/5"
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.5 }}
        className="relative px-10 py-20 flex flex-col items-center text-center gap-8"
      >
        <p className="text-[0.75rem] uppercase tracking-[0.12em] font-semibold text-white/60">Ready?</p>
        <h2 className="font-display font-extrabold text-white text-balance" style={{ fontSize: 'clamp(2rem,4vw,3.25rem)' }}>
          Start learning algorithms<br />the visual way.
        </h2>
        <Link href="/signup"
          className="group flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[var(--accent-blue)] font-semibold text-sm hover:opacity-90 active:scale-[0.97] transition-all duration-150">
          Create Free Account
          <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </section>
  )
}
