// Course content schema - data-oriented design with discriminated unions

export type CourseModule = {
  readonly title: string
  readonly lessons: readonly string[]
}

export type Course = {
  readonly id: string
  readonly title: string
  readonly author: string
  readonly description: string
  readonly modules: readonly CourseModule[]
  readonly order?: number
}

// Derived types for runtime use
export type LessonMeta = {
  readonly courseId: string
  readonly lessonId: string
  readonly title: string
  readonly moduleTitle: string
  readonly moduleIndex: number
  readonly lessonIndex: number
  readonly totalLessons: number
}

export type CourseWithProgress = Course & {
  readonly completedLessons: number
  readonly totalLessons: number
  readonly progressPercent: number
}

// Navigation helpers
export type LessonNavigation = {
  readonly prev: LessonMeta | null
  readonly current: LessonMeta
  readonly next: LessonMeta | null
}

// Utility: flatten course modules into ordered lesson list
export function flattenLessons(course: Course): readonly LessonMeta[] {
  const lessons: LessonMeta[] = []
  let globalIndex = 0

  const totalLessons = course.modules.reduce(
    (acc, mod) => acc + mod.lessons.length,
    0
  )

  for (let moduleIndex = 0; moduleIndex < course.modules.length; moduleIndex++) {
    const mod = course.modules[moduleIndex]
    for (let lessonIndex = 0; lessonIndex < mod.lessons.length; lessonIndex++) {
      lessons.push({
        courseId: course.id,
        lessonId: mod.lessons[lessonIndex],
        title: formatLessonTitle(mod.lessons[lessonIndex]),
        moduleTitle: mod.title,
        moduleIndex,
        lessonIndex: globalIndex,
        totalLessons,
      })
      globalIndex++
    }
  }

  return lessons
}

// Utility: get navigation for a specific lesson
export function getLessonNavigation(
  course: Course,
  lessonId: string
): LessonNavigation | null {
  const lessons = flattenLessons(course)
  const currentIndex = lessons.findIndex((l) => l.lessonId === lessonId)

  if (currentIndex === -1) return null

  return {
    prev: currentIndex > 0 ? lessons[currentIndex - 1] : null,
    current: lessons[currentIndex],
    next: currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null,
  }
}

// Convert "01-intro" to "Intro", "02-advanced-types" to "Advanced Types"
function formatLessonTitle(lessonId: string): string {
  return lessonId
    .replace(/^\d+-/, "") // Remove leading number prefix
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
