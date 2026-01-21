"use client"

import type { ReactNode } from "react"
import { IconExternalLink } from "@tabler/icons-react"

type ExternalLinkProps = {
  href: string
  children: ReactNode
}

export function ExternalLink({ href, children }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group my-4 flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all duration-150 ease-out hover:bg-muted/50 hover:border-primary"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:text-foreground transition-colors">
        <IconExternalLink className="size-5" />
      </span>
      <span className="flex-1 font-medium group-hover:text-primary transition-colors">
        {children}
      </span>
      <IconExternalLink className="size-4 text-muted-foreground shrink-0" />
    </a>
  )
}
