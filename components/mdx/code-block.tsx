import type { ComponentPropsWithoutRef, ReactNode, ReactElement } from "react"
import { highlightCode } from "@/lib/shiki"
import { CopyButton } from "./copy-button"

// Extract text content from React node tree
function getTextContent(node: ReactNode): string {
  if (typeof node === "string") return node
  if (typeof node === "number") return String(node)
  if (!node) return ""
  if (Array.isArray(node)) return node.map(getTextContent).join("")
  if (typeof node === "object" && node !== null && "props" in node) {
    const element = node as { props?: { children?: ReactNode } }
    return getTextContent(element.props?.children)
  }
  return ""
}

// Extract language from code element className (e.g., "language-typescript")
function getLanguage(children: ReactNode): string {
  if (
    children &&
    typeof children === "object" &&
    "props" in children
  ) {
    const element = children as ReactElement<{ className?: string }>
    const className = element.props?.className || ""
    const match = className.match(/language-(\w+)/)
    return match ? match[1] : "text"
  }
  return "text"
}

function isMermaidBlock(children: ReactNode): boolean {
  if (
    children &&
    typeof children === "object" &&
    "props" in children
  ) {
    const element = children as ReactElement<{ className?: string }>
    const className = element.props?.className || ""
    return className.includes("language-mermaid")
  }
  return false
}

export async function PreWrapper({
  children,
}: ComponentPropsWithoutRef<"pre">) {
  if (isMermaidBlock(children)) {
    const { MermaidDiagram } = await import("./mermaid-diagram")
    const code = getTextContent(children).trim()
    return <MermaidDiagram chart={code} />
  }

  const code = getTextContent(children).trim()
  const lang = getLanguage(children)

  const highlightedHtml = await highlightCode(code, lang)

  return (
    <div className="group relative my-6">
      <div
        className="overflow-x-auto rounded-xl border border-white/10 text-sm leading-relaxed font-[family-name:var(--font-jetbrains-mono)] [&_pre]:!bg-[#121212] [&_pre]:px-4 [&_pre]:py-3.5 [&_pre]:m-0 [&_code]:!bg-transparent"
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />
      <CopyButton
        text={code}
        className="absolute right-2.5 top-2.5 opacity-0 transition-opacity group-hover:opacity-100"
      />
    </div>
  )
}

// Export as CodeBlockWrapper for backwards compatibility
export { PreWrapper as CodeBlockWrapper }
