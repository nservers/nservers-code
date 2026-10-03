// nServers fork: built-in provider preset.
// Baked into the global config as the base layer — user config still wins on conflicts
// (mergeConfig treats later sources as overrides), so a user's opencode.json can
// disable the provider entirely via `disabled_providers: ["nservers"]`.
import type { ConfigV1 } from "@opencode-ai/core/v1/config/config"

export const NSERVERS_GATEWAY_URL = process.env.NSERVERS_GATEWAY_URL ?? "https://ai-api.nservers.io"
export const NSERVERS_API_BASE = `${NSERVERS_GATEWAY_URL}/v1`
export const NSERVERS_DEVICE_URL = process.env.NSERVERS_DEVICE_URL ?? "https://nservers.app/device"
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
      // Keys públicos reais do catálogo (GET /v1/models). `nservers:router`
      // é o auto-route do plano; os demais são a allowlist dos planos code_*.
      models: {
        "nservers:router": {
          name: "nServers Router (Auto)",
          tool_call: true,
          temperature: true,
          attachment: true,
          reasoning: true,
          limit: { context: 1_050_000, output: 128_000 },
        },
        "openai:gpt-5.5": {
          name: "GPT-5.5",
          tool_call: true,
          temperature: true,
          attachment: true,
          reasoning: true,
          limit: { context: 1_050_000, output: 128_000 },
        },
        "openai:gpt-5.4-mini": {
          name: "GPT-5.4 Mini",
          tool_call: true,
          temperature: true,
          attachment: true,
          limit: { context: 256_000, output: 32_000 },
        },
        "gemini:gemini-3.5-flash": {
          name: "Gemini 3.5 Flash",
          tool_call: true,
          temperature: true,
          attachment: true,
          limit: { context: 1_000_000, output: 65_000 },
        },
        "qwen:qwen3-coder": {
          name: "Qwen3 Coder",
          tool_call: true,
          temperature: true,
          limit: { context: 256_000, output: 32_000 },
        },
        "deepseek:deepseek-v4-pro": {
          name: "DeepSeek V4 Pro",
          tool_call: true,
          temperature: true,
          reasoning: true,
          limit: { context: 256_000, output: 32_000 },
        },
      },
    },
  },
}
