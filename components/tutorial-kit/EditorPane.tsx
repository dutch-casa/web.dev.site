"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Editor, { type OnMount, type Monaco } from "@monaco-editor/react"
import type { editor } from "monaco-editor"
import { IconX, IconCircle } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import {
  useTutorialActiveFile,
  useTutorialFiles,
  useTutorialActions,
  useTutorial,
} from "@/lib/tutorial-kit/context"
import { useTutorialKitContext } from "./TutorialKit"
import { useSettings } from "@/lib/tutorial-kit/settings"

// ============================================================================
// Language Detection
// ============================================================================

function getLanguage(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase()
  switch (ext) {
    case "ts":
    case "tsx":
      return "typescript"
    case "js":
    case "jsx":
      return "javascript"
    case "json":
      return "json"
    case "html":
      return "html"
    case "css":
      return "css"
    case "md":
    case "mdx":
      return "markdown"
    default:
      return "plaintext"
  }
}

// ============================================================================
// Tab Component
// ============================================================================

interface TabProps {
  path: string
  isActive: boolean
  isDirty: boolean
  onSelect: () => void
  onClose: () => void
}

function Tab({ path, isActive, isDirty, onSelect, onClose }: TabProps) {
  const filename = path.split("/").pop() ?? path

  return (
    <div
      className={cn(
        "group flex items-center gap-1.5 px-3 py-1.5 text-sm cursor-pointer",
        "border-r border-border/50",
        isActive
          ? "bg-background text-foreground"
          : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
      )}
      onClick={onSelect}
    >
      <span className="truncate max-w-[120px]">{filename}</span>
      {isDirty && (
        <IconCircle className="w-2 h-2 fill-primary text-primary shrink-0" />
      )}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        className={cn(
          "p-0.5 rounded hover:bg-muted-foreground/20 transition-colors",
          "opacity-0 group-hover:opacity-100",
          isActive && "opacity-100"
        )}
      >
        <IconX className="w-3 h-3" />
      </button>
    </div>
  )
}

// ============================================================================
// EditorPane Component
// ============================================================================

interface EditorPaneProps {
  className?: string
  defaultSize?: number
  minSize?: number
}

export function EditorPane({
  className,
  defaultSize = 50,
  minSize = 30,
}: EditorPaneProps) {
  const { onFileChange } = useTutorialKitContext()
  const activeFile = useTutorialActiveFile()
  const files = useTutorialFiles()
  const openFiles = useTutorial((s) => s.editor.openFiles)
  const dirty = useTutorial((s) => s.editor.dirty)
  const actions = useTutorialActions()
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)
  const vimModeRef = useRef<{ dispose: () => void } | null>(null)
  const statusBarRef = useRef<HTMLDivElement | null>(null)

  // Settings
  const { vimMode, fontSize, lineNumbers, wordWrap } = useSettings()
  const [vimStatus, setVimStatus] = useState("")
  const [cursorLine, setCursorLine] = useState(1)

  const content = activeFile ? files[activeFile] ?? "" : ""
  const language = activeFile ? getLanguage(activeFile) : "plaintext"

  // Hybrid line numbers function: current line = absolute, others = relative
  const hybridLineNumbers = useCallback(
    (lineNumber: number): string => {
      if (lineNumber === cursorLine) {
        return String(lineNumber)
      }
      return String(Math.abs(lineNumber - cursorLine))
    },
    [cursorLine]
  )

  // Determine line numbers mode
  const lineNumbersOption = vimMode
    ? hybridLineNumbers
    : lineNumbers
      ? "on"
      : "off"

  // Initialize/cleanup vim mode
  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    // Cleanup existing vim mode
    if (vimModeRef.current) {
      vimModeRef.current.dispose()
      vimModeRef.current = null
      setVimStatus("")
    }

    if (vimMode && statusBarRef.current) {
      // Dynamically import monaco-vim
      import("monaco-vim").then(({ initVimMode }) => {
        if (!editorRef.current || !statusBarRef.current) return
        vimModeRef.current = initVimMode(editorRef.current, statusBarRef.current)
      }).catch(() => {
        // monaco-vim not available
        console.warn("monaco-vim not installed")
      })
    }

    return () => {
      if (vimModeRef.current) {
        vimModeRef.current.dispose()
        vimModeRef.current = null
      }
    }
  }, [vimMode])

  // Update editor options when settings change
  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    editor.updateOptions({
      fontSize,
      lineNumbers: lineNumbersOption,
      wordWrap: wordWrap ? "on" : "off",
    })
  }, [fontSize, lineNumbers, wordWrap, vimMode, lineNumbersOption])

  const handleEditorMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

    // Configure TypeScript/JavaScript
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      jsx: monaco.languages.typescript.JsxEmit.React,
      jsxFactory: "React.createElement",
      jsxFragmentFactory: "React.Fragment",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      allowSyntheticDefaultImports: true,
      allowJs: true,
      noEmit: true,
    })

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      jsx: monaco.languages.typescript.JsxEmit.React,
      allowJs: true,
      checkJs: true,
    })

    // Add React types
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `
      declare module 'react' {
        export function useState<T>(initial: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
        export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
        export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
        export function useMemo<T>(factory: () => T, deps: any[]): T;
        export function useRef<T>(initial: T): { current: T };
        export function useContext<T>(context: React.Context<T>): T;
        export function createContext<T>(defaultValue: T): React.Context<T>;
        export type FC<P = {}> = (props: P) => JSX.Element | null;
        export type ReactNode = JSX.Element | string | number | boolean | null | undefined | ReactNode[];
        export default React;
      }
      declare module 'react-dom/client' {
        export function createRoot(container: Element): { render(element: JSX.Element): void };
      }
      `,
      "file:///node_modules/@types/react/index.d.ts"
    )

    // Track cursor position for hybrid line numbers
    editor.onDidChangeCursorPosition((e) => {
      setCursorLine(e.position.lineNumber)
    })
  }, [])

  const handleChange = useCallback(
    (value: string | undefined) => {
      if (!activeFile || value === undefined) return
      // onFileChange handles local state update + debounced write to WebContainer
      onFileChange(activeFile, value)
    },
    [activeFile, onFileChange]
  )

  const handleTabSelect = useCallback(
    (path: string) => {
      actions.selectFile(path)
    },
    [actions]
  )

  const handleTabClose = useCallback(
    (path: string) => {
      actions.closeFile(path)
    },
    [actions]
  )

  return (
    <>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={defaultSize}
        minSize={minSize}
        className={cn("flex flex-col", className)}
      >
        {/* Tabs */}
        <div className="flex items-center border-b bg-muted/20 overflow-x-auto">
          {openFiles.map((path) => (
            <Tab
              key={path}
              path={path}
              isActive={path === activeFile}
              isDirty={dirty.has(path)}
              onSelect={() => handleTabSelect(path)}
              onClose={() => handleTabClose(path)}
            />
          ))}
        </div>

        {/* Editor */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {activeFile ? (
            <Editor
              height="100%"
              path={`file://${activeFile}`}
              language={language}
              value={content}
              onChange={handleChange}
              onMount={handleEditorMount}
              theme="vs-dark"
              options={{
                fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
                fontLigatures: true,
                fontSize,
                lineHeight: 1.6,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: lineNumbersOption,
                wordWrap: wordWrap ? "on" : "off",
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                formatOnPaste: true,
                formatOnType: true,
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnEnter: "on",
                quickSuggestions: {
                  other: true,
                  comments: false,
                  strings: true,
                },
                padding: { top: 12, bottom: 12 },
                scrollbar: {
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8,
                },
                renderLineHighlight: "line",
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                smoothScrolling: true,
                bracketPairColorization: { enabled: true },
                guides: {
                  bracketPairs: true,
                  indentation: true,
                },
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <span>Select a file to edit</span>
            </div>
          )}
        </div>

        {/* Vim status bar */}
        {vimMode && (
          <div
            ref={statusBarRef}
            className="shrink-0 h-6 px-2 text-xs font-mono bg-[#1e1e1e] text-gray-400 flex items-center border-t border-[#333]"
          />
        )}
      </ResizablePanel>
    </>
  )
}
