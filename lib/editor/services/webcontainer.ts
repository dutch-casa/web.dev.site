// WebContainer Service - Singleton for WebContainer lifecycle management
import { WebContainer, type FileSystemTree, type DirectoryNode, type FileSystemAPI } from "@webcontainer/api"
import type { TutorialConfig } from "../types"
import { FilesystemError } from "../types"

// Singleton state
let _instance: WebContainer | null = null
let _booting: Promise<WebContainer> | null = null
let _workdirName = "tutorial"

// Event emitter for file changes (simple pub/sub)
type FileChangeCallback = (event: { type: string; path: string }) => void
const _fileChangeListeners = new Set<FileChangeCallback>()

export function onFileChange(callback: FileChangeCallback): () => void {
  _fileChangeListeners.add(callback)
  return () => _fileChangeListeners.delete(callback)
}

function _emitFileChange(event: { type: string; path: string }) {
  _fileChangeListeners.forEach((cb) => cb(event))
}

// Ignore counters to prevent sync loops (Editor -> FS -> Watcher -> Editor)
const _ignoreEvents = new Map<string, number>()

function _shouldIgnoreEvent(path: string): boolean {
  const count = _ignoreEvents.get(path) ?? 0
  if (count > 0) {
    _ignoreEvents.set(path, count - 1)
    return true
  }
  return false
}

function _ignoreNextEvent(path: string) {
  const count = _ignoreEvents.get(path) ?? 0
  _ignoreEvents.set(path, count + 1)
}

// Convert flat file templates to WebContainer file tree
function _toFileTree(files: Record<string, string>): FileSystemTree {
  const root: FileSystemTree = {}

  for (const filePath in files) {
    const segments = filePath.split("/").filter(Boolean)
    let current: FileSystemTree = root

    for (let i = 0; i < segments.length; i++) {
      const name = segments[i]
      const isLast = i === segments.length - 1

      if (isLast) {
        current[name] = { file: { contents: files[filePath] } }
      } else {
        if (!current[name]) {
          current[name] = { directory: {} }
        }
        current = (current[name] as DirectoryNode).directory
      }
    }
  }

  return root
}

// Boot WebContainer (singleton pattern)
export async function bootWebContainer(options?: { workdirName?: string }): Promise<WebContainer> {
  if (_instance) return _instance
  if (_booting) return _booting

  if (options?.workdirName) {
    _workdirName = options.workdirName
  }

  _booting = WebContainer.boot({ workdirName: _workdirName }).then(async (instance) => {
    _instance = instance

    // Set up file watching to sync FS changes back to editor
    await instance.fs.watch(".", { recursive: true }, (eventType, filename) => {
      if (!filename) return
      const path = `/${filename}`
      if (_shouldIgnoreEvent(path)) return
      _emitFileChange({ type: eventType, path })
    })

    return instance
  })

  return _booting
}

// Get instance (throws if not booted)
export function getWebContainer(): WebContainer {
  if (!_instance) {
    throw new Error("WebContainer not booted. Call bootWebContainer() first.")
  }
  return _instance
}

// Clear all files in the workdir (for fresh mounts)
async function clearWorkdir(): Promise<void> {
  const instance = getWebContainer()
  try {
    const entries = await instance.fs.readdir(".")
    for (const entry of entries) {
      // Skip node_modules to avoid slow reinstalls if deps haven't changed
      if (entry === "node_modules") continue
      try {
        await instance.fs.rm(entry, { recursive: true })
      } catch {
        // Ignore errors for files that don't exist
      }
    }
  } catch {
    // Directory might not exist yet
  }
}

// Mount files to WebContainer (clears old files first)
export async function mountFiles(files: Record<string, string>, options?: { clean?: boolean }): Promise<void> {
  const instance = getWebContainer()

  // Clear old files if requested (default: true for fresh slate)
  if (options?.clean !== false) {
    await clearWorkdir()
  }

  const tree = _toFileTree(files)

  // Increment ignore counters for all files being mounted
  for (const path in files) {
    _ignoreNextEvent(path)
  }

  await instance.mount(tree)
}

// Write single file
export async function writeFile(path: string, content: string): Promise<void> {
  const instance = getWebContainer()
  _ignoreNextEvent(path)
  await instance.fs.writeFile(path, content)
}

// Write multiple files (batch operation)
export async function writeFiles(files: Record<string, string>): Promise<void> {
  const instance = getWebContainer()

  // Increment ignore counters for all files
  for (const path in files) {
    _ignoreNextEvent(path)
  }

  await Promise.all(Object.entries(files).map(([path, content]) => instance.fs.writeFile(path, content)))
}

// Read single file
export async function readFile(path: string): Promise<string> {
  const instance = getWebContainer()
  return instance.fs.readFile(path, "utf-8")
}

// Delete file
export async function deleteFile(path: string): Promise<void> {
  const instance = getWebContainer()
  _ignoreNextEvent(path)
  await instance.fs.rm(path)
}

// Create directory
export async function createDirectory(path: string): Promise<void> {
  const instance = getWebContainer()
  await instance.fs.mkdir(path, { recursive: true })
}

// Check if file exists
export async function fileExists(path: string): Promise<boolean> {
  try {
    const instance = getWebContainer()
    // @ts-expect-error stat exists on FileSystemAPI
    await instance.fs.stat(path)
    return true
  } catch {
    return false
  }
}

// List directory contents
export async function listDirectory(path: string): Promise<string[]> {
  const instance = getWebContainer()
  const entries = await instance.fs.readdir(path)
  return entries
}

// Spawn process
export async function spawn(
  command: string,
  args: string[],
  options?: { terminal?: { cols: number; rows: number } }
) {
  const instance = getWebContainer()
  return instance.spawn(command, args, options)
}

// Install dependencies
export async function installDependencies(deps: Record<string, string>): Promise<void> {
  const instance = getWebContainer()

  // Write package.json
  const packageJson = {
    name: "tutorial-project",
    version: "1.0.0",
    dependencies: deps,
  }

  await writeFile("/package.json", JSON.stringify(packageJson, null, 2))

  // Run npm install
  const process = await spawn("npm", ["install"])

  return new Promise<void>((resolve, reject) => {
    process.exit.then((code) => {
      if (code === 0) resolve()
      else reject(new Error(`npm install failed with exit code ${code}`))
    })
  })
}

// Run script
export async function runScript(scriptName: string): Promise<{ exit: Promise<number>; output: ReadableStream }> {
  return spawn("npm", ["run", scriptName])
}

// File operations with error handling
export async function createFile(path: string, content: string): Promise<void> {
  if (await fileExists(path)) {
    throw new FilesystemError("FILE_EXISTS", path)
  }
  await writeFile(path, content)
}

export async function renameFile(oldPath: string, newPath: string): Promise<void> {
  const content = await readFile(oldPath)
  await writeFile(newPath, content)
  await deleteFile(oldPath)
}

// Export functions for external use
export const webcontainerService = {
  boot: bootWebContainer,
  get: getWebContainer,
  mount: mountFiles,
  writeFile,
  writeFiles,
  readFile,
  deleteFile,
  createDirectory,
  fileExists,
  listDirectory,
  spawn,
  installDependencies,
  runScript,
  createFile,
  renameFile,
  onFileChange,
}

// Cleanup (for testing or unmount)
export async function disposeWebContainer(): Promise<void> {
  _instance = null
  _booting = null
  _fileChangeListeners.clear()
  _ignoreEvents.clear()
}
