# Repository Guidelines

## Project Structure & Module Organization

This repository uses Next.js 16 and Payload CMS 3. Public routes live in `src/app/(frontend)/[locale]`; Payload Admin is under `src/app/(payload)`, and server actions and APIs are in `src/app/actions` and `src/app/api`. Keep reusable UI in `src/components`, CMS schemas in `src/collections` and `src/globals`, and shared localization, SEO, and security logic in `src/lib`. Database changes belong in `src/migrations`. Tests use `tests/*.test.ts`; scripts live in `scripts`; static assets live in `public`.

## Build, Test, and Development Commands

- `pnpm install` installs the locked dependency set.
- `pnpm dev` starts Next.js with Turbopack.
- `pnpm test` runs the Node test suite through `tsx`.
- `pnpm lint` runs the Next.js ESLint rules.
- `pnpm exec tsc --noEmit` performs strict type checking.
- `pnpm build` creates the deployable build.
- `pnpm qa` runs tests, lint, types, claim and production audits, and build.
- `SMOKE_BASE_URL=http://127.0.0.1:3014 pnpm smoke` checks a running build's routes and security headers.
- Run `pnpm generate:types` after Payload schema changes; do not hand-edit `src/payload-types.ts`.

## Coding Style & Naming Conventions

Use TypeScript, ESM imports, two-space indentation, single quotes, and semicolon-free style. Use `PascalCase` for React components and Payload configs, `camelCase` for functions and variables, and kebab-case for route segments. Prefer the `@/` alias over deep relative imports. Add `'use client'` only when browser state, effects, or events require it. Reuse existing helpers and UI primitives before introducing dependencies.

## Testing Guidelines

Tests use `node:test` and `node:assert/strict`. Name files `*.test.ts` and write behavior-focused test names. Add a regression test for changed parsing, routing, validation, access, or security behavior. No numeric coverage gate exists; cover meaningful changed branches. Run focused tests while iterating and `pnpm qa` before handoff.

## Commit & Pull Request Guidelines

History favors short imperative subjects, optionally prefixed by a ticket (`SMA-200:`) or a relevant type (`feat:`). Keep commits scoped. Pull requests should include a concise summary, affected routes/locales, verification commands, linked issue, screenshots for UI changes, and any Payload migration or configuration notes.

## Security, Content, and Agent Guidance

Never commit `.env`, credentials, generated uploads, or customer data. Treat `PAYLOAD_SECRET` and `DATABASE_URI` as required secrets. Inspect `git status` first and preserve unrelated work. This Payload repository is the implementation authority; the live WordPress site is not a baseline unless a task explicitly covers migration. Read `DESIGN.md` before UI work and `PRD-SmartCounter-Company-Profile-Revamp.md` before changing IA, claims, evidence, or EN/ID behavior.

## Film

Remotion films live in `videos/`. When making or editing a product film, load `smartcounter-film`.
