'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useSession } from '@/lib/session'
import NavPill from '@/components/nav-pill'
import SiteFooter from '@/components/site-footer'
import AuthIllustration from '@/components/auth-illustration'

export default function SignupPage() {
  const { login } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    login()
    router.push('/summarizer')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavPill />
      <main className="flex-1 grid md:grid-cols-2 pt-20">
        <div className="hidden md:flex flex-col justify-center items-center bg-[var(--foreground)] px-16 py-20 gap-8">
          <AuthIllustration />
          <p className="font-display font-bold text-2xl text-[var(--background)] text-center">Your algorithm<br />journey starts here.</p>
        </div>

        <div className="flex flex-col justify-center items-center px-8 py-20">
          <div className="w-full max-w-sm">
            <h1 className="font-display font-bold text-3xl text-[var(--foreground)] mb-2">Create account</h1>
            <p className="text-[var(--muted-foreground)] text-sm mb-8">Free forever. No credit card needed.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input type="text" placeholder="Full name" required
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-transparent text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--accent-blue)] focus:ring-2 focus:ring-[var(--accent-blue)]/20 transition" />
              <input type="email" placeholder="Email" required
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-transparent text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--accent-blue)] focus:ring-2 focus:ring-[var(--accent-blue)]/20 transition" />
              <input type="password" placeholder="Password" required
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-transparent text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--accent-blue)] focus:ring-2 focus:ring-[var(--accent-blue)]/20 transition" />
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-full bg-[var(--accent-blue)] text-white font-semibold text-sm hover:opacity-90 active:scale-[0.97] transition-all disabled:opacity-60">
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-sm text-center text-[var(--muted-foreground)]">
              Already have an account?{' '}
              <Link href="/login" className="text-[var(--accent-blue)] hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
