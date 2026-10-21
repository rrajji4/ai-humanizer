import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: 'Text is required' }, { status: 400 });

    // Hamesha free chalne wali Google Gemini API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === "") {
      return NextResponse.json({ error: 'Free API Key (GEMINI_API_KEY) not found in Vercel Settings.' }, { status: 500 });
    }

    // Step 1: Content Generation (Gemini API Call)
    const genUrl = `https://googleapis.com{apiKey}`;
    
    const rawResponse = await fetch(genUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are a helpful research assistant. Write about: ${text}` }] }]
      })
    });

    const rawData = await rawResponse.json();
    const rawText = rawData.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate initial text.";

    // Step 2: Humanizer Engine (Making it AI undetectable)
    const humanizedResponse = await fetch(genUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are an expert human content writer. Rewrite the following text to make it sound 100% human-written and score 100% human on AI detectors. Use varied sentence lengths and natural language: ${rawText}` }] }]
      })
    });

    const humanData = await humanizedResponse.json();
    const humanizedText = humanData.candidates?.[0]?.content?.parts?.[0]?.text || "Conversion failed.";

    return NextResponse.json({ result: humanizedText });
  } catch (error) {
    return NextResponse.json({ error: `Free Engine Error: ${error.message || error}` }, { status: 500 });
  }
}
