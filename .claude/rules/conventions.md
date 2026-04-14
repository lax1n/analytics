# Coding Conventions

## General

- This is a **library**, not an app — no path aliases (`@/`), no Vercel features, no app-specific code
- TypeScript strict mode, no `any` in public API (internal `as any` for Drizzle db is acceptable)
- All exports documented with JSDoc comments on public functions
- No test framework — verify with `npm run typecheck` and consumer build

## Build & Release Process

1. Make changes in `src/`
2. Run `npm run typecheck` — fix any errors
3. Run `npm run build` — produces `dist/`
4. Verify `"use client"` directives: `head -1 dist/components/tracker.js` should output `"use client";`
5. Commit both `src/` and `dist/` together
6. Tag releases: `git tag v0.X.0` — consumers pin to these

## Module System

- `"type": "module"` in package.json — all imports use `.js` extension
- Internal imports: `import { foo } from "./bar.js"` (not `./bar` or `./bar.ts`)
- Subpath exports defined in `package.json` `"exports"` — keep in sync when adding new modules

## Components

- All client components start with `"use client"` directive
- All components accept `className?: string` prop
- Use `data-analytics-*` attributes for styling hooks (not class names)
- Reference colors/spacing via CSS custom properties: `var(--analytics-primary)`
- Inline styles are fine for layout (flex, grid) — CSS variables for theming
- No external UI libraries (no shadcn, no Radix, no MUI) — native HTML elements only
- No icon libraries — use text characters (`●`, `✓`, `!`, `▶`, `▼`)

## Handlers

- Factory function pattern: `createXHandler()` returns `{ GET }` or `{ POST }`
- Get config via `getConfig()` — never import consumer modules
- Always rate limit (default: built-in, overridable via config)
- Always call `config.requireAdmin(request)` on admin endpoints
- Return 204 on tracking endpoints (never error to the client)
- Validate and slice all string inputs to prevent abuse

## Hooks

- All hooks are `"use client"` components
- Accept `basePath` parameter (default: `"/api/analytics"`)
- Return `{ data, loading, error }` pattern
- Internal fetching via `useAnalyticsFetch` shared hook

## Error Handling

- **Tracking endpoints:** catch everything, return 204, log to console. Tracking should NEVER break the app.
- **Admin endpoints:** return proper HTTP status codes (403, 429, 404, 500)
- **Client tracking (sendBeacon):** wrapped in try/catch with empty catch — this is intentional, not a bug
- **Server tracking (trackEventServer):** fire-and-forget with console.error on failure

## Compatibility

- Must work with Next.js 14+ (App Router)
- Must work with drizzle-orm 0.45+ (same version consumer uses)
- Must work with React 18+ (hooks, "use client")
- CSS must work without Tailwind (pure CSS custom properties)
- Components must render without JavaScript (SSR-safe, client hydration for interactivity)
