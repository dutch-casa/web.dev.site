import { WebContainer, type FileSystemTree, type WebContainerProcess } from "@webcontainer/api"

/**
 * IndexedDB storage for persistent file changes
 */
namespace Storage {
  const DB_NAME = "web-dev-playground"
  const STORE_NAME = "files"
  const DB_VERSION = 1

  interface FileEntry {
    path: string
    content: string
    modifiedAt: number
  }

  let dbPromise: Promise<IDBDatabase> | null = null

  function openDB(): Promise<IDBDatabase> {
    if (typeof window === "undefined") {
      return Promise.reject(new Error("IndexedDB not available"))
    }

    if (dbPromise) return dbPromise

    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "path" })
        }
      }
    })

    return dbPromise
  }

  export async function save(path: string, content: string): Promise<void> {
    try {
      const db = await openDB()
      const entry: FileEntry = { path, content, modifiedAt: Date.now() }

      const transaction = db.transaction(STORE_NAME, "readwrite")
      transaction.objectStore(STORE_NAME).put(entry)
    } catch (error) {
      console.error("[PlaygroundStorage] Save failed:", error)
    }
  }

  export async function load(path: string): Promise<string | null> {
    try {
      const db = await openDB()
      return new Promise<string | null>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readonly")
        const request = transaction.objectStore(STORE_NAME).get(path)

        request.onerror = () => reject(request.error)
        request.onsuccess = () => {
          const entry = request.result as FileEntry | undefined
          resolve(entry?.content ?? null)
        }
      })
    } catch {
      return null
    }
  }

  export async function remove(path: string): Promise<void> {
    try {
      const db = await openDB()
      const transaction = db.transaction(STORE_NAME, "readwrite")
      transaction.objectStore(STORE_NAME).delete(path)
    } catch (error) {
      console.error("[PlaygroundStorage] Remove failed:", error)
    }
  }

  export async function list(): Promise<string[]> {
    try {
      const db = await openDB()
      return new Promise<string[]>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readonly")
        const request = transaction.objectStore(STORE_NAME).getAllKeys()

        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve((request.result as string[]) || [])
      })
    } catch {
      return []
    }
  }

  export async function loadAll(): Promise<Record<string, string>> {
    try {
      const db = await openDB()
      return new Promise<Record<string, string>>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readonly")
        const request = transaction.objectStore(STORE_NAME).getAll()

        request.onerror = () => reject(request.error)
        request.onsuccess = () => {
          const entries = request.result as FileEntry[]
          const files: Record<string, string> = {}
          for (const entry of entries) {
            files[entry.path] = entry.content
          }
          resolve(files)
        }
      })
    } catch {
      return {}
    }
  }

  export async function clear(): Promise<void> {
    try {
      const db = await openDB()
      const transaction = db.transaction(STORE_NAME, "readwrite")
      transaction.objectStore(STORE_NAME).clear()
    } catch (error) {
      console.error("[PlaygroundStorage] Clear failed:", error)
    }
  }
}

/**
 * Terminal line buffer for processing streaming output
 */
class TerminalBuffer {
  private buffer = ""
  private lines: string[] = []

  append(chunk: string): string[] {
    this.buffer += chunk
    const newLines = this.buffer.split("\n")
    this.buffer = newLines.pop() || ""

    for (const line of newLines) {
      const cleaned = this.stripAnsi(line.trim())
      if (cleaned) {
        this.lines.push(cleaned)
      }
    }

    const result = [...this.lines]
    this.lines = []
    return result
  }

  flush(): string[] {
    if (this.buffer.trim()) {
      const cleaned = this.stripAnsi(this.buffer.trim())
      if (cleaned) {
        this.lines.push(cleaned)
      }
    }
    const result = [...this.lines]
    this.lines = []
    this.buffer = ""
    return result
  }

  private stripAnsi(str: string): string {
    return str.replace(/\x1b\[[0-9;]*m/g, "").replace(/\x1b\[[0-9;]*[a-zA-Z]/g, "")
  }
}

type BootStatus = "idle" | "booting" | "ready" | "error"
type InstallStatus = "idle" | "installing" | "ready" | "error"
type ServerStatus = "idle" | "starting" | "ready" | "error"

export type PlaygroundStatus = {
  boot: BootStatus
  install: InstallStatus
  server: ServerStatus
  previewUrl: string | null
  error: string | null
  terminalOutput: string[]
}

type StatusListener = (status: PlaygroundStatus) => void

class PlaygroundFacade {
  private static instance: PlaygroundFacade | null = null

  private container: WebContainer | null = null
  private bootPromise: Promise<WebContainer> | null = null
  private listeners = new Set<StatusListener>()

  private status: PlaygroundStatus = {
    boot: "idle",
    install: "idle",
    server: "idle",
    previewUrl: null,
    error: null,
    terminalOutput: [],
  }

  private terminalBuffer = new TerminalBuffer()

  private constructor() {}

  static getInstance(): PlaygroundFacade {
    if (!PlaygroundFacade.instance) {
      PlaygroundFacade.instance = new PlaygroundFacade()
    }
    return PlaygroundFacade.instance
  }

  get storage() {
    return Storage
  }

  subscribe(listener: StatusListener): () => void {
    this.listeners.add(listener)
    listener(this.status)
    return () => this.listeners.delete(listener)
  }

  private updateStatus(update: Partial<PlaygroundStatus>): void {
    this.status = { ...this.status, ...update }
    this.listeners.forEach((listener) => listener(this.status))
  }

  private addTerminalLines(lines: string[]): void {
    if (lines.length > 0) {
      this.updateStatus({
        terminalOutput: [...this.status.terminalOutput, ...lines],
      })
    }
  }

  async boot(): Promise<WebContainer> {
    if (this.container) {
      return this.container
    }

    if (this.bootPromise) {
      return this.bootPromise
    }

    this.updateStatus({ boot: "booting", error: null })
    this.addTerminalLines(["Booting WebContainer..."])

    this.bootPromise = WebContainer.boot()
      .then((container) => {
        this.container = container
        this.updateStatus({ boot: "ready" })
        this.addTerminalLines(["✓ WebContainer ready"])
        return container
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : "Boot failed"
        this.updateStatus({ boot: "error", error: message })
        this.addTerminalLines([`✗ Boot failed: ${message}`])
        this.bootPromise = null
        throw err
      })

    return this.bootPromise
  }

  async mountFiles(files: FileSystemTree): Promise<void> {
    const container = await this.boot()
    this.addTerminalLines(["Mounting files..."])
    await container.mount(files)
    this.addTerminalLines(["✓ Files mounted"])
  }

  async install(): Promise<void> {
    const container = await this.boot()

    this.updateStatus({ install: "installing" })
    this.addTerminalLines(["", "→ Installing dependencies..."])

    const installProcess = await container.spawn("npm", ["install"])
    await this.streamProcessOutput(installProcess)

    const exitCode = await installProcess.exit

    if (exitCode !== 0) {
      this.updateStatus({ install: "error", error: `npm install failed with code ${exitCode}` })
      this.addTerminalLines([`✗ npm install failed (exit code: ${exitCode})`])
      throw new Error(`npm install failed with code ${exitCode}`)
    }

    this.updateStatus({ install: "ready" })
    this.addTerminalLines(["✓ Dependencies installed"])
  }

  async startServer(command: string = "npm run dev"): Promise<string> {
    const container = await this.boot()

    this.updateStatus({ server: "starting" })
    this.addTerminalLines(["", "→ Starting development server..."])

    const [cmd, ...args] = command.split(" ")
    const serverProcess = await container.spawn(cmd, args)
    await this.streamProcessOutput(serverProcess)

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Server startup timed out"))
      }, 60000)

      container.on("server-ready", (port, url) => {
        clearTimeout(timeout)
        this.updateStatus({ server: "ready", previewUrl: url })
        this.addTerminalLines([`✓ Server ready at ${url}`, "", "Press Ctrl+C to stop the server"])
        resolve(url)
      })
    })
  }

  private async streamProcessOutput(process: WebContainerProcess): Promise<void> {
    try {
      const reader = process.output.getReader()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const newLines = this.terminalBuffer.append(value)
        this.addTerminalLines(newLines)
      }

      const remainingLines = this.terminalBuffer.flush()
      this.addTerminalLines(remainingLines)
    } catch {
      const remainingLines = this.terminalBuffer.flush()
      this.addTerminalLines(remainingLines)
    }
  }

  async writeFile(path: string, content: string): Promise<void> {
    const container = await this.boot()
    await container.fs.writeFile(path, content)
    await Storage.save(path, content)
  }

  async readFile(path: string): Promise<string> {
    const container = await this.boot()
    return container.fs.readFile(path, "utf-8")
  }

  async listFiles(path: string = "/"): Promise<string[]> {
    const container = await this.boot()
    try {
      const entries = await container.fs.readdir(path, { withFileTypes: true })
      return entries.map((e) => (e.isDirectory() ? `${e.name}/` : e.name))
    } catch {
      return []
    }
  }

  async deleteFile(path: string): Promise<void> {
    const container = await this.boot()
    await container.fs.rm(path, { recursive: true })
    await Storage.remove(path)
  }

  async createDirectory(path: string): Promise<void> {
    const container = await this.boot()
    await container.fs.mkdir(path, { recursive: true })
  }

  async renameFile(oldPath: string, newPath: string): Promise<void> {
    const container = await this.boot()
    const content = await container.fs.readFile(oldPath, "utf-8")
    await container.fs.writeFile(newPath, content)
    await container.fs.rm(oldPath, { recursive: true })
    await Storage.remove(oldPath)
    await Storage.save(newPath, content)
  }

  reset(): void {
    this.terminalBuffer = new TerminalBuffer()
    this.updateStatus({
      install: "idle",
      server: "idle",
      previewUrl: null,
      error: null,
      terminalOutput: [],
    })
  }

  getStatus(): PlaygroundStatus {
    return this.status
  }
}

export const playgroundFacade = PlaygroundFacade.getInstance()

export function filesToTree(files: Record<string, string>): FileSystemTree {
  const tree: FileSystemTree = {}

  for (const [path, contents] of Object.entries(files)) {
    const parts = path.split("/")
    let current = tree

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]
      if (!current[part]) {
        current[part] = { directory: {} }
      }
      const node = current[part]
      if ("directory" in node) {
        current = node.directory
      }
    }

    const fileName = parts[parts.length - 1]
    current[fileName] = { file: { contents } }
  }

  return tree
}
