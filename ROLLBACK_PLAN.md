# Rollback Plan

## Trigger conditions
Roll back when a production deploy causes any of:
- **UptimeRobot alert** — the monitor polling `GET /api/health` reports the backend down or returns a non-200 status; alert arrives via UptimeRobot's configured notification channel
- 5xx error rate spike visible in Vercel's Logs tab
- Broken auth/checkout flow reported or observed in smoke test
- A failing CI run that was force-merged despite branch protection

## Backend (Vercel)
1. Go to https://vercel.com/ahmed-70a6/aterra-backend/deployments
2. Find the last known-good deployment (before the bad one)
3. Click the "..." menu → "Promote to Production"
4. Confirm — this instantly repoints the production alias, no rebuild needed

## Frontend (Vercel)
Same steps at https://vercel.com/ahmed-70a6/aterra-frontend/deployments

## Database (Supabase / Prisma)
1. If the bad deploy included a migration: `cd backend && npx prisma migrate resolve --rolled-back <migration_name>`
2. Restore from Supabase's automatic backups if data was corrupted: Project Settings → Database → Backups
3. Never roll back a migration that's already been followed by newer ones without checking downstream schema dependencies first

## GitHub Actions
1. Revert the bad commit: `git revert <commit_sha>`
2. Push to `main` — this re-triggers the pipeline and redeploys the reverted (working) code

## Post-rollback
- Confirm health via smoke test on both frontend and backend URLs
- Open an issue documenting root cause before re-attempting the fix

## Where logs are read in production
Request and error logs are viewed in the **Vercel dashboard → project → Logs tab** (structured JSON via winston, stdout captured automatically by Vercel's runtime logging).
