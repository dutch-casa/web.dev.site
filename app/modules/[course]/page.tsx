import { notFound } from "next/navigation"
import Link from "next/link"
import { getCourse, getAllCourses } from "@/lib/course-loader"
import { flattenLessons } from "@/lib/course-types"
import { CourseModules } from "@/components/modules/course-modules"

type Params = Promise<{ course: string }>

export async function generateStaticParams() {
  const courses = await getAllCourses()
  return courses.map((course) => ({ course: course.id }))
}

export async function generateMetadata({ params }: { params: Params }) {
  const { course: courseId } = await params
  const course = await getCourse(courseId)

  if (!course) {
    return { title: "Course Not Found" }
  }

  return {
    title: course.title,
    description: course.description,
  }
}

export default async function CoursePage({ params }: { params: Params }) {
  const { course: courseId } = await params
  const course = await getCourse(courseId)

  if (!course) {
    notFound()
  }

  const lessons = flattenLessons(course)

  return (
    <main className="min-h-screen px-4 py-16 md:px-8 lg:px-16">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-muted-foreground">
          <Link href="/modules" className="hover:text-foreground transition-colors">
            Modules
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{course.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-12 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            {course.title}
          </h1>
          <p className="text-lg text-muted-foreground">{course.description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>By {course.author}</span>
            <span>•</span>
            <span>
              {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
            </span>
          </div>
        </header>

        {/* Course modules with lessons */}
        <CourseModules course={course} />
      </div>
    </main>
  )
}
