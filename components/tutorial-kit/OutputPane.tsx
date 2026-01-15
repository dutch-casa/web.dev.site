"use client"

import { useEffect, useRef, useState, useCallback, type KeyboardEvent } from "react"
import {
  IconTerminal2,
  IconEye,
  IconRefresh,
  IconExternalLink,
  IconLoader2,
  IconPlayerPlay,
  IconPlayerStop,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import {
  useTutorialTerminal,
  useTutorialPreviewUrl,
  useTutorialServerState,
  useTutorialPanels,
  useTutorialActions,
  useTutorialIsReady,
  useTutorialIsLoading,
} from "@/lib/tutorial-kit/context"
import { useTutorialKitContext } from "./TutorialKit"
import { spawn } from "@/lib/editor/services/webcontainer"

// ============================================================================
// Terminal Tab
// ============================================================================

interface TerminalTabProps {
  onRun?: () => void
  onStop?: () => void
}

function TerminalTab({ onRun, onStop }: TerminalTabProps) {
  const terminal = useTutorialTerminal()
  const serverState = useTutorialServerState()
  const isReady = useTutorialIsReady()
  const isLoading = useTutorialIsLoading()
  const actions = useTutorialActions()
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const isServerRunning = serverState.status === "starting" || serverState.status === "ready"

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [terminal.lines])

  // Focus input when terminal becomes ready
  useEffect(() => {
    if (isReady && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isReady])

  const runCommand = useCallback(async (cmd: string) => {
    if (!cmd.trim()) return

    const trimmed = cmd.trim()
    setCommandHistory((prev) => [...prev, trimmed])
    setHistoryIndex(-1)
    setInputValue("")

    actions.appendTerminal({ text: `$ ${trimmed}\n`, stream: "stdout" })

    try {
      const [command, ...args] = trimmed.split(" ")
      const process = await spawn(command, args)

      const reader = process.output.getReader()
      const readOutput = async () => {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          actions.appendTerminal({ text: value, stream: "stdout" })
        }
      }
      readOutput()

      const exitCode = await process.exit
      if (exitCode !== 0) {
        actions.appendTerminal({ text: `\nProcess exited with code ${exitCode}\n`, stream: "stderr" })
      }
    } catch (err) {
      actions.appendTerminal({
        text: `Error: ${err instanceof Error ? err.message : String(err)}\n`,
        stream: "stderr",
      })
    }
  }, [actions])

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runCommand(inputValue)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex
        setHistoryIndex(newIndex)
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex] ?? "")
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex] ?? "")
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInputValue("")
      }
    }
  }, [inputValue, commandHistory, historyIndex, runCommand])

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a] overflow-hidden">
      {/* Terminal toolbar */}
      <div className="shrink-0 flex items-center gap-2 px-2 py-1 border-b border-gray-700 bg-[#252525]">
        {isServerRunning ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 gap-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-900/30"
            onClick={onStop}
          >
            <IconPlayerStop className="w-3.5 h-3.5" />
            Stop
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 gap-1 text-xs text-green-400 hover:text-green-300 hover:bg-green-900/30"
            onClick={onRun}
            disabled={!isReady || isLoading}
          >
            <IconPlayerPlay className="w-3.5 h-3.5" />
            Run
          </Button>
        )}
        <div className="flex-1" />
        <span className="text-xs text-gray-500">
          {isLoading && "Loading..."}
          {isReady && !isServerRunning && "Ready"}
          {isServerRunning && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Running
            </span>
          )}
        </span>
      </div>

      {/* Terminal output */}
      <div
        ref={containerRef}
        className="flex-1 min-h-0 overflow-auto p-3 font-mono text-sm text-gray-100"
        onClick={() => inputRef.current?.focus()}
      >
        {terminal.lines.length === 0 ? (
          <div className="text-gray-500">
            <span className="text-green-400">$</span> Waiting for command...
          </div>
        ) : (
          terminal.lines.map((line) => (
            <div
              key={line.id}
              className={cn(
                "whitespace-pre-wrap break-all",
                line.stream === "stderr" && "text-red-400"
              )}
            >
              {line.text}
            </div>
          ))
        )}
      </div>

      {/* Command input */}
      <div className="shrink-0 flex items-center gap-2 px-3 py-2 border-t border-gray-700 bg-[#252525]">
        <span className="text-green-400 font-mono text-sm">$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!isReady}
          placeholder={isReady ? "Type a command..." : "Waiting..."}
          className={cn(
            "flex-1 bg-transparent text-gray-100 font-mono text-sm",
            "placeholder:text-gray-600 outline-none",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        />
      </div>
    </div>
  )
}

// ============================================================================
// Preview Tab
// ============================================================================

function PreviewTab() {
  const previewUrl = useTutorialPreviewUrl()
  const serverState = useTutorialServerState()
  const [iframeKey, setIframeKey] = useState(0)

  const handleRefresh = useCallback(() => {
    setIframeKey((k) => k + 1)
  }, [])

  const handleOpenExternal = useCallback(() => {
    if (previewUrl) {
      window.open(previewUrl, "_blank")
    }
  }, [previewUrl])

  if (serverState.status === "starting") {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground bg-white">
        <IconLoader2 className="w-6 h-6 animate-spin" />
        <span className="text-sm">Starting dev server...</span>
      </div>
    )
  }

  if (serverState.status === "error") {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2 text-destructive bg-white">
        <span className="text-sm">Server error: {serverState.error.message}</span>
      </div>
    )
  }

  if (!previewUrl) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground bg-white">
        <IconEye className="w-6 h-6 opacity-50" />
        <span className="text-sm">Run the app to see the preview</span>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Preview toolbar */}
      <div className="shrink-0 flex items-center gap-2 px-2 py-1 border-b bg-muted/20">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={handleRefresh}
          title="Refresh preview"
        >
          <IconRefresh className="w-3.5 h-3.5" />
        </Button>
        <div className="flex-1 px-2 py-0.5 text-xs text-muted-foreground truncate bg-muted/30 rounded">
          {previewUrl}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={handleOpenExternal}
          title="Open in new tab"
        >
          <IconExternalLink className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* iframe */}
      <div className="flex-1 min-h-0 bg-white">
        <iframe
          key={iframeKey}
          src={previewUrl}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          title="Preview"
        />
      </div>
    </div>
  )
}

// ============================================================================
// OutputPane Component (Terminal + Preview tabs)
// ============================================================================

interface OutputPaneProps {
  className?: string
  defaultSize?: number
  minSize?: number
}

export function OutputPane({
  className,
  defaultSize = 30,
  minSize = 20,
}: OutputPaneProps) {
  const panels = useTutorialPanels()
  const { onRun, onStop } = useTutorialKitContext()
  const [activeTab, setActiveTab] = useState<"terminal" | "preview">("terminal")

  // Hide if both terminal and preview are disabled
  if (!panels.terminal && !panels.preview) return null

  // Auto-select the visible tab
  const effectiveTab =
    activeTab === "terminal" && !panels.terminal
      ? "preview"
      : activeTab === "preview" && !panels.preview
        ? "terminal"
        : activeTab

  return (
    <>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={defaultSize}
        minSize={minSize}
        className={cn("flex flex-col overflow-hidden", className)}
      >
        {/* Tab headers */}
        <div className="shrink-0 flex items-center border-b bg-muted/20">
          {panels.terminal && (
            <button
              onClick={() => setActiveTab("terminal")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors",
                effectiveTab === "terminal"
                  ? "bg-background text-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <IconTerminal2 className="w-4 h-4" />
              Terminal
            </button>
          )}
          {panels.preview && (
            <button
              onClick={() => setActiveTab("preview")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors",
                effectiveTab === "preview"
                  ? "bg-background text-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <IconEye className="w-4 h-4" />
              Preview
            </button>
          )}
        </div>

        {/* Tab content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {effectiveTab === "terminal" ? (
            <TerminalTab onRun={onRun} onStop={onStop} />
          ) : (
            <PreviewTab />
          )}
        </div>
      </ResizablePanel>
    </>
  )
}
