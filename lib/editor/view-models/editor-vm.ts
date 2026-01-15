// Editor ViewModel using Zustand
"use client"

import { createStore } from "zustand"
import type { EditorDocument, EditorActions, EditorTheme } from "../types"

interface EditorState {
  documents: Record<string, EditorDocument>
  activeFile: string | null
  theme: EditorTheme
}

interface EditorStore extends EditorState, EditorActions {}

const initialState: EditorState = {
  documents: {},
  activeFile: null,
  theme: "dark",
}

export const editorStore = createStore<EditorStore>((set, get) => ({
  ...initialState,

  openFile: (path, content) =>
    set((state) => ({
      documents: { ...state.documents, [path]: { filePath: path, content, loading: false } },
    })),

  closeFile: (path) =>
    set((state) => {
      const { [path]: _, ...rest } = state.documents
      return { documents: rest, activeFile: state.activeFile === path ? null : state.activeFile }
    }),

  selectFile: (path) => set({ activeFile: path }),

  updateContent: (path, content) =>
    set((state) => ({
      documents: {
        ...state.documents,
        [path]: state.documents[path] ? { ...state.documents[path], content } : { filePath: path, content, loading: false },
      },
    })),

  updateScroll: (path, position) =>
    set((state) => ({
      documents: state.documents[path]
        ? { ...state.documents, [path]: { ...state.documents[path], scrollPosition: position } }
        : state.documents,
    })),
}))

export const editorActions: EditorActions = {
  openFile: (path: string, content: string) =>
    editorStore.setState((state) => ({
      documents: { ...state.documents, [path]: { filePath: path, content, loading: false } },
    })),

  closeFile: (path: string) =>
    editorStore.setState((state) => {
      const { [path]: _, ...rest } = state.documents
      return { documents: rest, activeFile: state.activeFile === path ? null : state.activeFile }
    }),

  selectFile: (path: string | null) => editorStore.setState({ activeFile: path }),

  updateContent: (path: string, content: string) =>
    editorStore.setState((state) => ({
      documents: {
        ...state.documents,
        [path]: state.documents[path] ? { ...state.documents[path], content } : { filePath: path, content, loading: false },
      },
    })),

  updateScroll: (path: string, position: { top: number; left: number }) =>
    editorStore.setState((state) => ({
      documents: state.documents[path]
        ? { ...state.documents, [path]: { ...state.documents[path], scrollPosition: position } }
        : state.documents,
    })),
}

export type { EditorStore, EditorState, EditorActions, EditorTheme }
