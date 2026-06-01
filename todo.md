# Rugby Planner Web — TODO

## Phase 1: Project Setup ✅
- [x] Next.js 14 project scaffold with TypeScript
- [x] Tailwind CSS configuration with navy/lime-green theme
- [x] PostgreSQL database schema (users, sessions, series, adaptations)
- [x] Drizzle ORM setup and migrations
- [x] Environment configuration (.env.example)

## Phase 2: Authentication ✅
- [x] Email signup with password hashing (bcryptjs)
- [x] Email login with JWT tokens
- [x] HTTP-only cookie session management
- [x] Logout endpoint
- [x] Route middleware for protected pages
- [x] Signup page UI
- [x] Login page UI

## Phase 3: Dashboard & Navigation ✅
- [x] Dashboard layout with responsive header
- [x] Dashboard home page with stats and features
- [x] Mobile-responsive navigation
- [x] Tab navigation for desktop

## Phase 4: Session Builder ✅
- [x] Multi-step form (4 steps)
- [x] Step 1: Player Group (age grade, gender, count, ability)
- [x] Step 2: Session Focus (length, topic, principle, struggles, outcome)
- [x] Step 3: Delivery Conditions (contact level, equipment, space)
- [x] Step 4: Review & Series (progression tracking)
- [x] Series creation with session numbering
- [x] Contact level safety warnings
- [x] Form validation and progress indicator

## Phase 5: Session Generation & Adaptations
- [ ] OpenAI API integration for LLM
- [ ] Session generation endpoint with RFU guardrails
- [ ] Adaptation generation (10 types):
  - [ ] Pitch-Side Card
  - [ ] Assistant Brief
  - [ ] Parent Summary
  - [ ] Make Easier
  - [ ] Make Harder
  - [ ] No Contact
  - [ ] Increase Contact (NEW)
  - [ ] Fewer Players
  - [ ] 1-to-1
  - [ ] Small Group
- [ ] Progression suggestions (AI suggests next session based on previous)
- [ ] Save adaptations to database

## Phase 6: Session Library & Viewing
- [ ] Session view page with markdown rendering
- [ ] Adaptation buttons on session page
- [ ] Copy to clipboard functionality
- [ ] PDF export functionality
- [ ] Sessions library page with filtering
- [ ] Series timeline view
- [ ] Delete session functionality
- [ ] Session search and sorting

## Phase 7: Payment & Deployment
- [ ] Stripe integration scaffolding
- [ ] User subscription tracking in database
- [ ] Payment status checks in API routes
- [ ] Usage limits (free tier vs paid)
- [ ] Database migrations for payment
- [ ] Environment setup for production
- [ ] Deploy to production server
- [ ] SSL/HTTPS configuration
- [ ] Database backups

## Phase 8: Polish & Testing
- [ ] Unit tests for auth endpoints
- [ ] Integration tests for session CRUD
- [ ] E2E tests for main user flows
- [ ] Mobile responsiveness testing
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Error handling improvements
- [ ] Loading states and skeletons
- [ ] Toast notifications for user feedback

## Known Limitations (MVP)
- LLM generation is mocked (returns template)
- No real OpenAI API calls yet
- Session fetch endpoints not implemented
- PDF export not implemented
- Series progression suggestions not implemented
- Email verification not implemented
- Password reset not implemented
- User profile/settings page not implemented
