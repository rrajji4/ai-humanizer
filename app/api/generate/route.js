import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });

    const rawResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a highly knowledgeable research assistant.' },
        { role: 'user', content: prompt }
      ],
    });

    const rawText = rawResponse.choices.message.content;

    const humanizedResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert human content writer. Rewrite the text to score 100% human on detectors. Use varied sentence lengths. Completely BAN words like: delve, tapestry, crucial, testament, furthermore, in conclusion.`
        },
        { role: 'user', content: rawText }
      ],
    });

    return NextResponse.json({ result: humanizedResponse.choices.message.content });
  } catch (error) {
    return NextResponse.json({ error: 'AI Engine Error' }, { status: 500 });
  }
}
