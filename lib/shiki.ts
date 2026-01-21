import { cache } from "react"
import { codeToHtml, type BundledLanguage } from "shiki"

// React.cache() provides per-request deduplication (server-cache-react)
export const highlightCode = cache(async (code: string, lang: string) => {
  return codeToHtml(code, {
    lang: lang as BundledLanguage,
    theme: "vitesse-black",
  })
})
