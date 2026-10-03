<h1 align="center">nServers Code</h1>
<p align="center">O agente de programação com IA para o seu terminal — integrado à plataforma de IA da nServers.</p>
<p align="center">
  <a href="https://www.npmjs.com/package/nservers-code"><img alt="npm" src="https://img.shields.io/npm/v/nservers-code?style=flat-square" /></a>
  <a href="https://github.com/nservers/nservers-code/actions/workflows/publish.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/nservers/nservers-code/publish.yml?style=flat-square&branch=dev" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.br.md">Português (Brasil)</a>
</p>

[![Interface de terminal do nServers Code](packages/web/src/assets/lander/screenshot.png)](https://nservers.com.br/code)

O nServers Code é um agente de programação com IA para o terminal, conectado à plataforma de IA da [nServers](https://nservers.com.br). É um fork mantido do [OpenCode](https://github.com/anomalyco/opencode) — mesma arquitetura aberta de agente, integrado ao nosso gateway de modelos, planos e billing.

### Instalação

```bash
# Script de instalação (macOS / Linux) — instala em ~/.nservers/bin
curl -fsSL https://nservers.com.br/install-code.sh | bash

# npm (qualquer SO, incluindo Windows)
npm i -g nservers-code
```

O instalador aceita `INSTALL_DIR` (caminho customizado) e `VERSION` (fixar uma release):

```bash
INSTALL_DIR=/usr/local/bin curl -fsSL https://nservers.com.br/install-code.sh | bash
VERSION=0.3.1 curl -fsSL https://nservers.com.br/install-code.sh | bash
```

### Primeiros passos

```bash
nservers-code nservers login    # login via device-flow com sua conta nServers
nservers-code                   # abre o TUI
```

O provider `nservers` embutido roteia as requisições pelo gateway de IA da nServers. O uso é cobrado pelo seu plano (nServers Code Pro / Max / Ultra / Team), com roteamento automático de modelos via `nservers:router`.

Comandos úteis:

```bash
nservers-code nservers status   # sessão e plano atual
nservers-code nservers logout   # revoga as credenciais locais
nservers-code models            # lista os modelos disponíveis
nservers-code run "corrija os testes quebrados"   # execução única não-interativa
```

### Agentes

O nServers Code inclui dois agentes embutidos, alternados com a tecla `Tab`.

- **build** — agente padrão, acesso total ao ambiente de desenvolvimento
- **plan** — agente somente-leitura para análise e exploração de código
  - Bloqueia edições de arquivo por padrão
  - Pede permissão antes de rodar comandos bash

### App desktop (beta)

Builds desktop são publicados na [página de releases](https://github.com/nservers/nservers-code/releases) como artefatos `nservers-code-desktop-*` (`.dmg` para macOS, `.exe` para Windows, `.deb`/`.rpm`/`.AppImage` para Linux). Deep links usam o scheme `nservers://`.

### Configuração

Compatível com o layout de config do upstream: `opencode.json` no projeto, `~/.config/opencode/` no usuário e variáveis `OPENCODE_*` continuam funcionando.

Overrides de ambiente para apontar o CLI para outra API (ex.: backend local):

```bash
NSERVERS_GATEWAY_URL=http://localhost:8000   # gateway de modelos
NSERVERS_API_URL=http://localhost:8080       # API de conta/device
NSERVERS_DEVICE_URL=http://localhost:3000/device
```

### Desenvolvimento

```bash
bun install
cd packages/opencode
bun run dev        # roda o CLI/TUI a partir do fonte
```

A branch padrão é `dev`. Leia o [AGENTS.md](./AGENTS.md) para as regras de arquitetura e convenções de estilo, e o [NSERVERS_FORK.md](./NSERVERS_FORK.md) para o que difere do upstream.

### Contribuindo

Veja [CONTRIBUTING.md](./CONTRIBUTING.md).

---

O nServers Code é baseado no [OpenCode](https://github.com/anomalyco/opencode) (MIT), © Anomaly Innovations. A nServers mantém a integração com o provider, o roteamento consciente de billing, a identidade desktop e o pipeline de release.
