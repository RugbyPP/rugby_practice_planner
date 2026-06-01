# Rugby Planner Web — Deployment Guide

This guide covers deploying the Rugby Planner web app to production with PostgreSQL, authentication, and payment integration scaffolding.

## Prerequisites

- Node.js 18+ and npm/pnpm
- PostgreSQL 14+ database
- OpenAI API key (for session generation)
- Stripe account (for payment processing)
- A domain name and SSL certificate
- A hosting provider (Vercel, Heroku, AWS, etc.)

## Environment Setup

### 1. Database Setup

Create a PostgreSQL database:

```bash
createdb rugby_planner_prod
```

### 2. Environment Variables

Create a `.env.production` file with:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/rugby_planner_prod

# JWT
JWT_SECRET=<generate-a-secure-random-string>

# LLM
OPENAI_API_KEY=<your-openai-api-key>

# Stripe (for payment)
STRIPE_SECRET_KEY=<your-stripe-secret-key>
STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>

# App
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

### 3. Database Migrations

Run migrations on the production database:

```bash
npm run db:push
```

## Deployment Options

### Option A: Vercel (Recommended for Next.js)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
vercel deploy --prod
```

### Option B: Self-Hosted (AWS EC2, DigitalOcean, etc.)

1. Install Node.js and PostgreSQL on server
2. Clone repository
3. Install dependencies: `npm install`
4. Build: `npm run build`
5. Start: `npm start`
6. Use PM2 or systemd for process management
7. Set up Nginx as reverse proxy
8. Configure SSL with Let's Encrypt

### Option C: Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and push:

```bash
docker build -t rugby-planner .
docker push your-registry/rugby-planner
```

## Payment Integration (Stripe)

### 1. Create Stripe Account

- Sign up at stripe.com
- Get API keys from dashboard

### 2. Database Schema for Payments

Add to `lib/db/schema.ts`:

```typescript
export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }).unique(),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  plan: varchar('plan', { length: 50 }).notNull().default('free'),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  currentPeriodEnd: timestamp('current_period_end'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

### 3. Create Payment Endpoints

- `POST /api/billing/create-checkout` — Create Stripe checkout session
- `POST /api/billing/webhook` — Handle Stripe webhooks
- `GET /api/billing/subscription` — Get user subscription status

### 4. Protect Features by Subscription

```typescript
async function checkSubscription(userId: number) {
  const sub = await db.select().from(subscriptions)
    .where(eq(subscriptions.userId, userId));
  return sub[0]?.plan === 'pro' || sub[0]?.plan === 'premium';
}
```

## Security Checklist

- [ ] Environment variables are never committed
- [ ] JWT_SECRET is a strong random string (32+ characters)
- [ ] HTTPS/SSL is enabled on all endpoints
- [ ] Database credentials are not in code
- [ ] API keys are rotated regularly
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (using Drizzle ORM)
- [ ] CSRF protection enabled
- [ ] Passwords are hashed with bcryptjs
- [ ] Sensitive data is not logged

## Monitoring & Maintenance

### Logs

- Check application logs: `pm2 logs` or Docker logs
- Monitor database query performance
- Set up error tracking (Sentry, LogRocket)

### Backups

- Daily database backups
- Automated backup to S3 or cloud storage
- Test restore procedures monthly

### Performance

- Monitor API response times
- Set up CDN for static assets
- Enable database query caching
- Use connection pooling for database

### Updates

- Keep Node.js updated
- Update npm dependencies monthly
- Monitor security advisories
- Test updates in staging first

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### Build Failures

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Authentication Issues

- Check JWT_SECRET is consistent across deployments
- Verify cookies are being set (check browser DevTools)
- Ensure HTTPS is enabled in production

### Payment Issues

- Verify Stripe API keys are correct
- Check webhook endpoint is publicly accessible
- Review Stripe dashboard for failed events

## Support

For issues or questions:
1. Check the main README.md
2. Review error logs
3. Check Stripe/OpenAI documentation
4. Open an issue on GitHub
