# Rollback Plan

## Trigger conditions
Roll back when a production deploy causes: 5xx error rate spike, failed health checks, broken auth/checkout flow, or a failing CI run that was force-merged.

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
