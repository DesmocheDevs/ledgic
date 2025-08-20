# Prisma migrations in production

- Vercel caches node_modules; ensure Prisma Client is generated at build time.
- Scripts used:
  - `postinstall`: runs `prisma generate` locally and in CI
  - `vercel-build`: runs `prisma generate && prisma migrate deploy && next build`

For Render/managed Postgres, do not run `migrate dev` in production. Use `prisma migrate deploy`.
