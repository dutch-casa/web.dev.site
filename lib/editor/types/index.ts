// Editor Domain Types - Modern TypeScript with discriminated unions
import type { FileSystemTree, WebContainer } from "@webcontainer/api"

// ----------------------------------------------------------------------------
// File System Types - Using satisfies for validation
// ----------------------------------------------------------------------------

export type FileType = "file" | "directory"

interface BaseFileTemplate {
  path: `/${string}`
  executable?: boolean
}

interface FileTemplate extends BaseFileTemplate {
  type: "file"
  content: string
}

interface DirectoryTemplate extends BaseFileTemplate {
  type: "directory"
  children: FileSystemTemplate
}

type FileSystemTemplate = FileTemplate | DirectoryTemplate

export const tutorialConfigSchema = {
  name: (name: string): name is string => name.length > 0,
  files: (files: FileSystemTemplate[]): files is FileSystemTemplate[] =>
    Array.isArray(files) && files.length > 0,
  dependencies: (deps: Record<string, string> | undefined): deps is Record<string, string> =>
    deps === undefined || Object.keys(deps).length > 0,
} as const

export interface TutorialConfig {
  readonly name: string
  readonly files: readonly FileSystemTemplate[]
  readonly dependencies?: Readonly<Record<string, string>>
  readonly scripts?: Readonly<Record<string, string>>
  readonly previewPort?: number
}

// Error classes
export class FilesystemError extends Error {
  constructor(
    message: "FILE_EXISTS" | "FOLDER_EXISTS" | "FILE_NOT_FOUND" | "PERMISSION_DENIED",
    public path: string
  ) {
    super(message)
    this.name = "FilesystemError"
  }
}

// ----------------------------------------------------------------------------
// Editor Types - Discriminated unions for state
// ----------------------------------------------------------------------------

export type EditorDocument = Readonly<{
  filePath: string
  content: string
  loading: false
  scrollPosition?: Readonly<{ top: number; left: number }>
}>

export type EditorTheme = "light" | "dark"

export type EditorChangeEvent = Readonly<{
  filePath: string
  content: string
  cursor?: Readonly<{ line: number; column: number }>
}>

// ----------------------------------------------------------------------------
// File Tree Types
// ----------------------------------------------------------------------------

export type FileTreeItem = {
  path: string
  type: FileType
  expanded?: boolean
  children?: FileTreeItem[]
}

export type FileChangeMethod = "add" | "remove" | "rename"

export type FileChangeEvent = Readonly<{
  type: FileType
  method: FileChangeMethod
  value: string
  oldValue?: string
}>

// ----------------------------------------------------------------------------
// Terminal Types
// ----------------------------------------------------------------------------

export type TerminalPanelType = "terminal" | "preview"

export type TerminalPanel = Readonly<{
  id: string
  title: string
  type: TerminalPanelType
  processId?: string
}>

export type TerminalSize = Readonly<{ cols: number; rows: number }>

// ----------------------------------------------------------------------------
// Workspace Types
// ----------------------------------------------------------------------------

export type WorkspacePanelType = "editor" | "terminal" | "preview"

export type WorkspacePanel = Readonly<{
  id: string
  type: WorkspacePanelType
  size: number
  minSize?: number
}>

export type WorkspaceLayout = Readonly<{
  direction: "horizontal" | "vertical"
  sizes: readonly number[]
}>

// ----------------------------------------------------------------------------
// WebContainer State - Discriminated union
// ----------------------------------------------------------------------------

export type WebContainerBootState =
  | { readonly status: "idle" }
  | { readonly status: "booting" }
  | { readonly status: "ready"; readonly instance: WebContainer }
  | { readonly status: "error"; readonly error: Error }

export type ServerReadyState =
  | { readonly status: "idle" }
  | { readonly status: "starting" }
  | { readonly status: "ready"; readonly url: string; readonly port: number }
  | { readonly status: "error"; readonly error: Error }

// ----------------------------------------------------------------------------
// ViewModel Action Types - Pure data, no React
// ----------------------------------------------------------------------------

export interface EditorActions {
  readonly openFile: (path: string, content: string) => void
  readonly closeFile: (path: string) => void
  readonly selectFile: (path: string | null) => void
  readonly updateContent: (path: string, content: string) => void
  readonly updateScroll: (path: string, position: { top: number; left: number }) => void
}

export interface FileTreeActions {
  readonly selectFile: (path: string) => void
  readonly createFile: (path: string) => Promise<void>
  readonly createDirectory: (path: string) => Promise<void>
  readonly deleteFile: (path: string) => Promise<void>
  readonly renameFile: (oldPath: string, newPath: string) => Promise<void>
}

export interface TerminalActions {
  readonly write: (data: string) => void
  readonly resize: (size: TerminalSize) => void
  readonly spawn: (command: string, args: readonly string[], options?: Record<string, unknown>) => Promise<void>
  readonly kill: () => Promise<void>
}

export interface WorkspaceActions {
  readonly setActivePanel: (panel: WorkspacePanelType) => void
  readonly resizePanel: (panel: WorkspacePanelType, size: number) => void
  readonly togglePanel: (panel: WorkspacePanelType) => void
}
