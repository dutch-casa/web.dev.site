"use client"

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type Context as ReactContext,
} from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "motion/react"
import {
  IconCode,
  IconPlayerPlay,
  IconRefresh,
  IconChevronDown,
  IconChevronUp,
  IconLoader2,
  IconAlertCircle,
  IconCheck,
  IconX,
  IconTerminal2,
  IconEye,
  IconFolder,
  IconBulb,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { TutorialProvider } from "@/lib/tutorial-kit/context"
import { useSettings } from "@/lib/tutorial-kit/settings"
import {
  useTutorialExpanded,
  useTutorialActions,
  useTutorialConfig,
  useTutorialBootState,
  useTutorialServerState,
  useTutorialIsLoading,
  useTutorialIsReady,
  useTutorialError,
  useTutorialPanels,
  useTutorialPreviewUrl,
  useTutorialActiveFile,
  useTutorialFilePaths,
  useTutorialFiles,
  useTutorialTerminal,
  useTutorialActiveFileContent,
  useTutorialShowingSolution,
  useTutorialHasSolution,
} from "@/lib/tutorial-kit/context"
import { useAutoBootWebContainer } from "@/lib/tutorial-kit/use-webcontainer"
import { SettingsPopover } from "./SettingsPopover"
import type { ExerciseConfig, ExerciseFile } from "@/lib/tutorial-kit/types"

// ============================================================================
// Context for compound component communication
// ============================================================================

interface TutorialKitContextValue {
  config: ExerciseConfig | null
  onRun: () => void
  onStop: () => void
  onReset: () => void
  onFileChange: (path: string, content: string) => void
}

const TutorialKitContext: ReactContext<TutorialKitContextValue | null> =
  createContext<TutorialKitContextValue | null>(null)

export function useTutorialKitContext() {
  const ctx = useContext(TutorialKitContext)
  if (!ctx) {
    throw new Error("TutorialKit.* components must be used within TutorialKit.Root")
  }
  return ctx
}

// ============================================================================
// Root Component
// ============================================================================

interface RootProps {
  children: ReactNode
  config: ExerciseConfig
  className?: string
  defaultExpanded?: boolean
}

function Root({ children, config, className, defaultExpanded = false }: RootProps) {
  // Convert config files to flat file map
  const initialFiles = useMemo(() => {
    const files: Record<string, string> = {}
    for (const file of config.files) {
      if (file.content.kind === "inline") {
        files[file.path] = file.content.content
      }
    }
    return files
  }, [config])

  return (
    <TutorialProvider
      initialState={{
        config,
        files: initialFiles,
        expanded: defaultExpanded,
        editor: {
          activeFile: config.focus ?? config.files[0]?.path ?? null,
          openFiles: config.focus ? [config.focus] : config.files[0] ? [config.files[0].path] : [],
          dirty: new Set(),
          scrollPositions: {},
        },
      }}
    >
      <TutorialKitInner config={config} className={className}>
        {children}
      </TutorialKitInner>
    </TutorialProvider>
  )
}

interface TutorialKitInnerProps {
  children: ReactNode
  config: ExerciseConfig
  className?: string
}

const DEBOUNCE_MS = 300

function TutorialKitInner({ children, config, className }: TutorialKitInnerProps) {
  const actions = useTutorialActions()
  const files = useTutorialFiles()
  const expanded = useTutorialExpanded()

  const { run, stop, writeFileToContainer } = useAutoBootWebContainer({
    config: expanded ? config : null,
    autoRun: true,
  })

  // Debounced write to WebContainer
  const pendingWritesRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const debouncedWrite = useCallback(
    (path: string, content: string) => {
      // Clear existing timeout for this path
      const existing = pendingWritesRef.current.get(path)
      if (existing) clearTimeout(existing)

      // Schedule new write
      const timeout = setTimeout(() => {
        pendingWritesRef.current.delete(path)
        writeFileToContainer(path, content)
        actions.markClean(path)
      }, DEBOUNCE_MS)

      pendingWritesRef.current.set(path, timeout)
    },
    [writeFileToContainer, actions]
  )

  // Cleanup pending writes on unmount
  useEffect(() => {
    return () => {
      pendingWritesRef.current.forEach((timeout) => clearTimeout(timeout))
    }
  }, [])

  const handleFileChange = useCallback(
    (path: string, content: string) => {
      // Update local state immediately (responsive UI)
      actions.updateFile(path, content)
      actions.markDirty(path)
      // Debounce write to WebContainer (triggers HMR)
      debouncedWrite(path, content)
    },
    [actions, debouncedWrite]
  )

  const handleReset = useCallback(() => {
    // Reset to original config files
    const files: Record<string, string> = {}
    for (const file of config.files) {
      if (file.content.kind === "inline") {
        files[file.path] = file.content.content
      }
    }
    actions.setFiles(files)
    actions.reset()
  }, [config, actions])

  const contextValue: TutorialKitContextValue = {
    config,
    onRun: run,
    onStop: stop,
    onReset: handleReset,
    onFileChange: handleFileChange,
  }

  return (
    <TutorialKitContext.Provider value={contextValue}>
      <div
        className={cn(
          "tutorial-kit rounded-xl border bg-card overflow-hidden",
          "transition-all duration-300 ease-out",
          className
        )}
      >
        {children}
      </div>
    </TutorialKitContext.Provider>
  )
}

// ============================================================================
// Collapsed Preview (Shows when tutorial is not expanded)
// ============================================================================

interface CollapsedProps {
  children?: ReactNode
  className?: string
}

function Collapsed({ children, className }: CollapsedProps) {
  const expanded = useTutorialExpanded()
  const actions = useTutorialActions()
  const config = useTutorialConfig()

  if (expanded) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={cn("p-4", className)}
    >
      <button
        onClick={() => actions.setExpanded(true)}
        className={cn(
          "w-full group flex items-center justify-between",
          "p-4 rounded-lg border border-dashed border-muted-foreground/30",
          "hover:border-primary/50 hover:bg-primary/5",
          "transition-all duration-200"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <IconCode className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="font-medium text-foreground">{config?.title ?? "Interactive Exercise"}</h4>
            {config?.description && (
              <p className="text-sm text-muted-foreground mt-0.5">{config.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-primary transition-colors">
          <span>Try it yourself</span>
          <IconChevronDown className="w-4 h-4" />
        </div>
      </button>
      {children}
    </motion.div>
  )
}

// ============================================================================
// Expanded Workspace (Fullscreen portal when expanded)
// ============================================================================

interface ExpandedProps {
  children?: ReactNode
  className?: string
  height?: string | number // Kept for API compatibility, ignored in fullscreen mode
}

function Expanded({ children, className }: ExpandedProps) {
  const expanded = useTutorialExpanded()
  const actions = useTutorialActions()
  const [mounted, setMounted] = useState(false)
  const { vimMode } = useSettings()

  // Client-side only portal
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle escape key to close (but not when vim mode is active in editor)
  useEffect(() => {
    if (!expanded) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        // Don't close if vim mode is enabled and focus is in the editor
        // Vim needs escape to return to normal mode
        const target = e.target as HTMLElement
        const isInEditor = target.closest(".monaco-editor") !== null

        if (vimMode && isInEditor) {
          // Let vim handle the escape key
          return
        }

        actions.setExpanded(false)
      }
    }

    // Prevent body scroll when fullscreen
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [expanded, actions, vimMode])

  if (!expanded || !mounted) return null

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "fixed inset-0 z-50 flex flex-col bg-background",
          className
        )}
      >
        {children}
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}

// ============================================================================
// Toolbar
// ============================================================================

interface ToolbarProps {
  className?: string
}

function Toolbar({ className }: ToolbarProps) {
  const { onRun, onStop, onReset, config } = useTutorialKitContext()
  const actions = useTutorialActions()
  const bootState = useTutorialBootState()
  const serverState = useTutorialServerState()
  const isLoading = useTutorialIsLoading()
  const isReady = useTutorialIsReady()
  const error = useTutorialError()
  const panels = useTutorialPanels()
  const showingSolution = useTutorialShowingSolution()
  const hasSolution = useTutorialHasSolution()

  const isServerRunning = serverState.status === "starting" || serverState.status === "ready"

  return (
    <div
      className={cn(
        "flex items-center justify-between px-3 py-2 border-b bg-muted/30",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {/* Title */}
        <div className="flex items-center gap-2">
          <IconCode className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{config?.title ?? "Exercise"}</span>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs">
          {isLoading && (
            <>
              <IconLoader2 className="w-3 h-3 animate-spin text-primary" />
              <span className="text-muted-foreground">
                {bootState.status === "booting" && "Starting..."}
                {bootState.status === "mounting" && "Loading files..."}
                {bootState.status === "installing" && "Installing..."}
              </span>
            </>
          )}
          {isReady && !isServerRunning && (
            <>
              <IconCheck className="w-3 h-3 text-green-500" />
              <span className="text-muted-foreground">Ready</span>
            </>
          )}
          {isServerRunning && (
            <>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-muted-foreground">Running</span>
            </>
          )}
          {error && (
            <>
              <IconAlertCircle className="w-3 h-3 text-destructive" />
              <span className="text-destructive">Error</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Panel toggles */}
        <div className="flex items-center gap-1 mr-2">
          <Button
            variant={panels.fileTree ? "secondary" : "ghost"}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => actions.togglePanel("fileTree")}
            title="Toggle file tree"
          >
            <IconFolder className="w-4 h-4" />
          </Button>
          <Button
            variant={panels.terminal ? "secondary" : "ghost"}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => actions.togglePanel("terminal")}
            title="Toggle terminal"
          >
            <IconTerminal2 className="w-4 h-4" />
          </Button>
          <Button
            variant={panels.preview ? "secondary" : "ghost"}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => actions.togglePanel("preview")}
            title="Toggle preview"
          >
            <IconEye className="w-4 h-4" />
          </Button>
          <SettingsPopover />
        </div>

        {/* Run/Stop button */}
        {isServerRunning ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onStop}
            className="h-7 gap-1.5"
          >
            <IconX className="w-3.5 h-3.5" />
            Stop
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={onRun}
            disabled={!isReady}
            className="h-7 gap-1.5 bg-green-600 hover:bg-green-700"
          >
            <IconPlayerPlay className="w-3.5 h-3.5" />
            Run
          </Button>
        )}

        {/* Reset button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-7 gap-1.5"
          title="Reset to original"
        >
          <IconRefresh className="w-3.5 h-3.5" />
        </Button>

        {/* Show Solution button */}
        {hasSolution && (
          <Button
            variant={showingSolution ? "secondary" : "ghost"}
            size="sm"
            onClick={() => actions.toggleSolution()}
            className="h-7 gap-1.5"
            title={showingSolution ? "Hide solution" : "Show solution"}
          >
            <IconBulb className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {showingSolution ? "Hide" : "Solution"}
            </span>
          </Button>
        )}

        {/* Divider */}
        <div className="w-px h-5 bg-border mx-1" />

        {/* Exit fullscreen button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => actions.setExpanded(false)}
          className="h-7 gap-1.5"
        >
          <IconX className="w-4 h-4" />
          <span className="hidden sm:inline">Back to lesson</span>
          <span className="sm:hidden">Exit</span>
        </Button>
      </div>
    </div>
  )
}

// ============================================================================
// Workspace (Resizable panels container)
// ============================================================================

interface WorkspaceProps {
  children?: ReactNode
  className?: string
}

function Workspace({ children, className }: WorkspaceProps) {
  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className={cn("flex-1 flex h-full w-full", className)}
    >
      {children}
    </ResizablePanelGroup>
  )
}

// ============================================================================
// Export compound component
// ============================================================================

export const TutorialKit = {
  Root,
  Collapsed,
  Expanded,
  Toolbar,
  Workspace,
}
