"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { IconCheck, IconCircle } from "@tabler/icons-react"
import type { Course } from "@/lib/course-types"
import { useProgressStore } from "@/lib/progress-store"
import { cn } from "@/lib/utils"

type CourseModulesProps = {
  course: Course
}

export function CourseModules({ course }: CourseModulesProps) {
  const [hydrated, setHydrated] = useState(false)
  const isComplete = useProgressStore((s) => s.isComplete)

  // Wait for client-side hydration before reading localStorage-backed state
  useEffect(() => {
    setHydrated(true)
  }, [])

  return (
    <div className="space-y-8">
      {course.modules.map((mod, moduleIndex) => (
        <section key={moduleIndex} className="space-y-4">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-semibold tracking-tight"
          >
            {mod.title}
          </motion.h2>
          <ul className="space-y-2.5">
            {mod.lessons.map((lessonId) => {
              // Only check completion after hydration to avoid mismatch
              const completed = hydrated && isComplete(course.id, lessonId)
              const title = formatLessonTitle(lessonId)

              return (
                <li key={lessonId}>
                  <Link href={`/modules/${course.id}/${lessonId}`} className="group">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn(
                        "flex items-center gap-3.5 rounded-xl border border-transparent px-4 py-3.5 transition-all",
                        "hover:border-border hover:bg-muted/50"
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-full transition-colors",
                          completed
                            ? "bg-primary text-primary-foreground"
                            : "border border-muted-foreground/30 text-muted-foreground group-hover:border-primary/50"
                        )}
                      >
                        {completed ? (
                          <IconCheck className="size-3" strokeWidth={3} />
                        ) : (
                          <IconCircle className="size-2.5" />
                        )}
                      </span>
                      <span
                        className={cn(
                          "transition-colors",
                          completed ? "text-muted-foreground" : "group-hover:text-foreground"
                        )}
                      >
                        {title}
                      </span>
                    </motion.div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}

function formatLessonTitle(lessonId: string): string {
  return lessonId
    .replace(/^\d+-/, "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
