import { notFound } from 'next/navigation'
import NavPill from '@/components/nav-pill'
import SiteFooter from '@/components/site-footer'
import AlgorithmDetail from '@/components/algorithms/algorithm-detail'
import { ALGORITHMS } from '@/lib/dummy-data'
import { ALGORITHM_CODE } from '@/lib/algorithm-lessons'

export function generateStaticParams() {
  return ALGORITHMS.map(a => ({ slug: a.slug }))
}

export default async function AlgorithmPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const algo = ALGORITHMS.find(a => a.slug === slug)
  if (!algo) notFound()
  const code = ALGORITHM_CODE[slug] ?? {}

  return (
    <div className="min-h-screen flex flex-col">
      <NavPill />
      <main className="flex-1 max-w-[1360px] mx-auto w-full px-6 lg:px-24 pt-32 pb-20">
        <AlgorithmDetail algo={algo} code={code} />
      </main>
      <SiteFooter />
    </div>
  )
}
