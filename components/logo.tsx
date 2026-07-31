'use client'
import { motion } from 'framer-motion'

/**
 * MentoraAI mark — a geometric "node graph" that reads as an abstract M / rising
 * path. Three connected nodes climb upward, evoking learning progress + algorithms.
 */
export default function Logo({ size = 22, animated = true }: { size?: number; animated?: boolean }) {
  const Wrap = animated ? motion.svg : 'svg'
  const wrapProps = animated
    ? { whileHover: { rotate: 6, scale: 1.08 }, transition: { type: 'spring' as const, stiffness: 300, damping: 15 } }
    : {}

  return (
    <Wrap
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      {...wrapProps}
    >
      {/* connecting path */}
      <path
        d="M4 19 L9 8 L15 14 L20 5"
        stroke="var(--accent-blue)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* nodes */}
      <circle cx="4" cy="19" r="2.4" fill="var(--accent-blue)" />
      <circle cx="9" cy="8" r="2.4" fill="var(--accent-yellow)" />
      <circle cx="15" cy="14" r="2.4" fill="var(--accent-orange)" />
      <circle cx="20" cy="5" r="2.6" fill="var(--accent-green)" />
    </Wrap>
  )
}
