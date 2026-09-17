# Working in this repo

Read this before changing anything; the rest is in [README.md](./README.md).

- **Regenerate the committed Payload files** when a collection, global or admin component changes:
  `pnpm generate:types && pnpm generate:importmap`. CI fails on a stale `payload-types.ts` or
  `importMap.js`, and Dependabot cannot do it for you.
- **Bump `version` in `package.json` in every PR.** Merging tags a release from it. Patch for
  fixes, minor for features.
- **Never delete `pnpm-lock.yaml`.** Deleting it silently re-resolves every dependency; use
  `pnpm install` or `pnpm update` deliberately.
- **Biome, not ESLint or Prettier.** `pnpm lint:fix`. `pnpm lint` fails on warnings, so a stray
  `any` or an array-index key breaks CI rather than nagging.
- **Node 24 and pnpm 10**, pinned in `engines` and `packageManager`.
- **Add new env vars in three places**: `src/env.ts` (validated), `.env.example` (documented) and
  `.github/workflows/ci.yml`'s `env` block, since the config loads `env.ts` during the build.
- **Tests come in two tiers.** `pnpm test` is unit-only and needs nothing running.
  `pnpm test:integration` drives a real build over the REST API and writes to the database, so
  give it a throwaway one.
- **Payload Cloud builds `main` with buildpacks**, not Docker, and deploys on merge. There are no
  preview environments, so anything you want to see before merging, run locally.
- **PR titles are short and lowercase**, `type: what changed` — `fix: keep the picked day when the
  filter reloads`. No AI attribution anywhere, in commits or PR bodies.

## Verifying frontend work

Unit tests, typecheck and a green build have all passed while the page itself was broken — a
timezone bug that only showed after a reload, and analytics that stopped recording after any
client-side navigation. If a change touches what a reader or an editor sees, drive it in a
browser before calling it done.
