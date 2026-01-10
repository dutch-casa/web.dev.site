"use client"

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
  type ComponentType,
} from "react"
import { motion } from "motion/react"
import { IconInfoCircle, IconAlertTriangle, IconBulb } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

type CalloutVariant = "note" | "warning" | "tip"

type CalloutContextValue = {
  variant: CalloutVariant
  styles: (typeof variantStyles)[CalloutVariant]
}

const variantStyles = {
  note: {
    container: "border-secondary/30 bg-secondary/5",
    accent: "text-secondary",
  },
  warning: {
    container: "border-destructive/30 bg-destructive/5",
    accent: "text-destructive",
  },
  tip: {
    container: "border-primary/30 bg-primary/5",
    accent: "text-primary",
  },
} as const

const defaultIcons: Record<CalloutVariant, ComponentType<{ className?: string }>> = {
  note: IconInfoCircle,
  warning: IconAlertTriangle,
  tip: IconBulb,
}

const defaultTitles: Record<CalloutVariant, string> = {
  note: "Note",
  warning: "Warning",
  tip: "Tip",
}

const CalloutContext = createContext<CalloutContextValue | null>(null)

function useCalloutContext() {
  const ctx = useContext(CalloutContext)
  if (!ctx) throw new Error("Callout.* must be used within Callout.Root")
  return ctx
}

type RootProps = {
  variant?: CalloutVariant
  children: ReactNode
  className?: string
}

function Root({ variant = "note", children, className }: RootProps) {
  const styles = variantStyles[variant]

  const contextValue = useMemo<CalloutContextValue>(
    () => ({ variant, styles }),
    [variant, styles]
  )

  return (
    <CalloutContext.Provider value={contextValue}>
      <motion.aside
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "my-6 rounded-2xl border-l-4 px-5 py-4",
          styles.container,
          className
        )}
        role="note"
      >
        {children}
      </motion.aside>
    </CalloutContext.Provider>
  )
}

function Header({ children }: { children?: ReactNode }) {
  const { variant, styles } = useCalloutContext()
  const DefaultIcon = defaultIcons[variant]
  const defaultTitle = defaultTitles[variant]

  return (
    <div className={cn("mb-2.5 flex items-center gap-2 font-medium", styles.accent)}>
      {children ?? (
        <>
          <DefaultIcon className="size-5" />
          <span>{defaultTitle}</span>
        </>
      )}
    </div>
  )
}

function Icon({ icon: CustomIcon }: { icon?: ComponentType<{ className?: string }> }) {
  const { variant, styles } = useCalloutContext()
  const DefaultIcon = defaultIcons[variant]
  const IconComponent = CustomIcon ?? DefaultIcon

  return <IconComponent className={cn("size-5", styles.accent)} />
}

function Title({ children }: { children?: ReactNode }) {
  const { variant, styles } = useCalloutContext()
  const defaultTitle = defaultTitles[variant]

  return <span className={styles.accent}>{children ?? defaultTitle}</span>
}

function Content({ children }: { children: ReactNode }) {
  return (
    <div className="text-sm text-foreground/80 leading-relaxed">
      {children}
    </div>
  )
}

export const Callout = {
  Root,
  Header,
  Icon,
  Title,
  Content,
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <Callout.Root variant="note">
      <Callout.Header />
      <Callout.Content>{children}</Callout.Content>
    </Callout.Root>
  )
}

export function Warning({ children }: { children: ReactNode }) {
  return (
    <Callout.Root variant="warning">
      <Callout.Header />
      <Callout.Content>{children}</Callout.Content>
    </Callout.Root>
  )
}

export function Tip({ children }: { children: ReactNode }) {
  return (
    <Callout.Root variant="tip">
      <Callout.Header />
      <Callout.Content>{children}</Callout.Content>
    </Callout.Root>
  )
}
