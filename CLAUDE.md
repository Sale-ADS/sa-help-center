# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Dev server at http://localhost:3000
pnpm build        # Production build
pnpm start        # Run production server
pnpm types:check  # Type validation (runs fumadocs-mdx + next typegen + tsc --noEmit)
```

`types:check` is the only type/lint command — there is no separate lint or test script.

After installing dependencies, `fumadocs-mdx` runs automatically via the `postinstall` hook to regenerate `.source/`. If types are broken after adding/removing MDX files, run `pnpm types:check` to regenerate.

## Architecture

**Stack:** Next.js 16 (App Router) + Fumadocs 16 + Tailwind CSS 4 + TypeScript. Dark-mode only (`className: "dark"`). No theme switch.

**Locale routing:** All pages live under `/[locale]/` — supported locales are `es` (default) and `en`. The dynamic catch-all route `app/[locale]/docs/[[...slug]]/page.tsx` renders every doc page. `lib/source.ts` exposes `getSource(locale)` which returns the correct Fumadocs loader (`sourceEs` or `sourceEn`).

**Content collections:** Defined in `source.config.ts`. Two collections:
- `docsEs` → `content/docs/es/`
- `docsEn` → `content/docs/en/`

Fumadocs generates `.source/` at build time (and via `fumadocs-mdx` CLI). **Never edit `.source/` manually.**

**Navigation structure:** Controlled by `meta.json` files inside each locale's content directories. A page must appear in a `meta.json` `pages` array to show in the sidebar. Pages missing from `meta.json` will not appear in navigation even if the MDX file exists.

**Redirects:** Defined in `next.config.mjs` `redirects()`. Permanent redirects here will override any MDX page at the same path — this has caused bugs before (a page at `ubicacion-audiencia` was blocked by a hardcoded redirect). Always check `next.config.mjs` when a route misbehaves.

**Adding a new doc page:**
1. Create the MDX file in both `content/docs/es/` and `content/docs/en/` (mirrored paths)
2. Add the page slug to the correct `meta.json` `pages` array for each locale
3. Ensure no conflicting redirect exists in `next.config.mjs`

**AI Assistant:** Implemented in `components/ai-assistant/`. Calls `app/api/chat/route.ts` which uses `GEMINI_API_KEY` (required in `.env`). The model defaults to `gemini-2.0-flash-lite` unless `GEMINI_MODEL` is set.

**Path aliases:**
- `@/*` → project root
- `collections/*` → `.source/*` (auto-generated)

**API routes:** `app/api/` has `chat/`, `feedback/`, and `search/` endpoints. Rate limiting is in `lib/rate-limit.ts`.

## Content Conventions

- MDX frontmatter requires at minimum `title` and `description`
- Icons for sidebar items are mapped in `lib/source.ts` using Lucide icons or custom SVGs (Meta, Google, TikTok)
- `content/docs/es/configurar-negocio/_backup/` holds archived pages — files here are not indexed

## CI/CD

GitHub Actions workflows (deploy to Cloud Run + PR checks) currently only exist on the `migration/cloud-run-prep` branch and have not been merged to `main`. Pushing to `main` does **not** trigger an automatic deploy until those workflow files are merged.
