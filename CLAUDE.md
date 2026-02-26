# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm dev                    # Start dev server at http://localhost:3000
pnpm build                  # Production build (Next.js + generates sitemap)
pnpm start                  # Serve production build

# Testing
pnpm test:int               # Integration tests (Vitest, tests/int/**/*.int.spec.ts)
pnpm test:e2e               # E2E tests (Playwright, tests/e2e/)
pnpm test                   # Run both int and e2e tests

# Linting
pnpm lint                   # ESLint
pnpm lint:fix               # ESLint with auto-fix

# Payload CLI
pnpm payload migrate:create # Create a new DB migration
pnpm payload migrate        # Run pending migrations
pnpm generate:types         # Regenerate payload-types.ts from schema
pnpm generate:importmap     # Regenerate Payload's admin import map
```

## Architecture

This is a **Payload CMS v3 + Next.js 15** monorepo where both the CMS backend and the public-facing website run in the same process. The app is served under the `/cms` basePath (configured in `next.config.js`).

### Request routing (Next.js App Router)

| Route group | Purpose |
|---|---|
| `src/app/(frontend)/` | Public website pages |
| `src/app/(payload)/` | Payload admin panel at `/cms/admin` |
| `src/app/(sitemaps)/` | Sitemap routes |

Pages are statically generated via `generateStaticParams`. Draft/preview mode uses Next.js `draftMode()` to serve unpublished content.

### Payload configuration

`src/payload.config.ts` is the single source of truth for the CMS. It wires together:
- **DB**: PostgreSQL via `@payloadcms/db-postgres` (`DATABASE_URI` env var)
- **Collections**: `Pages`, `Posts`, `Media`, `Categories`, `Users`
- **Globals**: `Header`, `Footer`
- **Plugins**: redirects, nested-docs (categories), SEO, form-builder, search, payload-cloud

After modifying the Payload schema, run `pnpm generate:types` to update `src/payload-types.ts`, which is the generated TypeScript interface file for all collections/globals.

### Layout builder

Pages and Posts use a block-based layout system. Blocks live in `src/blocks/` (each block has a `config.ts` for the Payload field definition and a React component for rendering). `src/blocks/RenderBlocks.tsx` maps block slugs to components. Hero variants are in `src/heros/`.

### Data revalidation

Collections use `afterChange`/`afterDelete` hooks (e.g., `src/collections/Pages/hooks/revalidatePage.ts`) to call Next.js on-demand revalidation so static pages update without a full rebuild.

### Database (PostgreSQL)

- Local dev uses `push: true` (schema auto-syncs without migrations).
- For production, create migrations (`pnpm payload migrate:create`) and run them before starting the server (`pnpm payload migrate`).
- Docker Compose provides a local Postgres instance: `docker-compose up` (postgres on port 5432, user `postgres`, password `admin`, db `cms`).

### Environment variables

Copy `.env.example` to `.env`. Key vars:
- `DATABASE_URI` — Postgres connection string
- `PAYLOAD_SECRET` — Payload encryption secret
- `CRON_SECRET` — Bearer token for scheduled job endpoint

### CI/CD

GitHub Actions (`.github/workflows/workflow.yml`) on push to `main`:
1. Builds with `npm run build -- --experimental-build-mode compile`
2. rsyncs to the VPS
3. SSHs in, runs `npm run build -- --experimental-build-mode generate`, restarts `lukachyna-cms.service` (systemd/pm2)