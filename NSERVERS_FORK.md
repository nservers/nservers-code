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
| Binary/package rename to `nservers-code` | ✅ done | `bin/nservers-code`, `package.json`, `build/postinstall/publish` scripts |
| npm publish `nservers-code` | ⏳ pending | release pipeline (`npm publish --access public`) |
| Branding pass (TUI header, docs, screenshots) | ✅ done | theme + wordmark + strings (see below) |

## Branding (visual identity)

- **Theme**: `packages/tui/src/theme/assets/nservers.json` — paleta da marca
  (indigo `#818cf8`/`#4f46e5`, cyan `#22d3ee`, violet `#a78bfa`, slate bg
  `#050914`). Registrado em `theme/index.ts` (`DEFAULT_THEMES`) e virou o
  default em `context/theme.tsx`. Usuário ainda pode trocar via `/themes`.
- **Wordmark**: `tui/src/logo.ts` (ASCII "nservers" two-tone, mesmo grid 4×3 do
  upstream), `tui/src/util/presentation.ts` (epílogo de sessão) e
  `opencode/src/cli/ui.ts` (wordmark flat para prompts não-TTY) — as três
  cópias sincronizadas.
- **Strings**: título do terminal, sound pack (`nservers.default`), docs
  (`docs.open` → nservers.io/docs/nservers-code), tips (`nservers-code ...`
  + tip `nservers login`), crash report → `nservers/nservers-code` issues,
  permission/uninstall/splash texts "nServers Code".
- **Provider UX**: `nservers` é prioridade 0 no `/connect` ("Recommended —
  nServers account"), com bloco apontando `nservers-code nservers login` e
  nservers.app/ai-ntokens. Providers upstream (opencode zen/go) mantidos com
  descrições próprias.
- **Upsell**: rate-limit no provider `nservers` dispara o dialog de upgrade
  com link `nservers.io/code` (antes `opencode.ai/go`); mini-logo `ns` na
  animação BgPulse.
- **Distribuição**: `Installation` repontado — npm `nservers-code`, GitHub
  releases `nservers/nservers-code`, curl installer
  `https://nservers.io/install-code.sh` (script em `nservers-site/public/`),
  install dir `~/.nservers/bin` (sem colisão com `~/.opencode/bin` do stock).
- **`/share` desligado por default**: `share-next.ts` agora lança erro claro
  quando não há `enterprise.url` configurada — nada de sessão vazando pro
  backend upstream (`opncd.ai`). Pra reativar quando houver share backend
  nServers, basta setar `enterprise.url` no config. `nservers-code import`
  segue lendo URLs públicas do upstream (migração legada).
- **Desktop/app (Electron)**: identidade completa nServers — `appId`
  `br.com.nservers.code{,.dev,.beta}`, `productName`/`APP_NAMES` "nServers
  Code*", scheme `nservers://` (parser aceita `opencode://` legado também),
  pacotes `nservers-code-*`, artifact `nservers-code-desktop-*`, publish →
  `nservers/nservers-code`. Binário bundled virou `resources/nservers-code`
  e passa a ser **buildado do nosso `packages/cli`** (`CLI_TARGET` em
  `cli/script/build.ts` + `buildCliToResources` em `desktop/scripts/utils.ts`)
  — antes baixava `@opencode-ai/cli-*` do npm upstream. `copy-metainfo.ts`
  gera metainfo nServers. i18n: `OpenCode` → `nServers Code` em todos os
  locales (preservando "OpenCode Zen"/"OpenCode Go" — nomes de provider
  terceiro). `publish.yml` repontado pro fork + paths `dist/nservers-code-*`
  corrigidos. **Compat mantida**: `opencode.json`, `OPENCODE_*`,
  `@opencode-ai/*`, `username: "opencode"` do serviço local, ids Tauri
  legados na migração de estado.
- **Docs/CI hygiene**: README.md/README.br.md reescritos (EN + PT-BR; as 20
  traduções upstream foram removidas — stale > ausente), `install`, `STATS.md`,
  `CODEOWNERS` (owners upstream), `publish-python-sdk.yml` (dead) deletados;
  CONTRIBUTING/SECURITY reescritos pro fork (contato `privacidade@nservers.io`).
  Workflows upstream-only removidos (`deploy`, `docs-locale-sync`,
  `models-snapshot`, `stats`, `opencode` mention-bot, `publish/release-github-action`,
  `publish-vscode`); workflows de automação (`review`, `triage`,
  `duplicate-issues`, `pr-management`) repontados pra `install-code.sh` +
  `nservers-code` + `secrets.NSERVERS_API_KEY` + runners `ubuntu-latest` (era
  blacksmith-*). `setup-git-committer` agora usa `vars.NSERVERS_APP_ID`/
  `secrets.NSERVERS_APP_SECRET`. **Pendente**: provisionar secrets
  (`NSERVERS_API_KEY`, `NSERVERS_APP_ID/SECRET`, `APPLE_*`, `AZURE_*`,
  `DISCORD_WEBHOOK`) e atualizar `.github/TEAM_MEMBERS` com nossos handles.

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
caller's plan. The preset ships the real public keys (`nservers:router`,
`openai:gpt-5.5`, `openai:gpt-5.4-mini`, `gemini:gemini-3.5-flash`,
`qwen:qwen3-coder`, `deepseek:deepseek-v4-pro`); new models also appear
via the well-known remote config without CLI updates.

### Login

`nservers-code nservers login|logout|status` — device authorization flow
against `api.nservers.io` (existing infra). The gateway advertises it via
`wellknown.auth.command = ["nservers-code","nservers","login"]`.

## Release checklist (when ready)

1. `bun install && bun run --cwd packages/opencode typecheck` — ✅ limpo (bun 1.4.2, 2026-02-15)
2. ✅ Package rename (2026-02-15): `name: nservers-code` (unscoped — org
   `@nservers` no npm não existe; escopo confirmado livre para uso futuro),
   `bin: nservers-code`, pacotes de plataforma `nservers-code-{os}-{arch}`,
   shim `bin/nservers-code`, `script/build.ts`/`postinstall.mjs`/`publish.ts`
   alinhados. Pendente só o `npm publish` em si + releases GitHub.
3. ✅ Installer: upstream `install` removido — o canônico é
   `nservers.io/install-code.sh` (nservers-site/public), instala
   `~/.nservers/bin` baixando artifacts `nservers-code-*` das releases.
4. GitHub releases with platform binaries (bun compiled targets)
5. Docs: `nservers.io/code` + `docs/nservers-code/*` on the site
