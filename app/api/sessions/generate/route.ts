import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { sessions } from '@/lib/db/schema';
import { generateSession, type SessionGenerationInput } from '@/lib/llm';
import { z } from 'zod';

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
  seriesId: z.number().optional(),
  sessionNumber: z.number().optional(),
  totalSessions: z.number().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const input = generateSessionSchema.parse(body);

    // Generate session plan using LLM
    const planMarkdown = await generateSession(input as SessionGenerationInput);

    // Save to database
    const result = await db
      .insert(sessions)
      .values({
        userId: user.userId,
        title: input.topic, // Use topic as title for now
        ageGrade: input.ageGrade,
        gender: input.gender,
        playerCount: input.playerCount,
        abilityLevel: input.abilityLevel,
        sessionLength: input.sessionLength,
        topic: input.topic,
        principle: input.principle,
        struggles: input.struggles,
        desiredOutcome: input.desiredOutcome,
        contactLevel: input.contactLevel,
        equipment: input.equipment,
        space: input.space,
        planMarkdown,
        seriesId: input.seriesId,
        sessionNumber: input.sessionNumber || 1,
      })
      .returning();

    return NextResponse.json({
      session: result[0],
      planMarkdown,
    });
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
