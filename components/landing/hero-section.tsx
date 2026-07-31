'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

function HeroIllustration() {
  return (
    <motion.svg
      viewBox="0 0 480 480"
      fill="none"
      className="w-full max-w-md mx-auto"
      aria-hidden
      initial="hidden"
      animate="show"
    >
      {/* Grid lines */}
      {[80, 160, 240, 320, 400].map((v) => (
        <line key={`h${v}`} x1="40" y1={v} x2="440" y2={v} stroke="var(--border)" strokeWidth="1" />
      ))}
      {[80, 160, 240, 320, 400].map((v) => (
        <line key={`v${v}`} x1={v} y1="40" x2={v} y2="440" stroke="var(--border)" strokeWidth="1" />
      ))}

      {/* Rotating dashed circle */}
      <motion.circle
        cx="240" cy="240" r="160"
        stroke="var(--accent-blue)" strokeWidth="1.5" strokeDasharray="6 4"
        style={{ transformOrigin: '240px 240px' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />

      {/* Diagonal cut rect — subtle float */}
      <motion.polygon
        points="100,140 300,140 380,340 180,340"
        fill="var(--accent-yellow)" fillOpacity="0.12" stroke="var(--accent-yellow)" strokeWidth="1.5"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Small accent circle — pulse */}
      <motion.circle
        cx="360" cy="120" r="36"
        fill="var(--accent-orange)" fillOpacity="0.15" stroke="var(--accent-orange)" strokeWidth="1.5"
        style={{ transformOrigin: '360px 120px' }}
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Triangle — counter float */}
      <motion.polygon
        points="120,380 200,260 280,380"
        fill="var(--accent-purple)" fillOpacity="0.12" stroke="var(--accent-purple)" strokeWidth="1.5"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Center node — breathing */}
      <motion.circle
        cx="240" cy="240" r="24" fill="var(--accent-blue)" fillOpacity="0.9"
        style={{ transformOrigin: '240px 240px' }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <circle cx="240" cy="240" r="8" fill="var(--surface)" />
    </motion.svg>
  )
}

export default function HeroSection() {
  return (
    <section className="pt-36 pb-20 md:pb-32 px-6 lg:px-24 max-w-[1360px] mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-[0.7rem] uppercase tracking-[0.12em] font-semibold text-[var(--muted-foreground)] mb-5"
          >
            <Sparkles size={12} className="text-[var(--accent-blue)]" />
            AI-Powered Algorithm Learning
          </motion.p>
          <h1 className="font-display font-extrabold leading-[1.0] tracking-[-0.02em] text-balance mb-6"
            style={{ fontSize: 'clamp(2.75rem,6vw,5.5rem)' }}>
            Stop Memorizing.<br />
            Start{' '}
            <span className="relative inline-block text-[var(--accent-blue)]">
              Visualizing.
              <motion.span
                className="absolute left-0 -bottom-1 h-1 rounded-full bg-[var(--accent-blue)]"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.6, duration: 0.6, ease: 'easeOut' }}
              />
            </span>
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg leading-relaxed max-w-[34ch] mb-10">
            MentoraAI turns YouTube lectures into structured notes and quizzes, brings every algorithm to life, and preps you for interviews with a live AI interviewer.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/signup"
              className="group flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--accent-blue)] text-white font-medium text-sm hover:opacity-90 active:scale-[0.97] transition-all duration-150">
              Get Started Free
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link href="/login"
              className="px-6 py-3 rounded-full border border-[var(--border)] text-[var(--foreground)] font-medium text-sm hover:bg-[var(--border)] active:scale-[0.97] transition-all duration-150">
              Log In
            </Link>
          </div>
        </motion.div>

        {/* Right illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="hidden md:block"
        >
          <HeroIllustration />
        </motion.div>
      </div>
    </section>
  )
}
