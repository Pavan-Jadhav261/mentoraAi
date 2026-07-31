import NavPill from '@/components/nav-pill'
import SiteFooter from '@/components/site-footer'
import PageHeader from '@/components/page-header'
import AlgorithmGrid from '@/components/algorithms/algorithm-grid'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
export default function AlgorithmsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavPill />
      <main className="flex-1 max-w-[1360px] mx-auto w-full px-6 lg:px-24 pt-32 pb-20">
        <PageHeader eyebrow="Algorithm Catalog" title="Understand Algorithms Through Visuals">
          Browse 40+ algorithms grouped by category. Stars indicate interview priority, not difficulty.
        </PageHeader>
        <AlgorithmGrid />

        <div className="mt-32 mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl flex items-center gap-3">
              Complex Algorithms <Sparkles className="text-blue-500" />
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Deep-dive interactive simulations for advanced machine learning and sorting topics.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Linear Regression Card */}
            <Link href="/algorithms/linear-regression" className="group relative rounded-3xl overflow-hidden border border-border bg-card p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-6">
                <span className="text-2xl">📈</span>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">Linear Regression Visualizer</h3>
              <p className="text-muted-foreground text-sm flex-1 mb-6">
                Build intuition for machine learning! Drop data points on an interactive canvas and watch the Line of Best Fit dynamically minimize the Mean Squared Error (MSE).
              </p>
              
              <div className="flex items-center text-sm font-medium text-purple-500">
                Launch Visualizer <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* SVM Card */}
            <Link href="/algorithms/svm-visualizer" className="group relative rounded-3xl overflow-hidden border border-border bg-card p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                <span className="text-2xl">🍎</span>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">SVM Discovery Quest</h3>
              <p className="text-muted-foreground text-sm flex-1 mb-6">
                Don't just memorize Support Vector Machines—discover them! Play through 9 interactive levels covering margins, support vectors, and the Kernel trick.
              </p>
              
              <div className="flex items-center text-sm font-medium text-blue-500">
                Launch Visualizer <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
