/**
 * Fetches OG metadata for all vault resources and caches them.
 * Run with: bun run vault:cache
 */

import { readFileSync, writeFileSync, existsSync } from "fs"
import { join } from "path"

const VAULT_PATH = join(process.cwd(), "content/vault/vault.json")
const CACHE_PATH = join(process.cwd(), "content/vault/vault-cache.json")

type OGData = {
  title: string
  description: string
  image: string | null
  logo: string | null
  url: string
}

type VaultCache = Record<string, OGData>

async function fetchOG(url: string): Promise<OGData> {
  const apiUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}`

  try {
    const res = await fetch(apiUrl)
    const data = await res.json()

    if (data.status === "success") {
      return {
        title: data.data.title || url,
        description: data.data.description || "",
        image: data.data.image?.url || null,
        logo: data.data.logo?.url || null,
        url,
      }
    }
  } catch (e) {
    console.error(`Failed to fetch OG for ${url}:`, e)
  }

  return {
    title: url,
    description: "",
    image: null,
    logo: null,
    url,
  }
}

async function main() {
  // Load vault
  const vault = JSON.parse(readFileSync(VAULT_PATH, "utf-8"))
  const urls: string[] = vault.resources.map((r: { url: string }) => r.url)

  // Load existing cache
  let cache: VaultCache = {}
  if (existsSync(CACHE_PATH)) {
    cache = JSON.parse(readFileSync(CACHE_PATH, "utf-8"))
  }

  // Find URLs that need fetching
  const uncached = urls.filter((url) => !cache[url])

  if (uncached.length === 0) {
    console.log("All URLs already cached!")
    return
  }

  console.log(`Fetching OG data for ${uncached.length} URLs...`)

  // Fetch with rate limiting (1 per second to be safe)
  for (const url of uncached) {
    console.log(`  → ${url}`)
    cache[url] = await fetchOG(url)
    await new Promise((r) => setTimeout(r, 1000))
  }

  // Save cache
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2))
  console.log(`\nCached ${uncached.length} URLs to ${CACHE_PATH}`)
}

main()
