"use client"

import { useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { IconArrowLeft, IconArrowRight, IconCheck } from "@tabler/icons-react"
import type { LessonMeta } from "@/lib/course-types"
import { useProgressStore, useIsLessonComplete } from "@/lib/progress-store"
import { cn } from "@/lib/utils"

type LessonNavigationProps = {
  courseId: string
  lessonId: string
  courseTitle: string
  prev: LessonMeta | null
  next: LessonMeta | null
}

export function LessonNavigation({
  courseId,
  lessonId,
  courseTitle,
  prev,
  next,
}: LessonNavigationProps) {
  const router = useRouter()
  const isComplete = useIsLessonComplete(courseId, lessonId)
  const markComplete = useProgressStore((s) => s.markComplete)
  const markIncomplete = useProgressStore((s) => s.markIncomplete)

  const toggleComplete = useCallback(() => {
    if (isComplete) {
      markIncomplete(courseId, lessonId)
    } else {
      markComplete(courseId, lessonId)
    }
  }, [isComplete, courseId, lessonId, markComplete, markIncomplete])

  const navigatePrev = useCallback(() => {
    if (prev) {
      router.push(`/modules/${courseId}/${prev.lessonId}`)
    }
  }, [router, courseId, prev])

  const navigateNext = useCallback(() => {
    if (next) {
      router.push(`/modules/${courseId}/${next.lessonId}`)
    }
  }, [router, courseId, next])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return
      }

      switch (e.key) {
        case "ArrowLeft":
          navigatePrev()
          break
        case "ArrowRight":
          navigateNext()
          break
        case "m":
        case "M":
          toggleComplete()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [navigatePrev, navigateNext, toggleComplete])

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-16 border-t border-border pt-8"
    >
      <div className="mb-8 flex justify-center">
        <button
          type="button"
          onClick={toggleComplete}
          className={cn(
            "flex items-center gap-2.5 rounded-full px-6 py-3 font-medium transition-colors",
            isComplete
              ? "bg-primary/10 text-primary hover:bg-primary/20"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          <span
            className={cn(
              "flex size-5 items-center justify-center rounded-full transition-colors",
              isComplete ? "bg-primary text-primary-foreground" : "bg-primary-foreground/20"
            )}
          >
            {isComplete && <IconCheck className="size-3" strokeWidth={3} />}
          </span>
          <span>{isComplete ? "Completed" : "Mark Complete"}</span>
          <kbd className="ml-2 hidden rounded bg-black/10 px-1.5 py-0.5 text-xs sm:inline-block">
            M
          </kbd>
        </button>
      </div>

      <div className="flex items-stretch justify-between gap-4">
        {prev ? (
          <Link
            href={`/modules/${courseId}/${prev.lessonId}`}
            className="group flex flex-1 flex-col items-start gap-1.5 rounded-xl border border-border p-4 transition-all hover:border-primary/30 hover:bg-muted/50"
          >
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <IconArrowLeft className="size-4" />
              <span>Previous</span>
              <kbd className="ml-1 hidden rounded bg-muted px-1 text-xs sm:inline-block">←</kbd>
            </span>
            <span className="font-medium transition-colors group-hover:text-primary">
              {prev.title}
            </span>
          </Link>
        ) : (
          <Link
            href={`/modules/${courseId}`}
            className="group flex flex-1 flex-col items-start gap-1.5 rounded-xl border border-border p-4 transition-all hover:border-primary/30 hover:bg-muted/50"
          >
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <IconArrowLeft className="size-4" />
              <span>Back to Course</span>
            </span>
            <span className="font-medium transition-colors group-hover:text-primary">
              {courseTitle}
            </span>
          </Link>
        )}

        {next ? (
          <Link
            href={`/modules/${courseId}/${next.lessonId}`}
            className="group flex flex-1 flex-col items-end gap-1.5 rounded-xl border border-border p-4 text-right transition-all hover:border-primary/30 hover:bg-muted/50"
          >
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <span>Next</span>
              <IconArrowRight className="size-4" />
              <kbd className="ml-1 hidden rounded bg-muted px-1 text-xs sm:inline-block">→</kbd>
            </span>
            <span className="font-medium transition-colors group-hover:text-primary">
              {next.title}
            </span>
          </Link>
        ) : (
          <Link
            href={`/modules/${courseId}`}
            className="group flex flex-1 flex-col items-end gap-1.5 rounded-xl border border-border p-4 text-right transition-all hover:border-primary/30 hover:bg-muted/50"
          >
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <span>Course Complete!</span>
              <IconArrowRight className="size-4" />
            </span>
            <span className="font-medium transition-colors group-hover:text-primary">
              Back to {courseTitle}
            </span>
          </Link>
        )}
      </div>
    </motion.nav>
  )
}
