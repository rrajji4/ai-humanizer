import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: 'Text is required' }, { status: 400 });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === "") {
      return NextResponse.json({ error: 'GEMINI_API_KEY not found in Vercel Settings.' }, { status: 500 });
    }

    // New Google Gen AI Client Initialize
    const ai = new GoogleGenAI({ apiKey: apiKey });

    // Step 1: Raw Content Generation
    const rawResult = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `You are a helpful research assistant. Write about: ${text}`,
    });
    
    // Naye SDK me text read karne ka tarika
    const rawText = rawResult.text || "Failed to generate initial text.";

    // Step 2: Humanizer Engine (AI Detectors bypass karne ke liye)
    const humanResult = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `You are an expert human content writer. Rewrite the following text to make it sound 100% human-written, natural, and score 100% human on AI detectors. Use varied sentence lengths: ${rawText}`,
    });

    const humanizedText = humanResult.text || "Conversion failed.";

    return NextResponse.json({ result: humanizedText });
  } catch (error) {
    return NextResponse.json({ error: `Free Engine Error: ${error.message || error}` }, { status: 500 });
  }
}
