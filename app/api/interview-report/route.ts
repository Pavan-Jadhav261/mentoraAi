import { NextResponse } from 'next/server'

export const maxDuration = 300 // allow up to 5 minutes

export async function POST(req: Request) {
  try {
    const { messages, topic } = await req.json()

    if (!messages || messages.length === 0) {
      return NextResponse.json({ report: "No conversation history available to generate a report." })
    }

    const systemPrompt = `You are an expert technical interviewer evaluator.
The user just completed a mock interview on the topic of "${topic}".
Below is the transcript of their conversation with the AI interviewer.
You must generate a comprehensive feedback report.

Include the following sections (formatted beautifully in Markdown):
1. **Overall Progress**: A summary of how the candidate performed overall.
2. **Detailed Feedback**: Feedback on how the candidate answered specific questions, highlighting strengths and weaknesses.
3. **Ideal Answers**: Examples of what the actual/ideal answers should have been for the questions asked.

Transcript:
${messages.map((m: any) => `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.content}`).join('\n\n')}

Write the report now:`

    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemma3:4b',
        prompt: systemPrompt,
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error('Ollama API error')
    }

    const data = await response.json()
    
    return NextResponse.json({ report: data.response })

  } catch (error) {
    console.error('Interview Report Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}
