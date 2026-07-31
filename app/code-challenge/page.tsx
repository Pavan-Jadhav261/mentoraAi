import NavPill from '@/components/nav-pill'
import SiteFooter from '@/components/site-footer'
import PageHeader from '@/components/page-header'
import CodeChallenge from '@/components/code-challenge/code-challenge'

export default function CodeChallengePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavPill />
      <main className="flex-1 max-w-[1360px] mx-auto w-full px-6 lg:px-24 pt-32 pb-20">
        <PageHeader eyebrow="Code Challenge" title="Reconstruct the Algorithm">
          Drag the shuffled code blocks into the correct order, then check your solution to earn XP.
        </PageHeader>
        
        <div className="mb-12 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-[var(--accent-blue)] transition group">
          <div>
            <h3 className="text-xl font-display font-semibold mb-2 text-[var(--foreground)] group-hover:text-[var(--accent-blue)] transition">Interactive AI: SVM Quest</h3>
            <p className="text-[var(--muted-foreground)]">Train your first Support Vector Machine AI visually. Learn how algorithms separate data by playing through the code!</p>
          </div>
          <a href="/code-challenge/svm-quest" className="px-6 py-3 rounded-xl bg-[var(--foreground)] text-[var(--background)] font-medium whitespace-nowrap hover:opacity-90 active:scale-[0.98] transition">
            Play SVM Quest →
          </a>
        </div>

        <CodeChallenge />
      </main>
      <SiteFooter />
    </div>
  )
}
