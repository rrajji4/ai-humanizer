import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: 'Text is required' }, { status: 400 });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is missing in Vercel settings.' }, { status: 500 });
    }

    // Google Gemini Pro API Endpoint
    const targetUrl = `https://googleapis.com{apiKey}`;

    // Step 1: Raw Content Generation
    const rawResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are a helpful research assistant. Write comprehensive info about: ${text}` }] }]
      })
    });

    const rawData = await rawResponse.json();
    if (rawData.error) return NextResponse.json({ error: `Gemini Error 1: ${rawData.error.message}` }, { status: 500 });
    
    const rawText = rawData.candidates?.[0]?.content?.parts?.[0]?.text || "No text generated.";

    // Step 2: Advanced 100% Humanizer Engine
    const humanResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are an expert human content writer. Rewrite the following text to make it sound 100% human-written, natural, and completely bypass AI detectors. Use varied sentence lengths (burstiness), casual flow, and absolutely BAN robotic words like 'delve', 'tapestry', 'crucial', 'furthermore', 'in conclusion': ${rawText}` }] }]
      })
    });

    const humanData = await humanResponse.json();
    if (humanData.error) return NextResponse.json({ error: `Gemini Error 2: ${humanData.error.message}` }, { status: 500 });

    const humanizedText = humanData.candidates?.[0]?.content?.parts?.[0]?.text || "Humanization failed.";

    return NextResponse.json({ result: humanizedText });

  } catch (error) {
    return NextResponse.json({ error: `Server Error: ${error.message || error}` }, { status: 500 });
  }
}
