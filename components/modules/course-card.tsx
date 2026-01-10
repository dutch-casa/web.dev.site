"use client"

import Link from "next/link"
import { motion } from "motion/react"
import type { Course } from "@/lib/course-types"
import { useCourseProgress } from "@/lib/progress-store"

type CourseCardProps = {
  course: Course
  totalLessons: number
}

export function CourseCard({ course, totalLessons }: CourseCardProps) {
  const progress = useCourseProgress(course.id, totalLessons)
  const progressPercent = Math.round(progress * 100)

  return (
    <Link href={`/modules/${course.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all"
      >
        <div className="h-1.5 w-full bg-muted">
          <motion.div
            className="h-full bg-primary"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
              {course.title}
            </h2>
            {progressPercent > 0 && (
              <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {progressPercent}%
              </span>
            )}
          </div>

          <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {course.description}
          </p>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{course.author}</span>
            <span>
              {totalLessons} {totalLessons === 1 ? "lesson" : "lessons"}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
