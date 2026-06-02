import { NextRequest, NextResponse } from 'next/server';
import { generateAdaptation } from '@/lib/llm';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const adaptSessionSchema = z.object({
  sessionId: z.string(),
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
  planMarkdown: z.string(),
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
    console.log('Adapt request body:', JSON.stringify(body));
    
    const input = adaptSessionSchema.parse(body);
    console.log('Parsed adapt input:', JSON.stringify(input));

    // Generate adaptation using LLM
    console.log('Calling generateAdaptation...');
    const adaptedMarkdown = await generateAdaptation(
      input.planMarkdown,
      input.adaptationType,
      {
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
      }
    );
    console.log('Adaptation generated, length:', adaptedMarkdown?.length);

    return NextResponse.json({ adaptedMarkdown });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Adaptation error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'Failed to generate adaptation', details: errorMessage },
      { status: 500 }
    );
  }
}
