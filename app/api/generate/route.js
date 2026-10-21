import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: 'Text is required' }, { status: 400 });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.trim() === "") {
      return NextResponse.json({ error: 'API Key not found' }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey: apiKey });

    // Step 1: Content Generation
    const rawResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful research assistant.' },
        { role: 'user', content: text }
      ],
    });

    const rawText = rawResponse.choices.message.content;

    // Step 2: Humanizer Engine
    const humanizedResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert human content writer. Rewrite the text to score 100% human on detectors. Use varied sentence lengths.'
        },
        { role: 'user', content: rawText }
      ],
    });

    return NextResponse.json({ result: humanizedResponse.choices.message.content });
  } catch (error) {
    // FIX: Yahan backticks (``) laga diye hain taaki syntax error na aaye
    return NextResponse.json({ error: `AI Engine Error: ${error.message || error}` }, { status: 500 });
  }
}
