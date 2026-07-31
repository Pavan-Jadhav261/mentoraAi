import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { question, algorithm, explanation } = await req.json()

    if (!question || !algorithm) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const prompt = `You are a helpful and concise computer science tutor. 
The student is currently learning about the algorithm: ${algorithm}.
Here is a brief explanation of the algorithm: ${explanation}

The student has asked the following doubt: "${question}"

Please provide a clear, concise, and helpful answer to their doubt. Keep it brief (under 3 paragraphs) and easy to understand.`

    // Communicate with local Ollama API
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemma3:4b',
        prompt: prompt,
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json({ answer: data.response })

  } catch (error) {
    console.error('Ask Doubt API Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response. Ensure Ollama is running locally with the gemma3:4b model.' },
      { status: 500 }
    )
  }
}
