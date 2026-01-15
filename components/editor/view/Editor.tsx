"use client"

import { createContext, useContext, useCallback, useRef, type ReactNode, type Context as ReactContext } from "react"
import { useStore } from "zustand"
import { editorStore, editorActions, type EditorActions, type EditorTheme } from "../../../lib/editor/view-models/editor-vm"

// ============================================================================
// Compound Component Pattern - Root/Context
// ============================================================================

interface EditorContextValue {
  store: typeof editorStore
  actions: EditorActions
  theme: EditorTheme
  activeDocumentPath: string | null
}

const EditorContext: ReactContext<EditorContextValue | null> = createContext<EditorContextValue | null>(null)

function useEditorContext() {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error("Editor.* components must be used within Editor.Root")
  }
  return context
}

// ============================================================================
// Root Component - Provider + Layout
// ============================================================================

interface EditorRootProps {
  children: ReactNode
  theme?: EditorTheme
}

function EditorRoot({ children, theme = "dark" }: EditorRootProps) {
  const activeDocumentPath = useStore(editorStore, (state) => state.activeFile)

  const contextValue: EditorContextValue = {
    store: editorStore,
    actions: editorActions,
    theme,
    activeDocumentPath,
  }

  return (
    <EditorContext.Provider value={contextValue}>
      <div className="editor-root flex flex-col h-full">{children}</div>
    </EditorContext.Provider>
  )
}

// ============================================================================
// Content Component - Main editor area
// ============================================================================

interface EditorContentProps {
  className?: string
}

function EditorContent({ className }: EditorContentProps) {
  const { actions, theme, activeDocumentPath } = useEditorContext()
  const activeDocument = useStore(editorStore, (state) =>
    activeDocumentPath ? state.documents[activeDocumentPath] ?? null : null
  )
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = useCallback((content: string) => {
    if (activeDocumentPath) {
      actions.updateContent(activeDocumentPath, content)
    }
  }, [activeDocumentPath, actions])

  if (!activeDocument) {
    return (
      <div className={`flex items-center justify-center h-full bg-muted/30 ${className}`}>
        <p className="text-muted-foreground">Select a file to edit</p>
      </div>
    )
  }

  return (
    <div className={`relative h-full ${className}`}>
      <textarea
        ref={textareaRef}
        value={activeDocument.content}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full h-full p-4 font-mono text-sm resize-none bg-background border-none focus:outline-none"
        spellCheck={false}
        data-theme={theme}
      />
    </div>
  )
}

// ============================================================================
// Status Bar Component
// ============================================================================

interface EditorStatusBarProps {
  className?: string
}

function EditorStatusBar({ className }: EditorStatusBarProps) {
  const { activeDocumentPath, theme } = useEditorContext()

  return (
    <div
      className={`flex items-center justify-between px-3 py-1 text-xs border-t bg-muted/50 ${className}`}
      data-theme={theme}
    >
      <span className="text-muted-foreground">
        {activeDocumentPath || "No file selected"}
      </span>
      <span className="text-muted-foreground">
        {theme === "dark" ? "Dark Mode" : "Light Mode"}
      </span>
    </div>
  )
}

// ============================================================================
// Compound Component Export
// ============================================================================

export const Editor = {
  Root: EditorRoot,
  Content: EditorContent,
  StatusBar: EditorStatusBar,
}

// ============================================================================
// Convenience Hooks
// ============================================================================

export function useEditorActions() {
  return useEditorContext().actions
}

export function useActiveDocument() {
  const { store, activeDocumentPath } = useEditorContext()
  const document = useStore(store, (state) =>
    activeDocumentPath ? state.documents[activeDocumentPath] ?? null : null
  )
  return document
}

export function useEditorTheme(): EditorTheme {
  return useEditorContext().theme
}
