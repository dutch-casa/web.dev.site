"use client"

import { createContext, useContext, useEffect, useCallback, useMemo, useState, type ReactNode, type Context as ReactContext } from "react"
import { useStore } from "zustand"
import { fileTreeStore, fileTreeActions, type FileTreeActions } from "../../../lib/editor/view-models/file-tree-vm"
import { IconFile, IconFolder, IconFolderOpen, IconChevronRight, IconChevronDown } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

// ============================================================================
// Compound Component Pattern - Root/Context
// ============================================================================

interface FileTreeContextValue {
  store: typeof fileTreeStore
  actions: FileTreeActions
  selectedFile: string | null
}

const FileTreeContext: ReactContext<FileTreeContextValue | null> = createContext<FileTreeContextValue | null>(null)

function useFileTreeContext() {
  const context = useContext(FileTreeContext)
  if (!context) {
    throw new Error("FileTree.* components must be used within FileTree.Root")
  }
  return context
}

// ============================================================================
// Type Utilities
// ============================================================================

interface FileTreeNode {
  path: string
  type: "file" | "directory"
  expanded?: boolean
  children?: FileTreeNode[]
}

type FileTreeItemProps = {
  item: FileTreeNode
  depth: number
  selectedFile: string | null
  onSelect: (path: string) => void
}

// ============================================================================
// Helper: Render file/folder item recursively
// ============================================================================

function FileTreeItem({ item, depth, selectedFile, onSelect }: FileTreeItemProps) {
  const [expanded, setExpanded] = useState(false)
  const isSelected = item.path === selectedFile
  const hasChildren = item.type === "directory" && item.children && item.children.length > 0

  const handleClick = useCallback(() => {
    if (item.type === "directory") {
      setExpanded((prev) => !prev)
    }
    onSelect(item.path)
  }, [item.type, item.path, onSelect])

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (item.type === "directory") {
      setExpanded((prev) => !prev)
    }
  }, [item.type])

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-muted/50 transition-colors",
          isSelected && "bg-primary/10 text-primary"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
      >
        {/* Expand/collapse arrow */}
        <span className="w-4 h-4 flex items-center justify-center shrink-0">
          {hasChildren ? (
            <button
              onClick={handleToggle}
              className="p-0.5 hover:bg-muted rounded"
            >
              {expanded ? (
                <IconChevronDown className="w-3 h-3" />
              ) : (
                <IconChevronRight className="w-3 h-3" />
              )}
            </button>
          ) : (
            <span className="w-3 h-3" />
          )}
        </span>

        {/* Icon */}
        <span className="w-4 h-4 flex items-center justify-center shrink-0">
          {item.type === "directory" ? (
            expanded ? (
              <IconFolderOpen className="w-4 h-4 text-yellow-500" />
            ) : (
              <IconFolder className="w-4 h-4 text-yellow-500" />
            )
          ) : (
            <IconFile className="w-4 h-4 text-muted-foreground" />
          )}
        </span>

        {/* Name */}
        <span className="truncate text-sm">{item.path.split("/").pop()}</span>
      </div>

      {/* Children */}
      {item.type === "directory" && expanded && item.children && (
        <div>
          {item.children.map((child) => (
            <FileTreeItem
              key={child.path}
              item={child}
              depth={depth + 1}
              selectedFile={selectedFile}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Root Component
// ============================================================================

interface FileTreeRootProps {
  children: ReactNode
  initialFiles?: string[]
  onFileSelect?: (path: string) => void
}

function FileTreeRoot({ children, initialFiles = [], onFileSelect }: FileTreeRootProps) {
  const selectedFile = useStore(fileTreeStore, (state) => state.selectedFile)

  // Handle file selection
  const handleSelect = useCallback((path: string) => {
    fileTreeActions.selectFile(path)
    onFileSelect?.(path)
  }, [onFileSelect])

  const contextValue: FileTreeContextValue = {
    store: fileTreeStore,
    actions: fileTreeActions,
    selectedFile,
  }

  return (
    <FileTreeContext.Provider value={contextValue}>
      <div className="file-tree h-full overflow-auto bg-card border rounded-lg">
        {children}
      </div>
    </FileTreeContext.Provider>
  )
}

// ============================================================================
// List Component
// ============================================================================

interface FileTreeListProps {
  className?: string
}

function FileTreeList({ className }: FileTreeListProps) {
  const { actions, selectedFile } = useFileTreeContext()
  const files = useStore(fileTreeStore, (state) => state.files)

  // Convert flat paths to tree structure
  const tree = useMemo((): FileTreeNode[] => {
    if (files.length === 0) return []

    // Build a map for O(1) lookup
    const nodeMap = new Map<string, FileTreeNode>()

    // First pass: create all nodes
    for (const path of [...files].sort((a, b) => a.localeCompare(b))) {
      const segments = path.split("/").filter(Boolean)
      for (let i = 0; i < segments.length; i++) {
        const fullPath = "/" + segments.slice(0, i + 1).join("/")
        if (!nodeMap.has(fullPath)) {
          nodeMap.set(fullPath, {
            path: fullPath,
            type: i === segments.length - 1 ? "file" : "directory",
            children: [],
          })
        }
      }
    }

    // Second pass: link children to parents
    for (const [path, node] of nodeMap) {
      const segments = path.split("/").filter(Boolean)
      if (segments.length > 1) {
        const parentPath = "/" + segments.slice(0, -1).join("/")
        const parent = nodeMap.get(parentPath)
        if (parent && parent.children) {
          parent.children.push(node)
        }
      }
    }

    // Return root-level items (nodes without parents)
    const childPaths = new Set(nodeMap.keys())
    return Array.from(nodeMap.values()).filter((n) => {
      const segments = n.path.split("/").filter(Boolean)
      if (segments.length === 0) return false
      const parentPath = "/" + segments.slice(0, -1).join("/")
      return !childPaths.has(parentPath)
    }).sort((a, b) => {
      // Directories first, then files
      if (a.type !== b.type) return a.type === "directory" ? -1 : 1
      return a.path.localeCompare(b.path)
    })
  }, [files])

  const handleSelect = useCallback((path: string) => {
    actions.selectFile(path)
  }, [actions])

  return (
    <div className={cn("py-1", className)}>
      {tree.length === 0 ? (
        <p className="px-4 py-2 text-sm text-muted-foreground">No files</p>
      ) : (
        tree.map((item) => (
          <FileTreeItem
            key={item.path}
            item={item}
            depth={0}
            selectedFile={selectedFile}
            onSelect={handleSelect}
          />
        ))
      )}
    </div>
  )
}

// ============================================================================
// Header Component
// ============================================================================

interface FileTreeHeaderProps {
  className?: string
}

function FileTreeHeader({ className }: FileTreeHeaderProps) {
  return (
    <div className={cn("flex items-center px-4 py-2 border-b text-sm font-medium", className)}>
      <span>Files</span>
    </div>
  )
}

// ============================================================================
// Compound Component Export
// ============================================================================

export const FileTree = {
  Root: FileTreeRoot,
  List: FileTreeList,
  Header: FileTreeHeader,
}

// ============================================================================
// Convenience Hooks
// ============================================================================

export function useFileTreeActions() {
  return useFileTreeContext().actions
}

export function useSelectedFile() {
  return useFileTreeContext().selectedFile
}
