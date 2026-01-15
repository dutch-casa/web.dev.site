import type { WebContainer, WebContainerProcess } from "@webcontainer/api"

export async function bootContainer(): Promise<WebContainer> {
  throw new Error("WebContainer not initialized")
}

export async function mountFiles(container: WebContainer, files: Record<string, string>): Promise<void> {
  throw new Error("WebContainer not initialized")
}

export async function createDirectory(container: WebContainer, path: string): Promise<void> {
  throw new Error("WebContainer not initialized")
}

export async function writeFile(container: WebContainer, path: string, content: string): Promise<void> {
  throw new Error("WebContainer not initialized")
}

export async function deleteFile(container: WebContainer, path: string): Promise<void> {
  throw new Error("WebContainer not initialized")
}

export async function installDependencies(
  container: WebContainer,
  onProgress?: (progress: number) => void
): Promise<void> {
  throw new Error("WebContainer not initialized")
}

export async function startServer(
  container: WebContainer,
  command: string,
  onOutput?: (line: string) => void
): Promise<WebContainerProcess> {
  throw new Error("WebContainer not initialized")
}
