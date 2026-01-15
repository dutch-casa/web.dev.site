"use client"

import { useMemo, Children, type ReactNode, type ReactElement } from "react"
import { ResizableHandle } from "@/components/ui/resizable"
import { TutorialKit, FilePane, EditorPane, OutputPane } from "@/components/tutorial-kit"
import type { ExerciseConfig, ExerciseFile, FileContent } from "@/lib/tutorial-kit/types"

// ============================================================================
// Exercise.File - Define a file inline in MDX
// ============================================================================

interface ExerciseFileProps {
  path: `/${string}`
  children: string
  hidden?: boolean
  readonly?: boolean
}

function ExerciseFile(_props: ExerciseFileProps): null {
  // This component is only used for its props, it doesn't render anything
  return null
}

// ============================================================================
// Exercise.Solution - Define solution files (optional)
// ============================================================================

interface ExerciseSolutionProps {
  children: ReactNode
}

function ExerciseSolution(_props: ExerciseSolutionProps): null {
  return null
}

// ============================================================================
// Helper: Extract file definitions from children
// ============================================================================

function extractFiles(children: ReactNode): ExerciseFile[] {
  const files: ExerciseFile[] = []

  Children.forEach(children, (child) => {
    if (!child || typeof child !== "object") return
    const element = child as ReactElement<ExerciseFileProps>

    // Check if this is an ExerciseFile component
    if (element.type === ExerciseFile) {
      const { path, children: content, hidden, readonly } = element.props
      files.push({
        path,
        content: { kind: "inline", content: content?.trim() ?? "" },
        hidden,
        readonly,
      })
    }
  })

  return files
}

function extractSolutionFiles(children: ReactNode): ExerciseFile[] | undefined {
  let solutionFiles: ExerciseFile[] | undefined

  Children.forEach(children, (child) => {
    if (!child || typeof child !== "object") return
    const element = child as ReactElement<ExerciseSolutionProps>

    if (element.type === ExerciseSolution) {
      solutionFiles = extractFiles(element.props.children)
    }
  })

  return solutionFiles
}

// ============================================================================
// Exercise Root - Main MDX component
// ============================================================================

interface ExerciseRootProps {
  /** Unique identifier for this exercise */
  id: string
  /** Display title */
  title: string
  /** Optional description shown in collapsed state */
  description?: string
  /** Initial file to focus (defaults to first file) */
  focus?: string
  /** NPM dependencies */
  dependencies?: Record<string, string>
  /** NPM dev dependencies */
  devDependencies?: Record<string, string>
  /** Custom scripts */
  scripts?: Record<string, string>
  /** Dev command (defaults to "npm run dev") */
  devCommand?: string
  /** Preview port (defaults to 5173 for Vite) */
  previewPort?: number
  /** Start expanded */
  defaultExpanded?: boolean
  /** Height of expanded workspace */
  height?: number
  /** Children - Exercise.File components */
  children: ReactNode
  /** Additional className */
  className?: string
}

function ExerciseRoot({
  id,
  title,
  description,
  focus,
  dependencies,
  devDependencies,
  scripts,
  devCommand,
  previewPort,
  defaultExpanded = false,
  height = 600,
  children,
  className,
}: ExerciseRootProps) {
  // Extract file definitions from children
  const config = useMemo<ExerciseConfig>(() => {
    const files = extractFiles(children)
    const solution = extractSolutionFiles(children)

    // Provide sensible defaults if no files specified
    const effectiveFiles = files.length > 0 ? files : getDefaultReactFiles()

    return {
      id,
      title,
      description,
      files: effectiveFiles,
      solution,
      dependencies: dependencies ?? { react: "^18.2.0", "react-dom": "^18.2.0" },
      devDependencies: devDependencies ?? { vite: "^5.0.0", "@vitejs/plugin-react": "^4.2.0" },
      scripts: scripts ?? { dev: "vite", build: "vite build" },
      devCommand: devCommand ?? "npm run dev",
      previewPort: previewPort ?? 5173,
      focus: focus ?? effectiveFiles[0]?.path,
    }
  }, [id, title, description, focus, dependencies, devDependencies, scripts, devCommand, previewPort, children])

  return (
    <TutorialKit.Root config={config} defaultExpanded={defaultExpanded} className={className}>
      <TutorialKit.Collapsed />
      <TutorialKit.Expanded height={height}>
        <TutorialKit.Toolbar />
        <TutorialKit.Workspace>
          <FilePane />
          <EditorPane />
          <OutputPane />
        </TutorialKit.Workspace>
      </TutorialKit.Expanded>
    </TutorialKit.Root>
  )
}

// ============================================================================
// Default React project files
// ============================================================================

function getDefaultReactFiles(): ExerciseFile[] {
  return [
    {
      path: "/package.json",
      content: {
        kind: "inline",
        content: JSON.stringify(
          {
            name: "exercise",
            version: "1.0.0",
            type: "module",
            scripts: { dev: "vite", build: "vite build" },
            dependencies: { react: "^18.2.0", "react-dom": "^18.2.0" },
            devDependencies: { vite: "^5.0.0", "@vitejs/plugin-react": "^4.2.0" },
          },
          null,
          2
        ),
      },
      hidden: true,
    },
    {
      path: "/vite.config.js",
      content: {
        kind: "inline",
        content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, host: true }
})`,
      },
      hidden: true,
    },
    {
      path: "/index.html",
      content: {
        kind: "inline",
        content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Exercise</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
      },
      hidden: true,
    },
    {
      path: "/src/main.tsx",
      content: {
        kind: "inline",
        content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`,
      },
      hidden: true,
    },
    {
      path: "/src/App.tsx",
      content: {
        kind: "inline",
        content: `export default function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Hello, World!</h1>
      <p>Edit this file to get started.</p>
    </div>
  )
}`,
      },
    },
  ]
}

// ============================================================================
// Compound Export (for JSX usage)
// ============================================================================

export const Exercise = {
  Root: ExerciseRoot,
  File: ExerciseFile,
  Solution: ExerciseSolution,
}

// ============================================================================
// MDX-friendly convenience wrappers
// ============================================================================

/**
 * MDX-friendly Exercise component with files as array prop
 */
export function ExerciseBlock({
  id,
  title,
  description,
  focus,
  files,
  solution,
  dependencies,
  devDependencies,
  scripts,
  devCommand,
  previewPort,
  defaultExpanded = false,
  height = 600,
  className,
}: {
  id: string
  title: string
  description?: string
  focus?: string
  files: Array<{
    path: `/${string}`
    content: string
    hidden?: boolean
    readonly?: boolean
  }>
  solution?: Array<{
    path: `/${string}`
    content: string
  }>
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  scripts?: Record<string, string>
  devCommand?: string
  previewPort?: number
  defaultExpanded?: boolean
  height?: number
  className?: string
}) {
  const config = useMemo<ExerciseConfig>(() => {
    // Start with scaffold files (hidden by default)
    const scaffoldFiles = getDefaultReactFiles()

    // Convert user files to ExerciseFile format
    const userFiles: ExerciseFile[] = files.map((f) => ({
      path: f.path,
      content: { kind: "inline" as const, content: f.content },
      hidden: f.hidden ?? false, // User files visible by default
      readonly: f.readonly,
    }))

    // Merge: scaffold first, then overlay user files (replacing matching paths)
    const userFilePaths = new Set(userFiles.map((f) => f.path))
    const mergedFiles: ExerciseFile[] = [
      // Keep scaffold files that aren't overridden by user
      ...scaffoldFiles.filter((f) => !userFilePaths.has(f.path)),
      // Add all user files (they take precedence)
      ...userFiles,
    ]

    const solutionFiles: ExerciseFile[] | undefined = solution?.map((f) => ({
      path: f.path,
      content: { kind: "inline" as const, content: f.content },
    }))

    // Find the first visible user file for focus, or first user file
    const firstVisibleUserFile = userFiles.find((f) => !f.hidden)?.path ?? userFiles[0]?.path

    return {
      id,
      title,
      description,
      files: mergedFiles,
      solution: solutionFiles,
      dependencies: dependencies ?? { react: "^18.2.0", "react-dom": "^18.2.0" },
      devDependencies: devDependencies ?? { vite: "^5.0.0", "@vitejs/plugin-react": "^4.2.0" },
      scripts: scripts ?? { dev: "vite", build: "vite build" },
      devCommand: devCommand ?? "npm run dev",
      previewPort: previewPort ?? 5173,
      focus: focus ?? firstVisibleUserFile ?? mergedFiles[0]?.path,
    }
  }, [id, title, description, focus, files, solution, dependencies, devDependencies, scripts, devCommand, previewPort])

  return (
    <TutorialKit.Root config={config} defaultExpanded={defaultExpanded} className={className}>
      <TutorialKit.Collapsed />
      <TutorialKit.Expanded height={height}>
        <TutorialKit.Toolbar />
        <TutorialKit.Workspace>
          <FilePane />
          <EditorPane />
          <OutputPane />
        </TutorialKit.Workspace>
      </TutorialKit.Expanded>
    </TutorialKit.Root>
  )
}

// ============================================================================
// Convenience Export for Simple Usage
// ============================================================================

/**
 * Simple exercise component for quick exercises with minimal config.
 * Use Exercise.Root for full control.
 */
export function SimpleExercise({
  id,
  title,
  description,
  code,
  className,
}: {
  id: string
  title: string
  description?: string
  code: string
  className?: string
}) {
  const config = useMemo<ExerciseConfig>(() => {
    const files = getDefaultReactFiles()
    // Replace App.tsx content with provided code
    const appFileIndex = files.findIndex((f) => f.path === "/src/App.tsx")
    if (appFileIndex !== -1) {
      files[appFileIndex] = {
        ...files[appFileIndex],
        content: { kind: "inline", content: code.trim() },
      }
    }

    return {
      id,
      title,
      description,
      files,
      dependencies: { react: "^18.2.0", "react-dom": "^18.2.0" },
      devDependencies: { vite: "^5.0.0", "@vitejs/plugin-react": "^4.2.0" },
      scripts: { dev: "vite", build: "vite build" },
      devCommand: "npm run dev",
      previewPort: 5173,
      focus: "/src/App.tsx",
    }
  }, [id, title, description, code])

  return (
    <TutorialKit.Root config={config} className={className}>
      <TutorialKit.Collapsed />
      <TutorialKit.Expanded>
        <TutorialKit.Toolbar />
        <TutorialKit.Workspace>
          <FilePane />
          <EditorPane />
          <OutputPane />
        </TutorialKit.Workspace>
      </TutorialKit.Expanded>
    </TutorialKit.Root>
  )
}
