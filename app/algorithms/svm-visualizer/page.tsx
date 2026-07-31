import SVMVisualizerWrapper from '@/components/svm-visualizer/SVMVisualizerWrapper'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function SVMVisualizerPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          body { overflow: hidden; margin: 0; padding: 0; }
        `
      }} />
      <main className="w-screen h-screen bg-[#0f172a] relative overflow-hidden svm-visualizer-wrapper">
        <div className="absolute top-4 left-4 z-50">
          <Link href="/algorithms" className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all text-sm font-medium border border-white/20 shadow-lg">
            <ArrowLeft size={16} />
            Back to Algorithms
          </Link>
        </div>
        <SVMVisualizerWrapper />
      </main>
    </>
  )
}
