// Workspace ViewModel - Orchestrates all editor components
import { createStore } from "zustand/vanilla"
import type {
  WorkspacePanelType,
  WorkspacePanel,
  WorkspaceLayout,
  WorkspaceActions,
  WebContainerBootState,
  ServerReadyState,
} from "../types"

// State interface
interface WorkspaceState {
  // Panel configuration
  panels: WorkspacePanel[]
  activePanel: WorkspacePanelType

  // Layout
  layout: WorkspaceLayout

  // System states
  webcontainer: WebContainerBootState
  server: ServerReadyState

  // UI preferences
  showFileTree: boolean
  showTerminal: boolean
  showPreview: boolean
}

// Initial state
const _initialState: WorkspaceState = {
  panels: [
    { id: "files", type: "editor", size: 20, minSize: 15 },
    { id: "editor", type: "editor", size: 40, minSize: 30 },
    { id: "preview", type: "preview", size: 40, minSize: 30 },
  ],
  activePanel: "editor",
  layout: {
    direction: "horizontal",
    sizes: [20, 40, 40],
  },
  webcontainer: { status: "idle" },
  server: { status: "idle" },
  showFileTree: true,
  showTerminal: true,
  showPreview: true,
}

// Actions creator
const _createActions = (
  set: (partial: Partial<WorkspaceState> | ((state: WorkspaceState) => Partial<WorkspaceState>)) => void,
  get: () => WorkspaceState
): WorkspaceActions => ({
  setActivePanel: (panel) => {
    set({ activePanel: panel })
  },

  resizePanel: (panel, size) => {
    set((state) => {
      const panelIndex = state.panels.findIndex((p) => p.type === panel)
      if (panelIndex === -1) return state

      const newSizes = [...state.layout.sizes]
      newSizes[panelIndex] = size

      return {
        layout: { ...state.layout, sizes: newSizes },
        panels: state.panels.map((p, i) =>
          i === panelIndex ? { ...p, size } : p
        ),
      }
    })
  },

  togglePanel: (panel) => {
    const key = `show${panel.charAt(0).toUpperCase() + panel.slice(1)}` as keyof Pick<
      WorkspaceState,
      "showFileTree" | "showTerminal" | "showPreview"
    >
    set((state) => ({
      [key]: !(state as unknown as Record<string, boolean>)[key],
    }))
  },
})

// Factory function
export function createWorkspaceVM() {
  const store = createStore<WorkspaceState>((set, get) => _initialState)

  return {
    store,
    actions: _createActions(store.setState.bind(store), store.getState.bind(store)),
  }
}

// Selectors
export function selectPanels(state: WorkspaceState) {
  return state.panels
}

export function selectActivePanel(state: WorkspaceState) {
  return state.activePanel
}

export function selectLayout(state: WorkspaceState) {
  return state.layout
}

export function selectWebContainerState(state: WorkspaceState) {
  return state.webcontainer
}

export function selectServerState(state: WorkspaceState) {
  return state.server
}

export function selectVisibility(state: WorkspaceState) {
  return {
    fileTree: state.showFileTree,
    terminal: state.showTerminal,
    preview: state.showPreview,
  }
}

export type WorkspaceVMStore = ReturnType<typeof createWorkspaceVM>["store"]
export type WorkspaceVMActions = ReturnType<typeof createWorkspaceVM>["actions"]
