import NavPill from '@/components/nav-pill'
import SiteFooter from '@/components/site-footer'
import PageHeader from '@/components/page-header'
import ResumeMatcher from '@/components/resume-matcher/resume-matcher'

export const metadata = {
  title: 'Resume Analyser & Matcher - Mentora AI',
  description: 'Upload your resume to calculate your score, optimize for ATS, and discover live matching job opportunities.'
}

export default function ResumeMatcherPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavPill />
      <main className="flex-1 max-w-[1360px] mx-auto w-full px-6 lg:px-24 pt-32 pb-20">
        <PageHeader eyebrow="Resume Intelligence" title="Resume Analyzer & Job Matcher">
          Upload your resume or paste its text. We will analyze your ATS score, identify missing skills, and match you with relevant tech jobs.
        </PageHeader>
        <ResumeMatcher />
      </main>
      <SiteFooter />
    </div>
  )
}
