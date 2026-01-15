import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

// We'll implement these components
import { CodePreview, ExpandButton } from "@/components/editor/collapsed"

describe("CodePreview", () => {
  it("renders code content", async () => {
    const code = 'const hello = "world"'
    const { container } = render(<CodePreview code={code} language="typescript" />)

    // Wait for async highlighting to complete
    await new Promise(resolve => setTimeout(resolve, 100))

    // Should render code content in document
    expect(container.textContent).toContain("hello")
  })

  it("handles empty code", () => {
    const { container } = render(<CodePreview code="" language="typescript" />)
    expect(container).toBeTruthy()
  })
})

describe("ExpandButton", () => {
  it("renders button", () => {
    render(<ExpandButton onClick={() => {}} />)
    const button = screen.getByRole("button")
    expect(button).toBeTruthy()
  })

  it("calls onClick when clicked", () => {
    const onClick = vi.fn()
    render(<ExpandButton onClick={onClick} />)

    const button = screen.getByRole("button")
    fireEvent.click(button)

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
