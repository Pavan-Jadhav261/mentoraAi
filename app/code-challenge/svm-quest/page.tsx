'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import NavPill from '@/components/nav-pill'
import SiteFooter from '@/components/site-footer'

export default function SVMQuestPage() {
  const { theme, systemTheme } = useTheme()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const currentTheme = theme === 'system' ? systemTheme : theme
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'THEME_CHANGE', theme: currentTheme }, '*')
    }
  }, [theme, systemTheme])

  return (
    <div className="min-h-screen flex flex-col">
      <NavPill />
      <main className="flex-1 w-full pt-20">
        <iframe
          ref={iframeRef}
          src="/svm-quest.html"
          className="w-full h-[calc(100vh-80px)] border-0"
          title="SVM Quest"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </main>
      <SiteFooter />
    </div>
  )
}
