"use client"

import {
  createContext,
  useContext,
  useRef,
  useMemo,
  type ReactNode,
  type Context as ReactContext,
} from "react"
import { useStore, type StoreApi } from "zustand"
import { useShallow } from "zustand/react/shallow"
import { createTutorialStore, type TutorialStore } from "./store"
import type { TutorialState } from "./types"

// ----------------------------------------------------------------------------
// Context
// ----------------------------------------------------------------------------

const TutorialContext: ReactContext<StoreApi<TutorialStore> | null> =
  createContext<StoreApi<TutorialStore> | null>(null)

// ----------------------------------------------------------------------------
// Provider
// ----------------------------------------------------------------------------

interface TutorialProviderProps {
  children: ReactNode
  initialState?: Partial<TutorialState>
}

export function TutorialProvider({ children, initialState }: TutorialProviderProps) {
  const storeRef = useRef<StoreApi<TutorialStore> | null>(null)

  if (!storeRef.current) {
    storeRef.current = createTutorialStore(initialState)
  }

  return (
    <TutorialContext.Provider value={storeRef.current}>
      {children}
    </TutorialContext.Provider>
  )
}

// ----------------------------------------------------------------------------
// Hooks
// ----------------------------------------------------------------------------

function useTutorialStore(): StoreApi<TutorialStore> {
  const store = useContext(TutorialContext)
  if (!store) {
    throw new Error("useTutorial* hooks must be used within TutorialProvider")
  }
  return store
}

/**
 * Subscribe to selected state from the tutorial store.
 * Uses Zustand's selector pattern for optimal re-renders.
 */
export function useTutorial<T>(selector: (state: TutorialStore) => T): T {
  const store = useTutorialStore()
  return useStore(store, selector)
}

/**
 * Get the full store for imperative access.
 * Use sparingly - prefer useTutorial with selectors.
 */
export function useTutorialApi(): StoreApi<TutorialStore> {
  return useTutorialStore()
}

// ----------------------------------------------------------------------------
// Convenience Hooks (common selections)
// ----------------------------------------------------------------------------

export function useTutorialConfig() {
  return useTutorial((s) => s.config)
}

export function useTutorialFiles() {
  return useTutorial((s) => s.files)
}

export function useTutorialBootState() {
  return useTutorial((s) => s.boot)
}

export function useTutorialServerState() {
  return useTutorial((s) => s.server)
}

export function useTutorialEditor() {
  return useTutorial((s) => s.editor)
}

export function useTutorialTerminal() {
  return useTutorial((s) => s.terminal)
}

export function useTutorialPanels() {
  return useTutorial((s) => s.panels)
}

export function useTutorialExpanded() {
  return useTutorial((s) => s.expanded)
}

/**
 * Get stable action references from the store.
 * Actions are bound to the store and never change, so we memoize them.
 */
export function useTutorialActions() {
  const store = useTutorialStore()
  // Actions are stable - memoize to prevent new object on every render
  return useMemo(() => {
    const state = store.getState()
    return {
      loadConfig: state.loadConfig,
      setFiles: state.setFiles,
      updateFile: state.updateFile,
      setBootState: state.setBootState,
      setServerState: state.setServerState,
      selectFile: state.selectFile,
      openFile: state.openFile,
      closeFile: state.closeFile,
      markDirty: state.markDirty,
      markClean: state.markClean,
      appendTerminal: state.appendTerminal,
      clearTerminal: state.clearTerminal,
      setTerminalRunning: state.setTerminalRunning,
      togglePanel: state.togglePanel,
      setExpanded: state.setExpanded,
      toggleSolution: state.toggleSolution,
      reset: state.reset,
    }
  }, [store])
}

// Derived selectors
export function useTutorialIsLoading() {
  return useTutorial(
    (s) =>
      s.boot.status === "booting" ||
      s.boot.status === "mounting" ||
      s.boot.status === "installing"
  )
}

export function useTutorialIsReady() {
  return useTutorial((s) => s.boot.status === "ready")
}

export function useTutorialError() {
  return useTutorial((s) =>
    s.boot.status === "error"
      ? s.boot.error
      : s.server.status === "error"
        ? s.server.error
        : null
  )
}

export function useTutorialPreviewUrl() {
  return useTutorial((s) =>
    s.server.status === "ready" ? s.server.url : null
  )
}

export function useTutorialActiveFile() {
  return useTutorial((s) => s.editor.activeFile)
}

export function useTutorialActiveFileContent() {
  return useTutorial((s) =>
    s.editor.activeFile ? s.files[s.editor.activeFile] ?? "" : ""
  )
}

export function useTutorialFilePaths() {
  const store = useTutorialStore()
  return useStore(store, useShallow((s) => Object.keys(s.files).sort()))
}

export function useTutorialShowingSolution() {
  return useTutorial((s) => s.showingSolution)
}

export function useTutorialHasSolution() {
  return useTutorial((s) => s.config?.solution && s.config.solution.length > 0)
}
