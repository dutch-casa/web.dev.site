"use client"

import { useEffect, useState } from "react"
import { motion, useScroll, useSpring } from "motion/react"

export function ReadingProgress() {
  const [mounted, setMounted] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 30,
    restDelta: 0.001,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-primary"
      style={{ scaleX }}
    />
  )
}
