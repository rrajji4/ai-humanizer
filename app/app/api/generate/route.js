import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Step 1: Raw AI Content Generation
    const rawResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a highly knowledgeable research assistant. Provide detailed information on the topic.' },
        { role: 'user', content: prompt }
      ],
    });

    const rawText = rawResponse.choices.message.content;

    // Step 2: Advanced Humanizer Engine
    const humanizedResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert human content writer and editor. Your job is to rewrite the provided AI text so that it scores 100% human and completely bypasses AI detectors. 
          
          Strict Rules:
          1. Use varied sentence lengths (Burstiness). Write a short sentence of 4 words, then a long one of 20 words.
          2. Use natural transitions. Absolutely BAN words like: 'delve', 'tapestry', 'crucial', 'testament', 'furthermore', 'in conclusion', 'moreover', 'revolutionize'.
          3. Write in a conversational, engaging, and authoritative tone (like a real expert blogger).
          4. Include realistic flow, minor style quirks, or everyday idioms where appropriate.
          5. Keep the exact core facts, structure, and value of the original text but change the linguistic pattern completely.`
        },
        { role: 'user', content: rawText }
      ],
    });

    const humanText = humanizedResponse.choices.message.content;

    return NextResponse.json({ result: humanText });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Something went wrong with the AI Engine' }, { status: 500 });
  }
}
