import NavPill from '@/components/nav-pill'
import SiteFooter from '@/components/site-footer'
import RoadmapBuilder from '@/components/roadmap/roadmap-builder'

export default async function RoadmapPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const { role } = await searchParams
  return <div className="min-h-screen flex flex-col"><NavPill /><main className="flex-1 w-full px-6 pb-20 pt-32 lg:px-24"><RoadmapBuilder initialTopic={role ?? ''} /></main><SiteFooter /></div>
}
