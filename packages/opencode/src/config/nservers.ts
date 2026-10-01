// nServers fork: built-in provider preset.
// Baked into the global config as the base layer — user config still wins on conflicts
// (mergeConfig treats later sources as overrides), so a user's opencode.json can
// disable the provider entirely via `disabled_providers: ["nservers"]`.
import type { ConfigV1 } from "@opencode-ai/core/v1/config/config"

export const NSERVERS_GATEWAY_URL = "https://ai-api.nservers.io"
export const NSERVERS_API_BASE = `${NSERVERS_GATEWAY_URL}/v1`
export const NSERVERS_DEVICE_URL = "https://nservers.app/device"
export const NSERVERS_CLIENT_NAME = "nservers-code"

export const NSERVERS_PRESET: ConfigV1.Info = {
  provider: {
    nservers: {
      npm: "@ai-sdk/openai-compatible",
      name: "nServers Code",
      options: {
        baseURL: NSERVERS_API_BASE,
        apiKey: "{env:NSERVERS_API_KEY}",
        headers: {
          "x-client-name": NSERVERS_CLIENT_NAME,
        },
      },
      models: {
        "code-standard": {
          name: "nServers Code Standard",
          tool_call: true,
          temperature: true,
          attachment: true,
          limit: { context: 256_000, output: 32_000 },
        },
        "code-premium": {
          name: "nServers Code Premium",
          tool_call: true,
          temperature: true,
          attachment: true,
          reasoning: true,
          limit: { context: 256_000, output: 64_000 },
        },
      },
    },
  },
}
