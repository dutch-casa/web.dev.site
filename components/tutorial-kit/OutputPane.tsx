"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { IconTerminal2, IconEye, IconRefresh, IconExternalLink, IconLoader2 } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import {
  useTutorialTerminal,
  useTutorialPreviewUrl,
  useTutorialServerState,
  useTutorialPanels,
  useTutorialActions,
} from "@/lib/tutorial-kit/context"

// ============================================================================
// Terminal Tab
// ============================================================================

function TerminalTab() {
  const terminal = useTutorialTerminal()
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [terminal.lines])

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto p-3 font-mono text-sm bg-[#1a1a1a] text-gray-100"
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
      {terminal.isRunning && (
        <div className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1" />
      )}
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
      <div className="flex-1 flex flex-col items-center justify-center gap-2 text-muted-foreground bg-white">
        <IconLoader2 className="w-6 h-6 animate-spin" />
        <span className="text-sm">Starting dev server...</span>
      </div>
    )
  }

  if (serverState.status === "error") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 text-destructive bg-white">
        <span className="text-sm">Server error: {serverState.error.message}</span>
      </div>
    )
  }

  if (!previewUrl) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 text-muted-foreground bg-white">
        <IconEye className="w-6 h-6 opacity-50" />
        <span className="text-sm">Run the app to see the preview</span>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Preview toolbar */}
      <div className="flex items-center gap-2 px-2 py-1 border-b bg-muted/20">
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
      <div className="flex-1 bg-white">
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
  const [activeTab, setActiveTab] = useState<"terminal" | "preview">("preview")

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
        className={cn("flex flex-col", className)}
      >
        {/* Tab headers */}
        <div className="flex items-center border-b bg-muted/20">
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
        {effectiveTab === "terminal" ? <TerminalTab /> : <PreviewTab />}
      </ResizablePanel>
    </>
  )
}
