import { NextRequest, NextResponse } from 'next/server';
import { generateSession } from '@/lib/llm';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const generateSessionSchema = z.object({
  ageGrade: z.string(),
  gender: z.string(),
  playerCount: z.number().min(1),
  abilityLevel: z.string(),
  sessionLength: z.number().min(30).max(120),
  topic: z.string(),
  principle: z.string(),
  struggles: z.string().optional(),
  desiredOutcome: z.string().optional(),
  contactLevel: z.string(),
  equipment: z.string().optional(),
  space: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = generateSessionSchema.parse(body);

    // Generate session plan using LLM
    const plan = await generateSession(input);

    return NextResponse.json({ plan });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Session generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate session' },
      { status: 500 }
    );
  }
}
