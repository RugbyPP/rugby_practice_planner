import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { sessions, adaptations } from '@/lib/db/schema';
import { generateAdaptation } from '@/lib/llm';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const adaptSessionSchema = z.object({
  sessionId: z.number(),
  adaptationType: z.enum([
    'pitch_side',
    'assistant_brief',
    'parent_summary',
    'make_easier',
    'make_harder',
    'no_contact',
    'increase_contact',
    'fewer_players',
    'one_to_one',
    'small_group',
  ]),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { sessionId, adaptationType } = adaptSessionSchema.parse(body);

    // Get session
    const sessionResult = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1);

    if (sessionResult.length === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const session = sessionResult[0];

    // Verify user owns this session
    if (session.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Generate adaptation
    const adaptedMarkdown = await generateAdaptation(
      session.planMarkdown,
      adaptationType,
      {
        ageGrade: session.ageGrade,
        gender: session.gender,
        playerCount: session.playerCount,
        abilityLevel: session.abilityLevel,
        sessionLength: session.sessionLength,
        topic: session.topic,
        principle: session.principle,
        struggles: session.struggles || undefined,
        desiredOutcome: session.desiredOutcome || undefined,
        contactLevel: session.contactLevel,
        equipment: session.equipment || undefined,
        space: session.space || undefined,
      }
    );

    // Save adaptation
    const result = await db
      .insert(adaptations)
      .values({
        sessionId,
        userId: user.id,
        adaptationType,
        adaptedMarkdown,
      })
      .returning();

    return NextResponse.json({
      adaptation: result[0],
      adaptedMarkdown,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Adaptation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate adaptation' },
      { status: 500 }
    );
  }
}
