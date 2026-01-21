"use client"

import { useEffect, useState, useCallback } from "react"
import mermaid from "mermaid"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

// Fix circular JSON error caused by React fibers on DOM elements
// https://github.com/mermaid-js/mermaid/issues/5530
if (typeof window !== "undefined") {
  (HTMLElement.prototype as unknown as { toJSON: () => string }).toJSON = () => ""
}

type MermaidProps = {
  chart: string
  className?: string
}

let elkRegistered = false

async function registerElk() {
  if (elkRegistered) return
  try {
    const elkLayouts = await import("@mermaid-js/layout-elk")
    mermaid.registerLayoutLoaders(elkLayouts.default)
    elkRegistered = true
  } catch (err) {
    console.warn("ELK layouts not available:", err)
  }
}

function initMermaid(theme: "dark" | "default") {
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose" as const,
    fontFamily: "var(--font-sans)",
    theme,
    layout: "elk",
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
    },
  })
}

export function MermaidDiagram({ chart, className }: MermaidProps) {
  const [svg, setSvg] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { resolvedTheme } = useTheme()

  const renderChart = useCallback(async () => {
    if (!chart) return

    setIsLoading(true)
    setError(null)

    try {
      // Always register ELK (default layout)
      await registerElk()

      const theme = resolvedTheme === "dark" ? "dark" : "default"
      initMermaid(theme)

      const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`
      const { svg: renderedSvg } = await mermaid.render(id, chart)

      const fixedSvg = renderedSvg.replace(/<br\s*>/gi, "<br/>")
      setSvg(fixedSvg)
    } catch (err) {
      console.error("Mermaid render error:", err)
      setError(err instanceof Error ? err.message : "Failed to render diagram")
    } finally {
      setIsLoading(false)
    }
  }, [chart, resolvedTheme])

  useEffect(() => {
    renderChart()
  }, [renderChart])

  return (
    <div
      className={cn(
        "relative my-6 min-h-[200px] w-full overflow-hidden rounded-xl border border-white/10 bg-muted/50",
        className
      )}
      role="img"
      aria-label="Mermaid diagram"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="flex min-h-[200px] items-center justify-center p-4 text-center">
          <div>
            <p className="text-sm font-medium text-destructive">Failed to render diagram</p>
            <p className="mt-1 text-xs text-muted-foreground">{error}</p>
          </div>
        </div>
      )}

      {!isLoading && !error && svg && (
        <div
          className="flex h-full w-full items-center justify-center p-4 [&_svg]:max-h-[600px] [&_svg]:w-auto [&_svg]:object-contain"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
    </div>
  )
}
