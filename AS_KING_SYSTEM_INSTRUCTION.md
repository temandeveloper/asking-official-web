# AsKing Cross-Repository System Instruction

You are working on the AsKing product across two repositories:

- `/Users/yamato/Project/as-king-ai` — the primary desktop product.
- `/Users/yamato/Project/as-king-official-web` — the official public website and account/operator portal.

Treat this document as the first architectural reference. Read only the files relevant to the requested change after using the routing rules below. Do not scan both repositories indiscriminately.

## 1. Product Model and Ownership

### Desktop product: `as-king-ai`

The Electron desktop app is the operational workspace. It owns:

- WhatsApp connectivity through Baileys.
- Telegram connectivity through Teleproto/MTProto.
- Local conversations, messages, contacts, templates, tickets, schedules, and AI history.
- CRM workflows, human-support mode, customer-agent workflows, and local backup/restore.
- The desktop renderer experience and the main/preload/renderer security boundary.
- Local subscription state and access gating, backed by the shared cloud subscription row.

The desktop application is primarily local-first. Do not assume that Dexie records are synchronized to the website or to another device.

### Official website: `as-king-official-web`

The Next.js website owns:

- Marketing and public product pages.
- User signup, login, email verification, password recovery, and profile management.
- The browser-to-desktop authentication bridge.
- Subscription display, payment instructions, support entry points, and plan configuration.
- Restricted operator login and payment administration.
- Website-specific collaboration or future integrations when a real source route exists.

### Shared cloud boundary

Both applications use the same Supabase project and user identity system. The important shared contracts are:

- Supabase Auth users and JWT sessions.
- `public.tb_payment`, keyed by `uid`.
- `public.tb_operator`, used for operator whitelisting.
- The `gemini-chat` Supabase Edge Function.
- Supabase RLS and RPC functions, some of which are defined outside these repositories.

The repositories do not share source modules. A cross-repository contract must be changed in both consumers and in the database/Edge Function layer when applicable.

## 2. Repository Reading Order

### Desktop reading order

Start with the nearest owner of the behavior:

1. [`src/main/index.js`](as-king-ai/src/main/index.js) — Electron lifecycle, window creation, custom protocol registration, deep-link handling, single-instance behavior, and startup reconnects.
2. [`src/main/ipc/handlers.js`](as-king-ai/src/main/ipc/handlers.js) — main-process IPC handlers for messaging, AI, backup, and native operations.
3. `src/preload/` — the allowlisted renderer-to-main API exposed through `contextBridge`.
4. `src/main/services/baileys.service.js` — WhatsApp connection, persistence, send, presence, and message events.
5. `src/main/services/telegram.service.js` — Telegram session, pairing, connection, send, read, and presence behavior.
6. [`src/main/services/gemini.service.js`](as-king-ai/src/main/services/gemini.service.js) — Gemini routing, Supabase SSE parsing, retries, BYOK fallback, and tool continuation.
7. `src/renderer/src/App.jsx` — renderer composition and top-level initialization.
8. [`src/renderer/src/services/db.js`](as-king-ai/src/renderer/src/services/db.js) — Dexie schema versions, migrations, and local persistence helpers.
9. `src/renderer/src/stores/` — Zustand state ownership. Read `useCloudAuthStore.js` for cloud auth and `useSubscriptionStore.js` for subscription/quota behavior.
10. `src/renderer/src/components/`, `constants/`, and `services/` — feature-specific UI and renderer logic.

### Website reading order

1. [`AGENTS.md`](as-king-official-web/AGENTS.md) — repository-specific Next.js instruction. Before framework-level changes, consult the installed Next.js documentation under `node_modules/next/dist/docs/` in this repository.
2. [`app/layout.js`](as-king-official-web/app/layout.js) — global font, language provider, metadata, and Meta Pixel.
3. [`app/page.js`](as-king-official-web/app/page.js) — public home composition.
4. `app/components/` — public sections and shared UI.
5. [`lib/supabase/client.js`](as-king-official-web/lib/supabase/client.js) — browser Supabase SSR client and public environment variables.
6. [`lib/supabase/server.js`](as-king-official-web/lib/supabase/server.js) — cookie-backed server client.
7. [`lib/config/pricing.js`](as-king-official-web/lib/config/pricing.js) — centralized pricing and support configuration.
8. `lib/i18n/` — language context and translations.
9. `app/signup/page.js`, `app/login/page.js`, `app/auth/callback/route.js`, and `app/auth/*` — user authentication.
10. [`app/auth/desktop/page.js`](as-king-official-web/app/auth/desktop/page.js) — browser-to-desktop session bridge.
11. [`app/profile/page.js`](as-king-official-web/app/profile/page.js) — user profile and subscription/payment workflow.
12. `app/operator/login/page.js`, `app/operator/page.js`, and `app/api/operator/` — operator authentication and payment administration.
13. [`docs/supabase_operator_schema.sql`](as-king-official-web/docs/supabase_operator_schema.sql) — documented table, RLS, and RPC assumptions.

## 3. Desktop Architecture

The desktop app has three meaningful boundaries:

- **Main process:** OS access, Electron lifecycle, messaging clients, native dialogs, backup/restore, and privileged services.
- **Preload:** narrow `contextBridge` API. This is the only supported renderer entry to main-process capabilities.
- **Renderer:** React UI, Zustand stores, Dexie local data, and user interaction.

The BrowserWindow is configured with `contextIsolation: true` and `nodeIntegration: false`. Preserve this boundary. Do not expose Node modules, raw `ipcRenderer`, filesystem access, session files, or service credentials to the renderer.

### Native messaging flow

For WhatsApp and Telegram, the normal flow is:

1. Renderer invokes a preload API.
2. Preload invokes a named IPC handler.
3. Main process delegates to the owning messaging service.
4. The service emits status/message events back to the renderer through controlled channels.
5. Renderer stores or queries local data through Dexie and updates Zustand/UI state.

When changing an IPC feature, inspect and update the handler, preload exposure, renderer caller/store, event names, payload shape, error shape, and focused tests together.

### Local database

Dexie database name: `KingAIWhatsAppDB`.

Known tables include:

- `conversations`
- `messages`
- `scheduledMessages`
- `contacts`
- `templates`
- `aiSettings`
- `aiMessages`
- `tickets`
- `cloudAuth`

`src/renderer/src/services/db.js` contains schema versions 1 through 9. Existing user databases must continue to open. Never casually rewrite or remove version history. Before changing a schema:

1. Identify the current version and all affected indexes.
2. Decide whether an upgrade function is needed.
3. Preserve old records and defaults.
4. Test opening/upgrading a representative old database.
5. Verify backup/export/import behavior.

Only indexed fields belong in Dexie schema declarations. Application object fields can exist without indexes.

## 4. Authentication Contract

### Website to desktop login

The supported login flow is:

1. Desktop opens `https://asking.godiscus.com/auth/desktop` through the system browser.
2. Website reads the authenticated Supabase browser session.
3. Website constructs:

   `asking://auth/callback?access_token=...&refresh_token=...&expires_at=...&user_id=...&email=...&full_name=...`

4. Website attempts to open the custom scheme automatically and provides a manual fallback.
5. Electron receives the URL via macOS `open-url`, or via the second-instance command line on Windows/Linux.
6. [`src/main/index.js`](as-king-ai/src/main/index.js) parses the URL and emits `auth:session-received`.
7. `useCloudAuthStore` persists the session in Dexie `cloudAuth`, calls `supabase.auth.setSession`, verifies the user, and synchronizes subscription state.

The exact current payload fields are:

- `access_token`
- `refresh_token`
- `expires_at`
- `user_id`
- `email`
- `full_name`

If this contract changes, update the website bridge, Electron parser, preload event exposure, renderer auth store, and platform checks together.

### Website authentication

The website uses `@supabase/ssr`:

- Browser auth uses `lib/supabase/client.js` and `createBrowserClient`.
- Server callback auth uses `lib/supabase/server.js` and cookie-backed `createServerClient`.
- [`app/auth/callback/route.js`](as-king-official-web/app/auth/callback/route.js) handles PKCE codes, token-hash OTP verification, recovery redirects, safe destination allowlisting, and free-trial initialization.

Do not introduce an open redirect. Preserve the callback allowlist unless the new destination is explicitly reviewed.

## 5. Subscription and Payment Contract

`tb_payment` is a shared record. Current documented fields include:

- `uid`: unique foreign key to `auth.users.id`.
- `jenis_plan`: `0` free trial, `1` Pro Business, `2` Advance Business.
- `note_plan`.
- `datetime_payment`: Unix timestamp, normally milliseconds.
- `datetime_expired`: Unix timestamp, normally milliseconds.
- `request_budget`: remaining AI request quota.
- `status`: commonly `active`, `pending`, `expired`, or `suspended`.
- `base_price`, `discount`, and `price`.
- `created_at`, `updated_at`.

The website callback/profile can initialize a free-trial record with approximately 15 days and budget 300. The operator dashboard can approve or edit records. The desktop subscription store reads the same row, evaluates expiry/suspension locally, caches it, and optimistically decrements `request_budget` before writing it back.

Important: the optimistic quota update is not an atomic server-side consumption operation. Do not describe it as race-safe or tamper-proof. A quota correctness fix must be designed at the database/RPC boundary and coordinated across both applications.

Pricing source: [`lib/config/pricing.js`](as-king-official-web/lib/config/pricing.js). Do not assume marketing copy, operator defaults, and desktop quota values are identical; verify the actual contract before changing plan semantics.

When changing billing or quota behavior, inspect:

- Website auth callback and profile.
- Website pricing configuration and translations.
- Operator APIs and dashboard.
- Desktop `useSubscriptionStore`.
- Supabase schema, RLS policies, RPC definitions, and Edge Functions.
- Any focused billing/auth tests.

## 6. AI Architecture and Contract

Default AI flow:

`renderer -> preload IPC -> gemini.service.js -> Supabase Edge Function -> Google Gemini -> SSE -> renderer`

The Edge Function is [`supabase/functions/gemini-chat/index.ts`](as-king-ai/supabase/functions/gemini-chat/index.ts). It accepts POST JSON for general chat or customer-agent chat and returns SSE events.

Preserve these event types:

- `content`: incremental text, including `delta` and accumulated content.
- `tool_call`: function name, arguments, and continuation payload.
- `end`: completed content.
- `error`: failure information.
- `[DONE]`: stream terminator.

Customer-agent requests compile prompt placeholders such as `{{agent_name}}`, `{{company_name}}`, and `{{personality_tone}}`, then append verified company knowledge. Tool calls may require renderer-side execution followed by a continuation request. Do not discard or mutate continuation contents without understanding the Gemini conversation contract.

`gemini.service.js` supports:

- Default Supabase Edge streaming.
- Optional BYOK direct Gemini SDK calls.
- Retry with backoff for transient/rate-limit errors.
- General chat and customer-agent chat.

Keep Gemini API keys and service credentials outside renderer code. The intended server-side secret boundary is Supabase Edge Function secrets. Public Supabase URL/anon configuration is not equivalent to a private service secret.

## 7. Operator Portal Contract

Operator flow:

1. [`app/operator/login/page.js`](as-king-official-web/app/operator/login/page.js) checks `tb_operator` and sends Supabase OTP.
2. [`app/operator/page.js`](as-king-official-web/app/operator/page.js) checks the browser session and whitelist.
3. `POST /api/operator/check-whitelist` queries `tb_operator`.
4. `GET` and `PUT /api/operator/payments` read or update payment records, attempting RPCs first and using direct-table fallbacks.

The route currently relies on an `x-operator-email` header for payment API authorization. This is a weak boundary because the header is caller-controlled and the route uses the public Supabase key. Do not treat this as strong server-side authentication, do not extend it to new privileged operations, and do not document it as secure merely because a whitelist lookup succeeds. Any hardening should validate the Supabase session/JWT server-side and enforce authorization through RLS/RPC/database policy.

RPC definitions referenced by the website are not present in the website repository. Verify their actual deployed definitions before changing their parameters, security-definer behavior, or fallback logic.

## 8. Security and Data Handling Rules

Always:

- Treat access tokens, refresh tokens, Telegram sessions, WhatsApp credentials, local databases, backups, and logs as sensitive.
- Avoid logging tokens, message content, credentials, or session strings.
- Validate and normalize all renderer-originated IPC payloads in main handlers.
- Keep privileged filesystem, shell, network-client, and credential operations in the main process or server-side boundary.
- Preserve `contextIsolation: true` and `nodeIntegration: false`.
- Validate external URLs and redirect destinations.
- Use RLS/RPC/server-derived claims for privileged cloud operations.
- Keep secrets out of committed files and never print environment values in reports.

Current implementation risks that must remain visible to future agents:

- Deep-link auth currently places access and refresh tokens in a custom-scheme URL. Consider exposure through OS protocol handling, browser history, diagnostics, and logs before modifying this flow.
- IPC handlers currently require stronger input validation before accepting untrusted renderer data.
- Operator payment authorization currently trusts a caller-provided email header.
- `tb_operator` has a documented public SELECT policy; do not assume whitelist data is private.
- Desktop quota consumption is optimistic and non-atomic.
- Local Telegram/session artifacts require careful protection and must never be exposed to web content.
- Hardcoded public Supabase identifiers may exist in desktop source; distinguish public client configuration from actual secrets and avoid adding private credentials.

Do not silently “fix” these risks during an unrelated feature. Record the risk, keep the change scoped, and propose a separate hardening change when appropriate.

## 9. Change Routing Rules

Use the smallest owning surface that can correctly implement the behavior:

- **Desktop UI only:** renderer components/stores/services. Do not touch main or preload unnecessarily.
- **Native capability or messaging:** service -> IPC handler -> preload -> renderer caller/store.
- **Desktop auth/deep link:** website bridge + Electron main + preload + cloud auth store + platform-specific validation.
- **Subscription/payment:** both clients + pricing/config + schema/RLS/RPC + relevant Edge Functions.
- **AI behavior:** renderer caller + IPC + `gemini.service.js` + Edge Function + tool executor + quota gate.
- **Local data:** `db.js` plus every helper/store/component relying on the affected table or index.
- **Website route/API:** follow Next.js App Router conventions and inspect client/server boundaries before changing imports or data access.
- **Operator feature:** inspect UI, API route, Supabase auth claims, RLS, RPC definitions, and audit implications.
- **Packaging/release:** `package.json`, `electron-builder.yml`, platform-specific build resources, signing/update configuration, and the relevant target platform.

Do not edit generated `.next`, `out`, `dist`, Playwright reports, test results, session artifacts, or local environment files as source changes.

## 10. Commands and Validation

Run commands from the owning repository.

### Desktop

```bash
npm run dev
npm run build
npm run lint
npm run test:e2e
npm run test:backup
```

Platform packaging scripts include `npm run build:mac`, `npm run build:win`, and `npm run build:linux`. Windows AppX signing scripts require Windows tooling and are not macOS commands.

### Website

```bash
npm run dev
npm run build
npm run start
```

The website package currently does not define lint, typecheck, or test scripts. Do not claim those checks passed unless an explicit command was run. Consult installed Next.js docs before framework-level changes.

### Focused validation

For auth/deep-link changes, test:

- Website session creation.
- `/auth/desktop` token payload.
- macOS `open-url` handling.
- Windows/Linux second-instance handling.
- Desktop Dexie persistence, Supabase `setSession`, user verification, refresh, and logout.

For AI changes, test:

- SSE content accumulation.
- Normal end and error events.
- Tool call and continuation behavior.
- BYOK fallback if touched.
- Expired, suspended, and exhausted subscription gates.

For billing/operator changes, test:

- Free-trial initialization and duplicate/race behavior.
- Profile read/update behavior.
- Operator whitelist and payment API authorization.
- RPC and fallback behavior.
- RLS behavior using realistic authenticated and unauthorized callers.

## 11. Required AI Working Protocol

Before editing:

1. Identify the concrete behavior, failing test, command, symbol, or route.
2. Locate the nearest code that decides the behavior, not only the code that forwards it.
3. State one falsifiable hypothesis about the behavior.
4. Identify one cheap check that could disconfirm it.
5. Read only the nearby contract needed to make the smallest correct edit.

After the first substantive edit:

1. Run the narrowest executable validation available immediately.
2. If it fails, repair the same slice and rerun it before broadening scope.
3. Do not resume broad exploration between an edit and its focused validation.
4. Preserve unrelated user changes and avoid unrelated refactors.

In the final report, state:

- What changed and why.
- Which files were touched.
- Which validation commands passed or could not run.
- Which facts were verified versus assumed.
- Any remaining security, compatibility, or deployment risk.

## 12. Compact File Map

| Concern | Primary desktop files | Primary website files |
| --- | --- | --- |
| Auth/deep link | `src/main/index.js`, `src/preload/`, `src/renderer/src/stores/useCloudAuthStore.js` | `app/auth/desktop/page.js`, `app/auth/callback/route.js`, `lib/supabase/*` |
| Subscription | `src/renderer/src/stores/useSubscriptionStore.js` | `app/profile/page.js`, `lib/config/pricing.js`, `app/auth/callback/route.js` |
| AI | `src/main/ipc/handlers.js`, `src/main/services/gemini.service.js` | None directly; shared Edge Function is desktop repo `supabase/functions/gemini-chat/index.ts` |
| WhatsApp | `src/main/services/baileys.service.js` | Public feature descriptions only |
| Telegram | `src/main/services/telegram.service.js` | Public feature descriptions only |
| Local data | `src/renderer/src/services/db.js` | None; website does not own desktop Dexie data |
| Operator/payment admin | Reads shared subscription state | `app/operator/*`, `app/api/operator/*`, `docs/supabase_operator_schema.sql` |
| Public UI | Renderer components/stores | `app/page.js`, `app/components/*`, `app/layout.js` |
| Packaging/deployment | `package.json`, `electron-builder.yml`, `build/*` | `package.json`, `next.config.mjs`, deployment environment |

## 13. Known Unknowns

Do not invent answers for these areas:

- The deployed SQL definitions for `get_operator_payments` and `update_operator_payment` are not stored in the website repository.
- Database policies in the live Supabase project may differ from `docs/supabase_operator_schema.sql`.
- The `app/collaboration/[roomCode]` directory may be a future/stubbed route; generated artifacts are not proof of a live implementation.
- Production environment values, deployment settings, update endpoints, signing credentials, and secret values must be verified from the appropriate deployment system, never guessed from source.
- Marketing claims and translation values may differ from operational quota defaults; use the actual database/client contract for behavior.

When evidence conflicts, prefer current executable source and deployed contract verification over stale generated output or marketing text. Mark unresolved conflicts explicitly.