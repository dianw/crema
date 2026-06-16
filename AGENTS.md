# Project Guidelines

> **Crema** — Graphical Crypto Toolkit. A client-only Nuxt 4 SPA for cryptographic operations.
> Live at [crema.enkrip.org](https://crema.enkrip.org).

## Tech Stack

| Concern | Choice |
|---------|--------|
| Framework | Nuxt 4.0.1 + Vue 3.5 (Composition API only) |
| Language | TypeScript 5.8, strict mode |
| State | Pinia 3 (setup stores) |
| Styling | Tailwind CSS 6 + SCSS |
| Auth | Firebase 12 (Google OAuth, client-only) |
| Crypto | `node-forge` — **all crypto operations must use this** |
| Build | Vite (bundled), static generation (`nuxt generate`) |
| Lint | ESLint 9 + `@nuxt/eslint` |

## Architecture

```
pages/          → File-based routes, nested by feature category
components/     → Auto-imported Vue components (PascalCase filenames)
stores/         → Pinia setup stores, one per feature
composables/    → Reusable Composition API utilities (useCrypto, etc.)
plugins/        → Client-only Firebase init, route handlers
middleware/     → Route guards (auth.ts)
types/          → All shared TypeScript interfaces
utils/          → Constants, algorithm lists, crypto parameters
layouts/        → default.vue with Header, Sidebar, Footer
```

### Critical Constraints

- **`ssr: false`** in `nuxt.config.ts` — this is a pure client-side SPA
- **Hash-mode routing** (`hashMode: true`) — required for GitHub Pages hosting
- **Static output** only — `npm run generate` produces `.output/public/`
- **No server/Nitro code** — all logic runs in the browser
- **All crypto via `node-forge`** — never introduce crypto libraries without explicit approval
- **Firebase is client-only** (`firebase.client.ts`) — no server-side auth

## Conventions

### Naming

| What | Pattern | Example |
|------|---------|---------|
| Components | `PascalCase.vue` | `Header.vue`, `KeyPairTab.vue` |
| Pages | `kebab-case.vue` | `rsa-keygen.vue`, `cert-signing-req.vue` |
| Stores (file) | `kebab-case.ts` | `hash.ts`, `rsagen.ts` |
| Stores (function) | `camelCase`, `use` prefix + `Store` suffix | `useHashStore()`, `useAesStore()` |
| Composables | `camelCase`, `use` prefix | `useCrypto()` |
| Types | `PascalCase` interfaces | `User`, `HashResult`, `KeyPairData` |
| Constants | `SCREAMING_SNAKE_CASE` | `SUPPORTED_ALGORITHMS` |

### Stores (Pinia)

```typescript
// Pattern: setup store with readonly state
export const useFeatureStore = defineStore('feature', () => {
  const state = ref<Type>(default)
  const computed = computed(() => derived)
  const action = async (params) => { /* try/catch wrapping */ }

  return {
    state: readonly(state),   // expose as readonly
    computed,                  // computed is already readonly
    action                     // public methods
  }
})
```

- One store per feature / page
- Expose state via `readonly()` to prevent direct mutations
- Wrap async crypto operations in `try/catch`
- Import types from `~/types`

### Components & Pages

- **Auto-imports**: Components, composables, and stores are auto-available — no manual imports
- **Composition API**: `<script setup lang="ts">` with `ref`, `computed`, `watch`
- **Styling**: Tailwind utility classes only; global overrides in `assets/css/style.scss`
- **No Options API** — no `data()`, `methods: {}`, etc.

### TypeScript

- All new code in TypeScript with strict mode
- New shared types go in `types/index.ts`
- `no-explicit-any` is a **warning** (not error) — prefer typed interfaces
- Unused vars pattern: prefix with `_` to suppress warnings

## Build & Run

```bash
npm run dev          # Dev server with HMR
npm run build        # Production build
npm run generate     # Static site generation → .output/public/
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix lint issues
npm run typecheck    # Run TypeScript type checking
npm run clean        # Clean build artifacts
```

## Key Files

| File | Purpose |
|------|---------|
| `nuxt.config.ts` | App config: modules, plugins, routing, CSS, SSR settings |
| `types/index.ts` | All shared TypeScript interfaces |
| `utils/constants.ts` | Crypto algorithm lists, app parameters |
| `layouts/default.vue` | Master layout (Header + Sidebar + `<slot />` + Footer) |
| `plugins/firebase.client.ts` | Firebase initialization and auth provider |
| `middleware/auth.ts` | Route protection (currently extensible) |
| `eslint.config.js` | Linting rules |

## Deployment

See `DEPLOYMENT.md` for full details. Quick summary:
- CI/CD via `.github/workflows/ci-cd.yml` on push to `main`
- Builds → generates static site → pushes Docker image to `dianw/crema:latest` → deploys to GitHub Pages
