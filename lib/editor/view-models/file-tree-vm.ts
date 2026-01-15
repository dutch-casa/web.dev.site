// FileTree ViewModel using Zustand
"use client"

import { createStore } from "zustand"
import type { FileTreeItem, FileTreeActions } from "../types"

interface FileTreeState {
  files: string[]
  selectedFile: string | null
  expandedDirectories: ReadonlySet<string>
}

interface FileTreeStore extends FileTreeState, FileTreeActions {}

const initialState: FileTreeState = {
  files: [],
  selectedFile: null,
  expandedDirectories: new Set(),
}

export const fileTreeStore = createStore<FileTreeStore>((set, get) => ({
  ...initialState,

  selectFile: (path) => set({ selectedFile: path }),

  createFile: async (path) => {
    if (get().files.includes(path)) throw new Error("FILE_EXISTS")
    set((state) => ({ files: [...state.files, path].sort() }))
  },

  createDirectory: async (path) => {
    if (get().files.some((f) => f.startsWith(path + "/"))) throw new Error("FOLDER_EXISTS")
    set((state) => ({ expandedDirectories: new Set([...state.expandedDirectories, path]) }))
  },

  deleteFile: async (path) =>
    set((state) => ({
      files: state.files.filter((f) => !f.startsWith(path + "/") && f !== path),
      selectedFile: state.selectedFile === path ? null : state.selectedFile,
    })),

  renameFile: async (oldPath, newPath) =>
    set((state) => ({
      files: state.files.map((f) => (f === oldPath ? newPath : f.startsWith(oldPath + "/") ? f.replace(oldPath, newPath) : f)).sort(),
      selectedFile: state.selectedFile === oldPath ? newPath : state.selectedFile,
    })),
}))

export const fileTreeActions: FileTreeActions = {
  selectFile: (path: string) => fileTreeStore.setState({ selectedFile: path }),
  createFile: async (path: string) => {
    const files = fileTreeStore.getState().files
    if (files.includes(path)) throw new Error("FILE_EXISTS")
    fileTreeStore.setState({ files: [...files, path].sort() })
  },
  createDirectory: async (path: string) => {
    const expandedDirectories = fileTreeStore.getState().expandedDirectories
    if (fileTreeStore.getState().files.some((f) => f.startsWith(path + "/"))) throw new Error("FOLDER_EXISTS")
    fileTreeStore.setState({ expandedDirectories: new Set([...expandedDirectories, path]) })
  },
  deleteFile: async (path: string) => {
    const state = fileTreeStore.getState()
    fileTreeStore.setState({
      files: state.files.filter((f) => !f.startsWith(path + "/") && f !== path),
      selectedFile: state.selectedFile === path ? null : state.selectedFile,
    })
  },
  renameFile: async (oldPath: string, newPath: string) => {
    const state = fileTreeStore.getState()
    fileTreeStore.setState({
      files: state.files.map((f) => (f === oldPath ? newPath : f.startsWith(oldPath + "/") ? f.replace(oldPath, newPath) : f)).sort(),
      selectedFile: state.selectedFile === oldPath ? newPath : state.selectedFile,
    })
  },
}

export type { FileTreeStore, FileTreeState, FileTreeActions }
