# Rugby Practice Planner — Full Product

A production-ready web application that helps rugby coaches generate structured, age-aware, RFU-informed session plans using AI.

## 🎯 Features

### Core Functionality
- **Email Authentication** — Secure signup/login with JWT tokens
- **4-Step Session Builder** — Intuitive form for creating sessions
- **AI Session Generation** — Claude 3.5 Sonnet powered by OpenAI API
- **10 Adaptation Types** — One-tap variants for any session
- **Session Library** — Save and manage all sessions
- **Session Progression** — Build multi-session coaching blocks
- **RFU-Informed Guardrails** — Age-grade safety warnings and compliance

### Adaptation Types
1. **Pitch-Side Card** — Coach reference card for sideline use
2. **Assistant Brief** — Support coach instructions
3. **Parent Summary** — Family-friendly explanation
4. **Make Easier** — Simplified version for struggling players
5. **Make Harder** — Advanced version for experienced players
6. **No Contact** — Touch-only variant
7. **Increase Contact** — Progressive contact variant
8. **Fewer Players** — Adapted for smaller groups
9. **1-to-1 Coaching** — Individual coaching focus
10. **Small Group** — 4-6 player variant

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT with HTTP-only cookies
- **AI**: OpenAI API (Claude 3.5 Sonnet)
- **Deployment**: Vercel

### Database Schema
- **users** — Coach accounts with email/password
- **session_series** — Multi-session progression blocks
- **sessions** — Individual session plans
- **adaptations** — Generated variants from sessions

## 🚀 Deployment

### Quick Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/rugbypp/rugby-planner-web.git
   git branch -M main
   git push -u origin main
   ```

2. **Create Vercel Project**
   - Go to https://vercel.com/new
   - Connect GitHub and select this repository
   - Add environment variables (see below)

3. **Set Environment Variables**
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-random-secret
   OPENAI_API_KEY=sk-proj-...
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically

See `VERCEL_DEPLOYMENT.md` for detailed instructions.

## 🔧 Local Development

### Setup

```bash
# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local

# Configure environment variables
# DATABASE_URL=postgresql://...
# JWT_SECRET=your-secret
# OPENAI_API_KEY=sk-proj-...

# Run database migrations
npm run db:push

# Start dev server
npm run dev
```

Visit http://localhost:3000

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run db:push      # Run database migrations
npm run db:generate  # Generate migration files
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` — Create new account
- `POST /api/auth/login` — Login with email/password
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Get current user

### Sessions
- `GET /api/sessions` — List user's sessions
- `POST /api/sessions/generate` — Generate new session with AI
- `GET /api/sessions/[id]` — Get session details
- `DELETE /api/sessions/[id]` — Delete session
- `POST /api/sessions/adapt` — Generate adaptation variant

## 🔐 Security

- Passwords hashed with bcryptjs
- JWT authentication with HTTP-only cookies
- CSRF protection via SameSite cookies
- SQL injection prevention via Drizzle ORM
- Input validation with Zod
- Rate limiting on API endpoints (recommended)

## 💳 Payment Integration (Ready)

Database schema includes payment tracking. To add Stripe:

1. Install Stripe SDK: `npm install stripe`
2. Add `STRIPE_SECRET_KEY` environment variable
3. Create payment endpoints in `app/api/payments/`
4. Add subscription management UI

See `server/README.md` for backend payment setup.

## 📱 Responsive Design

- Mobile-first Tailwind CSS
- Works on phones, tablets, desktops
- Navy (#0D1B3E) and lime-green (#84CC16) branding
- Accessible form inputs and navigation

## 🧪 Testing

```bash
npm run test         # Run tests
npm run test:watch   # Watch mode
```

## 📈 Monitoring

- Vercel Analytics dashboard
- Database query monitoring
- OpenAI API usage tracking
- Error logging and alerting

## 🔄 Updates & Maintenance

### Database Migrations
```bash
# After schema changes
npm run db:generate
npm run db:push
```

### Deploy Updates
```bash
git add .
git commit -m "Your message"
git push origin main
# Vercel auto-deploys
```

## 🐛 Troubleshooting

### Build Fails
- Check Vercel logs
- Run `npm run build` locally
- Verify environment variables

### Database Errors
- Check `DATABASE_URL` is correct
- Ensure database is accessible
- Run migrations: `npm run db:push`

### OpenAI Errors
- Verify API key is valid
- Check account has credits
- Ensure API key has Claude 3.5 Sonnet access

## 📚 Documentation

- `VERCEL_DEPLOYMENT.md` — Deployment guide
- `lib/llm.ts` — AI generation logic
- `app/api/` — API endpoint documentation

## 🎓 RFU Compliance

This app includes:
- Age-grade appropriate activity suggestions
- Contact level safety warnings
- APES check (Active, Purposeful, Enjoyable, Safe)
- Coach responsibility disclaimers
- RFU principle-based planning

**Important**: Coaches remain responsible for RFU compliance, safeguarding, and session suitability.

## 📞 Support

For issues:
1. Check error logs in Vercel dashboard
2. Verify environment variables
3. Test locally: `npm run dev`
4. Check database connectivity

## 📄 License

Private project — All rights reserved

## 🚀 Future Enhancements

- [ ] PDF export for session plans
- [ ] Video tutorials for coaches
- [ ] Coaching analytics dashboard
- [ ] Team management features
- [ ] Mobile app (React Native)
- [ ] Stripe payment integration
- [ ] Advanced session analytics
- [ ] Coach collaboration features

## 📧 Contact

For questions or support, contact the development team.

---

**Built with ❤️ for rugby coaches**
