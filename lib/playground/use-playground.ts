"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { playgroundFacade, filesToTree, type PlaygroundStatus } from "./facade"
import type { FileSystemTree } from "@webcontainer/api"

/**
 * Playground state machine states
 */
export type PlaygroundState =
  | { status: "idle" }
  | { status: "booting" }
  | { status: "mounting" }
  | { status: "installing"; progress: number }
  | { status: "starting" }
  | { status: "running"; previewUrl: string }
  | { status: "error"; message: string }

export type PlaygroundConfig = {
  files: Record<string, string>
  startCommand?: string
  autoStart?: boolean
}

export type UsePlaygroundReturn = {
  state: PlaygroundState
  terminalOutput: string[]
  start: () => Promise<void>
  writeFile: (path: string, content: string) => Promise<void>
  reset: () => void
}

/**
 * Hook for managing WebContainer playground state
 *
 * @param config - Playground configuration with files and optional start command
 * @returns Playground state and controls
 *
 * @example
 * ```tsx
 * const { state, terminalOutput, start } = usePlayground({
 *   files: {
 *     "package.json": JSON.stringify({ name: "demo", scripts: { dev: "vite" } }),
 *     "index.html": "<h1>Hello</h1>",
 *   },
 *   autoStart: true,
 * })
 * ```
 */
export function usePlayground(config: PlaygroundConfig): UsePlaygroundReturn {
  const [state, setState] = useState<PlaygroundState>({ status: "idle" })
  const [terminalOutput, setTerminalOutput] = useState<string[]>([])
  const startedRef = useRef(false)
  const configRef = useRef(config)

  // Keep config ref updated
  configRef.current = config

  // Subscribe to facade status updates
  useEffect(() => {
    const unsubscribe = playgroundFacade.subscribe((status: PlaygroundStatus) => {
      setTerminalOutput(status.terminalOutput)
    })
    return unsubscribe
  }, [])

  const start = useCallback(async () => {
    if (state.status !== "idle" && state.status !== "error") {
      return
    }

    try {
      // Boot
      setState({ status: "booting" })
      await playgroundFacade.boot()

      // Mount files
      setState({ status: "mounting" })
      const tree = filesToTree(configRef.current.files)
      await playgroundFacade.mountFiles(tree)

      // Install dependencies (if package.json exists)
      if (configRef.current.files["package.json"]) {
        setState({ status: "installing", progress: 0 })
        await playgroundFacade.install()
      }

      // Start server
      setState({ status: "starting" })
      const url = await playgroundFacade.startServer(
        configRef.current.startCommand ?? "npm run dev"
      )

      setState({ status: "running", previewUrl: url })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      setState({ status: "error", message })
    }
  }, [state.status])

  const writeFile = useCallback(async (path: string, content: string) => {
    await playgroundFacade.writeFile(path, content)
  }, [])

  const reset = useCallback(() => {
    playgroundFacade.reset()
    setState({ status: "idle" })
    setTerminalOutput([])
    startedRef.current = false
  }, [])

  // Auto-start if configured
  useEffect(() => {
    if (config.autoStart && !startedRef.current && state.status === "idle") {
      startedRef.current = true
      start()
    }
  }, [config.autoStart, start, state.status])

  return {
    state,
    terminalOutput,
    start,
    writeFile,
    reset,
  }
}

/**
 * Get a human-readable label for the current state
 */
export function getStateLabel(state: PlaygroundState): string {
  switch (state.status) {
    case "idle":
      return "Ready to start"
    case "booting":
      return "Starting WebContainer..."
    case "mounting":
      return "Mounting files..."
    case "installing":
      return "Installing dependencies..."
    case "starting":
      return "Starting dev server..."
    case "running":
      return "Running"
    case "error":
      return `Error: ${state.message}`
  }
}

/**
 * Check if the playground is in a loading state
 */
export function isLoading(state: PlaygroundState): boolean {
  return (
    state.status === "booting" ||
    state.status === "mounting" ||
    state.status === "installing" ||
    state.status === "starting"
  )
}
