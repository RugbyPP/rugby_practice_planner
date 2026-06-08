import puppeteer, { type Browser, type Page } from 'puppeteer';

interface SessionData {
  title: string;
  ageGrade: string;
  gender: string;
  playerCount: number;
  abilityLevel: string;
  sessionLength: number;
  topic: string;
  principle: string;
  struggles?: string | undefined;
  desiredOutcome?: string | undefined;
  contactLevel: string;
  equipment?: string | undefined;
  space?: string | undefined;
  planMarkdown: string;
  createdAt: string;
}

export async function generateSessionPDF(session: SessionData): Promise<Uint8Array> {
  let browser: Browser | undefined;
  let page: Page | undefined;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    page = await browser.newPage();
    
    // Set viewport for consistent rendering
    await page.setViewport({ width: 1200, height: 1600 });

    // Generate HTML content
    const htmlContent = generatePDFHTML(session);

    // Set content
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm',
      },
      printBackground: true,
    });

    return new Uint8Array(pdfBuffer);
  } finally {
    if (page) {
      await page.close();
    }
    if (browser) {
      await browser.close();
    }
  }
}

function generatePDFHTML(session: SessionData): string {
  const formattedDate = new Date(session.createdAt).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Convert markdown to simple HTML
  const planHTML = session.planMarkdown
    .split('\n')
    .map(line => {
      // Headings
      if (line.startsWith('### ')) {
        return `<h3 style="color: #84CC16; font-size: 16px; font-weight: bold; margin-top: 16px; margin-bottom: 8px;">${line.substring(4)}</h3>`;
      }
      if (line.startsWith('## ')) {
        return `<h2 style="color: #84CC16; font-size: 20px; font-weight: bold; margin-top: 20px; margin-bottom: 12px;">${line.substring(3)}</h2>`;
      }
      if (line.startsWith('# ')) {
        return `<h1 style="color: #84CC16; font-size: 24px; font-weight: bold; margin-top: 24px; margin-bottom: 16px;">${line.substring(2)}</h1>`;
      }
      // Bold text
      if (line.includes('**')) {
        return `<p style="margin: 8px 0; line-height: 1.6;">${line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;
      }
      // List items
      if (line.startsWith('- ')) {
        return `<li style="margin-left: 20px; margin-bottom: 4px; line-height: 1.6;">${line.substring(2)}</li>`;
      }
      // Empty lines
      if (line.trim() === '') {
        return '<div style="height: 8px;"></div>';
      }
      // Regular paragraphs
      if (line.trim()) {
        return `<p style="margin: 8px 0; line-height: 1.6;">${line}</p>`;
      }
      return '';
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          color: #1e293b;
          background: white;
          line-height: 1.6;
        }
        .container {
          width: 100%;
          max-width: 100%;
          padding: 0;
        }
        .header {
          background: linear-gradient(135deg, #0D1B3E 0%, #1a2f5a 100%);
          color: white;
          padding: 30px;
          margin-bottom: 30px;
          border-bottom: 4px solid #84CC16;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          color: #84CC16;
        }
        .title {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 10px;
          color: white;
        }
        .subtitle {
          font-size: 14px;
          color: #cbd5e1;
          margin-bottom: 5px;
        }
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin: 30px 0;
          padding: 20px;
          background: #f8fafc;
          border-left: 4px solid #84CC16;
          border-radius: 4px;
        }
        .detail-item {
          display: flex;
          flex-direction: column;
        }
        .detail-label {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .detail-value {
          font-size: 16px;
          color: #1e293b;
          font-weight: 500;
        }
        .section {
          margin: 30px 0;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #0D1B3E;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 2px solid #84CC16;
        }
        .plan-content {
          margin-top: 20px;
          padding: 20px;
          background: white;
          border-left: 3px solid #84CC16;
        }
        .plan-content h1 {
          color: #84CC16 !important;
          font-size: 22px !important;
          margin-top: 20px !important;
          margin-bottom: 12px !important;
        }
        .plan-content h2 {
          color: #84CC16 !important;
          font-size: 18px !important;
          margin-top: 16px !important;
          margin-bottom: 10px !important;
        }
        .plan-content h3 {
          color: #84CC16 !important;
          font-size: 15px !important;
          margin-top: 12px !important;
          margin-bottom: 8px !important;
        }
        .plan-content p {
          margin: 8px 0 !important;
          line-height: 1.6 !important;
        }
        .plan-content li {
          margin-left: 20px !important;
          margin-bottom: 4px !important;
          line-height: 1.6 !important;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e2e8f0;
          font-size: 12px;
          color: #64748b;
          text-align: center;
        }
        .footer-text {
          color: #84CC16;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="logo">🏉 RUGBY PRACTICE PLANNER</div>
          <div class="title">${session.title}</div>
          <div class="subtitle">Session Plan • Created ${formattedDate}</div>
        </div>

        <!-- Session Details -->
        <div class="details-grid">
          <div class="detail-item">
            <div class="detail-label">Age Grade</div>
            <div class="detail-value">${session.ageGrade}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Players</div>
            <div class="detail-value">${session.playerCount}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Ability Level</div>
            <div class="detail-value">${session.abilityLevel}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Duration</div>
            <div class="detail-value">${session.sessionLength} minutes</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Topic</div>
            <div class="detail-value">${session.topic}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Principle</div>
            <div class="detail-value">${session.principle}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Contact Level</div>
            <div class="detail-value">${session.contactLevel}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Gender</div>
            <div class="detail-value">${session.gender}</div>
          </div>
        </div>

        <!-- Additional Details -->
        ${session.struggles ? `
          <div class="section">
            <div class="section-title">Player Struggles</div>
            <p>${session.struggles}</p>
          </div>
        ` : ''}

        ${session.desiredOutcome ? `
          <div class="section">
            <div class="section-title">Desired Outcome</div>
            <p>${session.desiredOutcome}</p>
          </div>
        ` : ''}

        ${session.equipment ? `
          <div class="section">
            <div class="section-title">Equipment</div>
            <p>${session.equipment}</p>
          </div>
        ` : ''}

        ${session.space ? `
          <div class="section">
            <div class="section-title">Space</div>
            <p>${session.space}</p>
          </div>
        ` : ''}

        <!-- Session Plan -->
        <div class="section">
          <div class="section-title">Session Plan</div>
          <div class="plan-content">
            ${planHTML}
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>Generated by <span class="footer-text">Rugby Practice Planner</span></p>
          <p>Better Coaching. Better Players. Better Game.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
