"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
  type ReactElement,
  Children,
  isValidElement,
} from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

type SlidesState = {
  currentIndex: number
  totalSlides: number
  direction: number
  labels: string[]
}

type SlidesActions = {
  goTo: (index: number) => void
  next: () => void
  prev: () => void
}

type SlidesContextValue = SlidesState & SlidesActions

const SlidesContext = createContext<SlidesContextValue | null>(null)

function useSlidesContext() {
  const ctx = useContext(SlidesContext)
  if (!ctx) throw new Error("CodeSlides.* must be used within CodeSlides.Root")
  return ctx
}

type SlideProps = {
  label: string
  children: ReactNode
}

function Slide({ children }: SlideProps) {
  return <>{children}</>
}

type RootProps = {
  children: ReactNode
}

function Root({ children }: RootProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const { slides, labels } = useMemo(() => {
    const extracted = Children.toArray(children).filter(
      (child): child is ReactElement<SlideProps> =>
        isValidElement(child) && child.type === Slide
    )
    return {
      slides: extracted,
      labels: extracted.map((s) => s.props.label),
    }
  }, [children])

  const totalSlides = slides.length

  const goTo = useCallback(
    (index: number) => {
      const newIndex = Math.max(0, Math.min(index, totalSlides - 1))
      setDirection(newIndex > currentIndex ? 1 : -1)
      setCurrentIndex(newIndex)
    },
    [currentIndex, totalSlides]
  )

  const next = useCallback(() => {
    if (currentIndex < totalSlides - 1) {
      setDirection(1)
      setCurrentIndex((i) => i + 1)
    }
  }, [currentIndex, totalSlides])

  const prev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1)
      setCurrentIndex((i) => i - 1)
    }
  }, [currentIndex])

  const contextValue = useMemo<SlidesContextValue>(
    () => ({
      currentIndex,
      totalSlides,
      direction,
      labels,
      goTo,
      next,
      prev,
    }),
    [currentIndex, totalSlides, direction, labels, goTo, next, prev]
  )

  return (
    <SlidesContext.Provider value={contextValue}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="my-6 overflow-hidden rounded-2xl border border-border bg-card"
      >
        {Children.toArray(children).filter(
          (child) => !isValidElement(child) || child.type !== Slide
        )}
        <Content slides={slides} />
      </motion.div>
    </SlidesContext.Provider>
  )
}

function Header() {
  const { currentIndex, totalSlides, labels, goTo, next, prev } = useSlidesContext()
  const currentLabel = labels[currentIndex] ?? `Slide ${currentIndex + 1}`

  return (
    <div className="flex items-center justify-between border-b border-border bg-muted/30 px-5 py-2.5">
      <span className="text-sm font-medium">
        {currentLabel}
        <span className="ml-2.5 text-muted-foreground">
          ({currentIndex + 1}/{totalSlides})
        </span>
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={prev}
          disabled={currentIndex === 0}
          className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous slide"
        >
          <IconChevronLeft className="size-4" />
        </button>

        <Dots />

        <button
          type="button"
          onClick={next}
          disabled={currentIndex === totalSlides - 1}
          className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <IconChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

function Dots() {
  const { currentIndex, totalSlides, goTo } = useSlidesContext()

  return (
    <div className="flex items-center gap-1.5 px-2">
      {Array.from({ length: totalSlides }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => goTo(i)}
          className={cn(
            "size-2.5 rounded-full transition-colors",
            i === currentIndex ? "bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
          )}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  )
}

type ContentProps = {
  slides: ReactElement<SlideProps>[]
}

function Content({ slides }: ContentProps) {
  const { currentIndex, direction, next, prev } = useSlidesContext()
  const shouldReduceMotion = useReducedMotion()

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      const swipeThreshold = 50
      const velocityThreshold = 500

      if (
        info.offset.x < -swipeThreshold ||
        info.velocity.x < -velocityThreshold
      ) {
        next()
      } else if (
        info.offset.x > swipeThreshold ||
        info.velocity.x > velocityThreshold
      ) {
        prev()
      }
    },
    [next, prev]
  )

  const variants = {
    enter: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir < 0 ? 100 : -100,
      opacity: 0,
    }),
  }

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
      className="cursor-grab active:cursor-grabbing touch-pan-y"
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.15 },
          }}
          className="[&>pre]:my-0 [&>pre]:rounded-none [&>pre]:border-0"
        >
          {slides[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

export const CodeSlides = {
  Root,
  Header,
  Slide,
}

export function CodeSlidesSimple({ children }: { children: ReactNode }) {
  return (
    <CodeSlides.Root>
      <CodeSlides.Header />
      {children}
    </CodeSlides.Root>
  )
}
