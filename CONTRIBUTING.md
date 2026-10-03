# Contributing to nServers Code

nServers Code is a maintained fork of [OpenCode](https://github.com/anomalyco/opencode). Contributions are welcome — bug fixes, provider support, performance work and docs land fastest. UI or core product changes should be discussed in an issue first.

## Ground rules

- The default branch is `dev`. Branch names: short, at most three hyphen-separated words, no `feat/`/`fix/` prefixes (e.g. `session-recovery`).
- Commit messages and PR titles use conventional commits: `type(scope): summary` (see [AGENTS.md](./AGENTS.md)).
- Read [AGENTS.md](./AGENTS.md) before touching code — it documents the architecture constraints and style guide enforced in review.
- Fork-specific behavior is documented in [NSERVERS_FORK.md](./NSERVERS_FORK.md); keep upstream compatibility (`opencode.json`, `OPENCODE_*` env vars, `@opencode-ai/*` package names) unless a change deliberately breaks it.

## Development setup

```bash
bun install
cd packages/opencode
bun run dev        # TUI from source
bun typecheck      # run from the package dir, never repo root
bun test           # same — tests run per-package, not from root
```

For working on the desktop app: `cd packages/desktop && bun run dev` (builds the bundled `nservers-code` service binary from `packages/cli` automatically).

## Reporting issues

Open an issue at [nservers/nservers-code](https://github.com/nservers/nservers-code/issues). For bugs in the AI platform itself (models, billing, plans), use nServers support instead — that's a separate backend.
