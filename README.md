# Diário do Xingu

[![Production smoke check](https://github.com/Diario-do-Xingu/diario-do-xingu/actions/workflows/smoke.yml/badge.svg)](https://github.com/Diario-do-Xingu/diario-do-xingu/actions/workflows/smoke.yml)

The news site of the *Diário do Xingu*, a newspaper in Altamira, Pará. It publishes news, the
legal notices (*publicações legais*) that notaries are required to run, and the digital editions
of the printed paper.

Live at **[diariodoxingu.com](https://diariodoxingu.com)**, admin at `/admin`.

## Stack

Payload 3 on MongoDB, serving a Next 16 App Router frontend from the same process. React 19,
Tailwind 4, Biome for lint and format, Vitest for tests. pnpm 10 and Node 24 — both pinned, in
`packageManager` and `engines`.

## Running it locally

You need Node 24, pnpm 10 and a MongoDB you can write to. The quickest database is a container:

```bash
docker run -d --name xingu-mongo -p 27017:27017 mongo:8
```

Then:

```bash
cp .env.example .env     # fill in the required values below
pnpm install
pnpm dev                 # http://localhost:3000, admin at /admin
```

The signup form at `/admin` creates an **editor**, because `roles` is an admin-only field and
falls back to its default. Editors cannot manage users, so register the first account through the
API instead if you want an admin:

```bash
curl -X POST http://localhost:3000/api/users/first-register \
  -H 'content-type: application/json' \
  -d '{"email":"you@example.com","password":"...","roles":["admin"]}'
```

That endpoint only works while the collection is empty. A user with no roles at all is denied
everything.

To work against real data — rehearsing a migration, reproducing something an editor reported —
clone production into your local database:

```bash
pnpm db:clone-prod
```

It reads `PROD_DATABASE_URI`, only ever reads from it, refuses to restore into anything that is
not a local host, and keeps the dump as a dated archive. The integration suite can then run
against that copy by pointing `INTEGRATION_ADMIN_EMAIL` and `INTEGRATION_ADMIN_PASSWORD` at an
existing admin, since `first-register` only works on an empty database.

### Environment

`src/env.ts` validates these at boot, so a missing one fails the build rather than surfacing
later. `next.config.mjs` loads that file, which means even `pnpm build` needs them.

| Variable | Required | What it is |
| --- | --- | --- |
| `DATABASE_URI` | yes | MongoDB connection string |
| `PAYLOAD_SECRET` | yes | Signs Payload's auth tokens |
| `CRON_SECRET` | yes | `Bearer` token that lets an external caller run the job queue |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` | yes | Exactly 32 bytes: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `NEXT_PUBLIC_SERVER_URL` | yes | Public origin; canonical URLs, OG tags, the sitemap and the feed are built from it |
| `NEXT_PUBLIC_IS_LIVE` | no | `'false'` (default) serves a `noindex` header on every response |
| `NEXT_PUBLIC_USE_PAYLOAD_CLOUD` | no | Registers the Payload Cloud plugin; pair it with `PAYLOAD_CLOUD` |
| `UMAMI_URI`, `UMAMI_WEBSITE_ID` | no | Analytics; both must be set or the script is not rendered |
| `NEXT_PUBLIC_SENTRY_DSN` | no | Error reporting. Only the live site reports; elsewhere the SDK is switched off, so a copied `.env` cannot file dev errors against production |
| `SENTRY_AUTH_TOKEN` | no | Source-map upload at build time; only needed on Payload Cloud |
| `PAYLOAD_CLOUD_*` | no | Set by Payload Cloud itself; leave empty locally |

`NEXT_PUBLIC_*` values are inlined into the browser bundle at build time, so changing one needs a
rebuild to reach the client.

## Content model

**Collections** — `news`, `news-categories`, `article-media`, `notarial-acts`, `digital-editions`,
`digital-edition-thumbs`, `media`, `users`.
**Globals** — `site-info`, `advertisement`, `site-metadata`.

News and notarial acts are drafted and published (`_status`), and both stamp `publishedAt` the
first time they go live. Notarial acts are addressed by a generated `key` rather than a title
slug, and their uploaded file is renamed after it.

**Public routes** — `/`, `/noticias` (+ `/[slug]`, `/page/[n]`), `/publicacoes-legais`
(+ `/[key]`, `/page/[n]`), `/edicoes-digitais` (+ `/page/[n]`), `/tabela-brasileirao`,
`/feed.xml`, `/sitemap.xml`, `/robots.txt`.

### Publishing and caching

Pages are cached and refreshed three ways. Collection hooks revalidate the affected paths and
cache tags the moment an editor saves — the article's own URL, the list routes, the sitemap, and
for news the RSS feed.

Scheduled publishes run in Payload's job queue (`autoRun` every minute), which executes outside a
request, where `revalidatePath` throws. Those hooks post the work to `/api/revalidate` instead,
guarded by `CRON_SECRET`, so a scheduled article appears as quickly as a manual one. Without it a
scheduled publish reaches the database but stays invisible until each page's own window expires.

That window is the backstop: every public route carries `revalidate = 600`, so anything the first
two miss still heals within ten minutes.

## Scripts

| | |
| --- | --- |
| `pnpm dev` | Next dev server |
| `pnpm build` / `pnpm start` | Production build and serve |
| `pnpm test` | Unit tests. Pure functions only — no server, no database |
| `pnpm test:integration` | Drives a **running build** over the REST API. Creates and deletes documents, so point it at a throwaway database only |
| `pnpm lint` / `pnpm lint:fix` | Biome. `lint` fails on warnings |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm generate:types` / `pnpm generate:importmap` | Regenerate the committed Payload files |
| `pnpm migrate` / `migrate:status` / `migrate:down` | Payload migrations |
| `pnpm db:clone-prod` | Copy production into the local database (read-only on production) |

## Committed generated files

`src/payload-types.ts` and `src/app/(payload)/admin/importMap.js` are generated and **committed**.
Change a collection, a global or an admin component and you must regenerate them, or CI fails:

```bash
pnpm generate:types && pnpm generate:importmap
```

## CI

Every PR to `main` runs seven jobs: `version`, `lint`, `typecheck`, `test`, `payload-types`,
`audit` and `build` (which also starts the build and runs the integration suite against it).

Two of those need explaining:

- **`version`** — every PR must raise `version` in `package.json`, because merging `main` tags a
  release from it and the footer shows the running version. Patch for fixes, minor for features.
- **`audit`** — green today, so a red one means a finding someone can act on. Advisories with no
  reachable fix are either baselined in `pnpm.auditConfig.ignoreCves` or skipped by
  `--ignore-unfixable`, and a second step prints them all so they stay visible.

## Deployment

Payload Cloud builds and deploys `main` automatically; there are no preview environments. It does
not report deploy status back to GitHub, so `smoke.yml` probes the live site every six hours for
the two things most likely to break quietly: the homepage, and the Next image optimizer.

Merging to `main` also tags `v<version>` and cuts a GitHub release. The footer links its commit,
so you can always see what is actually running.

## Licence

Proprietary — see [LICENSE](./LICENSE). The source is public for reference, not for reuse.
