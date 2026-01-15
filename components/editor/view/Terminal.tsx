"use client"

import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type Context as ReactContext } from "react"
import { useStore } from "zustand"
import { terminalStore, terminalActions, type TerminalActions } from "../../../lib/editor/view-models/terminal-vm"
import { IconTerminal2, IconLoader } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

// ============================================================================
// Compound Component Pattern - Root/Context
// ============================================================================

interface TerminalContextValue {
  store: typeof terminalStore
  actions: TerminalActions
  isReady: boolean
  output: string[]
}

const TerminalContext: ReactContext<TerminalContextValue | null> = createContext<TerminalContextValue | null>(null)

function useTerminalContext() {
  const context = useContext(TerminalContext)
  if (!context) {
    throw new Error("Terminal.* components must be used within Terminal.Root")
  }
  return context
}

// ============================================================================
// Root Component
// ============================================================================

interface TerminalRootProps {
  children: ReactNode
  className?: string
}

function TerminalRoot({ children, className }: TerminalRootProps) {
  const isReady = useStore(terminalStore, (state) => state.isReady)
  const output = useStore(terminalStore, (state) => state.output)

  const contextValue: TerminalContextValue = {
    store: terminalStore,
    actions: terminalActions,
    isReady,
    output,
  }

  return (
    <TerminalContext.Provider value={contextValue}>
      <div className={cn("terminal-root flex flex-col h-full bg-card border rounded-lg overflow-hidden", className)}>
        {children}
      </div>
    </TerminalContext.Provider>
  )
}

// ============================================================================
// Panel Component - Main terminal display
// ============================================================================

interface TerminalPanelProps {
  className?: string
}

function TerminalPanel({ className }: TerminalPanelProps) {
  const { actions, isReady } = useTerminalContext()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    let term: InstanceType<typeof import("@xterm/xterm").Terminal> | null = null

    const initTerminal = async () => {
      const [{ Terminal }, { FitAddon }] = await Promise.all([
        import("@xterm/xterm"),
        import("@xterm/addon-fit"),
      ])

      term = new Terminal({
        convertEol: true,
        theme: {
          background: "#1a1a1a",
          foreground: "#ffffff",
          cursor: "#ffffff",
        },
        fontSize: 14,
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        cursorBlink: true,
      })

      const fitAddon = new FitAddon()
      term.loadAddon(fitAddon)
      term.open(containerRef.current!)
      fitAddon.fit()

      actions.resize({ cols: 80, rows: 24 })

      // Write welcome message
      term.clear()
      term.write("Welcome to Terminal\n")
      term.write("$ ")
    }

    initTerminal()

    return () => {
      term?.dispose()
    }
  }, [actions])

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current
        const cols = Math.floor(clientWidth / 8)
        const rows = Math.floor(clientHeight / 16)
        actions.resize({ cols, rows })
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [actions])

  if (!isReady) {
    return (
      <div className={cn("flex items-center justify-center h-full bg-muted/30", className)}>
        <IconLoader className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className={cn("flex-1 overflow-hidden relative", className)}>
      <div
        ref={containerRef}
        className="w-full h-full p-2 bg-[#1a1a1a] resize-none focus:outline-none"
      />
    </div>
  )
}

// ============================================================================
// Header Component
// ============================================================================

interface TerminalHeaderProps {
  className?: string
}

function TerminalHeader({ className }: TerminalHeaderProps) {
  const { store } = useTerminalContext()

  return (
    <div className={cn("flex items-center gap-2 px-3 py-1.5 border-b bg-muted/30", className)}>
      <IconTerminal2 className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm font-medium">Terminal</span>
    </div>
  )
}

// ============================================================================
// Status Component
// ============================================================================

interface TerminalStatusProps {
  className?: string
}

function TerminalStatus({ className }: TerminalStatusProps) {
  const { isReady } = useTerminalContext()

  return (
    <div className={cn("flex items-center gap-2 px-3 py-1 border-t bg-muted/30 text-xs", className)}>
      <span
        className={cn(
          "w-2 h-2 rounded-full",
          isReady ? "bg-green-500" : "bg-yellow-500 animate-pulse"
        )}
      />
      <span className="text-muted-foreground">
        {isReady ? "Ready" : "Initializing..."}
      </span>
    </div>
  )
}

// ============================================================================
// Compound Component Export
// ============================================================================

export const Terminal = {
  Root: TerminalRoot,
  Panel: TerminalPanel,
  Header: TerminalHeader,
  Status: TerminalStatus,
}

// ============================================================================
// Convenience Hooks
// ============================================================================

export function useTerminalActions() {
  return useTerminalContext().actions
}

export function useTerminalOutput() {
  return useTerminalContext().output
}

export function useTerminalReady() {
  return useTerminalContext().isReady
}
