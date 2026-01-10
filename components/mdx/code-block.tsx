"use client"

import { useState, type ComponentPropsWithoutRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { IconCheck, IconCopy } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

function CopyButton({ className, text }: { className?: string; text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "flex items-center gap-1.5 rounded-full bg-muted/80 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        className
      )}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="copied"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5"
          >
            <IconCheck className="size-3.5 text-green-500" />
            Copied
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5"
          >
            <IconCopy className="size-3.5" />
            Copy
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

export function CodeBlockWrapper({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
  const getTextContent = (node: React.ReactNode): string => {
    if (typeof node === "string") return node
    if (typeof node === "number") return String(node)
    if (!node) return ""
    if (Array.isArray(node)) return node.map(getTextContent).join("")
    if (typeof node === "object" && node !== null && "props" in node) {
      const element = node as { props?: { children?: React.ReactNode } }
      return getTextContent(element.props?.children)
    }
    return ""
  }

  const text = getTextContent(children)

  return (
    <div className="group relative my-6">
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <pre
          {...props}
          className="overflow-x-auto rounded-xl border border-muted-foreground/20 bg-muted/30 px-4 py-3.5 text-sm leading-relaxed [&>code]:bg-transparent [&>code]:p-0"
        >
          {children}
        </pre>
      </motion.div>
      <CopyButton
        text={text}
        className="absolute right-2.5 top-2.5 opacity-0 transition-opacity group-hover:opacity-100"
      />
    </div>
  )
}
