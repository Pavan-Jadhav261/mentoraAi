import NavPill from '@/components/nav-pill'
import SiteFooter from '@/components/site-footer'
import RagChat from '@/components/ai-rag/rag-chat'

export const metadata = {
  title: 'AI RAG Engine | Mentora',
  description: 'Intelligent Teaching Engine based on RAG',
}

export default function AIRagPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background relative z-0">
      <NavPill />
      <div className="flex-1 w-full pt-28 pb-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-space mb-3">
            Intelligent <span className="text-primary">Teaching Engine</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Upload your study materials and chat with an adaptive AI tutor. Explore topics in Socratic, Feynman, or Exam modes.
          </p>
        </div>
        <RagChat />
      </div>
      <SiteFooter />
    </div>
  )
}
