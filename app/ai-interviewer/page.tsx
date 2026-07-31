import NavPill from '@/components/nav-pill'
import SiteFooter from '@/components/site-footer'
import PageHeader from '@/components/page-header'
import AIInterviewer from '@/components/ai-interviewer/ai-interviewer'

export default function AIInterviewerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavPill />
      <main className="flex-1 max-w-[1360px] mx-auto w-full px-6 lg:px-24 pt-32 pb-20">
        <PageHeader eyebrow="Mock Interview" title="Practice with an AI Interviewer">
          Pick a difficulty, solve the prompt in the editor, and submit to hear real-time feedback.
        </PageHeader>
        <AIInterviewer />
      </main>
      <SiteFooter />
    </div>
  )
}
