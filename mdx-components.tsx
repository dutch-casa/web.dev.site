import type { MDXComponents } from "mdx/types"
import type { ComponentPropsWithoutRef } from "react"

// MDX Components - only convenience wrappers, not compound component objects
import {
  Note,
  Warning,
  Tip,
  StarterCode,
  CodeSlidesSimple,
  YouTubeVideo,
  MultipleChoice,
  FillBlank,
  ShortAnswer,
  Exercise,
  SimpleExercise,
  ExerciseBlock,
  MermaidDiagram,
  Math,
  MathBlock,
} from "@/components/mdx"
import { CodeBlockWrapper } from "@/components/mdx/code-block"

// Base prose styles following design standards
const prose = {
  h1: "text-4xl font-bold tracking-tight mb-8 mt-12 first:mt-0",
  h2: "text-3xl font-semibold tracking-tight mb-6 mt-10",
  h3: "text-2xl font-semibold tracking-tight mb-4 mt-8",
  h4: "text-xl font-semibold mb-3 mt-6",
  p: "leading-relaxed mb-4",
  ul: "list-disc pl-6 mb-4 space-y-2",
  ol: "list-decimal pl-6 mb-4 space-y-2",
  li: "leading-relaxed",
  blockquote: "border-l-4 border-muted-foreground/30 pl-4 italic my-4",
  hr: "my-8 border-muted-foreground/20",
  a: "text-primary underline underline-offset-4 hover:text-primary/80 transition-colors",
  strong: "font-semibold",
  table: "w-full my-6 border-collapse",
  th: "border border-muted-foreground/20 px-4 py-2 text-left font-semibold bg-muted/50",
  td: "border border-muted-foreground/20 px-4 py-2",
} as const

function InlineCode({ children, ...props }: ComponentPropsWithoutRef<"code">) {
  // Shiki wraps code blocks in <code>, so only style inline code (no parent <pre>)
  return (
    <code
      {...props}
      className="rounded bg-muted/50 px-1.5 py-0.5 text-sm font-mono before:content-none after:content-none"
    >
      {children}
    </code>
  )
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Typography
    h1: (props) => <h1 {...props} className={prose.h1} />,
    h2: (props) => <h2 {...props} className={prose.h2} />,
    h3: (props) => <h3 {...props} className={prose.h3} />,
    h4: (props) => <h4 {...props} className={prose.h4} />,
    p: (props) => <p {...props} className={prose.p} />,
    ul: (props) => <ul {...props} className={prose.ul} />,
    ol: (props) => <ol {...props} className={prose.ol} />,
    li: (props) => <li {...props} className={prose.li} />,
    blockquote: (props) => <blockquote {...props} className={prose.blockquote} />,
    hr: (props) => <hr {...props} className={prose.hr} />,
    a: (props) => <a {...props} className={prose.a} />,
    strong: (props) => <strong {...props} className={prose.strong} />,
    table: (props) => <table {...props} className={prose.table} />,
    th: (props) => <th {...props} className={prose.th} />,
    td: (props) => <td {...props} className={prose.td} />,
    pre: CodeBlockWrapper,
    code: InlineCode,

    // Callouts
    Note,
    Warning,
    Tip,

    // Starter code links
    StarterCode,

    // Code slides (comparison/slideshow)
    CodeSlides: CodeSlidesSimple,

    // Video (YouTube)
    Video: YouTubeVideo,

    // Quiz components
    MultipleChoice,
    FillBlank,
    ShortAnswer,

    // Interactive exercises
    // - Exercise: File-based (loads from content/exercises/{id}/) - PREFERRED
    // - ExerciseBlock: Legacy inline files array
    Exercise,
    SimpleExercise,
    ExerciseBlock,

    // Math (KaTeX)
    Math,
    MathBlock,

    // Diagrams
    MermaidDiagram,

    ...components,
  }
}
