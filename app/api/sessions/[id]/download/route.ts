import { NextRequest, NextResponse } from 'next/server';
import { generateSessionPDF } from '@/lib/pdf-generator';
import { db } from '@/lib/db';
import { sessions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = parseInt(params.id, 10);
    if (isNaN(sessionId)) {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      );
    }

    // Fetch session from database
    const session = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1);

    if (!session || session.length === 0) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    const sessionData = session[0];

    // Prepare data for PDF generation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfData: any = {
      title: sessionData.title,
      ageGrade: sessionData.ageGrade,
      gender: sessionData.gender,
      playerCount: sessionData.playerCount,
      abilityLevel: sessionData.abilityLevel,
      sessionLength: sessionData.sessionLength,
      topic: sessionData.topic,
      principle: sessionData.principle,
      struggles: sessionData.struggles || undefined,
      desiredOutcome: sessionData.desiredOutcome || undefined,
      contactLevel: sessionData.contactLevel,
      equipment: sessionData.equipment || undefined,
      space: sessionData.space || undefined,
      planMarkdown: sessionData.planMarkdown,
      createdAt: sessionData.createdAt.toISOString(),
    };
    // Convert nulls to undefined
    Object.keys(pdfData).forEach(key => {
      if (pdfData[key] === null) {
        pdfData[key] = undefined;
      }
    });

    // Generate PDF
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await generateSessionPDF(pdfData as any);

    // Return PDF as response
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${sessionData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_session_plan.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
