"use client"

import { motion, type Transition } from "framer-motion"
import useMeasure from "use-measure"
import { useRef, type ReactNode } from "react"

type ScaleInProps = {
  children: ReactNode
  className?: string
  spring?: boolean
}

export function ScaleIn({ children, className, spring = true }: ScaleInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const measure = useMeasure(ref)
  const height = measure.height

  const animate = spring
    ? { scaleY: 1 }
    : { scaleY: 1, opacity: 1 }

  const transition: Transition = spring
    ? { type: "spring" as const, stiffness: 300, damping: 25 }
    : { duration: 0.2, ease: "easeOut" as const }

  return (
    <div className={className} style={{ overflow: "hidden", height }}>
      <motion.div
        ref={ref}
        style={{
          scaleY: 0,
          opacity: spring ? 1 : 0,
          transformOrigin: "bottom",
        }}
        animate={animate}
        transition={transition}
      >
        {children}
      </motion.div>
    </div>
  )
}

type ExpandProps = {
  show: boolean
  children: ReactNode
  className?: string
}

export function Expand({ show, children, className }: ExpandProps) {
  const ref = useRef<HTMLDivElement>(null)
  const measure = useMeasure(ref)
  const height = measure.height

  return (
    <motion.div
      className={className}
      initial={false}
      animate={{
        height: show ? height : 0,
        opacity: show ? 1 : 0,
      }}
      transition={{
        height: { type: "spring" as const, stiffness: 300, damping: 25 },
        opacity: { duration: 0.15 },
      }}
      style={{ overflow: "hidden" }}
    >
      <div ref={ref}>{children}</div>
    </motion.div>
  )
}
