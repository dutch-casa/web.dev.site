// TutorialKit Store - Zustand with immer for immutable updates
import { createStore, type StoreApi } from "zustand"
import { immer } from "zustand/middleware/immer"
import { enableMapSet } from "immer"

// Enable Immer plugins for Set/Map support (used by editor.dirty)
enableMapSet()
import type {
  TutorialState,
  TutorialAction,
  BootState,
  ServerState,
  TerminalLine,
  PanelState,
  ExerciseConfig,
} from "./types"
import { initialTutorialState, tutorialReducer } from "./types"

// ----------------------------------------------------------------------------
// Store Type
// ----------------------------------------------------------------------------

export type TutorialStore = TutorialState & {
  dispatch: (action: TutorialAction) => void
  // Convenience actions (thin wrappers around dispatch)
  loadConfig: (config: ExerciseConfig) => void
  setFiles: (files: Record<string, string>) => void
  updateFile: (path: string, content: string) => void
  setBootState: (state: BootState) => void
  setServerState: (state: ServerState) => void
  selectFile: (path: string | null) => void
  openFile: (path: string) => void
  closeFile: (path: string) => void
  markDirty: (path: string) => void
  markClean: (path: string) => void
  appendTerminal: (line: Omit<TerminalLine, "id" | "timestamp">) => void
  clearTerminal: () => void
  setTerminalRunning: (running: boolean) => void
  togglePanel: (panel: keyof PanelState) => void
  setExpanded: (expanded: boolean) => void
  toggleSolution: () => void
  reset: () => void
}

// ----------------------------------------------------------------------------
// Store Factory
// ----------------------------------------------------------------------------

let lineIdCounter = 0

export function createTutorialStore(
  initialState: Partial<TutorialState> = {}
): StoreApi<TutorialStore> {
  return createStore<TutorialStore>()(
    immer((set) => ({
      ...initialTutorialState,
      ...initialState,

      dispatch: (action) =>
        set((state) => {
          const newState = tutorialReducer(state, action)
          return newState
        }),

      loadConfig: (config) =>
        set((state) => tutorialReducer(state, { type: "LOAD_CONFIG", config })),

      setFiles: (files) =>
        set((state) => tutorialReducer(state, { type: "SET_FILES", files })),

      updateFile: (path, content) =>
        set((state) => tutorialReducer(state, { type: "UPDATE_FILE", path, content })),

      setBootState: (bootState) =>
        set((state) => tutorialReducer(state, { type: "SET_BOOT_STATE", state: bootState })),

      setServerState: (serverState) =>
        set((state) => tutorialReducer(state, { type: "SET_SERVER_STATE", state: serverState })),

      selectFile: (path) =>
        set((state) => tutorialReducer(state, { type: "SELECT_FILE", path })),

      openFile: (path) =>
        set((state) => tutorialReducer(state, { type: "OPEN_FILE", path })),

      closeFile: (path) =>
        set((state) => tutorialReducer(state, { type: "CLOSE_FILE", path })),

      markDirty: (path) =>
        set((state) => tutorialReducer(state, { type: "MARK_DIRTY", path })),

      markClean: (path) =>
        set((state) => tutorialReducer(state, { type: "MARK_CLEAN", path })),

      appendTerminal: (line) =>
        set((state) =>
          tutorialReducer(state, {
            type: "APPEND_TERMINAL",
            line: {
              ...line,
              id: `line-${++lineIdCounter}`,
              timestamp: Date.now(),
            },
          })
        ),

      clearTerminal: () =>
        set((state) => tutorialReducer(state, { type: "CLEAR_TERMINAL" })),

      setTerminalRunning: (running) =>
        set((state) => tutorialReducer(state, { type: "SET_TERMINAL_RUNNING", running })),

      togglePanel: (panel) =>
        set((state) => tutorialReducer(state, { type: "TOGGLE_PANEL", panel })),

      setExpanded: (expanded) =>
        set((state) => tutorialReducer(state, { type: "SET_EXPANDED", expanded })),

      toggleSolution: () =>
        set((state) => tutorialReducer(state, { type: "TOGGLE_SOLUTION" })),

      reset: () =>
        set((state) => tutorialReducer(state, { type: "RESET" })),
    }))
  )
}

// ----------------------------------------------------------------------------
// Selectors (for performance optimization)
// ----------------------------------------------------------------------------

export const selectConfig = (state: TutorialStore) => state.config
export const selectFiles = (state: TutorialStore) => state.files
export const selectBootStatus = (state: TutorialStore) => state.boot.status
export const selectServerStatus = (state: TutorialStore) => state.server.status
export const selectActiveFile = (state: TutorialStore) => state.editor.activeFile
export const selectOpenFiles = (state: TutorialStore) => state.editor.openFiles
export const selectTerminalLines = (state: TutorialStore) => state.terminal.lines
export const selectPanels = (state: TutorialStore) => state.panels
export const selectExpanded = (state: TutorialStore) => state.expanded

export const selectPreviewUrl = (state: TutorialStore) =>
  state.server.status === "ready" ? state.server.url : null

export const selectIsLoading = (state: TutorialStore) =>
  state.boot.status === "booting" ||
  state.boot.status === "mounting" ||
  state.boot.status === "installing"

export const selectIsReady = (state: TutorialStore) =>
  state.boot.status === "ready"

export const selectError = (state: TutorialStore) =>
  state.boot.status === "error"
    ? state.boot.error
    : state.server.status === "error"
      ? state.server.error
      : null

export const selectActiveFileContent = (state: TutorialStore) =>
  state.editor.activeFile ? state.files[state.editor.activeFile] ?? "" : ""

export const selectFilePaths = (state: TutorialStore) =>
  Object.keys(state.files).sort()
