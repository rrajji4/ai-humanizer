import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: "Switched to client-side pipeline to bypass Vercel fetch timeouts." });
}
