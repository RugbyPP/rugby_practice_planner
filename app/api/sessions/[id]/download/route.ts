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

    // Return HTML as PDF response
    // The browser will handle printing this HTML to PDF
    return new NextResponse(pdfBuffer.toString('utf-8'), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${sessionData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_session_plan.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: errorMessage },
      { status: 500 }
    );
  }
}
