import { describe, it, expect, vi, beforeEach } from "vitest"
import { bootContainer, mountFiles, installDependencies, startServer } from "@/components/editor/webcontainer"

// Mock WebContainer API
vi.mock("@webcontainer/api", () => ({
  WebContainer: {
    boot: vi.fn(() => Promise.resolve({
      mount: vi.fn(() => Promise.resolve()),
      spawn: vi.fn(() => ({
        exit: Promise.resolve(0),
        output: {
          pipeTo: vi.fn(),
          getReader: vi.fn(() => ({
            read: vi.fn()
              .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode("output\n") })
              .mockResolvedValueOnce({ done: true, value: undefined })
          }))
        }
      })),
      on: vi.fn(),
      fs: {
        writeFile: vi.fn(() => Promise.resolve()),
        readFile: vi.fn(() => Promise.resolve("content")),
        rm: vi.fn(() => Promise.resolve())
      }
    }))
  }
}))

describe("WebContainer Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("boots container", async () => {
    const container = await bootContainer()
    expect(container).toBeDefined()
  })

  it("mounts files to container", async () => {
    const container = await bootContainer()
    const files = {
      "package.json": JSON.stringify({ name: "test" }),
      "index.js": "console.log('hello')"
    }

    await mountFiles(container, files)
    expect(container.mount).toHaveBeenCalled()
  })

  it("installs dependencies", async () => {
    const container = await bootContainer()
    const onProgress = vi.fn()

    await installDependencies(container, onProgress)
    expect(container.spawn).toHaveBeenCalledWith("npm", ["install"])
  })

  it("starts dev server", async () => {
    const container = await bootContainer()
    const onOutput = vi.fn()

    await startServer(container, "npm run dev", onOutput)
    expect(container.spawn).toHaveBeenCalledWith("npm", ["run", "dev"])
  })
})
