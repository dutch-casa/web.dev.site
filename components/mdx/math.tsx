"use client"

import katex from "katex"
import "katex/dist/katex.min.css"
import { cn } from "@/lib/utils"

type MathProps = {
  children: string
  className?: string
}

/**
 * Inline math: <Math>x^2 + y^2 = z^2</Math>
 * Content is rendered by KaTeX (trusted, not user input)
 */
export function Math({ children, className }: MathProps) {
  const html = katex.renderToString(children, {
    throwOnError: false,
    displayMode: false,
  })

  return (
    <span
      className={cn("math-inline", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

/**
 * Block/display math: <MathBlock>\sum_{i=0}^n x_i</MathBlock>
 * Content is rendered by KaTeX (trusted, not user input)
 */
export function MathBlock({ children, className }: MathProps) {
  const html = katex.renderToString(children, {
    throwOnError: false,
    displayMode: true,
  })

  return (
    <div
      className={cn("math-block my-6 overflow-x-auto text-center", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
