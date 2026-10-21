import { NextResponse } from 'next/server';

// Proxy static network cache completely block karne ke liye server configurations
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === "") {
      return NextResponse.json({ error: 'GEMINI_API_KEY not found in Vercel Settings.' }, { status: 500 });
    }

    // Google Rest HTTP Endpoint - Bina kisi external SDK binary overhead ke direct network channel use karega
    const targetUrl = `https://googleapis.com{apiKey}`;

    // Step 1: Raw Content Generation 
    const rawResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are a helpful research assistant. Write about: ${text}` }] }]
      }),
      cache: 'no-store' // Enforces server to completely ignore cached failed networks
    });

    if (!rawResponse.ok) {
      const errPayload = await rawResponse.text();
      return NextResponse.json({ error: `Google Network Error (Step 1): ${errPayload}` }, { status: rawResponse.status });
    }

    const rawData = await rawResponse.json();
    const rawText = rawData.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate initial text.";

    // Step 2: Humanizer Engine (AI Detectors bypass karne ke liye redirection logic)
    const humanResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are an expert human content writer. Rewrite the following text to make it sound 100% human-written, natural, and score 100% human on AI detectors. Use varied sentence lengths and informal expressions: ${rawText}` }] }]
      }),
      cache: 'no-store'
    });

    if (!humanResponse.ok) {
      const errPayload = await humanResponse.text();
      return NextResponse.json({ error: `Google Network Error (Step 2): ${errPayload}` }, { status: humanResponse.status });
    }

    const humanData = await humanResponse.json();
    const humanizedText = humanData.candidates?.[0]?.content?.parts?.[0]?.text || "Conversion failed.";

    return NextResponse.json({ result: humanizedText }, { status: 200 });

  } catch (error) {
    console.error("Critical Network Engine Crash:", error);
    // Agar native client fail hota hai, toh yeh clear diagnostic warning pass karega
    return NextResponse.json(
      { error: `Network Connection Interrupted: ${error.message || error}` }, 
      { status: 500 }
    );
  }
}
