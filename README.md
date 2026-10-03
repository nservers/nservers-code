<h1 align="center">nServers Code</h1>
<p align="center">The AI coding agent for your terminal — powered by the nServers AI platform.</p>
<p align="center">
  <a href="https://www.npmjs.com/package/nservers-code"><img alt="npm" src="https://img.shields.io/npm/v/nservers-code?style=flat-square" /></a>
  <a href="https://github.com/nservers/nservers-code/actions/workflows/publish.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/nservers/nservers-code/publish.yml?style=flat-square&branch=dev" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.br.md">Português (Brasil)</a>
</p>

[![nServers Code Terminal UI](packages/web/src/assets/lander/screenshot.png)](https://nservers.com.br/code)

nServers Code is a terminal AI coding agent that plugs into the [nServers](https://nservers.com.br) AI platform. It is a maintained fork of [OpenCode](https://github.com/anomalyco/opencode) — same open agent architecture, wired to our model gateway, plans and billing.

### Installation

```bash
# Install script (macOS / Linux) — installs to ~/.nservers/bin
curl -fsSL https://nservers.com.br/install-code.sh | bash

# npm (any OS, including Windows)
npm i -g nservers-code
```

The installer accepts `INSTALL_DIR` (custom path) and `VERSION` (pin a release):

```bash
INSTALL_DIR=/usr/local/bin curl -fsSL https://nservers.com.br/install-code.sh | bash
VERSION=0.3.1 curl -fsSL https://nservers.com.br/install-code.sh | bash
```

### Getting started

```bash
nservers-code nservers login    # device-flow sign-in with your nServers account
nservers-code                   # start the TUI
```

The built-in `nservers` provider routes requests through the nServers AI gateway. Usage is billed to your account plan (nServers Code Pro / Max / Ultra / Team), with automatic model routing via `nservers:router`.

Useful commands:

```bash
nservers-code nservers status   # current session/plan info
nservers-code nservers logout   # revoke local credentials
nservers-code models            # list available models
nservers-code run "fix the failing tests"   # non-interactive one-shot
```

### Agents

nServers Code includes two built-in agents you can switch between with the `Tab` key.

- **build** — default, full-access agent for development work
- **plan** — read-only agent for analysis and code exploration
  - Denies file edits by default
  - Asks permission before running bash commands

### Desktop app (beta)

Desktop builds are published on the [releases page](https://github.com/nservers/nservers-code/releases) as `nservers-code-desktop-*` artifacts (macOS `.dmg`, Windows `.exe`, Linux `.deb`/`.rpm`/`.AppImage`). Deep links use the `nservers://` scheme.

### Configuration

Compatible with the upstream config layout: `opencode.json` project config, `~/.config/opencode/` user config and `OPENCODE_*` environment variables keep working.

Environment overrides for pointing the CLI at a different API (e.g. a local backend):

```bash
NSERVERS_GATEWAY_URL=http://localhost:8000   # model gateway
NSERVERS_API_URL=http://localhost:8080       # account/device API
NSERVERS_DEVICE_URL=http://localhost:3000/device
```

### Development

```bash
bun install
cd packages/opencode
bun run dev        # run the CLI/TUI from source
```

The default branch is `dev`. Read [AGENTS.md](./AGENTS.md) for architecture rules and style conventions, and [NSERVERS_FORK.md](./NSERVERS_FORK.md) for what differs from upstream.

### Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

nServers Code is based on [OpenCode](https://github.com/anomalyco/opencode) (MIT), © Anomaly Innovations. nServers maintains the provider integration, billing-aware routing, desktop identity and release pipeline.
