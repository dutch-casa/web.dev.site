import Link from "next/link"
import { getAllCourses } from "@/lib/course-loader"
import { flattenLessons } from "@/lib/course-types"
import { CourseCard } from "@/components/modules/course-card"

export const metadata = {
  title: "Modules",
  description: "Free learning modules - progress tracked locally",
}

export default async function ModulesPage() {
  const courses = await getAllCourses()

  return (
    <main className="min-h-screen px-4 py-16 md:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Learning Modules
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Free courses with interactive code examples, quizzes, and hands-on
            exercises. Your progress is saved locally.
          </p>
          <p className="text-sm text-muted-foreground">
            Course contributions are welcome!{" "}
            <Link
              href="https://github.com/RobotCrookedMan/web.dev.site"
              className="underline underline-offset-4 hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Submit a pull request on GitHub.
            </Link>
          </p>
        </header>

        {courses.length === 0 ? (
          <div className="rounded-lg border border-dashed border-muted-foreground/30 p-12 text-center">
            <p className="text-muted-foreground">
              No courses available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                totalLessons={flattenLessons(course).length}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
