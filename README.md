# Rugby Practice Planner — Web App

A responsive web application for rugby coaches to generate RFU-informed, age-grade aware session plans with AI assistance. Features email authentication, session progression tracking, and instant adaptations.

## Features

- **Email Authentication** — Secure signup/login with JWT tokens
- **Session Builder** — Multi-step form for creating rugby sessions
- **AI Generation** — LLM-powered session plans with RFU-informed guardrails
- **Progression Tracking** — Build multi-session series to show coaching progression
- **Instant Adaptations** — 10 one-tap variants (pitch-side card, parent summary, easier/harder, no-contact, increase contact, fewer players, 1-to-1, small group)
- **Responsive Design** — Works beautifully on mobile and desktop
- **Payment-Ready** — Database schema and user tracking for future payment integration

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT + HTTP-only cookies
- **AI**: OpenAI API integration
- **Testing**: Vitest

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- OpenAI API key

### Installation

1. Clone the repository
```bash
cd rugby-planner-web
```

2. Install dependencies
```bash
npm install
# or
pnpm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your:
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — A secure random string
- `OPENAI_API_KEY` — Your OpenAI API key

4. Initialize the database
```bash
npm run db:push
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  api/
    auth/              # Authentication endpoints
    sessions/          # Session CRUD endpoints
  auth/                # Login/signup pages
  dashboard/           # Protected dashboard pages
  layout.tsx           # Root layout
  page.tsx             # Landing page
  globals.css          # Global styles

lib/
  db/
    schema.ts          # Database schema
    index.ts           # Database connection
  auth.ts              # Authentication utilities

components/            # Reusable React components

middleware.ts          # Route protection middleware
```

## Database Schema

- **users** — User accounts with email/password
- **session_series** — Multi-session progression blocks
- **sessions** — Individual session plans
- **adaptations** — Tracked variants (pitch-side, parent summary, etc.)

## API Endpoints

### Authentication
- `POST /api/auth/signup` — Create account
- `POST /api/auth/login` — Sign in
- `POST /api/auth/logout` — Sign out

### Sessions (Protected)
- `GET /api/sessions` — List user's sessions
- `POST /api/sessions` — Create new session
- `GET /api/sessions/:id` — Get session details
- `PUT /api/sessions/:id` — Update session
- `DELETE /api/sessions/:id` — Delete session

### Session Generation (Protected)
- `POST /api/sessions/generate` — Generate session plan with AI
- `POST /api/sessions/:id/adapt` — Generate adaptation variant

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Building for Production
```bash
npm run build
npm start
```

## Payment Integration (Future)

The database schema is designed to support payment tracking:
- User records can store subscription status
- Session series can have access control
- API endpoints can check payment status before allowing generation

## Security Notes

- Passwords are hashed with bcryptjs
- JWT tokens are stored in HTTP-only cookies
- All protected routes use middleware verification
- Environment variables are never exposed to the client

## License

MIT

## Support

For issues or questions, please open an issue on the repository.
