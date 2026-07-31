import NavPill from '@/components/nav-pill'
import SiteFooter from '@/components/site-footer'
import RoadmapResult from '@/components/roadmap/roadmap-result'
import { createMockRoadmap } from '@/lib/learning-mock-data'

export default async function RoadmapResultPage({ searchParams }: { searchParams: Promise<{ topic?: string; level?: string; commitment?: string }> }) {
  const { topic, level, commitment } = await searchParams
  const roadmap = createMockRoadmap(topic || 'Your chosen topic', level || 'Complete Beginner', commitment || '5 hours/week')
  return <div className="min-h-screen flex flex-col"><NavPill /><main className="flex-1 w-full px-6 pb-20 pt-32 lg:px-24"><RoadmapResult roadmap={roadmap} /></main><SiteFooter /></div>
}
