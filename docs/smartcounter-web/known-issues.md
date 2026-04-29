# Known Issues & Workarounds

## Payload 3.84 + Next.js 16.2 + Turbopack + pnpm

### 1. Nested `<html>` Tags (RESOLVED)

**Problem:** Payload's `RootLayout` component renders its own `<html data-theme="dark" dir="LTR">/<body>`. If a shared root `layout.tsx` also renders `<html>/<body>`, the browser gets nested `<html>` tags — causing hydration errors, duplicate element mounting, and CSS being ignored.

**Symptoms:**
- Console: "You are mounting a new html component when a previous one has not first unmounted"
- Console: "Hydration failed because the server rendered text didn't match the client"
- Admin renders unstyled (white background)

**Fix:** Delete root `layout.tsx`. Create separate route-group root layouts:
- `(frontend)/layout.tsx` — renders `<html>/<body>` with fonts + SEO metadata
- `(payload)/layout.tsx` — Payload's `RootLayout` renders its own `<html>/<body>`

This is the Next.js "multiple root layouts" pattern.

### 2. Payload CSS Not Bundled (RESOLVED)

**Problem:** Payload's SCSS import (`import '@payloadcms/ui/scss/app.scss'`) is **stripped from compiled JS** during the Payload package build process. Present in `.d.ts` declaration files but absent from `.js` runtime files. Turbopack never receives the CSS import, so 253KB of admin styles never load.

**Symptoms:**
- Only `@layer payload-default, payload;` appears as 32-byte inline `<style>` (first plain-CSS line of app.scss)
- No `--theme-*` variables defined
- Admin renders with correct DOM but no styling

**Fix:** Add `import '@payloadcms/next/css'` to `(payload)/layout.tsx`. This uses the `./css` package export which maps to `./dist/prod/styles.css` (pre-compiled, 253KB).

**Why not `@payloadcms/ui/css`?** pnpm doesn't hoist `@payloadcms/ui` (transitive dependency of `@payloadcms/next`). Importing from `@payloadcms/next` works because it's a direct dependency.

### 3. Custom CSS Not Loading via `admin.style` (RESOLVED)

**Problem:** `payload.config.ts` has `admin.style: path.resolve(dirname, 'admin/custom.css')`, but Payload's SCSS build system (which processes `admin.style`) is broken (see issue #2). The custom CSS file is never loaded.

**Fix:** Import directly in `(payload)/layout.tsx`:
```tsx
import '@payloadcms/next/css'
import '@/admin/custom.css'
```

### 4. Dashboard Grid Inline Style Override

**Problem:** Payload's default dashboard renders `.modular-dashboard` with inline `style="display:flex;flex-wrap:wrap"`. CSS rules in any layer cannot override inline styles without `!important`.

**Fix:**
```css
@layer payload {
  .modular-dashboard { display: none !important; }
}
```

### 5. Payload Localized Fields in Multipart Upload

**Problem:** Uploading to Media collection with localized `alt` field via multipart form fails with "This field is required" even when `-F "alt=value"` is provided.

**Fix:** Use the `_payload` form field for metadata:
```bash
curl -X POST /api/media?locale=en \
  -F "file=@image.png" \
  -F '_payload={"alt":"Image description"}'
```

### 6. API Route Catch-All Parameter Name

**Problem:** Payload 3.84 expects the catch-all route parameter to be named `slug`, not `payload`. Using `[...payload]` causes all API routes to return 500 with `.map()` error on undefined `params.slug`.

**Fix:** Rename `src/app/api/[...payload]/route.ts` → `src/app/api/[...slug]/route.ts`.

## Turbopack-Specific

### SCSS from node_modules

Turbopack partially processes SCSS files from `node_modules` but fails on `@import` directives that reference other SCSS files. The first plain-CSS line passes through, but SCSS-specific syntax is silently dropped. Use pre-compiled CSS imports instead.

### Leaflet + Tailwind CSS 4

Tailwind's CSS reset (`max-width: 100%`, `position: static`) breaks Leaflet tile positioning. Required overrides in `globals.css`:

```css
.leaflet-container img.leaflet-tile { max-width: none !important; }
.leaflet-tile-pane { position: absolute !important; }
```

Also call `map.invalidateSize()` after 100ms timeout to fix partial tile rendering when container isn't fully sized at mount time.

### Leaflet SSR

Leaflet requires `window` (browser-only). Fix: dynamic `import('leaflet')` inside `useEffect`.

## pnpm-Specific

### Transitive Dependency Resolution

pnpm's strict `node_modules` structure means packages not in your direct `dependencies` cannot be imported. `@payloadcms/ui` is a transitive dependency (installed by `@payloadcms/next`) and is NOT accessible from project code.

**Workarounds:**
- Import from direct dependencies instead (e.g., `@payloadcms/next/css` instead of `@payloadcms/ui/css`)
- Or add as direct dependency: `pnpm add @payloadcms/ui`
- Or configure `.npmrc` with `public-hoist-pattern[]=@payloadcms/*`
