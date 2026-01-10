import { notFound } from "next/navigation"
import { getCourse, getAllLessonPaths } from "@/lib/course-loader"
import { getLessonNavigation } from "@/lib/course-types"
import { LessonNavigation } from "@/components/modules/lesson-navigation"
import { ReadingProgress } from "@/components/modules/reading-progress"

type Params = Promise<{ course: string; lesson: string }>

export async function generateStaticParams() {
  const paths = await getAllLessonPaths()
  return paths
}

export async function generateMetadata({ params }: { params: Params }) {
  const { course: courseId, lesson: lessonId } = await params
  const course = await getCourse(courseId)

  if (!course) {
    return { title: "Lesson Not Found" }
  }

  const nav = getLessonNavigation(course, lessonId)
  if (!nav) {
    return { title: "Lesson Not Found" }
  }

  return {
    title: `${nav.current.title} | ${course.title}`,
    description: `Lesson ${nav.current.lessonIndex + 1} of ${nav.current.totalLessons} in ${course.title}`,
  }
}

export default async function LessonPage({ params }: { params: Params }) {
  const { course: courseId, lesson: lessonId } = await params
  const course = await getCourse(courseId)

  if (!course) {
    notFound()
  }

  const nav = getLessonNavigation(course, lessonId)
  if (!nav) {
    notFound()
  }

  // Dynamic import for MDX content
  let Content: React.ComponentType
  try {
    const mod = await import(`@/content/courses/${courseId}/${lessonId}.mdx`)
    Content = mod.default
  } catch {
    notFound()
  }

  return (
    <>
      <ReadingProgress />
      <main className="min-h-screen px-4 py-16 md:px-8 lg:px-16">
        <article className="mx-auto max-w-3xl">
          {/* Lesson header */}
          <header className="mb-8 border-b border-border pb-8">
            <div className="mb-4 text-sm text-muted-foreground">
              <span>{course.title}</span>
              <span className="mx-2">•</span>
              <span>{nav.current.moduleTitle}</span>
              <span className="mx-2">•</span>
              <span>
                Lesson {nav.current.lessonIndex + 1} of {nav.current.totalLessons}
              </span>
            </div>
          </header>

          {/* MDX content */}
          <div className="prose-container">
            <Content />
          </div>

          {/* Navigation */}
          <LessonNavigation
            courseId={courseId}
            lessonId={lessonId}
            courseTitle={course.title}
            prev={nav.prev}
            next={nav.next}
          />
        </article>
      </main>
    </>
  )
}
