import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import LinearRegressionWrapper from '@/components/linear-regression/LinearRegressionWrapper'

export default function LinearRegressionPage() {
  return (
    <main className="w-screen h-screen bg-[#0f172a] relative overflow-hidden font-sans flex flex-col">
      <div className="absolute top-6 left-6 z-50">
        <Link href="/algorithms" className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-full backdrop-blur-xl transition-all text-sm font-medium border border-white/10 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.5)]">
          <ArrowLeft size={16} />
          Back to Algorithms
        </Link>
      </div>
      <LinearRegressionWrapper />
    </main>
  )
}
