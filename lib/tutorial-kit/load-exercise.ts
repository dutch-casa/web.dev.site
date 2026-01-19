/**
 * Exercise Loader - Reads exercise projects from the filesystem
 *
 * Directory structure:
 *   content/exercises/{id}/
 *     ├── meta.yaml           # Exercise metadata
 *     ├── src/                 # Source files (editable)
 *     │   └── App.tsx
 *     └── solution/            # Optional solution files
 *         └── src/App.tsx
 *
 * Usage in MDX: <Exercise id="counter-exercise" />
 */

import { readFile, readdir, stat } from "node:fs/promises"
import { join, relative, dirname, basename } from "node:path"
import { parse as parseYaml } from "yaml"
import type { ExerciseConfig, ExerciseFile } from "./types"

// ----------------------------------------------------------------------------
// Paths
// ----------------------------------------------------------------------------

const EXERCISES_DIR = join(process.cwd(), "content", "exercises")

// Hidden files that form the scaffold (not shown in editor)
const SCAFFOLD_PATHS = new Set([
  "/package.json",
  "/vite.config.js",
  "/index.html",
  "/src/main.tsx",
])

// Files to exclude from loading
const EXCLUDED_FILES = new Set(["meta.yaml", "meta.json", ".DS_Store", "node_modules"])

// ----------------------------------------------------------------------------
// Meta Schema
// ----------------------------------------------------------------------------

interface ExerciseMeta {
  title: string
  description?: string
  focus?: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  scripts?: Record<string, string>
  devCommand?: string
  previewPort?: number
}

// ----------------------------------------------------------------------------
// File Walking
// ----------------------------------------------------------------------------

async function walkDirectory(dir: string, basePath = ""): Promise<Array<{ path: string; fullPath: string }>> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files: Array<{ path: string; fullPath: string }> = []

  for (const entry of entries) {
    if (EXCLUDED_FILES.has(entry.name)) continue
    if (entry.name.startsWith(".")) continue

    const fullPath = join(dir, entry.name)
    const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name

    if (entry.isDirectory()) {
      // Skip solution directory in main walk
      if (entry.name !== "solution") {
        const subFiles = await walkDirectory(fullPath, relativePath)
        files.push(...subFiles)
      }
    } else {
      files.push({ path: `/${relativePath}`, fullPath })
    }
  }

  return files
}

// ----------------------------------------------------------------------------
// Exercise Loading
// ----------------------------------------------------------------------------

export async function loadExercise(id: string): Promise<ExerciseConfig> {
  const exerciseDir = join(EXERCISES_DIR, id)

  // Verify directory exists
  try {
    const stats = await stat(exerciseDir)
    if (!stats.isDirectory()) {
      throw new Error(`Exercise "${id}" is not a directory`)
    }
  } catch (e) {
    throw new Error(`Exercise "${id}" not found at ${exerciseDir}`)
  }

  // Load meta.yaml
  let meta: ExerciseMeta
  try {
    const metaPath = join(exerciseDir, "meta.yaml")
    const metaContent = await readFile(metaPath, "utf-8")
    meta = parseYaml(metaContent) as ExerciseMeta
  } catch (e) {
    throw new Error(`Exercise "${id}" missing meta.yaml`)
  }

  // Walk exercise directory for source files
  const fileEntries = await walkDirectory(exerciseDir)

  // Load file contents
  const files: ExerciseFile[] = []
  for (const entry of fileEntries) {
    const content = await readFile(entry.fullPath, "utf-8")
    files.push({
      path: entry.path as `/${string}`,
      content: { kind: "inline", content },
      hidden: SCAFFOLD_PATHS.has(entry.path),
    })
  }

  // Check for solution directory
  let solution: ExerciseFile[] | undefined
  const solutionDir = join(exerciseDir, "solution")
  try {
    const solutionStats = await stat(solutionDir)
    if (solutionStats.isDirectory()) {
      const solutionEntries = await walkDirectory(solutionDir)
      solution = []
      for (const entry of solutionEntries) {
        const content = await readFile(entry.fullPath, "utf-8")
        solution.push({
          path: entry.path as `/${string}`,
          content: { kind: "inline", content },
        })
      }
    }
  } catch {
    // No solution directory - that's fine
  }

  // Merge with scaffold files
  const scaffoldFiles = getScaffoldFiles(meta)
  const userFilePaths = new Set(files.map((f) => f.path))
  const mergedFiles: ExerciseFile[] = [
    ...scaffoldFiles.filter((f) => !userFilePaths.has(f.path)),
    ...files,
  ]

  // Find first visible file for focus
  const firstVisibleFile = files.find((f) => !f.hidden)?.path ?? files[0]?.path

  return {
    id,
    title: meta.title,
    description: meta.description,
    files: mergedFiles,
    solution,
    dependencies: meta.dependencies ?? { react: "^18.2.0", "react-dom": "^18.2.0" },
    devDependencies: meta.devDependencies ?? { vite: "^5.0.0", "@vitejs/plugin-react": "^4.2.0" },
    scripts: meta.scripts ?? { dev: "vite", build: "vite build" },
    devCommand: meta.devCommand ?? "npm run dev",
    previewPort: meta.previewPort ?? 5173,
    focus: meta.focus ?? firstVisibleFile,
  }
}

// ----------------------------------------------------------------------------
// Scaffold Files (React + Vite defaults)
// ----------------------------------------------------------------------------

function getScaffoldFiles(meta: ExerciseMeta): ExerciseFile[] {
  const packageJson = {
    name: "exercise",
    version: "1.0.0",
    type: "module",
    scripts: meta.scripts ?? { dev: "vite", build: "vite build" },
    dependencies: meta.dependencies ?? { react: "^18.2.0", "react-dom": "^18.2.0" },
    devDependencies: meta.devDependencies ?? { vite: "^5.0.0", "@vitejs/plugin-react": "^4.2.0" },
  }

  return [
    {
      path: "/package.json",
      content: { kind: "inline", content: JSON.stringify(packageJson, null, 2) },
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
  ]
}

// ----------------------------------------------------------------------------
// List Available Exercises
// ----------------------------------------------------------------------------

export async function listExercises(): Promise<string[]> {
  try {
    const entries = await readdir(EXERCISES_DIR, { withFileTypes: true })
    return entries.filter((e) => e.isDirectory()).map((e) => e.name)
  } catch {
    return []
  }
}

// ----------------------------------------------------------------------------
// Check if Exercise Exists
// ----------------------------------------------------------------------------

export async function exerciseExists(id: string): Promise<boolean> {
  try {
    const exerciseDir = join(EXERCISES_DIR, id)
    const stats = await stat(exerciseDir)
    return stats.isDirectory()
  } catch {
    return false
  }
}
