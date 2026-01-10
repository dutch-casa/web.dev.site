"use client"

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
  type ComponentType,
} from "react"
import { IconExternalLink, IconBrandGithub, IconCode } from "@tabler/icons-react"

// ============================================================================
// Types
// ============================================================================

type Platform = "github" | "codesandbox" | "stackblitz" | "leetcode" | "other"

type StarterContextValue = {
  href: string
  platform: Platform
  config: (typeof platformConfig)[Platform]
}

// ============================================================================
// Config
// ============================================================================

const platformConfig = {
  github: {
    icon: IconBrandGithub,
    defaultLabel: "View on GitHub",
    color: "hover:border-[#333] dark:hover:border-[#f0f0f0]",
  },
  codesandbox: {
    icon: IconCode,
    defaultLabel: "Open in CodeSandbox",
    color: "hover:border-[#151515]",
  },
  stackblitz: {
    icon: IconCode,
    defaultLabel: "Open in StackBlitz",
    color: "hover:border-[#1389fd]",
  },
  leetcode: {
    icon: IconCode,
    defaultLabel: "Practice on LeetCode",
    color: "hover:border-[#ffa116]",
  },
  other: {
    icon: IconExternalLink,
    defaultLabel: "View Starter Code",
    color: "hover:border-primary",
  },
} as const

function detectPlatform(href: string): Platform {
  if (href.includes("github.com")) return "github"
  if (href.includes("codesandbox.io")) return "codesandbox"
  if (href.includes("stackblitz.com")) return "stackblitz"
  if (href.includes("leetcode.com")) return "leetcode"
  return "other"
}

// ============================================================================
// Context
// ============================================================================

const StarterContext = createContext<StarterContextValue | null>(null)

function useStarterContext() {
  const ctx = useContext(StarterContext)
  if (!ctx) throw new Error("Starter.* must be used within Starter.Root")
  return ctx
}

// ============================================================================
// Compound Components
// ============================================================================

type RootProps = {
  href: string
  platform?: Platform
  children: ReactNode
}

function Root({ href, platform, children }: RootProps) {
  const detectedPlatform = platform ?? detectPlatform(href)
  const config = platformConfig[detectedPlatform]

  const contextValue = useMemo<StarterContextValue>(
    () => ({ href, platform: detectedPlatform, config }),
    [href, detectedPlatform, config]
  )

  return (
    <StarterContext.Provider value={contextValue}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`group my-6 flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all duration-150 ease-out hover:bg-muted/50 ${config.color}`}
      >
        {children}
      </a>
    </StarterContext.Provider>
  )
}

function Icon({ icon: CustomIcon }: { icon?: ComponentType<{ className?: string }> }) {
  const { config } = useStarterContext()
  const IconComponent = CustomIcon ?? config.icon

  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:text-foreground transition-colors">
      <IconComponent className="size-5" />
    </span>
  )
}

function Label({ children }: { children?: ReactNode }) {
  const { config } = useStarterContext()

  return (
    <span className="font-medium group-hover:text-primary transition-colors">
      {children ?? config.defaultLabel}
    </span>
  )
}

function Url() {
  const { href } = useStarterContext()

  return (
    <span className="text-sm text-muted-foreground truncate">{href}</span>
  )
}

function Content({ children }: { children?: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      {children}
    </div>
  )
}

function ExternalIcon() {
  return <IconExternalLink className="size-4 text-muted-foreground shrink-0" />
}

// ============================================================================
// Export as compound component
// ============================================================================

export const Starter = {
  Root,
  Icon,
  Label,
  Url,
  Content,
  ExternalIcon,
}

// ============================================================================
// Convenience wrapper for MDX
// ============================================================================

type StarterCodeProps = {
  href: string
  label?: string
  platform?: Platform
}

export function StarterCode({ href, label, platform }: StarterCodeProps) {
  return (
    <Starter.Root href={href} platform={platform}>
      <Starter.Icon />
      <Starter.Content>
        {label ? <Starter.Label>{label}</Starter.Label> : <Starter.Label />}
        <Starter.Url />
      </Starter.Content>
      <Starter.ExternalIcon />
    </Starter.Root>
  )
}
