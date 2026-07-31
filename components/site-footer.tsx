import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] mt-auto">
      <div className="max-w-[1360px] mx-auto px-6 lg:px-24 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="font-display font-bold text-sm text-[var(--foreground)]">mentoraAI</Link>
        <div className="flex items-center gap-6">
          {[
            { href: '/summarizer', label: 'Summarizer' },
            { href: '/algorithms', label: 'Algorithms' },
            { href: '/code-challenge', label: 'Code Challenge' },
            { href: '/ai-interviewer', label: 'AI Interviewer' },
          ].map(l => (
            <Link key={l.href} href={l.href}
              className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              {l.label}
            </Link>
          ))}
        </div>
        <p className="text-xs text-[var(--muted-foreground)]">&copy; {new Date().getFullYear()} MentoraAI</p>
      </div>
    </footer>
  )
}
