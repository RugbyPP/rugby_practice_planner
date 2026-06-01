# Vercel Deployment Guide for Rugby Practice Planner

## Quick Start (5 minutes)

### Step 1: Push to GitHub

```bash
cd ~/rugby-planner-web
git remote add origin https://github.com/rugbypp/rugby-planner-web.git
git branch -M main
git push -u origin main
```

### Step 2: Create Vercel Project

1. Go to https://vercel.com/new
2. Click "Continue with GitHub"
3. Authorize Vercel to access your GitHub account
4. Select the `rugby-planner-web` repository
5. Click "Import"

### Step 3: Configure Environment Variables

In the Vercel import screen, add these environment variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | `postgresql://...` | See database setup below |
| `JWT_SECRET` | Generate with `openssl rand -base64 32` | Keep this secret |
| `OPENAI_API_KEY` | `sk-proj-...` | Your OpenAI API key |
| `NODE_ENV` | `production` | Set automatically |

### Step 4: Set Up PostgreSQL Database

**Option A: Vercel Postgres (Recommended)**
- In Vercel dashboard, go to **Storage** → **Create Database** → **Postgres**
- Name it `rugby-planner`
- Copy the `POSTGRES_URL_NON_POOLING` connection string
- Paste into `DATABASE_URL` environment variable
- Click "Deploy"

**Option B: External PostgreSQL Provider**
- Use Neon, Railway, Supabase, or AWS RDS
- Get your connection string
- Set as `DATABASE_URL` environment variable

### Step 5: Run Database Migrations

After deployment, run migrations:

```bash
npm run db:push
```

This creates all tables in your database.

## Full Environment Variables

```bash
# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/rugby_planner

# Authentication
JWT_SECRET=your-random-32-character-secret-key

# OpenAI
OPENAI_API_KEY=sk-proj-your-openai-api-key

# Node
NODE_ENV=production
```

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created and connected
- [ ] `DATABASE_URL` environment variable set
- [ ] `JWT_SECRET` environment variable set
- [ ] `OPENAI_API_KEY` environment variable set
- [ ] Database migrations run (`npm run db:push`)
- [ ] App deployed and accessible

## Your Live App

Once deployed, your app will be live at:
```
https://rugby-planner-web.vercel.app
```

Or with a custom domain:
```
https://your-custom-domain.com
```

## Making Updates

To deploy updates:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Vercel will automatically rebuild and redeploy.

## Monitoring & Logs

- **View Logs**: Vercel Dashboard → Deployments → Click deployment → Logs
- **Monitor Errors**: Vercel Dashboard → Monitoring
- **Check Database**: Your database provider's dashboard

## Troubleshooting

### "Build failed"
- Check Vercel build logs for errors
- Ensure all environment variables are set
- Run `npm run build` locally to test

### "Database connection error"
- Verify `DATABASE_URL` is correct
- Check database is accessible from Vercel
- For Vercel Postgres, ensure IP whitelist is configured

### "OpenAI API error"
- Verify API key is correct
- Check account has credits
- Ensure key has access to Claude 3.5 Sonnet model

### "Session generation times out"
- Increase function timeout in `vercel.json` (currently 60s)
- Check OpenAI API status
- Verify network connectivity

## Support

For issues:
1. Check Vercel deployment logs
2. Check database connection
3. Verify environment variables
4. Test locally: `npm run dev`

## Next Steps

After deployment:
1. Test signup and login
2. Create a test session
3. Verify AI generation works
4. Test all 10 adaptation buttons
5. Set up custom domain (optional)
6. Configure analytics (optional)
7. Add payment gateway (future)
