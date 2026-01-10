"use client"

import { createHighlighter, type Highlighter } from "shiki"

type CodeColorTheme = "vitesse-dark" | "github-dark" | "dracula"

const themeCache = new Map<CodeColorTheme, Highlighter>()
const loadingPromises = new Map<CodeColorTheme, Promise<Highlighter>>()

async function getHighlighterWithCache(theme: CodeColorTheme = "vitesse-dark"): Promise<Highlighter> {
  if (themeCache.has(theme)) {
    return themeCache.get(theme)!
  }

  if (loadingPromises.has(theme)) {
    return loadingPromises.get(theme)!
  }

  const promise = createHighlighter({
    themes: [theme],
    langs: [
      "typescript",
      "javascript",
      "tsx",
      "jsx",
      "html",
      "css",
      "json",
      "python",
      "rust",
      "go",
      "bash",
      "markdown",
    ],
  }).then((highlighter) => {
    themeCache.set(theme, highlighter)
    loadingPromises.delete(theme)
    return highlighter
  })

  loadingPromises.set(theme, promise)
  return promise
}

export async function highlightCode(
  code: string,
  lang: string = "typescript",
  theme: CodeColorTheme = "vitesse-dark"
): Promise<string> {
  try {
    const highlighter = await getHighlighterWithCache(theme)
    const normalizedLang = normalizeLanguage(lang)

    const availableLangs = highlighter.getLoadedLanguages()
    if (!availableLangs.includes(normalizedLang as any)) {
      return highlighter.codeToHtml(code, { lang: "text", theme })
    }

    return highlighter.codeToHtml(code, { lang: normalizedLang, theme })
  } catch {
    return `<pre class="shiki-fallback"><code>${escapeHtml(code)}</code></pre>`
  }
}

function normalizeLanguage(lang: string): string {
  const mapping: Record<string, string> = {
    ts: "typescript",
    js: "javascript",
    tsx: "tsx",
    jsx: "jsx",
    py: "python",
    rs: "rust",
    sh: "bash",
    md: "markdown",
  }
  return mapping[lang.toLowerCase()] || lang.toLowerCase()
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export function getFileExtension(filename: string): string {
  const parts = filename.split(".")
  if (parts.length === 1) return ""
  return parts[parts.length - 1].toLowerCase()
}

export function getLanguageFromFilename(filename: string): string {
  const ext = getFileExtension(filename)
  const mapping: Record<string, string> = {
    ts: "typescript",
    tsx: "tsx",
    js: "javascript",
    jsx: "jsx",
    html: "html",
    htm: "html",
    css: "css",
    scss: "scss",
    less: "less",
    json: "json",
    md: "markdown",
    py: "python",
    rs: "rust",
    go: "go",
    sh: "bash",
    bash: "bash",
    zsh: "bash",
    vue: "vue",
    svelte: "svelte",
  }
  return mapping[ext] || "text"
}
