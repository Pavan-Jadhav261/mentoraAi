'use client'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Sun, Moon, Menu, X, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from '@/lib/session'
import Logo from '@/components/logo'

const APP_LINKS = [
  { href: '/summarizer', label: 'Summary' },
  { href: '/algorithms', label: 'Algorithms' },
  { href: '/code-challenge', label: 'Challenge' },  
  { href: '/ai-interviewer', label: 'Interview' },
  { href: '/smart-editor', label: 'Smart Editor' },
  // { href: '/resume-matcher', label: 'Resume' },
  // { href: '/roadmap', label: 'Roadmap' },
  // { href: '/dashboard', label: 'Dashboard' },
]

const PUBLIC_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
]

export default function NavPill() {
  const { theme, setTheme } = useTheme()
  const { loggedIn, logout } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isApp = loggedIn && !['/', '/login', '/signup'].includes(pathname)
  const links = isApp ? APP_LINKS : PUBLIC_LINKS

  const handleLogout = () => { logout(); router.push('/') }
  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl"
    >
      <div className="flex items-center justify-between gap-4 rounded-full border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-xl px-5 py-2.5 shadow-sm">
        {/* Wordmark */}
        <Link href="/" className="group flex items-center gap-2 shrink-0">
          <Logo size={22} />
          <span className="font-display font-bold text-sm tracking-tight">
            <span className="text-[var(--foreground)]">Mentora</span>
            <span className="text-[var(--accent-blue)]">AI</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex min-w-0 items-center gap-0.5">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className={`group relative shrink-0 whitespace-nowrap px-2.5 py-1.5 rounded-full text-sm transition-colors duration-150 ${isActive(l.href) ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}>
              {l.label}
              <span className={`pointer-events-none absolute left-3 right-3 -bottom-0.5 h-px origin-left bg-[var(--accent-blue)] transition-transform duration-200 ease-out ${isActive(l.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {mounted && (
            <motion.button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              whileTap={{ scale: 0.85, rotate: 30 }}
              className="p-1.5 rounded-full hover:bg-[var(--border)] transition-colors">
              {theme === 'dark'
                ? <Sun size={16} className="text-[var(--muted-foreground)]"/>
                : <Moon size={16} className="text-[var(--muted-foreground)]"/>}
            </motion.button>
          )}

          {isApp ? (
            <div className="hidden md:flex items-center gap-1">
              <button onClick={handleLogout}
                className="flex shrink-0 items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-full text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--border)] transition-colors">
                <LogOut size={14}/> Log out
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login"
                className="shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-sm border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--border)] transition-colors">
                Log in
              </Link>
              <Link href="/signup"
                className="shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                Sign up
              </Link>
            </div>
          )}

          {/* Hamburger */}
          <button className="md:hidden p-1.5" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
            {open ? <X size={18}/> : <Menu size={18}/>}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="mt-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md p-4 flex flex-col gap-1">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className={`px-4 py-2.5 rounded-xl text-sm transition-colors ${isActive(l.href) ? 'bg-[var(--accent-blue)]/10 text-[var(--foreground)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--border)]'}`}>
              {l.label}
            </Link>
          ))}
          {!isApp && (
            <div className="flex gap-2 mt-2 pt-2 border-t border-[var(--border)]">
              <Link href="/login" onClick={() => setOpen(false)}
                className="flex-1 text-center px-3 py-2 rounded-full text-sm border border-[var(--border)] text-[var(--foreground)]">
                Log in
              </Link>
              <Link href="/signup" onClick={() => setOpen(false)}
                className="flex-1 text-center px-3 py-2 rounded-full text-sm bg-primary text-primary-foreground">
                Sign up
              </Link>
            </div>
          )}
          {isApp && (
            <button onClick={handleLogout}
              className="mt-2 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-[var(--muted-foreground)]">
              <LogOut size={14}/> Log out
            </button>
          )}
        </div>
      )}
    </motion.nav>
  )
}
