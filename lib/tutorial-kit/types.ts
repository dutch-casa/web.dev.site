// TutorialKit Types - Discriminated unions for state management
// Invariant: All states are exhaustively matchable

// ----------------------------------------------------------------------------
// Exercise Configuration (Authoring Format)
// ----------------------------------------------------------------------------

/** File content - either inline string or reference to external file */
export type FileContent =
  | { readonly kind: "inline"; readonly content: string }
  | { readonly kind: "external"; readonly path: string }

/** Single file in an exercise */
export type ExerciseFile = Readonly<{
  path: `/${string}`
  content: FileContent
  hidden?: boolean
  readonly?: boolean
}>

/** Exercise configuration schema */
export type ExerciseConfig = Readonly<{
  id: string
  title: string
  description?: string
  files: readonly ExerciseFile[]
  solution?: readonly ExerciseFile[]
  dependencies?: Readonly<Record<string, string>>
  devDependencies?: Readonly<Record<string, string>>
  scripts?: Readonly<Record<string, string>>
  devCommand?: string
  previewPort?: number
  focus?: string // Initial file to focus
}>

// ----------------------------------------------------------------------------
// Tutorial State Machine (Discriminated Union)
// ----------------------------------------------------------------------------

/** Boot state - WebContainer lifecycle */
export type BootState =
  | { readonly status: "idle" }
  | { readonly status: "booting" }
  | { readonly status: "mounting" }
  | { readonly status: "installing" }
  | { readonly status: "ready" }
  | { readonly status: "error"; readonly error: Error }

/** Server state - Dev server lifecycle */
export type ServerState =
  | { readonly status: "idle" }
  | { readonly status: "starting" }
  | { readonly status: "ready"; readonly url: string; readonly port: number }
  | { readonly status: "error"; readonly error: Error }

/** Editor state - File editing lifecycle */
export type EditorState = Readonly<{
  activeFile: string | null
  openFiles: readonly string[]
  dirty: ReadonlySet<string>
  scrollPositions: Readonly<Record<string, { top: number; left: number }>>
}>

/** Terminal output line */
export type TerminalLine = Readonly<{
  id: string
  text: string
  stream: "stdout" | "stderr"
  timestamp: number
}>

/** Terminal state */
export type TerminalState = Readonly<{
  lines: readonly TerminalLine[]
  isRunning: boolean
}>

/** Panel visibility state */
export type PanelState = Readonly<{
  fileTree: boolean
  terminal: boolean
  preview: boolean
}>

/** Full tutorial state (single source of truth) */
export type TutorialState = Readonly<{
  config: ExerciseConfig | null
  files: Readonly<Record<string, string>>
  boot: BootState
  server: ServerState
  editor: EditorState
  terminal: TerminalState
  panels: PanelState
  expanded: boolean
}>

// ----------------------------------------------------------------------------
// Actions (Pure data transforms)
// ----------------------------------------------------------------------------

export type TutorialAction =
  | { readonly type: "LOAD_CONFIG"; readonly config: ExerciseConfig }
  | { readonly type: "SET_FILES"; readonly files: Record<string, string> }
  | { readonly type: "UPDATE_FILE"; readonly path: string; readonly content: string }
  | { readonly type: "SET_BOOT_STATE"; readonly state: BootState }
  | { readonly type: "SET_SERVER_STATE"; readonly state: ServerState }
  | { readonly type: "SELECT_FILE"; readonly path: string | null }
  | { readonly type: "OPEN_FILE"; readonly path: string }
  | { readonly type: "CLOSE_FILE"; readonly path: string }
  | { readonly type: "MARK_DIRTY"; readonly path: string }
  | { readonly type: "MARK_CLEAN"; readonly path: string }
  | { readonly type: "APPEND_TERMINAL"; readonly line: TerminalLine }
  | { readonly type: "CLEAR_TERMINAL" }
  | { readonly type: "SET_TERMINAL_RUNNING"; readonly running: boolean }
  | { readonly type: "TOGGLE_PANEL"; readonly panel: keyof PanelState }
  | { readonly type: "SET_EXPANDED"; readonly expanded: boolean }
  | { readonly type: "RESET" }

// ----------------------------------------------------------------------------
// Initial State
// ----------------------------------------------------------------------------

export const initialEditorState: EditorState = {
  activeFile: null,
  openFiles: [],
  dirty: new Set(),
  scrollPositions: {},
}

export const initialTerminalState: TerminalState = {
  lines: [],
  isRunning: false,
}

export const initialPanelState: PanelState = {
  fileTree: true,
  terminal: true,
  preview: true,
}

export const initialTutorialState: TutorialState = {
  config: null,
  files: {},
  boot: { status: "idle" },
  server: { status: "idle" },
  editor: initialEditorState,
  terminal: initialTerminalState,
  panels: initialPanelState,
  expanded: false,
}

// ----------------------------------------------------------------------------
// Reducer (Pure state transform)
// ----------------------------------------------------------------------------

export function tutorialReducer(state: TutorialState, action: TutorialAction): TutorialState {
  switch (action.type) {
    case "LOAD_CONFIG":
      return { ...state, config: action.config }

    case "SET_FILES":
      return { ...state, files: action.files }

    case "UPDATE_FILE":
      return {
        ...state,
        files: { ...state.files, [action.path]: action.content },
      }

    case "SET_BOOT_STATE":
      return { ...state, boot: action.state }

    case "SET_SERVER_STATE":
      return { ...state, server: action.state }

    case "SELECT_FILE":
      return {
        ...state,
        editor: { ...state.editor, activeFile: action.path },
      }

    case "OPEN_FILE": {
      const openFiles = state.editor.openFiles.includes(action.path)
        ? state.editor.openFiles
        : [...state.editor.openFiles, action.path]
      return {
        ...state,
        editor: { ...state.editor, openFiles, activeFile: action.path },
      }
    }

    case "CLOSE_FILE": {
      const openFiles = state.editor.openFiles.filter((f) => f !== action.path)
      const activeFile =
        state.editor.activeFile === action.path
          ? openFiles[openFiles.length - 1] ?? null
          : state.editor.activeFile
      return {
        ...state,
        editor: { ...state.editor, openFiles, activeFile },
      }
    }

    case "MARK_DIRTY": {
      const dirty = new Set(state.editor.dirty)
      dirty.add(action.path)
      return { ...state, editor: { ...state.editor, dirty } }
    }

    case "MARK_CLEAN": {
      const dirty = new Set(state.editor.dirty)
      dirty.delete(action.path)
      return { ...state, editor: { ...state.editor, dirty } }
    }

    case "APPEND_TERMINAL":
      return {
        ...state,
        terminal: {
          ...state.terminal,
          lines: [...state.terminal.lines, action.line],
        },
      }

    case "CLEAR_TERMINAL":
      return {
        ...state,
        terminal: { ...state.terminal, lines: [] },
      }

    case "SET_TERMINAL_RUNNING":
      return {
        ...state,
        terminal: { ...state.terminal, isRunning: action.running },
      }

    case "TOGGLE_PANEL":
      return {
        ...state,
        panels: { ...state.panels, [action.panel]: !state.panels[action.panel] },
      }

    case "SET_EXPANDED":
      return { ...state, expanded: action.expanded }

    case "RESET":
      return { ...initialTutorialState, config: state.config }

    default:
      return state
  }
}

// ----------------------------------------------------------------------------
// Type Guards
// ----------------------------------------------------------------------------

export function isBootReady(state: BootState): state is { status: "ready" } {
  return state.status === "ready"
}

export function isServerReady(
  state: ServerState
): state is { status: "ready"; url: string; port: number } {
  return state.status === "ready"
}

export function isBootError(
  state: BootState
): state is { status: "error"; error: Error } {
  return state.status === "error"
}

export function isServerError(
  state: ServerState
): state is { status: "error"; error: Error } {
  return state.status === "error"
}
