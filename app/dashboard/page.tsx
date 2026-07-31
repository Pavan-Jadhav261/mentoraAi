import NavPill from '@/components/nav-pill'
import SiteFooter from '@/components/site-footer'
import DashboardContent from '@/components/dashboard/dashboard-content'

export default function DashboardPage() {
  return <div className="min-h-screen flex flex-col"><NavPill /><main className="flex-1 max-w-[1360px] mx-auto w-full px-6 pb-20 pt-32 lg:px-24"><DashboardContent /></main><SiteFooter /></div>
}
