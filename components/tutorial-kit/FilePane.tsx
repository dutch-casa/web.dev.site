"use client"

import { useCallback, useMemo, useState } from "react"
import {
  IconFile,
  IconFolder,
  IconFolderOpen,
  IconChevronRight,
  IconChevronDown,
  IconFileTypeTs,
  IconFileTypeJsx,
  IconFileTypeCss,
  IconFileTypeHtml,
  IconJson,
  IconBrandJavascript,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { ResizablePanel } from "@/components/ui/resizable"
import {
  useTutorialFilePaths,
  useTutorialActiveFile,
  useTutorialActions,
  useTutorialPanels,
} from "@/lib/tutorial-kit/context"

// ============================================================================
// File Icon Helper
// ============================================================================

function getFileIcon(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase()
  switch (ext) {
    case "ts":
    case "tsx":
      return <IconFileTypeTs className="w-4 h-4 text-blue-500" />
    case "js":
      return <IconBrandJavascript className="w-4 h-4 text-yellow-500" />
    case "jsx":
      return <IconFileTypeJsx className="w-4 h-4 text-cyan-500" />
    case "css":
      return <IconFileTypeCss className="w-4 h-4 text-purple-500" />
    case "html":
      return <IconFileTypeHtml className="w-4 h-4 text-orange-500" />
    case "json":
      return <IconJson className="w-4 h-4 text-yellow-600" />
    default:
      return <IconFile className="w-4 h-4 text-muted-foreground" />
  }
}

// ============================================================================
// File Tree Node
// ============================================================================

interface TreeNode {
  name: string
  path: string
  type: "file" | "directory"
  children?: TreeNode[]
}

function buildTree(paths: string[]): TreeNode[] {
  const root: TreeNode[] = []
  const nodeMap = new Map<string, TreeNode>()

  // Sort paths so directories come before files at each level
  const sortedPaths = [...paths].sort((a, b) => {
    const aSegments = a.split("/").filter(Boolean)
    const bSegments = b.split("/").filter(Boolean)
    // Compare segment by segment
    for (let i = 0; i < Math.min(aSegments.length, bSegments.length); i++) {
      if (aSegments[i] !== bSegments[i]) {
        return aSegments[i].localeCompare(bSegments[i])
      }
    }
    return aSegments.length - bSegments.length
  })

  for (const path of sortedPaths) {
    const segments = path.split("/").filter(Boolean)
    let currentPath = ""

    for (let i = 0; i < segments.length; i++) {
      const name = segments[i]
      const isLast = i === segments.length - 1
      currentPath = currentPath ? `${currentPath}/${name}` : `/${name}`

      if (!nodeMap.has(currentPath)) {
        const node: TreeNode = {
          name,
          path: currentPath,
          type: isLast ? "file" : "directory",
          children: isLast ? undefined : [],
        }
        nodeMap.set(currentPath, node)

        // Add to parent or root
        if (i === 0) {
          root.push(node)
        } else {
          const parentPath = "/" + segments.slice(0, i).join("/")
          const parent = nodeMap.get(parentPath)
          if (parent && parent.children) {
            parent.children.push(node)
          }
        }
      }
    }
  }

  // Sort children at each level (directories first, then alphabetically)
  const sortChildren = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "directory" ? -1 : 1
      }
      return a.name.localeCompare(b.name)
    })
    for (const node of nodes) {
      if (node.children) {
        sortChildren(node.children)
      }
    }
  }
  sortChildren(root)

  return root
}

// ============================================================================
// Tree Item Component
// ============================================================================

interface TreeItemProps {
  node: TreeNode
  depth: number
  selectedPath: string | null
  expandedPaths: Set<string>
  onSelect: (path: string) => void
  onToggle: (path: string) => void
}

function TreeItem({
  node,
  depth,
  selectedPath,
  expandedPaths,
  onSelect,
  onToggle,
}: TreeItemProps) {
  const isSelected = node.path === selectedPath
  const isExpanded = expandedPaths.has(node.path)
  const hasChildren = node.type === "directory" && node.children && node.children.length > 0

  const handleClick = () => {
    if (node.type === "file") {
      onSelect(node.path)
    } else {
      onToggle(node.path)
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "w-full flex items-center gap-1.5 px-2 py-1 text-sm",
          "hover:bg-muted/50 transition-colors rounded-sm",
          "focus:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          isSelected && "bg-primary/10 text-primary font-medium"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {/* Expand/collapse indicator */}
        <span className="w-4 h-4 flex items-center justify-center shrink-0">
          {hasChildren ? (
            isExpanded ? (
              <IconChevronDown className="w-3 h-3 text-muted-foreground" />
            ) : (
              <IconChevronRight className="w-3 h-3 text-muted-foreground" />
            )
          ) : (
            <span className="w-3 h-3" />
          )}
        </span>

        {/* Icon */}
        <span className="shrink-0">
          {node.type === "directory" ? (
            isExpanded ? (
              <IconFolderOpen className="w-4 h-4 text-yellow-500" />
            ) : (
              <IconFolder className="w-4 h-4 text-yellow-500" />
            )
          ) : (
            getFileIcon(node.name)
          )}
        </span>

        {/* Name */}
        <span className="truncate">{node.name}</span>
      </button>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeItem
              key={child.path}
              node={child}
              depth={depth + 1}
              selectedPath={selectedPath}
              expandedPaths={expandedPaths}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// FilePane Component
// ============================================================================

interface FilePaneProps {
  className?: string
  defaultSize?: number
  minSize?: number
}

export function FilePane({
  className,
  defaultSize = 20,
  minSize = 15,
}: FilePaneProps) {
  const filePaths = useTutorialFilePaths()
  const activeFile = useTutorialActiveFile()
  const actions = useTutorialActions()
  const panels = useTutorialPanels()

  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(() => {
    // Auto-expand all directories by default
    const expanded = new Set<string>()
    for (const path of filePaths) {
      const segments = path.split("/").filter(Boolean)
      for (let i = 1; i < segments.length; i++) {
        expanded.add("/" + segments.slice(0, i).join("/"))
      }
    }
    return expanded
  })

  const tree = useMemo(() => buildTree(filePaths), [filePaths])

  const handleSelect = useCallback(
    (path: string) => {
      actions.openFile(path)
    },
    [actions]
  )

  const handleToggle = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }, [])

  if (!panels.fileTree) return null

  return (
    <ResizablePanel
      defaultSize={defaultSize}
      minSize={minSize}
      className={cn("flex flex-col", className)}
    >
      <div className="flex items-center px-3 py-2 border-b bg-muted/20">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Files
        </span>
      </div>
      <div className="flex-1 overflow-auto py-1">
        {tree.map((node) => (
          <TreeItem
            key={node.path}
            node={node}
            depth={0}
            selectedPath={activeFile}
            expandedPaths={expandedPaths}
            onSelect={handleSelect}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </ResizablePanel>
  )
}
