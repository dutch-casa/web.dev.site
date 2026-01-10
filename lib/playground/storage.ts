"use client"

const DB_NAME = "web-dev-playground"
const STORE_NAME = "files"
const DB_VERSION = 1

interface FileEntry {
  path: string
  content: string
  modifiedAt: number
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("IndexedDB not available"))
      return
    }

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
}

export async function saveFileToStorage(path: string, content: string): Promise<void> {
  try {
    const db = await openDB()
    const entry: FileEntry = {
      path,
      content,
      modifiedAt: Date.now(),
    }

    const transaction = db.transaction(STORE_NAME, "readwrite")
    const store = transaction.objectStore(STORE_NAME)
    store.put(entry)
  } catch (error) {
    console.error("Failed to save file to IndexedDB:", error)
  }
}

export async function loadFileFromStorage(path: string): Promise<string | null> {
  try {
    const db = await openDB()
    return new Promise<string | null>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly")
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(path)

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

export async function deleteFileFromStorage(path: string): Promise<void> {
  try {
    const db = await openDB()
    const transaction = db.transaction(STORE_NAME, "readwrite")
    const store = transaction.objectStore(STORE_NAME)
    store.delete(path)
  } catch (error) {
    console.error("Failed to delete file from IndexedDB:", error)
  }
}

export async function listFilesFromStorage(): Promise<string[]> {
  try {
    const db = await openDB()
    return new Promise<string[]>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly")
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAllKeys()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const keys = request.result as string[]
        resolve(keys)
      }
    })
  } catch {
    return []
  }
}

export async function clearStorage(): Promise<void> {
  try {
    const db = await openDB()
    const transaction = db.transaction(STORE_NAME, "readwrite")
    const store = transaction.objectStore(STORE_NAME)
    store.clear()
  } catch (error) {
    console.error("Failed to clear IndexedDB:", error)
  }
}

export async function loadAllFilesFromStorage(): Promise<Record<string, string>> {
  try {
    const db = await openDB()
    return new Promise<Record<string, string>>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly")
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

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
