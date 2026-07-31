import { NextRequest } from 'next/server'

const OLLAMA_URL = 'http://localhost:11434/api/chat'
const MODEL = 'gemma3:4b'

export async function POST(req: NextRequest) {
  try {
    const { messages, topic } = await req.json()

    const systemPrompt = `You are a friendly, realistic AI interviewer. Interview the user on **${topic || 'general software engineering'}**.

Start with basic questions and gradually move to intermediate, advanced, and hard questions based on their performance.

Ask **one question at a time** and keep everything **short, clear, and crisp**. Make the conversation feel like a real interview with a human.

After each answer:
- If correct, briefly acknowledge it and move on.
- If partially correct or wrong, briefly explain what's missing, give a helpful suggestion, and then continue.
- Ask follow-up questions when appropriate.
- If the user's answer is completely irrelevant to the question asked, politely point that out and ask them to try answering the question again.

Adapt the difficulty based on their answers. Focus on concepts, reasoning, practical knowledge, and real-world scenarios. Keep your responses extremely short, strictly 1-2 sentences maximum. Never give long explanations unless explicitly asked.`

    const ollamaMessages = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ]

    const ollamaRes = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        messages: ollamaMessages,
        stream: true,
      }),
    })

    if (!ollamaRes.ok) {
      const errText = await ollamaRes.text()
      return new Response(JSON.stringify({ error: `Ollama error ${ollamaRes.status}: ${errText}` }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Stream NDJSON lines from Ollama → stream text chunks to client
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const reader = ollamaRes.body!.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.trim()) continue
            try {
              const json = JSON.parse(line)
              const chunk = json.message?.content ?? ''
              if (chunk) {
                controller.enqueue(encoder.encode(chunk))
              }
              if (json.done) {
                controller.close()
                return
              }
            } catch {
              // skip malformed lines
            }
          }
        }
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Interview API failed'
    console.error('[/api/interview] Error:', message)
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
