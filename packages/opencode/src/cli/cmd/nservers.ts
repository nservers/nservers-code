import { Effect } from "effect"
import type { Argv } from "yargs"
import { Auth } from "../../auth"
import { NSERVERS_GATEWAY_URL } from "../../config/nservers"
import { CliError, effectCmd, fail } from "../effect-cmd"
import * as Prompt from "../effect/prompt"
import { openUrl } from "@opencode-ai/core/open"
import { cmd } from "./cmd"

const API_BASE = "https://api.nservers.io"
const AUTHORIZE_URL = `${API_BASE}/api/v1/device/authorize`
const TOKEN_URL = `${API_BASE}/api/v1/device/token`
const SCOPES = ["profile:read", "ai:ask", "ai:models:read", "ai:usage:read", "auth:tokens:revoke"]

interface DeviceStart {
  device_code: string
  user_code: string
  verification_uri: string
  verification_uri_complete?: string
  expires_in: number
  interval: number
}

const post = Effect.fn("Nservers.post")(function* (url: string, body: unknown) {
  return yield* Effect.tryPromise({
    try: async () => {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15_000),
      })
      return { status: res.status, body: await res.json().catch(() => ({})) }
    },
    catch: (err) => new CliError({ message: `request to ${url} failed: ${err}` }),
  })
})

const login = effectCmd({
  command: "login",
  describe: "authenticate this device with your nServers account",
  instance: false,
  handler: Effect.fn("Nservers.login")(function* () {
    const auth = yield* Auth.Service

    const started = yield* post(AUTHORIZE_URL, {
      client_type: "cli",
      client_name: "nservers-code",
      scopes: SCOPES,
    })
    if (started.status !== 201 && started.status !== 200) {
      yield* fail(`Device authorization failed (${started.status})`)
    }
    const device = started.body as DeviceStart

    const verificationUrl = device.verification_uri_complete ?? device.verification_uri
    yield* Prompt.log.info(`Open ${verificationUrl} and confirm code ${device.user_code}`)
    yield* Effect.promise(() => openUrl(verificationUrl).catch(() => false))

    const intervalMs = Math.max(1, device.interval || 5) * 1000
    const deadline = Date.now() + Math.max(30, device.expires_in || 900) * 1000
    let waitMs = intervalMs

    while (Date.now() < deadline) {
      yield* Effect.sleep(waitMs)
      const poll = yield* post(TOKEN_URL, { device_code: device.device_code })
      if (poll.status === 200 && poll.body?.access_token) {
        const token = String(poll.body.access_token)
        yield* Effect.orDie(auth.set("nservers", { type: "api", key: token }))
        yield* Prompt.log.success("Logged in — provider `nservers` is ready. Run `nservers-code` and pick a model.")
        // Última linha do stdout = token puro — contrato do `opencode auth
        // login --url` (wellknown.auth.command) que captura o stdout.
        process.stdout.write(`${token}\n`)
        return
      }
      const err = String((poll.body as any)?.error ?? "")
      if (err === "authorization_pending") continue
      if (err === "slow_down") {
        waitMs += 2000
        continue
      }
      yield* fail(`Login failed: ${err || `status ${poll.status}`}`)
    }
    yield* fail("Device authorization expired — run `nservers-code nservers login` again")
  }),
})

const logout = effectCmd({
  command: "logout",
  describe: "remove stored nServers credentials",
  instance: false,
  handler: Effect.fn("Nservers.logout")(function* () {
    const auth = yield* Auth.Service
    yield* Effect.orDie(auth.remove("nservers"))
    yield* Prompt.log.success("nServers credentials removed")
  }),
})

const status = effectCmd({
  command: "status",
  describe: "show nServers connection status",
  instance: false,
  handler: Effect.fn("Nservers.status")(function* () {
    const auth = yield* Auth.Service
    const cred = yield* Effect.orDie(auth.get("nservers"))
    if (!cred) {
      yield* Prompt.log.warn("Not logged in — run `nservers-code nservers login`")
      return
    }
    const key = cred.type === "api" ? cred.key : cred.type === "wellknown" ? cred.token : cred.access
    const res = yield* Effect.tryPromise({
      try: async () => {
        const r = await fetch(`${NSERVERS_GATEWAY_URL}/v1/models`, {
          headers: { authorization: `Bearer ${key}` },
          signal: AbortSignal.timeout(10_000),
        })
        return r.ok ? ((await r.json()) as { data?: unknown[] }) : null
      },
      catch: () => new CliError({ message: "unreachable" }),
    }).pipe(Effect.catch(() => Effect.succeed(null)))
    const count = res?.data?.length
    yield* Prompt.log.success(`Authenticated (${cred.type}) — ${count ?? "?"} models available on your plan`)
  }),
})

export const NserversCommand = cmd({
  command: "nservers",
  describe: "nServers Code account (login/logout/status)",
  builder: (yargs: Argv) => yargs.command(login).command(logout).command(status).demandCommand(),
  async handler() {},
})
