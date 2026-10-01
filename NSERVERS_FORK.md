# nServers Code — Fork Patches

Product-facing customizations on top of `sst/opencode`. Goal: `nservers-code`
CLI that connects to the nServers Code gateway (`https://ai-api.nservers.io/v1`)
out of the box, authenticates via the nServers account, and sends
`x-client-name: nservers-code` on every request.

## Status

| Patch | Status | Where |
|---|---|---|
| Built-in `nservers` provider preset | ✅ done | `packages/opencode/src/config/nservers.ts` + `config.ts` (`loadGlobal`) |
| `nservers login` device flow | ✅ done | `packages/opencode/src/cli/cmd/nservers.ts` — `nservers login\|logout\|status`, device authorization contra `api.nservers.io`, escreve `auth.json` (`{"nservers":{type:"api"}}`), token no stdout p/ `auth login --url` |
| `.well-known/opencode` remote config | ✅ done | `nservers-ai-api`: `GET /.well-known/opencode` com `auth.command` + catálogo dinâmico |
| Binary/package rename to `nservers-code` | ⏳ pending | packaging scripts only (see UPSTREAM_SYNC.md) |
| npm publish `@nservers/code` (fallback `nservers-code`) | ⏳ pending | release pipeline |
| Branding pass (TUI header, docs, screenshots) | ⏳ pending | keep `LICENSE` + upstream attribution |

## Architecture notes

### Auth model

opencode already stores credentials in `~/.local/share/opencode/auth.json`
(`Auth.Info` union: `api`, `oauth`, `wellknown`). For nServers:

- Short term: `NSERVERS_API_KEY` env var or `opencode auth login` → provider
  `nservers` → API key created in `nservers.app` panel.
- Target: `nservers login` runs the device authorization flow against
  `https://nservers.app/device`, polls for the issued `nsk_...` key, and writes
  `auth.json` with the gateway entry — same UX as `opencode auth login` but
  zero copy-paste.

### Remote provider config

The gateway should serve `GET /.well-known/opencode` returning
`{ config: { provider: { nservers: {...}, model: "nservers/code-standard" } } }`.
Stock opencode picks this up automatically when auth type is `wellknown` —
the fork presets the provider so even that step disappears.

### Request identity

Every request to the gateway must carry `x-client-name: nservers-code`
(preset in provider `options.headers`). The gateway uses it for metrics,
plan enforcement of CLI-specific limits, and feature flags.

### Model catalog

`/v1/models` on the gateway returns the public catalog filtered by the
caller's plan. The preset ships two static aliases (`code-standard`,
`code-premium`); the dynamic catalog should be wired through the well-known
config so new models appear without CLI updates.

## Release checklist (when ready)

1. `bun install && bun run --cwd packages/opencode typecheck` — ✅ limpo (bun 1.4.2, 2026-02-15)
2. Package rename + npm publish — **scope check 2026-02-15: `@nservers/code`
   e `nservers-code` livres**; scoped exige org `@nservers` criado em
   npmjs.com primeiro (404 ≠ scope nosso) — fallback: `nservers-code` unscoped
3. `install/` script adapted to download our binaries
4. GitHub releases with platform binaries (bun compiled targets)
5. Docs: `nservers.com.br/code` + `docs/nservers-code/*` on the site
