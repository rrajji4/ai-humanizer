import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// OpenAI/Groq client initialize karna
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY,
  // Agar aap Groq use kar rahe hain toh baseUrl uncomment karein, warna OpenAI ke liye ise delete kar sakte hain
  // baseURL: "https://groq.com" 
});

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // AI Humanizer Logic / Prompt
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Ya jo bhi model aap use kar rahe hain (jaise 'llama-3.1-8b-instant' groq ke liye)
      messages: [
        {
          role: 'system',
          content: 'You are an expert AI Humanizer. Rewrite the provided text to make it sound 100% human-written, natural, and engaging. Remove any AI-generated footprints while maintaining the original meaning.'
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.7,
    });

    const humanizedText = response.choices[0].message.content;
    return NextResponse.json({ output: humanizedText }, { status: 200 });

  } catch (error) {
    console.error('Full API Error:', error);
    // Syntax Error yahan fixed hai (Backticks check karein)
    return NextResponse.json(
      { error: `AI Engine Error: ${error.message || error}` }, 
      { status: 500 }
    );
  }
}
