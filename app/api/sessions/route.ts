import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { sessions, sessionSeries } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const createSessionSchema = z.object({
  ageGrade: z.string(),
  gender: z.string(),
  playerCount: z.string(),
  abilityLevel: z.string(),
  sessionLength: z.string(),
  coachingTopic: z.string(),
  principleOfPlay: z.string().optional(),
  playerStruggles: z.string().optional(),
  desiredOutcome: z.string().optional(),
  contactLevel: z.string(),
  equipment: z.string().optional(),
  space: z.string().optional(),
  isPartOfSeries: z.boolean().optional(),
  seriesTitle: z.string().optional(),
  totalSessions: z.number().optional(),
  currentSession: z.number().optional(),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userSessions = await db
      .select()
      .from(sessions)
      .where(eq(sessions.userId, user.userId));

    return NextResponse.json(userSessions);
  } catch (error) {
    console.error('Get sessions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = createSessionSchema.parse(body);

    let seriesId: number | null = null;

    // Create series if this is part of a series
    if (data.isPartOfSeries && data.seriesTitle) {
      const seriesResult = await db
        .insert(sessionSeries)
        .values({
          userId: user.userId,
          title: data.seriesTitle,
          ageGrade: data.ageGrade,
          totalSessions: data.totalSessions || 1,
          currentSession: data.currentSession || 1,
        })
        .returning();

      seriesId = seriesResult[0].id;
    }

    // Create session (without plan for now - will be generated)
    const result = await db
      .insert(sessions)
      .values({
        userId: user.userId,
        seriesId,
        sessionNumber: data.currentSession || 1,
        title: `${data.ageGrade} — ${data.coachingTopic}`,
        ageGrade: data.ageGrade,
        gender: data.gender,
        playerCount: data.playerCount,
        abilityLevel: data.abilityLevel,
        sessionLength: data.sessionLength,
        coachingTopic: data.coachingTopic,
        principleOfPlay: data.principleOfPlay,
        playerStruggles: data.playerStruggles,
        desiredOutcome: data.desiredOutcome,
        contactLevel: data.contactLevel,
        equipment: data.equipment,
        space: data.space,
        planMarkdown: '', // Will be filled by generation endpoint
        isAIGenerated: true,
      })
      .returning();

    const newSession = result[0];

    return NextResponse.json(newSession, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Create session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
