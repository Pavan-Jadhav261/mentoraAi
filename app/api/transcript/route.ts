import { NextRequest, NextResponse } from 'next/server'
import { YoutubeTranscript } from 'youtube-transcript'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 })

    const transcript = await YoutubeTranscript.fetchTranscript(url)

    // Return both raw (for display with timestamps) and plain text (for AI)
    const items = transcript.map(item => ({
      ts: formatTime(item.offset / 1000),
      text: item.text,
    }))

    const fullText = transcript.map(item => item.text).join(' ')

    return NextResponse.json({ items, fullText })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch transcript'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
