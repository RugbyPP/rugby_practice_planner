/**
 * PDF Generation Utility
 * Generates a simple HTML string that can be converted to PDF by the browser
 * Returns base64-encoded HTML that can be served as a PDF
 */

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

/**
 * Generate a simple HTML document that represents the session plan
 * This HTML can be printed to PDF by the browser
 */
export async function generateSessionPDF(session: SessionData): Promise<Buffer> {
  const htmlContent = generatePDFHTML(session);
  
  // Convert HTML string to UTF-8 buffer
  const buffer = Buffer.from(htmlContent, 'utf-8');
  return buffer;
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
        return `<h3>${line.substring(4)}</h3>`;
      }
      if (line.startsWith('## ')) {
        return `<h2>${line.substring(3)}</h2>`;
      }
      if (line.startsWith('# ')) {
        return `<h1>${line.substring(2)}</h1>`;
      }
      // Bold text
      if (line.includes('**')) {
        return `<p>${line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;
      }
      // List items
      if (line.startsWith('- ')) {
        return `<li>${line.substring(2)}</li>`;
      }
      // Empty lines
      if (line.trim() === '') {
        return '<br />';
      }
      // Regular paragraphs
      if (line.trim()) {
        return `<p>${line}</p>`;
      }
      return '';
    })
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${session.title} - Rugby Session Plan</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    @page {
      size: A4;
      margin: 20mm;
    }
    
    @media print {
      body {
        margin: 0;
        padding: 0;
      }
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      color: #1e293b;
      background: white;
      line-height: 1.6;
      padding: 20px;
    }
    
    .container {
      max-width: 900px;
      margin: 0 auto;
    }
    
    .header {
      background: linear-gradient(135deg, #0D1B3E 0%, #1a2f5a 100%);
      color: white;
      padding: 30px;
      margin-bottom: 30px;
      border-bottom: 4px solid #84CC16;
      page-break-after: avoid;
    }
    
    .logo {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
      color: #84CC16;
    }
    
    .title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 8px;
      color: white;
    }
    
    .subtitle {
      font-size: 13px;
      color: #cbd5e1;
      margin-bottom: 5px;
    }
    
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin: 25px 0;
      padding: 20px;
      background: #f8fafc;
      border-left: 4px solid #84CC16;
      page-break-inside: avoid;
    }
    
    .detail-item {
      display: flex;
      flex-direction: column;
    }
    
    .detail-label {
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    
    .detail-value {
      font-size: 15px;
      color: #1e293b;
      font-weight: 500;
    }
    
    .section {
      margin: 25px 0;
      page-break-inside: avoid;
    }
    
    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #0D1B3E;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #84CC16;
    }
    
    .plan-content {
      margin-top: 15px;
      padding: 15px;
      background: white;
      border-left: 3px solid #84CC16;
    }
    
    .plan-content h1 {
      color: #84CC16;
      font-size: 20px;
      margin-top: 15px;
      margin-bottom: 10px;
      page-break-after: avoid;
    }
    
    .plan-content h2 {
      color: #84CC16;
      font-size: 16px;
      margin-top: 12px;
      margin-bottom: 8px;
      page-break-after: avoid;
    }
    
    .plan-content h3 {
      color: #84CC16;
      font-size: 14px;
      margin-top: 10px;
      margin-bottom: 6px;
      page-break-after: avoid;
    }
    
    .plan-content p {
      margin: 8px 0;
      line-height: 1.6;
    }
    
    .plan-content li {
      margin-left: 20px;
      margin-bottom: 4px;
      line-height: 1.6;
    }
    
    .plan-content strong {
      font-weight: 600;
      color: #0D1B3E;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
      font-size: 11px;
      color: #64748b;
      text-align: center;
      page-break-inside: avoid;
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
      <div class="title">${escapeHtml(session.title)}</div>
      <div class="subtitle">Session Plan • Created ${formattedDate}</div>
    </div>

    <!-- Session Details -->
    <div class="details-grid">
      <div class="detail-item">
        <div class="detail-label">Age Grade</div>
        <div class="detail-value">${escapeHtml(session.ageGrade)}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Players</div>
        <div class="detail-value">${session.playerCount}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Ability Level</div>
        <div class="detail-value">${escapeHtml(session.abilityLevel)}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Duration</div>
        <div class="detail-value">${session.sessionLength} minutes</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Topic</div>
        <div class="detail-value">${escapeHtml(session.topic)}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Principle</div>
        <div class="detail-value">${escapeHtml(session.principle)}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Contact Level</div>
        <div class="detail-value">${escapeHtml(session.contactLevel)}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Gender</div>
        <div class="detail-value">${escapeHtml(session.gender)}</div>
      </div>
    </div>

    <!-- Additional Details -->
    ${session.struggles ? `
      <div class="section">
        <div class="section-title">Player Struggles</div>
        <p>${escapeHtml(session.struggles)}</p>
      </div>
    ` : ''}

    ${session.desiredOutcome ? `
      <div class="section">
        <div class="section-title">Desired Outcome</div>
        <p>${escapeHtml(session.desiredOutcome)}</p>
      </div>
    ` : ''}

    ${session.equipment ? `
      <div class="section">
        <div class="section-title">Equipment</div>
        <p>${escapeHtml(session.equipment)}</p>
      </div>
    ` : ''}

    ${session.space ? `
      <div class="section">
        <div class="section-title">Space</div>
        <p>${escapeHtml(session.space)}</p>
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
</html>`;
}

/**
 * Escape HTML special characters to prevent injection
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, char => map[char]);
}
