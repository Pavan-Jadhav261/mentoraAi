import { NextRequest, NextResponse } from 'next/server'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ''
const MODEL = 'google/gemma-4-26b-a4b-it:free'

async function callOpenRouter(prompt: string): Promise<string> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'Mentora Summarizer',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      stream: false,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`OpenRouter error ${res.status}: ${errText}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

export async function POST(req: NextRequest) {
  try {
    const { transcript, type, question, quizCount } = await req.json()

    let prompt = ''

    if (type === 'notes') {
      prompt = `You are an expert educator. Below is the transcript of a YouTube video.
Create comprehensive, well-structured study notes from this transcript.

Format your response as follows:
## Overview
A 2-3 sentence summary of what the video covers.

## Key Topics
List the main topics covered, each as a heading with bullet points underneath covering the key ideas.

## Important Concepts
Highlight the most critical concepts, definitions, or formulas mentioned.

## Key Takeaways
3-5 bullet points summarizing the most important things to remember.

## Conclusion
A brief closing statement tying everything together.

Transcript:
${transcript}

Provide clear, concise notes that a student can use to study from.`

    } else if (type === 'quiz') {
      prompt = `You are an expert educator. Based on this video transcript, generate exactly ${quizCount} multiple choice questions to test understanding.

Return ONLY a valid JSON array with no extra text, markdown code fences, or explanation. The format must be exactly:
[
  {
    "q": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": 0
  }
]

Where "answer" is the zero-based index of the correct option.

Transcript:
${transcript}

Generate ${quizCount} questions covering the main topics of the video. Make questions clear, educational, and varied in difficulty.`

    } else if (type === 'chat') {
      prompt = `You are a helpful AI tutor. The user has watched a video and you have access to its transcript. Answer their question concisely and clearly, grounding your answer in the video content.

Video transcript:
${transcript}

User's question: ${question}

Provide a helpful, concise answer (2-4 sentences) based on the video content.`
    }

    const content = await callOpenRouter(prompt)

    if (type === 'quiz') {
      // Strip markdown code fences if the model wrapped JSON in them
      const cleaned = content.replace(/```(?:json)?\n?/gi, '').replace(/```/g, '').trim()
      const jsonMatch = cleaned.match(/\[[\s\S]*\]/)
      if (!jsonMatch) throw new Error('Could not parse quiz JSON from AI response')
      const questions = JSON.parse(jsonMatch[0])
      return NextResponse.json({ questions })
    }

    return NextResponse.json({ content })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'AI request failed'
    console.error('[/api/ai] Error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
