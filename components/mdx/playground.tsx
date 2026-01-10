"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  type ReactNode,
} from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import {
  usePlayground,
  getStateLabel,
  isLoading,
  type PlaygroundConfig,
  type PlaygroundState,
} from "@/lib/playground/use-playground"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  highlightCode,
  getLanguageFromFilename,
} from "@/lib/syntax-highlight"
import {
  IconPlayerPlay,
  IconRefresh,
  IconTerminal2,
  IconWorld,
  IconFile,
  IconFolder,
  IconLayoutSidebarRightExpand,
  IconLayoutSidebarRightCollapse,
} from "@tabler/icons-react"

type PlaygroundContextValue = {
  state: PlaygroundState
  terminalOutput: string[]
  files: Record<string, string>
  activeFile: string | null
  setActiveFile: (file: string | null) => void
  updateFileContent: (path: string, content: string) => void
  start: () => Promise<void>
  reset: () => void
  writeFile: (path: string, content: string) => Promise<void>
  isFileExplorerOpen: boolean
  setFileExplorerOpen: (open: boolean) => void
}

const PlaygroundContext = createContext<PlaygroundContextValue | null>(null)

function usePlaygroundContext() {
  const ctx = useContext(PlaygroundContext)
  if (!ctx) throw new Error("Playground components must be used within Playground.Root")
  return ctx
}

type RootProps = {
  children: ReactNode
  files: Record<string, string>
  startCommand?: string
  autoStart?: boolean
  className?: string
}

function Root({ children, files: initialFiles, startCommand, autoStart = false, className }: RootProps) {
  const [files, setFiles] = useState(initialFiles)
  const [activeFile, setActiveFile] = useState<string | null>(
    Object.keys(initialFiles)[0] ?? null
  )
  const [isFileExplorerOpen, setFileExplorerOpen] = useState(true)

  const config: PlaygroundConfig = {
    files,
    startCommand,
    autoStart,
  }

  const { state, terminalOutput, start, writeFile, reset } = usePlayground(config)

  const updateFileContent = useCallback((path: string, content: string) => {
    setFiles((prev) => ({ ...prev, [path]: content }))
  }, [])

  return (
    <PlaygroundContext.Provider
      value={{
        state,
        terminalOutput,
        files,
        activeFile,
        setActiveFile,
        updateFileContent,
        start,
        reset,
        writeFile,
        isFileExplorerOpen,
        setFileExplorerOpen,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "my-6 overflow-hidden rounded-2xl border border-muted-foreground/20 bg-background",
          className
        )}
      >
        {children}
      </motion.div>
    </PlaygroundContext.Provider>
  )
}

function Toolbar({ className }: { className?: string }) {
  const { state, start, reset, isFileExplorerOpen, setFileExplorerOpen } = usePlaygroundContext()
  const loading = isLoading(state)
  const label = getStateLabel(state)

  return (
    <div className={cn("flex items-center justify-between gap-4 border-b border-muted-foreground/20 bg-muted/30 px-4 py-2.5", className)}>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {loading && <Spinner className="size-4" />}
          <span>{label}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setFileExplorerOpen(!isFileExplorerOpen)}
          className={cn(
            "h-8 w-8 p-0",
            isFileExplorerOpen && "bg-muted"
          )}
          title={isFileExplorerOpen ? "Hide file explorer" : "Show file explorer"}
        >
          {isFileExplorerOpen ? (
            <IconLayoutSidebarRightCollapse className="size-4" />
          ) : (
            <IconLayoutSidebarRightExpand className="size-4" />
          )}
        </Button>
        {state.status === "idle" && (
          <Button size="sm" onClick={start} variant="default">
            <IconPlayerPlay className="mr-1.5 size-4" />
            Run
          </Button>
        )}
        {state.status === "error" && (
          <Button size="sm" onClick={reset} variant="outline">
            <IconRefresh className="mr-1.5 size-4" />
            Retry
          </Button>
        )}
        {state.status === "running" && (
          <Button size="sm" onClick={reset} variant="outline">
            <IconRefresh className="mr-1.5 size-4" />
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}

function FileTabs({ className }: { className?: string }) {
  const { files, activeFile, setActiveFile } = usePlaygroundContext()
  const fileNames = Object.keys(files)

  return (
    <div className={cn("relative flex items-center gap-0.5 overflow-x-auto border-b border-muted-foreground/20 bg-muted/20 px-2 py-1.5", className)}>
      {fileNames.map((name) => (
        <button
          key={name}
          type="button"
          onClick={() => setActiveFile(name)}
          className={cn(
            "relative z-10 flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
            activeFile === name
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <IconFile className="size-3.5" />
          {name}
          {activeFile === name && (
            <motion.div
              layoutId="active-tab"
              className="absolute inset-0 rounded-lg bg-primary"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ zIndex: -1 }}
            />
          )}
        </button>
      ))}
    </div>
  )
}

function FileExplorer({ className }: { className?: string }) {
  const { files, activeFile, setActiveFile, isFileExplorerOpen } = usePlaygroundContext()
  const fileNames = Object.keys(files)

  return (
    <AnimatePresence mode="wait">
      {isFileExplorerOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 200, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="h-full border-l border-muted-foreground/20 bg-muted/10 overflow-hidden"
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-2 border-b border-muted-foreground/10 px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <IconFolder className="size-4" />
              Files
            </div>
            <div className="flex-1 overflow-auto p-1.5">
              {fileNames.map((name) => {
                const isActive = activeFile === name
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setActiveFile(name)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <IconFile className="size-3.5 shrink-0" />
                    <span className="truncate">{name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Editor({ className }: { className?: string }) {
  const { files, activeFile, updateFileContent, writeFile, state } = usePlaygroundContext()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const content = activeFile ? files[activeFile] : ""
  const [highlightedHtml, setHighlightedHtml] = useState("")

  const lang = activeFile ? getLanguageFromFilename(activeFile) : "text"

  useEffect(() => {
    let mounted = true
    highlightCode(content, lang).then((html) => {
      if (mounted) {
        setHighlightedHtml(html)
      }
    })
    return () => {
      mounted = false
    }
  }, [content, lang])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (activeFile) {
        updateFileContent(activeFile, e.target.value)
      }
    },
    [activeFile, updateFileContent]
  )

  const handleBlur = useCallback(async () => {
    if (activeFile && state.status === "running") {
      await writeFile(activeFile, content)
    }
  }, [activeFile, content, state.status, writeFile])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const value = textarea.value

      textarea.value = value.substring(0, start) + "  " + value.substring(end)
      textarea.selectionStart = textarea.selectionEnd = start + 2

      if (activeFile) {
        updateFileContent(activeFile, textarea.value)
      }
    }
  }, [activeFile, updateFileContent])

  const lineCount = content.split("\n").length

  return (
    <div className={cn("relative flex flex-col h-full font-mono text-sm", className)}>
      {/* Line numbers */}
      <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col bg-muted/10 pt-4 select-none z-10">
        {Array.from({ length: Math.max(lineCount, 1) }, (_, i) => (
          <div
            key={i}
            className="h-[20px] text-right pr-2 text-muted-foreground/40 text-xs leading-5"
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Code container with syntax highlighting */}
      <div className="flex-1 overflow-auto pl-10 pt-4">
        {/* Syntax highlighted code (background) */}
        <div
          className="shiki-container absolute inset-0 pointer-events-none overflow-hidden pl-10 pt-4"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          style={{
            fontSize: "14px",
            lineHeight: "20px",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          }}
        />

        {/* Editable textarea (foreground, transparent) */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="relative w-full h-full resize-none bg-transparent p-0 font-mono text-sm leading-[20px] outline-none selection:bg-primary/30"
          style={{
            fontSize: "14px",
            lineHeight: "20px",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            color: "transparent",
            caretColor: "white",
          }}
          placeholder="// Start coding..."
        />
      </div>
    </div>
  )
}

function Preview({ className }: { className?: string }) {
  const { state } = usePlaygroundContext()

  return (
    <div className={cn("flex h-full flex-col bg-white", className)}>
      {state.status === "running" ? (
        <iframe
          src={state.previewUrl}
          title="Preview"
          className="h-full w-full border-0"
          sandbox="allow-scripts allow-forms allow-same-origin"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <div className="text-center">
            <IconWorld className="mx-auto mb-3 size-10 opacity-50" />
            <p className="text-sm">
              {isLoading(state) ? "Loading preview..." : "Click Run to start"}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function Terminal({ className }: { className?: string }) {
  const { terminalOutput } = usePlaygroundContext()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [terminalOutput])

  return (
    <div
      ref={scrollRef}
      className={cn("h-full overflow-auto bg-zinc-950 p-4 font-mono text-xs text-zinc-300", className)}
    >
      {terminalOutput.length === 0 ? (
        <span className="text-zinc-500">Terminal output will appear here...</span>
      ) : (
        terminalOutput.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {line}
          </div>
        ))
      )}
    </div>
  )
}

function SplitView({ className }: { className?: string }) {
  return (
    <ResizablePanelGroup orientation="horizontal" className={cn("h-[500px]", className)}>
      <ResizablePanel defaultSize={40} minSize={30}>
        <div className="flex h-full flex-col">
          <FileTabs />
          <div className="flex-1 overflow-hidden">
            <Editor />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={40} minSize={20}>
        <Tabs defaultValue="preview" className="flex h-full flex-col">
          <TabsList className="w-full justify-start rounded-none border-b border-muted-foreground/20 bg-muted/20 px-3">
            <TabsTrigger value="preview" className="gap-1.5">
              <IconWorld className="size-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="terminal" className="gap-1.5">
              <IconTerminal2 className="size-4" />
              Terminal
            </TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="flex-1 mt-0">
            <Preview />
          </TabsContent>
          <TabsContent value="terminal" className="flex-1 mt-0">
            <Terminal />
          </TabsContent>
        </Tabs>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={20} minSize={0} collapsible={true} collapsedSize={0}>
        <FileExplorer />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export const Playground = {
  Root,
  Toolbar,
  FileTabs,
  FileExplorer,
  Editor,
  Preview,
  Terminal,
  SplitView,
}

type PlaygroundSimpleProps = {
  files: Record<string, string>
  startCommand?: string
  autoStart?: boolean
}

export function PlaygroundSimple({ files, startCommand, autoStart }: PlaygroundSimpleProps) {
  return (
    <Playground.Root files={files} startCommand={startCommand} autoStart={autoStart}>
      <Playground.Toolbar />
      <Playground.SplitView />
    </Playground.Root>
  )
}
