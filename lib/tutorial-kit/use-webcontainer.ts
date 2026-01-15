"use client"

import { useEffect, useRef, useCallback } from "react"
import type { WebContainer, WebContainerProcess } from "@webcontainer/api"
import {
  bootWebContainer,
  mountFiles,
  writeFile,
  onFileChange,
  spawn,
} from "@/lib/editor/services/webcontainer"
import type { ExerciseConfig, BootState, ServerState } from "./types"
import { useTutorialActions, useTutorialFiles, useTutorialBootState } from "./context"

// ----------------------------------------------------------------------------
// WebContainer Orchestration Hook
// ----------------------------------------------------------------------------

interface UseWebContainerOptions {
  config: ExerciseConfig | null
  onServerReady?: (url: string, port: number) => void
  onError?: (error: Error) => void
}

interface UseWebContainerReturn {
  boot: () => Promise<void>
  run: () => Promise<void>
  stop: () => void
  writeFileToContainer: (path: string, content: string) => Promise<void>
}

export function useWebContainer({
  config,
  onServerReady,
  onError,
}: UseWebContainerOptions): UseWebContainerReturn {
  const actions = useTutorialActions()
  const files = useTutorialFiles()
  const bootState = useTutorialBootState()

  const containerRef = useRef<WebContainer | null>(null)
  const processRef = useRef<WebContainerProcess | null>(null)
  const unsubscribeRef = useRef<(() => void) | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unsubscribeRef.current?.()
      processRef.current?.kill()
    }
  }, [])

  // Boot WebContainer
  const boot = useCallback(async () => {
    if (bootState.status !== "idle") return
    if (!config) return

    try {
      actions.setBootState({ status: "booting" })

      // Boot container (use consistent workdir - singleton is shared across exercises)
      const container = await bootWebContainer({ workdirName: "project" })
      containerRef.current = container

      // Subscribe to file changes from container
      unsubscribeRef.current = onFileChange((event) => {
        // Sync container changes back to store (if needed)
        // For now, we only sync editor -> container, not reverse
      })

      actions.setBootState({ status: "mounting" })

      // Mount initial files
      await mountFiles(files)

      // Install dependencies if needed
      if (config.dependencies && Object.keys(config.dependencies).length > 0) {
        actions.setBootState({ status: "installing" })
        actions.appendTerminal({ text: "$ npm install", stream: "stdout" })
        actions.setTerminalRunning(true)

        const installProcess = await spawn("npm", ["install"])

        // Stream install output (WebContainer output is already string)
        const reader = installProcess.output.getReader()

        const readOutput = async () => {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            actions.appendTerminal({ text: value, stream: "stdout" })
          }
        }

        readOutput()

        const exitCode = await installProcess.exit
        actions.setTerminalRunning(false)

        if (exitCode !== 0) {
          throw new Error(`npm install failed with exit code ${exitCode}`)
        }

        actions.appendTerminal({ text: "\nDependencies installed successfully.\n", stream: "stdout" })
      }

      actions.setBootState({ status: "ready" })
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      actions.setBootState({ status: "error", error: err })
      onError?.(err)
    }
  }, [config, files, bootState.status, actions, onError])

  // Run dev server
  const run = useCallback(async () => {
    if (bootState.status !== "ready") return
    if (!config) return

    const devCommand = config.devCommand ?? "npm run dev"
    const [cmd, ...args] = devCommand.split(" ")

    try {
      actions.setServerState({ status: "starting" })
      actions.clearTerminal()
      actions.appendTerminal({ text: `$ ${devCommand}`, stream: "stdout" })
      actions.setTerminalRunning(true)

      // Kill existing process if any
      processRef.current?.kill()

      const process = await spawn(cmd, args)
      processRef.current = process

      // Stream output (WebContainer output is already string)
      const reader = process.output.getReader()

      const readOutput = async () => {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          actions.appendTerminal({ text: value, stream: "stdout" })

          // Detect server ready
          // Common patterns: "Local:", "localhost:", "127.0.0.1:"
          const portMatch = value.match(/(?:Local|localhost|127\.0\.0\.1)[:\s]+(?:http:\/\/)?(?:localhost|127\.0\.0\.1):(\d+)/i)
          if (portMatch) {
            const port = parseInt(portMatch[1], 10)
            const container = containerRef.current
            if (container) {
              // Wait for server URL from WebContainer
              container.on("server-ready", (serverPort, url) => {
                if (serverPort === port || !portMatch) {
                  actions.setServerState({ status: "ready", url, port: serverPort })
                  onServerReady?.(url, serverPort)
                }
              })
            }
          }
        }
      }

      readOutput()

      // Also listen for server-ready event directly
      const container = containerRef.current
      if (container) {
        container.on("server-ready", (port, url) => {
          actions.setServerState({ status: "ready", url, port })
          onServerReady?.(url, port)
        })
      }

      // Handle process exit
      process.exit.then((code) => {
        actions.setTerminalRunning(false)
        if (code !== 0) {
          actions.appendTerminal({
            text: `\nProcess exited with code ${code}`,
            stream: "stderr",
          })
        }
      })
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      actions.setServerState({ status: "error", error: err })
      actions.setTerminalRunning(false)
      onError?.(err)
    }
  }, [config, bootState.status, actions, onServerReady, onError])

  // Stop dev server
  const stop = useCallback(() => {
    processRef.current?.kill()
    processRef.current = null
    actions.setServerState({ status: "idle" })
    actions.setTerminalRunning(false)
  }, [actions])

  // Write file to container (used when editor content changes)
  const writeFileToContainer = useCallback(
    async (path: string, content: string) => {
      if (bootState.status !== "ready") return
      await writeFile(path, content)
    },
    [bootState.status]
  )

  return { boot, run, stop, writeFileToContainer }
}

// ----------------------------------------------------------------------------
// Auto-boot Hook (convenience wrapper)
// ----------------------------------------------------------------------------

interface UseAutoBootOptions extends UseWebContainerOptions {
  autoRun?: boolean
}

export function useAutoBootWebContainer({
  config,
  autoRun = false,
  onServerReady,
  onError,
}: UseAutoBootOptions) {
  const { boot, run, stop, writeFileToContainer } = useWebContainer({
    config,
    onServerReady,
    onError,
  })
  const bootState = useTutorialBootState()

  // Auto-boot when config is loaded and component is expanded
  useEffect(() => {
    if (config && bootState.status === "idle") {
      boot()
    }
  }, [config, bootState.status, boot])

  // Auto-run when boot is ready
  useEffect(() => {
    if (autoRun && bootState.status === "ready") {
      run()
    }
  }, [autoRun, bootState.status, run])

  return { boot, run, stop, writeFileToContainer }
}
