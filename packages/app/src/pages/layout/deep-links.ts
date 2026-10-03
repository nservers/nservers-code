export const deepLinkEvent = "nservers:deep-link"

const parseUrl = (input: string) => {
  // "opencode://" kept for links generated before the fork rebrand.
  if (!input.startsWith("nservers://") && !input.startsWith("opencode://")) return
  if (typeof URL.canParse === "function" && !URL.canParse(input)) return
  try {
    return new URL(input)
  } catch {
    return
  }
}

export const parseDeepLink = (input: string) => {
  const url = parseUrl(input)
  if (!url) return
  if (url.hostname !== "open-project") return
  const directory = url.searchParams.get("directory")
  if (!directory) return
  return directory
}

export const parseNewSessionDeepLink = (input: string) => {
  const url = parseUrl(input)
  if (!url) return
  if (url.hostname !== "new-session") return
  const directory = url.searchParams.get("directory")
  if (!directory) return
  const prompt = url.searchParams.get("prompt") || undefined
  if (!prompt) return { directory }
  return { directory, prompt }
}

export const collectOpenProjectDeepLinks = (urls: string[]) =>
  urls.map(parseDeepLink).filter((directory): directory is string => !!directory)

export const collectNewSessionDeepLinks = (urls: string[]) =>
  urls.map(parseNewSessionDeepLink).filter((link): link is { directory: string; prompt?: string } => !!link)

type NserversWindow = Window & {
  __NSERVERS__?: {
    deepLinks?: string[]
  }
}

export const drainPendingDeepLinks = (target: NserversWindow) => {
  const pending = target.__NSERVERS__?.deepLinks ?? []
  if (pending.length === 0) return []
  if (target.__NSERVERS__) target.__NSERVERS__.deepLinks = []
  return pending
}
