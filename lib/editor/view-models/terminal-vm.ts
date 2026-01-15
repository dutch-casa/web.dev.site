// Terminal ViewModel using Zustand
"use client"

import { createStore } from "zustand"
import type { TerminalPanel, TerminalSize, TerminalActions } from "../types"

interface TerminalState {
  panels: TerminalPanel[]
  activePanelId: string | null
  isReady: boolean
  isRunning: boolean
  size: TerminalSize
  output: string[]
}

interface TerminalStore extends TerminalState, TerminalActions {}

const initialState: TerminalState = {
  panels: [{ id: "main", title: "Terminal", type: "terminal" }],
  activePanelId: "main",
  isReady: true, // Ready by default for demo (no WebContainer)
  isRunning: false,
  size: { cols: 80, rows: 24 },
  output: [],
}

export const terminalStore = createStore<TerminalStore>((set) => ({
  ...initialState,

  write: (data) => set((state) => ({ output: [...state.output.slice(-1000), data] })),
  resize: (size) => set({ size }),
  spawn: async () => set({ isRunning: true }),
  kill: async () => set({ isRunning: false }),
}))

export const terminalActions: TerminalActions = {
  write: (data: string) => terminalStore.setState((state) => ({ output: [...state.output.slice(-1000), data] })),
  resize: (size: TerminalSize) => terminalStore.setState({ size }),
  spawn: async () => terminalStore.setState({ isRunning: true }),
  kill: async () => terminalStore.setState({ isRunning: false }),
}

export type { TerminalStore, TerminalState, TerminalActions }
