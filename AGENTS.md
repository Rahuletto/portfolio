# AGENTS.md — Manic Framework Guide

> **Manic** (`manicjs`) is a file-based, client-side React SPA framework built exclusively on **Bun**. It uses **Elysia** as the HTTP server, supports **Tailwind CSS v4** natively, and has **no SSR** — all rendering happens in the browser.

## Project Structure

```
portfolio/
├── ~manic.ts                      # Server entry point (REQUIRED, DO NOT RENAME)
├── manic.config.ts                # Framework configuration (REQUIRED)
├── bunfig.toml                    # Bun config (enables Tailwind plugin)
├── tsconfig.json                  # Uses @/* alias → app/*
├── assets/                        # Static files served at /assets/*
└── app/
    ├── index.html                 # HTML shell (REQUIRED, serves for ALL routes)
    ├── main.tsx                   # React entry point (REQUIRED)
    ├── global.css                 # Global styles (Tailwind v4 @import "tailwindcss")
    ├── manic.d.ts                 # Type augmentation for __MANIC_ROUTES__
    ├── ~routes.generated.ts       # AUTO-GENERATED route manifest — NEVER EDIT
    ├── App.tsx                    # Optional app wrapper component
    ├── routes/                    # Page files — each .tsx = one URL route
    ├── api/                       # Server-side Elysia API routes
    └── components/                # Shared React components (any structure)
```

## The `~` (Tilde) Prefix Convention

The tilde prefix is the central naming convention:

| File                       | Meaning                                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `~manic.ts`                | Server entry point — runs on Bun, calls `createManicServer()`                                                |
| `app/~routes.generated.ts` | Auto-generated route manifest — regenerated on dev start and route file changes                              |
| `app/routes/~anything.tsx` | **Excluded from routing** — use for helpers, shared layout components, or utilities inside the routes folder |

**CRITICAL:** Never manually edit `~routes.generated.ts`. It is regenerated automatically.

## How to Create Pages

### File-Based Routing

Every `.tsx` file inside `app/routes/` (that doesn't start with `~`) becomes a route:

```
app/routes/index.tsx         →  /
app/routes/about.tsx         →  /about
app/routes/blog/index.tsx    →  /blog
app/routes/blog/[slug].tsx   →  /blog/:slug  (dynamic parameter)
```

### Page Requirements

A page **must export a default React component**:

```tsx
// app/routes/about.tsx → /about
import { Link } from 'manicjs';
import { useTheme } from 'manicjs/theme';

export default function About() {
  const { isDark } = useTheme();

  return (
    <main>
      <h1>About</h1>
      <Link to="/">Home</Link>
    </main>
  );
}
```

### Dynamic Routes

Use `[param]` in the filename for dynamic segments:

```tsx
// app/routes/blog/[slug].tsx → /blog/:slug
import { useRouter } from 'manicjs';

export default function BlogPost() {
  const { params } = useRouter();
  return <h1>Post: {params.slug}</h1>;
}
```

### Key Rules for Pages

- **Must have a default export** — the router uses `module.default` from dynamic imports
- **No server-side data fetching** — no `getServerSideProps`, `loader`, etc. All data fetching is client-side (fetch, SWR, React Query calling `/api/*` endpoints)
- **CSR only** — Manic is purely client-side rendered; no SSR, no RSC
- Use `@/*` import alias which maps to `app/*`

## Package Exports & Import Paths

All framework functionality lives under `manicjs` and its sub-paths. **Always use these — never recreate this functionality.**

| Import path           | What it provides                                                                     |
| --------------------- | ------------------------------------------------------------------------------------ |
| `manicjs`             | Root barrel — re-exports Router, Link, NotFound, useRouter, useQueryParams, navigate |
| `manicjs/router`      | Full router API (components, hooks, functions, context)                              |
| `manicjs/config`      | Config helpers and types                                                             |
| `manicjs/theme`       | Theme system (provider, hook, toggle component)                                      |
| `manicjs/transitions` | View Transitions API wrappers                                                        |
| `manicjs/env`         | Client-safe environment variable access                                              |
| `manicjs/server`      | Server bootstrap (`createManicServer`)                                               |
| `manicjs/plugins`     | Server plugins (API loader, static file serving)                                     |

---

### `manicjs` (root) & `manicjs/router`

#### Components

**`<Router>`** — Top-level SPA router. Reads `window.__MANIC_ROUTES__`, matches current URL, lazy-loads the page component, renders `<NotFound>` for unmatched paths.

```tsx
import { Router } from 'manicjs';
// Props (all optional):
//   routes?: Record<string, () => Promise<{ default: ComponentType }>>
//   — defaults to window.__MANIC_ROUTES__
```

**`<Link>`** — Client-side navigation link. Renders as `<a>`, prevents full-page reload, prefetches route chunk on hover/focus.

```tsx
import { Link } from "manicjs";

<Link
  to="/about"              // Target path (required)
  prefetch={true}          // Preload chunk on hover/focus (default: true)
  viewTransitionName="x"   // Sets CSS view-transition-name on the <a>
  className="..."
  style={{ ... }}
>
  About
</Link>
```

**`<NotFound>`** — Built-in 404 page with animated dot-canvas background. Used automatically by `<Router>` when no route matches.

```tsx
import { NotFound } from 'manicjs';
```

#### Hooks

**`useRouter()`** — Access current route context. Throws if called outside `<Router>`.

```tsx
import { useRouter } from 'manicjs';

const { path, navigate, params } = useRouter();
// path:     string — current pathname
// navigate: (to: string) => void — programmatic navigation
// params:   Record<string, string> — dynamic segment values (e.g. { slug: "hello" })
```

**`useQueryParams()`** — Access URL search params. Re-renders on popstate.

```tsx
import { useQueryParams } from 'manicjs';

const params = useQueryParams(); // Returns URLSearchParams
const q = params.get('q');
```

#### Functions

**`navigate(to)`** — Programmatic navigation. Works outside React components. Loads target component before pushing history. Uses View Transitions if enabled.

```tsx
import { navigate } from 'manicjs';
await navigate('/dashboard');
```

**`preloadRoute(path)`** — Eagerly load a route's component into cache. Used internally by `<Link>` on hover, but can be called manually.

```tsx
import { preloadRoute } from 'manicjs/router';
preloadRoute('/about'); // Starts loading the chunk immediately
```

**`setViewTransitions(enabled)`** — Globally enable/disable View Transitions API for all `navigate()` calls.

```tsx
import { setViewTransitions } from 'manicjs/router';
setViewTransitions(false); // Disable view transitions
```

#### Context

**`RouterContext`** — Raw React context. Use `useRouter()` instead unless you need to mock in tests.

```tsx
import { RouterContext } from 'manicjs/router';
// type: React.Context<RouterContextValue | null>
```

#### Types

```tsx
import type { RouteDef, RouterContextValue } from 'manicjs/router';

interface RouteDef {
  path: string;
  component: ComponentType | null;
  loader?: () => Promise<{ default: ComponentType }>;
}

interface RouterContextValue {
  path: string;
  navigate: (to: string) => void;
  params: Record<string, string>;
}
```

---

### `manicjs/theme`

#### Components

**`<ThemeProvider>`** — Wrap your app to enable theme management. Reads initial theme from `localStorage`, applies `dark` class on `<html>`, subscribes to `prefers-color-scheme` for system mode.

```tsx
import { ThemeProvider } from 'manicjs/theme';

<ThemeProvider>
  <Router />
</ThemeProvider>;
```

**`<ThemeToggle>`** — A button that toggles dark/light. Supports render-prop children.

```tsx
import { ThemeToggle } from "manicjs/theme";

// Default (emoji icons):
<ThemeToggle />

// Custom icons via render prop:
<ThemeToggle className="...">
  {(resolvedTheme) => resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
</ThemeToggle>
```

#### Hook

**`useTheme()`** — Full theme state and controls. Throws if called outside `<ThemeProvider>`.

```tsx
import { useTheme } from 'manicjs/theme';

const {
  theme, // "light" | "dark" | "system" — stored preference
  resolvedTheme, // "light" | "dark" — actual applied theme (never "system")
  setTheme, // (theme: "light" | "dark" | "system") => void
  toggle, // () => void — toggles between light and dark
  isDark, // boolean — shorthand for resolvedTheme === "dark"
  isLight, // boolean — shorthand for resolvedTheme === "light"
} = useTheme();
```

Theme persists to `localStorage` under key `"manic-theme"`. Works with Tailwind's `dark:` variant.

---

### `manicjs/transitions`

**`ViewTransitions`** — Object with pre-built components for common HTML elements that set `view-transition-name` via a `name` prop.

```tsx
import { ViewTransitions } from "manicjs/transitions";

<ViewTransitions.div name="hero-card" className="card">...</ViewTransitions.div>
<ViewTransitions.h1 name="page-title">Hello</ViewTransitions.h1>
<ViewTransitions.img name="avatar" src="..." />
```

All components accept: `name` (required), `children`, `className`, `style` (merged with `{ viewTransitionName: name }`), plus standard HTML attributes.

Available tags: `div`, `span`, `main`, `section`, `article`, `header`, `footer`, `nav`, `aside`, `h1`, `h2`, `h3`, `p`, `img`, `button`, `a`, `ul`, `li`

Alternatively, set view transitions inline (as done in this project):

```tsx
<div style={{ viewTransitionName: 'content' }}>...</div>
```

Also re-exports `navigate` and `setViewTransitions` from `manicjs/router`.

---

### `manicjs/env`

Client-safe environment variable access. Only `MANIC_PUBLIC_*` vars are accessible in the browser.

**`getEnv(key)`** — Read a single env var.

```tsx
import { getEnv } from 'manicjs/env';

// Client: only MANIC_PUBLIC_* keys work (others log a warning, return undefined)
// Server: any key works via process.env
const apiUrl = getEnv('MANIC_PUBLIC_API_URL');
```

**`getPublicEnv()`** — Get all public env vars as an object.

```tsx
import { getPublicEnv } from 'manicjs/env';

const env = getPublicEnv(); // { MANIC_PUBLIC_API_URL: "...", ... }
```

Server reads `.env` then `.env.local` (local takes precedence).

---

### `manicjs/server`

**`createManicServer(options)`** — Bootstraps the full Manic server. Called from `~manic.ts`.

```tsx
import { createManicServer } from 'manicjs/server';
import app from './app/index.html';

await createManicServer({ html: app });

// Options:
//   html: string | (() => Response | Promise<Response>) — the HTML shell (required)
//   port?: number — overrides config (overridden by $PORT env var)
```

Internally: loads env files → generates route manifest → loads config → mounts API routes → mounts Swagger → serves static assets → registers page routes → starts `Bun.serve()` → watches for route changes in dev.

---

### `manicjs/plugins`

**`apiLoaderPlugin(apiDir?)`** — Scans `app/api/` for Elysia modules and mounts them.

```tsx
import { apiLoaderPlugin } from 'manicjs/plugins';

const { app, routes } = await apiLoaderPlugin('app/api');
// app: Elysia instance with all API routes mounted
// routes: string[] — list of mounted route paths
```

**`fileImporterPlugin(publicDir?)`** — Serves static files via `@elysiajs/static`.

```tsx
import { fileImporterPlugin } from 'manicjs/plugins';

const staticApp = fileImporterPlugin('public');
```

---

### `manicjs/config`

**`defineConfig(config)`** — Type-safe config helper (identity function for autocomplete).

```tsx
import { defineConfig } from 'manicjs/config';

export default defineConfig({
  app: { name: 'my-app' },
  server: { port: 3000, hmr: true },
  router: {
    viewTransitions: true,
    preserveScroll: false,
    scrollBehavior: 'auto',
  },
  build: {
    minify: true,
    sourcemap: 'inline',
    splitting: true,
    outdir: '.manic',
  },
  swagger: false,
  providers: [],
});
```

**`loadConfig(cwd?)`** — Reads and merges `manic.config.ts` with defaults. Cached after first call.

```tsx
import { loadConfig } from 'manicjs/config';
const config = await loadConfig();
```

#### Types

```tsx
import type {
  ManicConfig,
  SwaggerConfig,
  ManicProvider,
  BuildContext,
} from 'manicjs/config';

interface ManicConfig {
  app?: { name?: string };
  server?: { port?: number; hmr?: boolean };
  router?: {
    viewTransitions?: boolean;
    preserveScroll?: boolean;
    scrollBehavior?: 'auto' | 'smooth';
  };
  build?: {
    minify?: boolean;
    sourcemap?: boolean | 'inline' | 'external';
    splitting?: boolean;
    outdir?: string;
  };
  swagger?: SwaggerConfig | false;
  providers?: ManicProvider[];
}

interface SwaggerConfig {
  path?: string;
  documentation?: {
    info?: { title?: string; description?: string; version?: string };
  };
}

interface ManicProvider {
  name: string;
  build(context: BuildContext): Promise<void>;
}

interface BuildContext {
  dist: string;
  config: ManicConfig;
  apiEntries: string[];
  clientDir: string;
  serverFile: string;
}
```

## API Routes

API routes live in `app/api/` and must use **folder + index.ts** structure. Each exports a default **Elysia** instance:

```typescript
// app/api/hello/index.ts → /api/hello
import { Elysia, t } from 'elysia';

export default new Elysia()
  .get('/', () => ({ message: 'Hello!' }))
  .post('/', ({ body }) => ({ echo: body.text }), {
    body: t.Object({ text: t.String() }),
  });
```

**Important:** Never create `app/api/index.ts` at root — always use `app/api/[name]/index.ts`.

## Configuration Reference

```typescript
// manic.config.ts
import { defineConfig } from 'manicjs/config';

export default defineConfig({
  app: {
    name: 'portfolio', // App name for logs/title
  },
  server: {
    port: 6070, // Default: 6070. Override with $PORT env var
    hmr: true, // Default: true
  },
  router: {
    viewTransitions: true, // Default: true. Enables View Transitions API
    preserveScroll: false, // Default: false
    scrollBehavior: 'auto', // "auto" | "smooth"
  },
  build: {
    minify: true,
    sourcemap: 'inline', // true | false | "inline" | "external"
    splitting: true, // Code-splitting per route
    outdir: '.manic',
  },
  swagger: false, // Set to { path: "/docs", documentation: {...} } to enable
});
```

## CLI Commands

| Command                         | Description                                   |
| ------------------------------- | --------------------------------------------- |
| `bun run dev` / `manic dev`     | Dev server with HMR (`bun --watch ~manic.ts`) |
| `manic dev --port 3000`         | Override dev port                             |
| `manic dev --network`           | Bind to 0.0.0.0, print LAN IP                 |
| `bun run build` / `manic build` | Production build → `.manic/` directory        |
| `bun run start` / `manic start` | Run production server (`.manic/server.js`)    |

## Build Output

```
.manic/
├── client/
│   ├── index.html           # Transformed HTML shell
│   ├── main-[hash].js       # Entry chunk
│   ├── [hash].css            # Tailwind output
│   └── chunks/              # One chunk per route (code-splitting)
├── api/                     # Bundled API routes
└── server.js                # Production server entry
```

## Styling Conventions (This Project)

- Tailwind CSS v4 with `@import "tailwindcss"` in `global.css`
- Custom theme using CSS variables (`--theme-*`) in `:root`
- Tailwind `@theme` block maps semantic colors (`--color-background`, `--color-foreground`, rainbow colors)
- Dark/light theme handled via `useTheme()` — currently switches assets rather than CSS variables
- Custom utility classes in `global.css`: `.btn-primary`, `.btn-outline`, `.border-box`, `.sidebar-item`
- View transition animations defined with `@view-transition` and `::view-transition-*` pseudo-elements

## Key Architectural Notes

1. **Pure CSR** — The server's only job is: serve the HTML shell for all page URLs, serve JS/CSS chunks, and handle `/api/*` routes
2. **No hydration** — React uses `createRoot()` (not `hydrateRoot`), mounting fresh into `#root`
3. **Route manifest** — `window.__MANIC_ROUTES__` is set in `main.tsx` from the auto-generated file; the `<Router>` reads it
4. **Lazy loading** — Each route is a dynamic `import()` in the manifest, enabling code-splitting
5. **Component caching** — Once a route's component loads, it's cached in memory; revisiting is instant
6. **Prefetching** — `<Link>` preloads route chunks on hover/focus by default
7. **Server entry** — `~manic.ts` imports the HTML via Bun's HTML import syntax (`import app from "./app/index.html"`)
8. **Favicon** — Auto-discovered from `assets/` in order: `favicon.svg` → `.png` → `.ico` → `icon.svg` → `.png` → `.ico`
